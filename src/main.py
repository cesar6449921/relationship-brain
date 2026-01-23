from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, BackgroundTasks, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware  # Import CORS
from sqlmodel import Session, select
from datetime import timedelta
from dotenv import load_dotenv

# Carrega varíaveis de ambiente do arquivo .env
load_dotenv()

# Imports Locais
from services import process_message, send_text, create_whatsapp_group
from logging_config import setup_logging, get_logger
from database import create_db_and_tables, get_session
from models import User, UserCreate, UserUpdate, Couple, CoupleCreate, CoupleRead
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SECRET_KEY, ALGORITHM
)
import time
import asyncio
from jose import JWTError, jwt

# Setup logging
setup_logging()
logger = get_logger(__name__)

# --- Deduplicador (Mantido) ---
class Deduplicator:
    def __init__(self, ttl_seconds=600):
        self.seen = {}
        self.ttl = ttl_seconds

    def is_duplicate(self, msg_id: str) -> bool:
        now = time.time()
        self.seen = {k: v for k, v in self.seen.items() if now - v < self.ttl}
        if msg_id in self.seen:
            return True
        self.seen[msg_id] = now
        return False

deduplicator = Deduplicator()
active_tasks = set()

# --- Configuração de Ciclo de Vida ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("startup_initiated")
    create_db_and_tables() # Cria tabelas do SQLite
    yield
    logger.info("shutdown_initiated", active_tasks=len(active_tasks))
    if active_tasks:
        logger.info("waiting_for_background_tasks")
        done, pending = await asyncio.wait(active_tasks, timeout=2.0)

app = FastAPI(lifespan=lifespan)

# --- Configuração CORS (Permitir Frontend) ---
# Em produção, você pode restringir allow_origins=["https://seu-frontend.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite tudo por enquanto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token") # URL atualizada para /api

# --- Dependências de Autenticação ---
async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user

# --- Rotas de Autenticação (Prefixo /api) ---

@app.post("/api/auth/signup", response_model=dict)
async def signup(user: UserCreate, session: Session = Depends(get_session)):
    # Check existing
    statement = select(User).where(User.email == user.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_pwd = get_password_hash(user.password)
    db_user = User(
        email=user.email, 
        full_name=user.full_name, 
        phone_number=user.phone_number,
        hashed_password=hashed_pwd
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return {"status": "created", "user_id": db_user.id}

@app.post("/api/auth/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/me")
def get_my_info(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """Retorna dados do usuário logado e do seu casal (se houver)."""
    statement = select(Couple).where(Couple.user_id == current_user.id)
    couple = session.exec(statement).first()
    
    return {
        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "phone_number": current_user.phone_number
        },
        "couple": couple
    }

@app.put("/api/me")
def update_my_info(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Atualiza dados do perfil do usuário."""
    if user_update.full_name:
        current_user.full_name = user_update.full_name
    if user_update.email:
        # Check if email is taken by another user
        if user_update.email != current_user.email:
            existing_user = session.exec(select(User).where(User.email == user_update.email)).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_update.email
    if user_update.phone_number:
        current_user.phone_number = user_update.phone_number
    if user_update.password:
        current_user.hashed_password = get_password_hash(user_update.password)
        
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return {"status": "updated", "user": {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number
    }}

# --- Rotas de Negócio (Casal) (Prefixo /api) ---

@app.post("/api/couples", response_model=CoupleRead)
async def create_couple(
    couple_data: CoupleCreate, 
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    """
    Cria o registro do casal e INICIA A CRIAÇÃO DO GRUPO NO WHATSAPP.
    """
    logger.info("creating_couple_flow", user=current_user.email)
    
    # 1. Cria grupo via Evolution API
    subject = f"Casal {current_user.full_name.split()[0]} & {couple_data.partner_name.split()[0]}"
    participants = [current_user.phone_number, couple_data.partner_phone]
    
    # Adicionar o número do bot também? Geralmente ele já é admin por criar.
    # remove_duplicates e formata
    participants = list(set([p.replace("+", "").strip() for p in participants]))
    
    # 1. Cria grupo via Evolution API (ou Mock se MOCK_WHATSAPP=true)
    group_jid = await create_whatsapp_group(subject, participants)
    
    if not group_jid:
        raise HTTPException(status_code=500, detail="Failed to create WhatsApp group via Bot")

    # 2. Salva no banco
    db_couple = Couple(
        user_id=current_user.id,
        partner_name=couple_data.partner_name,
        partner_phone=couple_data.partner_phone,
        group_jid=group_jid,
        status="active"
    )
    session.add(db_couple)
    session.commit()
    session.refresh(db_couple)
    
    # TODO: Mandar mensagem de boas-vindas no grupo recém-criado
    try:
        await send_text(group_jid, f"Olá {current_user.full_name} e {couple_data.partner_name}! Eu sou o NósDois AI, seu terapeuta virtual. 🌱\n\nEstou aqui para ajudar vocês a fortalecerem a relação. Sintam-se à vontade para conversar comigo aqui!")
    except Exception as e:
        logger.error("failed_to_send_welcome_message", error=str(e))
        pass

    return db_couple

    return db_couple

@app.delete("/api/couples/me")
def delete_my_couple(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Remove a conexão de casal do usuário atual."""
    statement = select(Couple).where(Couple.user_id == current_user.id)
    couple = session.exec(statement).first()
    
    if not couple:
        raise HTTPException(status_code=404, detail="Nenhum grupo ativo encontrado para este usuário.")
    
    # Aqui poderíamos tentar sair do grupo no WhatsApp via API também, se desejado
    # await leave_whatsapp_group(couple.group_jid) 

    session.delete(couple)
    session.commit()
    
    return {"status": "deleted", "message": "Grupo desconectado com sucesso."}


@app.get("/")
def health_check():
    return {"status": "Bot está vivo e pronto!", "version": "2.0 (Database Enabled)"}

async def process_webhook_task(data: dict):
    # Logica original do webhook mantida para compatibilidade
    # Pode ser expandida para checar se a mensagem vem de um grupo cadastrado no banco
    task = asyncio.current_task()
    active_tasks.add(task)
    try:
        message_type = data.get("messageType")
        push_name = data.get("pushName", "Usuário")
        remote_jid = data.get("key", {}).get("remoteJid") # Pode ser User ou Grupo

        log = logger.bind(remote_jid=remote_jid, push_name=push_name, message_type=message_type)

        user_text = None
        if message_type == "conversation":
            user_text = data.get("message", {}).get("conversation")
        elif message_type == "extendedTextMessage":
            user_text = data.get("message", {}).get("extendedTextMessage", {}).get("text")

        if user_text:
            log.info("processing_message", text_length=len(user_text))
            
            # Aqui poderíamos validar no banco se esse remote_jid é um "Group JID" válido de um casal
            # session = next(get_session())
            # couple = session.exec(select(Couple).where(Couple.group_jid == remote_jid)).first()
            # if couple: ...
            
            ai_response = await process_message(user_text, push_name, remote_jid)
            await send_text(remote_jid, ai_response)
            log.info("task_completed_successfully")
        else:
            log.info("ignored_message_no_text")
    except Exception as e:
        logger.error("task_failed", error=str(e), exc_info=True)
    finally:
        active_tasks.discard(task)

@app.post("/webhook")
async def receive_webhook(request: Request, background_tasks: BackgroundTasks):
    body = await request.json()
    logger.info("webhook_raw_hit", webhook_event=body.get("event"), headers=dict(request.headers))
    log = logger.bind(webhook_event=body.get("event"))

    try:
        event_type = body.get("event")
        if event_type == "messages.upsert":
            data = body.get("data", {})
            if data.get("key", {}).get("fromMe", False):
                return {"status": "ignored_self"}
            
            msg_id = data.get("key", {}).get("id")
            if msg_id and deduplicator.is_duplicate(msg_id):
                log.info("duplicate_message_skipped", msg_id=msg_id)
                return {"status": "duplicate"}

            background_tasks.add_task(process_webhook_task, data)
            log.info("webhook_accepted_for_processing")
    except Exception as e:
        log.error("webhook_dispatch_failed", error=str(e))
        return {"status": "error_logged"}

    return {"status": "ok"}

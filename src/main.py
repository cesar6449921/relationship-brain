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
from database import create_db_and_tables, get_session, engine
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
import os
from jose import JWTError, jwt
from mediation import (
    analyze_conflict_level,
    should_mediate,
    generate_mediation_prompt,
    is_manual_mediation_trigger
)

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

# Configuração de CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://app.nosai.online",
    "http://app.nosai.online",
    "*" # Para dev, liberar geral (mas em prod cuidado)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Liberando * para resolver o problema rápido. Depois restringimos.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

from pydantic import BaseModel

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class GoogleRequest(BaseModel):
    token: str

@app.post("/api/auth/google")
async def google_login(request: GoogleRequest, session: Session = Depends(get_session)):
    import traceback
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests

    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Server config error: GOOGLE_CLIENT_ID missing")

    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            request.token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )

        email = idinfo.get("email")
        name = idinfo.get("name")
        # picture = idinfo.get("picture")

        if not email:
            raise HTTPException(status_code=400, detail="Google token missing email")

        # Check existing user
        user = session.exec(select(User).where(User.email == email)).first()
        
        if not user:
            # Create new user
            random_pwd = os.urandom(16).hex()
            hashed_pwd = get_password_hash(random_pwd)
            
            user = User(
                email=email,
                full_name=name,
                phone_number="", # Vai precisar preencher depois
                hashed_password=hashed_pwd
            )
            session.add(user)
            session.commit()
            session.refresh(user)

        # Login success -> Generate Token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    except ValueError:
        # Invalid token specific from google lib
        print(f"GOOGLE LOGIN INVALID TOKEN: {traceback.format_exc()}")
        raise HTTPException(status_code=401, detail="Invalid Google Token")
    except Exception as e:
        print(f"GOOGLE LOGIN CRASH: {traceback.format_exc()}")
        with open("error_log.txt", "w") as f:
            f.write(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Google Login Error: {str(e)}")

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

@app.post("/api/auth/forgot-password")
async def forgot_password(request: PasswordResetRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        # Padrão de segurança: não revelar se existe, mas para debug/MVP vamos retornar erro se não achar
        raise HTTPException(status_code=404, detail="Email não encontrado.")
    
    # Generate reset token
    expires = timedelta(minutes=15)
    reset_token = create_access_token(data={"sub": user.email, "type": "reset"}, expires_delta=expires)
    
    # In a real app, send email. Here, we log it.
    logger.info(f"PASSWORD_RESET_TOKEN_GENERATED", email=user.email, token=reset_token)
    
    return {"message": "Token gerado! Verifique os logs do servidor.", "debug_token": reset_token}

@app.post("/api/auth/reset-password")
async def reset_password(request: PasswordResetConfirm, session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "reset":
            raise HTTPException(status_code=400, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")
        
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
    user.hashed_password = get_password_hash(request.new_password)
    session.add(user)
    session.commit()
    
    return {"message": "Senha alterada com sucesso!"}

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
    
    # Validação: Verifica se o usuário tem número de telefone
    if not current_user.phone_number or current_user.phone_number.strip() == "":
        raise HTTPException(
            status_code=400, 
            detail="Você precisa adicionar seu número de WhatsApp nas Configurações antes de criar um grupo."
        )
    
    # 1. Cria grupo via Evolution API
    subject = f"Casal {current_user.full_name.split()[0]} & {couple_data.partner_name.split()[0]}"
    participants = [current_user.phone_number, couple_data.partner_phone]
    
    # Adicionar o número do bot também? Geralmente ele já é admin por criar.
    # remove_duplicates e formata
    cleaned_participants = []
    for p in participants:
        num = p.replace("+", "").strip()
        
        # Ignora strings vazias
        if not num:
            continue
        
        # Estratégia "Tiro de Canhão": Envia com e sem o 9º dígito para garantir
        if num.startswith("55"):
            # Se tem 13 dígitos (já tem o 9), cria versão sem
            if len(num) == 13:
                num_without_9 = f"{num[:4]}{num[5:]}"
                cleaned_participants.append(num)
                cleaned_participants.append(num_without_9)
            # Se tem 12 dígitos (falta o 9), cria versão com
            elif len(num) == 12:
                num_with_9 = f"{num[:4]}9{num[4:]}"
                cleaned_participants.append(num)
                cleaned_participants.append(num_with_9)
            else:
                cleaned_participants.append(num)
        else:
            # Números internacionais (não BR)
            cleaned_participants.append(num)

    # Remove duplicatas e strings vazias
    participants = [p for p in list(set(cleaned_participants)) if p]
    
    
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
        await send_text(group_jid, f"Olá {current_user.full_name} e {couple_data.partner_name}! Eu sou o NósAi, seu terapeuta virtual. 🌱\n\nEstou aqui para ajudar vocês a fortalecerem a relação. Sintam-se à vontade para conversar comigo aqui!")
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

# Variável Global para rastrear última resposta do Bot por JID
from datetime import datetime
last_bot_reply_time: dict[str, datetime] = {}
BOT_ACTIVE_WINDOW_SECONDS = 120  # Janela de 2 minutos para conversa contínua

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

            # --- COMANDO DE ADMINISTRAÇÃO ---
            if user_text.strip().lower() == "/reset":
                from memory import conversation_manager
                conversation_manager.clear_history(remote_jid)
                await send_text(remote_jid, "🧠 Memória reiniciada! Esqueci tudo o que conversamos. Vamos começar do zero? ✨")
                return
            
            # --- Lógica de Intervenção em Grupos ---
            is_group = remote_jid.endswith("@g.us")
            should_respond = True

            if is_group:
                # 1. Verifica Triggers (Texto)
                triggers = ["/ia", "/ajuda", "nosai", "nosai", "bot", "terapeuta", "inteligencia", "inteligência"]
                user_text_lower = user_text.lower()
                is_text_triggered = any(t in user_text_lower for t in triggers)
                
                # 2. Verifica Menções (@)
                context_info = data.get("message", {}).get("extendedTextMessage", {}).get("contextInfo", {})
                mentioned_jids = context_info.get("mentionedJid", [])
                is_mentioned = len(mentioned_jids) > 0
                
                # 3. Conversa Ativa (Janela de Tempo)
                last_reply = last_bot_reply_time.get(remote_jid)
                is_active_conversation = False
                if last_reply:
                    delta = datetime.utcnow() - last_reply
                    if delta.total_seconds() < BOT_ACTIVE_WINDOW_SECONDS:
                        is_active_conversation = True
                        log.info("active_conversation_window_open", seconds_since_last=delta.total_seconds())

                # Decisão Final
                if not is_text_triggered and not is_mentioned and not is_active_conversation:
                    should_respond = False
                    log.info("group_message_ignored_no_trigger_or_active_window")

            # Busca contexto do casal no banco se for grupo
            couple_context = None
            couple_db_record = None
            if is_group:
                with Session(engine) as session:
                    couple = session.exec(select(Couple).where(Couple.group_jid == remote_jid)).first()
                    if couple:
                        couple_db_record = couple  # Guardar referência para atualizar depois
                        # Precisamos buscar o User dono do casal para saber o nome dele
                        user_owner = session.get(User, couple.user_id)
                        if user_owner:
                            couple_context = {
                                "user_name": user_owner.full_name,
                                "user_phone": user_owner.phone_number,
                                "partner_name": couple.partner_name,
                                "partner_phone": couple.partner_phone
                            }
                            # CORREÇÃO CRÍTICA: Sobrescreve o apelido do WhatsApp pelo Nome Real
                            push_name = user_owner.full_name.split()[0]  # Pega só o primeiro nome
            
            # --- MEDIAÇÃO ATIVA ---
            
            mediation_triggered = False
            if couple_context and couple_db_record:
                # Verifica se é comando manual
                manual_trigger = is_manual_mediation_trigger(user_text)
                
                # Analisa nível de conflito
                conflict_level = analyze_conflict_level(user_text)
                log.info("conflict_analysis", level=conflict_level, manual=manual_trigger)
                
                # Decide se deve mediar
                if should_mediate(conflict_level, couple_db_record.last_mediation_at, manual_trigger):
                    mediation_triggered = True
                    log.info("mediation_triggered", reason="manual" if manual_trigger else "auto")
                    
                    # Gera prompt especializado de mediação
                    # TODO: Implementar histórico de mensagens do grupo
                    # Por ora, usamos apenas a mensagem atual
                    recent_msgs = [{"sender": push_name, "text": user_text}]
                    
                    mediation_prompt = generate_mediation_prompt(
                        recent_msgs,
                        couple_context["user_name"].split()[0],
                        couple_context["partner_name"].split()[0]
                    )
                    
                    # Sobrescreve o texto do usuário com o prompt de mediação
                    user_text = mediation_prompt
                    should_respond = True  # Força resposta
                    
                    # Atualiza registro no banco
                    with Session(engine) as session:
                        couple_to_update = session.get(Couple, couple_db_record.id)
                        if couple_to_update:
                            couple_to_update.last_mediation_at = datetime.utcnow()
                            couple_to_update.mediation_count += 1
                            session.add(couple_to_update)
                            session.commit()


            if should_respond:
                # Refresh log with correct name
                log = logger.bind(remote_jid=remote_jid, push_name=push_name)
                log.info("task_responding_with_context", is_active_window=is_active_conversation if 'is_active_conversation' in locals() else False)
                
                ai_response = await process_message(user_text, push_name, remote_jid, couple_context)
                
                # SUPORTE A MENSAGENS PICADAS (<QUEBRA>)
                messages = ai_response.split("<QUEBRA>")
                for i, msg in enumerate(messages):
                    msg = msg.strip()
                    if not msg: continue
                    
                    # Processamento de Menções (Nome -> @Numero)
                    mentions_list = []
                    if couple_context:
                        # Helper para substituir nome por menção
                        def process_mention(text, name, phone):
                            if name and phone and name.lower() in text.lower():
                                # Estratégia simples: Replace case-insensitive
                                import re
                                pattern = re.compile(re.escape(name), re.IGNORECASE)
                                # Apenas substitui se encontrar. O WhatsApp precisa do formato @55...
                                # Mas cuidado para não substituir se já tiver @
                                text = pattern.sub(f"@{phone}", text)
                                mentions_list.append(phone)
                            return text

                        p_name = couple_context.get("partner_name", "").split()[0] # Primeiro nome
                        p_phone = couple_context.get("partner_phone", "")
                        u_name = couple_context.get("user_name", "").split()[0]
                        u_phone = couple_context.get("user_phone", "")

                        msg = process_mention(msg, p_name, p_phone)
                        msg = process_mention(msg, u_name, u_phone)

                    await send_text(remote_jid, msg, mentions=mentions_list)
                    
                    # Se não for a última mensagem, espera um pouco para dar efeito de "digitando"
                    if i < len(messages) - 1:
                        await asyncio.sleep(2) # Pausa de 2 segundos entre balões
                
                # Atualiza timestamp da última resposta
                last_bot_reply_time[remote_jid] = datetime.utcnow()
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

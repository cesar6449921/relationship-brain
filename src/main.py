from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, BackgroundTasks
from services import process_message, send_text
from logging_config import setup_logging, get_logger
import time
import asyncio

# Setup logging
setup_logging()
logger = get_logger(__name__)


# In-memory deduplication (for single-instance bot)
class Deduplicator:
    def __init__(self, ttl_seconds=600):
        self.seen = {}
        self.ttl = ttl_seconds

    def is_duplicate(self, msg_id: str) -> bool:
        now = time.time()
        # Lazy cleanup: remove old entries
        self.seen = {k: v for k, v in self.seen.items() if now - v < self.ttl}

        if msg_id in self.seen:
            return True

        self.seen[msg_id] = now
        return False


deduplicator = Deduplicator()
active_tasks = set()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("startup_initiated")
    yield
    # Shutdown
    logger.info("shutdown_initiated", active_tasks=len(active_tasks))
    if active_tasks:
        logger.info("waiting_for_background_tasks")
        # Give 2 seconds for tasks to finish
        done, pending = await asyncio.wait(active_tasks, timeout=2.0)
        logger.info("shutdown_complete", done=len(done), pending=len(pending))


app = FastAPI(lifespan=lifespan)


@app.get("/")
def health_check():
    return {"status": "Bot está vivo e pronto!"}


async def process_webhook_task(data: dict):
    """
    Task de processamento assíncrono para não bloquear o webhook
    """
    # Create task ID for tracking
    task = asyncio.current_task()
    active_tasks.add(task)

    try:
        message_type = data.get("messageType")
        push_name = data.get("pushName", "Usuário")
        remote_jid = data.get("key", {}).get("remoteJid")

        # Log context
        log = logger.bind(
            remote_jid=remote_jid, push_name=push_name, message_type=message_type
        )

        # Extrair texto
        user_text = None
        if message_type == "conversation":
            user_text = data.get("message", {}).get("conversation")
        elif message_type == "extendedTextMessage":
            user_text = (
                data.get("message", {}).get("extendedTextMessage", {}).get("text")
            )

        if user_text:
            log.info("processing_message", text_length=len(user_text))

            # 1. Processar com IA (Agora passando o JID para memória)
            ai_response = await process_message(user_text, push_name, remote_jid)

            # 2. Enviar resposta
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
    """
    Endpoint de alta performance: Recebe, valida e delega.
    Retorna 200 OK imediatamente.
    """
    body = await request.json()
    logger.info("webhook_raw_hit", event=body.get("event"), headers=dict(request.headers))
    log = logger.bind(webhook_event=body.get("event"))

    try:
        event_type = body.get("event")

        if event_type == "messages.upsert":
            data = body.get("data", {})

            # 1. Check fromMe (Ignorar mensagens do próprio bot)
            if data.get("key", {}).get("fromMe", False):
                return {"status": "ignored_self"}

            # 2. Deduplication check
            msg_id = data.get("key", {}).get("id")
            if msg_id and deduplicator.is_duplicate(msg_id):
                log.info("duplicate_message_skipped", msg_id=msg_id)
                return {"status": "duplicate"}

            # 3. Dispatch to background
            # Usamos BackgroundTasks do FastAPI que é robusto para isso
            background_tasks.add_task(process_webhook_task, data)
            log.info("webhook_accepted_for_processing")

    except Exception as e:
        log.error("webhook_dispatch_failed", error=str(e))
        # Ainda retornamos 200 para não travar a Evolution, mas logamos o erro
        return {"status": "error_logged"}

    return {"status": "ok"}

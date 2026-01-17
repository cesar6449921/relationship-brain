import os
import json
import httpx
import vertexai
from vertexai.generative_models import GenerativeModel
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)
from logging_config import get_logger
from google.oauth2 import service_account

logger = get_logger(__name__)

# --- Configurações Evolution ---
EVOLUTION_URL = os.getenv("EVOLUTION_URL", "http://evolution-api:8080")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "casal_bot")

# --- Configurações Vertex AI ---
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-flash-001")

# Autenticação Vertex AI
try:
    creds_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    if creds_json:
        try:
            info = json.loads(creds_json)
            credentials = service_account.Credentials.from_service_account_info(info)
            vertexai.init(project=PROJECT_ID, location=LOCATION, credentials=credentials)
            logger.info("vertex_ai_initialized_with_json", project=PROJECT_ID)
        except json.JSONDecodeError:
            logger.error("vertex_ai_creds_error", error="Invalid JSON in credentials env var")
    else:
        # Tenta autenticação padrão (ADC)
        vertexai.init(project=PROJECT_ID, location=LOCATION)
        logger.info("vertex_ai_initialized_adc", project=PROJECT_ID)
except Exception as e:
    logger.error("vertex_ai_init_fatal_error", error=str(e))

SYSTEM_PROMPT = """
Você é um Assistente de Relacionamento empático, inteligente e prático.
Seu objetivo é ajudar na comunicação, sugerir encontros e mediar conflitos leves.
Seja conciso. Use emojis.
"""

model = GenerativeModel(
    MODEL_NAME,
    system_instruction=[SYSTEM_PROMPT]
)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def generate_ai_content(user_text: str, user_name: str):
    return model.generate_content(
        f"{user_name} disse: {user_text}",
        generation_config={
            "max_output_tokens": 500,
            "temperature": 0.7,
            "top_p": 0.8
        }
    )

def process_message(user_text: str, user_name: str) -> str:
    log = logger.bind(user_name=user_name)
    try:
        log.info("calling_vertex_ai", model=MODEL_NAME)
        response = generate_ai_content(user_text, user_name)
        
        try:
            if response.text:
                return response.text
        except ValueError:
            log.warning("vertex_safety_block")
            return "Hmm, melhor mudarmos de assunto. O filtro de segurança bloqueou essa resposta. 😅"

        return "Não consegui formular uma resposta."

    except Exception as e:
        log.error("vertex_ai_failed", error=str(e))
        return "Ops, meu cérebro deu um curto! Tente novamente em instantes. 🧠💥"

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((httpx.ConnectError, httpx.TimeoutException)),
    reraise=False,
)
async def send_text(remote_jid: str, text: str):
    url = f"{EVOLUTION_URL}/message/sendText/{INSTANCE_NAME}"
    log = logger.bind(remote_jid=remote_jid, instance=INSTANCE_NAME)
    
    log.info("sending_whatsapp_message")

    payload = {"number": remote_jid, "text": text, "delay": 1200, "linkPreview": True}
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code == 201:
                log.info("message_sent_success")
            else:
                log.error("message_send_failed", status=response.status_code, body=response.text)
        except Exception as e:
            log.error("evolution_api_connection_error", error=str(e))
            raise e

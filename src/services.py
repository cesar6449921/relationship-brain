import os
import httpx
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)
from logging_config import get_logger

# --- HACK: Forçar GenAI a ignorar credenciais do GCP/ADC ---
# Remove variáveis que ativam a autenticação automática do Google Cloud
for key in ["GOOGLE_APPLICATION_CREDENTIALS", "GOOGLE_CLOUD_PROJECT", "GCLOUD_PROJECT"]:
    os.environ.pop(key, None)

import google.generativeai as genai

logger = get_logger(__name__)

# --- Configurações Evolution ---
EVOLUTION_URL = os.getenv("EVOLUTION_URL", "http://evolution-api:8080")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "test-bot-2")

# --- Configurações Google GenAI (Studio) ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

if not GOOGLE_API_KEY:
    logger.error("api_key_missing", msg="GOOGLE_API_KEY not found in env")
else:
    genai.configure(api_key=GOOGLE_API_KEY)
    logger.info("genai_configured_explicitly")

SYSTEM_PROMPT = """
Você é o "NósDois AI", um Terapeuta de Casais especialista em Comportamento Humano.
Seu objetivo é ajudar na comunicação, sugerir encontros e mediar conflitos leves.
Seja conciso, empático e use emojis. 🌿❤️
"""

model = genai.GenerativeModel(
    "gemini-1.5-flash",
    system_instruction=SYSTEM_PROMPT
)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def generate_ai_content(user_text: str, user_name: str):
    return model.generate_content(f"{user_name} disse: {user_text}")

def process_message(user_text: str, user_name: str) -> str:
    log = logger.bind(user_name=user_name)
    try:
        log.info("calling_genai_studio", model="gemini-1.5-flash")
        response = generate_ai_content(user_text, user_name)
        
        try:
            if response.text:
                return response.text
        except ValueError:
            log.warning("genai_safety_block", safety=response.prompt_feedback)
            return "Hmm, sinto que estamos entrando em um terreno delicado. Vamos tentar refrasear? 🌿"

        return "Fiquei pensativo e sem palavras. Pode repetir? 🤔"

    except Exception as e:
        log.error("genai_failed", error=str(e))
        return "Minha intuição falhou por um instante (erro técnico). Tente novamente! 🧠✨"

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
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

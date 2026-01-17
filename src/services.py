import os
import httpx
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)
from logging_config import get_logger

logger = get_logger(__name__)

# --- Configurações Evolution ---
EVOLUTION_URL = os.getenv("EVOLUTION_URL", "http://evolution-api:8080")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "test-bot-2")

# --- Configurações Google Gemini (REST API Puro) ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-1.5-flash"

SYSTEM_PROMPT = """
Você é o "NósDois AI", um Terapeuta de Casais especialista em Comportamento Humano.
Seu objetivo é ajudar na comunicação, sugerir encontros e mediar conflitos leves.
Seja conciso, empático e use emojis. 🌿❤️
"""

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((httpx.ConnectError, httpx.TimeoutException)),
    reraise=True,
)
async def generate_ai_content_http(user_text: str, user_name: str):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GOOGLE_API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [{"text": f"{SYSTEM_PROMPT}\n\nO usuário {user_name} disse: {user_text}"}]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 800
        }
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        return response.json()

async def process_message(user_text: str, user_name: str) -> str:
    log = logger.bind(user_name=user_name)
    try:
        log.info("calling_gemini_rest", model=GEMINI_MODEL)
        
        # Chamada REST direta (Bypassa SDK)
        data = await generate_ai_content_http(user_text, user_name)
        
        try:
            # Extrai texto do JSON complexo do Gemini
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            return text
        except (KeyError, IndexError) as e:
            log.warning("gemini_parse_error", error=str(e), raw=str(data))
            # Verifica se foi bloqueado por segurança
            if "promptFeedback" in data:
                return "Sinto que tocamos em um ponto delicado. Vamos tentar falar de outra forma? 🌿"
            return "Fiquei sem palavras. Pode repetir?"

    except Exception as e:
        log.error("gemini_rest_failed", error=str(e))
        return "Minha intuição falhou por um instante (erro técnico). Tente novamente! 🧠✨"

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

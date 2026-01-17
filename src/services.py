import os
import httpx
import google.generativeai as genai
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)
from logging_config import get_logger

logger = get_logger(__name__)

# Configurações
EVOLUTION_URL = os.getenv("EVOLUTION_URL")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")

# Configuração do Google Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Nome da instância criada na Evolution
INSTANCE_NAME = "casal_bot"

SYSTEM_PROMPT = """
Você é um Assistente de Relacionamento empático, inteligente e prático.
Você está em um grupo de WhatsApp com um casal.
Seu objetivo é ajudar na comunicação, sugerir encontros e mediar conflitos leves.
Seja conciso. Use emojis. Não pareça um robô corporativo, seja um "amigo sábio".
"""

# Inicializa o modelo
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash", system_instruction=SYSTEM_PROMPT
)


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def generate_ai_content(user_text: str, user_name: str):
    """
    Chama o Google Gemini.
    Retorna o objeto de resposta completo para tratamento posterior.
    """
    return model.generate_content(f"{user_name} disse: {user_text}")


def process_message(user_text: str, user_name: str) -> str:
    """
    Envia o texto do usuário para o Google Gemini e retorna a resposta.
    """
    log = logger.bind(user_name=user_name, text_snippet=user_text[:50])

    try:
        log.info("calling_gemini")
        # Retry logic is inside the wrapper
        response = generate_ai_content(user_text, user_name)

        # O Gemini pode retornar uma resposta vazia se cair nos filtros de segurança
        # Nesse caso, response.text lança um ValueError
        try:
            if response.text:
                log.info("gemini_success", response_length=len(response.text))
                return response.text
        except ValueError:
            log.warning("gemini_safety_block", safety_ratings=response.prompt_feedback)
            return (
                "Hmm, melhor mudarmos de assunto. O Google achou isso meio perigoso! 😅"
            )

        return "Não consegui formular uma resposta."

    except Exception as e:
        log.error("gemini_failed", error=str(e), exc_info=True)
        return "Ops, meu cérebro deu um curto! Tente novamente em instantes. 🧠💥"


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((httpx.ConnectError, httpx.TimeoutException)),
    reraise=False,
)
async def send_text(remote_jid: str, text: str):
    """
    Envia mensagem de texto via Evolution API com retries.
    """
    url = f"{EVOLUTION_URL}/message/sendText/{INSTANCE_NAME}"
    log = logger.bind(remote_jid=remote_jid)

    payload = {"number": remote_jid, "text": text, "delay": 1200, "linkPreview": True}

    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            log.info("sending_whatsapp_message")
            response = await client.post(url, json=payload, headers=headers)

            if response.status_code == 201:
                log.info("message_sent_success", status=response.status_code)
            else:
                log.error(
                    "message_send_failed",
                    status=response.status_code,
                    response=response.text,
                )

        except Exception as e:
            log.error("evolution_api_connection_error", error=str(e))
            raise e

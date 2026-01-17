import os

# --- EXORCISMO DE CREDENCIAIS (CRUCIAL) ---
# Força a remoção de credenciais do GCP para evitar que a lib tente usar a Service Account da VM
# em vez da API Key. Isso resolve o erro 403 "ACCESS_TOKEN_SCOPE_INSUFFICIENT".
if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
    print(f"🧹 Removendo credencial conflitante: {os.environ['GOOGLE_APPLICATION_CREDENTIALS']}")
    del os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

import httpx
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
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
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "casal_bot")

# --- Configurações Google AI Studio (API Key) ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-flash")

# Inicializa GenAI Studio
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY, transport="rest")
    logger.info("genai_configured_success", model=MODEL_NAME)
else:
    logger.error("google_api_key_missing", msg="GOOGLE_API_KEY not found via env vars")

SYSTEM_PROMPT = """
Você é o "NósDois AI", um Terapeuta de Casais especialista em Comportamento Humano e Comunicação Não-Violenta (CNV).

SEU PAPEL:
- Ajudar casais a se entenderem melhor.
- Traduzir ataques ("Você nunca me ouve!") em necessidades ("Eu me sinto sozinho e preciso de atenção").
- Sugerir exercícios práticos e rápidos.

TOM DE VOZ:
- Acolhedor, imparcial e leve.
- Use emojis moderadamente. 🌿❤️✨

REGRAS DE OURO:
1. Valide o sentimento antes de dar a solução.
2. Nunca diga quem está "certo" ou "errado".
3. Se a conversa esquentar, sugira uma pausa (Time-out).
"""

# Configuração de Segurança
safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
}

# Inicializa o modelo
# Nota: AI Studio usa 'generative_models' implicitamente via genai.GenerativeModel
model = genai.GenerativeModel(
    model_name=MODEL_NAME,
    system_instruction=SYSTEM_PROMPT
)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def generate_ai_content(user_text: str, user_name: str):
    """
    Chama o Google AI Studio via API Key
    """
    # AI Studio chat session management is simpler, but for single turn:
    return model.generate_content(
        f"{user_name} disse: {user_text}",
        generation_config=genai.types.GenerationConfig(
            max_output_tokens=800,
            temperature=0.6,
            top_p=0.95,
        ),
        safety_settings=safety_settings,
    )


def process_message(user_text: str, user_name: str) -> str:
    log = logger.bind(user_name=user_name, text_snippet=user_text[:50])

    try:
        log.info("calling_genai_studio", model=MODEL_NAME)
        response = generate_ai_content(user_text, user_name)

        try:
            if response.text:
                log.info("genai_success", response_length=len(response.text))
                return response.text
        except ValueError:
            # Bloqueio de segurança ou erro de resposta vazia
            log.warning(
                "genai_safety_block",
                feedback=getattr(response, "prompt_feedback", "unknown"),
                candidates=getattr(response, "candidates", "unknown")
            )
            return "Sinto que tocamos em um ponto muito sensível. Que tal respirarmos fundo e tentarmos falar sobre como você se *sente* em vez do que aconteceu? 🌿"

        return (
            "Fiquei em silêncio refletindo... (Erro de resposta vazia). Pode repetir?"
        )

    except Exception as e:
        log.error("genai_failed", error=str(e), exc_info=True)
        return "Minha conexão com a sabedoria universal falhou (erro técnico). Tente de novo em 1 minuto! 🧘‍♂️"


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((httpx.ConnectError, httpx.TimeoutException)),
    reraise=False,
)
async def send_text(remote_jid: str, text: str):
    url = f"{EVOLUTION_URL}/message/sendText/{INSTANCE_NAME}"
    log = logger.bind(remote_jid=remote_jid, instance=INSTANCE_NAME)

    payload = {"number": remote_jid, "text": text, "delay": 1200, "linkPreview": True}
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            log.info("sending_whatsapp_message")
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code == 201:
                log.info("message_sent_success")
            else:
                log.error(
                    "message_send_failed",
                    status=response.status_code,
                    body=response.text,
                )
        except Exception as e:
            log.error("evolution_api_connection_error", error=str(e))
            raise e

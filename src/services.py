import os
import json
import httpx
import vertexai
from vertexai.generative_models import GenerativeModel, SafetySetting, HarmCategory, HarmBlockThreshold
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
# Modelo Moderno (Tenta o 2.0, se falhar cai no 1.5 via fallback manual se necessário)
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-flash-001") 

# Inicialização Vertex AI (Com logs detalhados)
try:
    if not PROJECT_ID:
        logger.warning("vertex_missing_project_id", msg="Using default credentials project")
    
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    logger.info("vertex_ai_init_success", project=PROJECT_ID, location=LOCATION, model=MODEL_NAME)
except Exception as e:
    logger.error("vertex_ai_init_failed", error=str(e))

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

# Configuração de Segurança (Permite conversas difíceis de relacionamento)
safety_settings = [
    SafetySetting(
        category=HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=HarmBlockThreshold.BLOCK_ONLY_HIGH,
    ),
    SafetySetting(
        category=HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=HarmBlockThreshold.BLOCK_ONLY_HIGH,
    ),
    SafetySetting(
        category=HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold=HarmBlockThreshold.BLOCK_ONLY_HIGH,
    ),
    SafetySetting(
        category=HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=HarmBlockThreshold.BLOCK_ONLY_HIGH,
    ),
]

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
            "max_output_tokens": 800,
            "temperature": 0.6,
            "top_p": 0.95,
        },
        safety_settings=safety_settings
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
            # Vertex AI bloqueou
            log.warning("vertex_safety_block", finish_reason=getattr(response.candidates[0], 'finish_reason', 'unknown'))
            return "Sinto que tocamos em um ponto muito sensível. Que tal respirarmos fundo e tentarmos falar sobre como você se *sente* em vez do que aconteceu? 🌿"

        return "Fiquei em silêncio refletindo... (Erro de resposta vazia). Pode repetir?"

    except Exception as e:
        log.error("vertex_ai_failed", error=str(e))
        # Fallback amigável
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

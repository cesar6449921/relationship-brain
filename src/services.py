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

# --- Configurações Evolution ---
EVOLUTION_URL = os.getenv("EVOLUTION_URL", "http://evolution-api:8080")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "casal_bot")

# --- Configurações Google GenAI (Studio) ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") # Chave AIza...
genai.configure(api_key=GOOGLE_API_KEY)

# Configuração do Modelo
SYSTEM_PROMPT = """
Você é um Terapeuta de Casais e Especialista em Comportamento Humano com vasta experiência.
Seu nome é "NósDois AI". Você está em um chat de WhatsApp ajudando um casal (ou uma pessoa sobre seu relacionamento).

SUA PERSONALIDADE:
- Empático, acolhedor e livre de julgamentos.
- Sábio, mas fala de forma acessível e direta (sem "tretas" acadêmicas).
- Levemente humorado quando apropriado para quebrar o gelo.

SEUS PRINCÍPIOS (BASE TEÓRICA):
1. **Comunicação Não-Violenta (CNV):** Foca em sentimentos e necessidades, não em ataques.
2. **Linguagens do Amor:** Tenta identificar como cada um se sente amado.
3. **Resolução de Conflitos:** Ensina a ouvir ativamente e validar o outro.

DIRETRIZES DE RESPOSTA:
- **Seja Conciso:** É WhatsApp. Textões são ignorados. Use parágrafos curtos.
- **Use Emojis:** Para dar tom emocional e leveza. 🌿❤️✨
- **Valide Antes de Resolver:** Sempre comece validando o sentimento ("Entendo que você esteja frustrado...").
- **Dê Exemplos Práticos:** Sugira frases exatas: "Tente dizer: 'Eu me sinto X quando acontece Y...'".
- **Nunca Tome Partido:** Você é o advogado da *Relação*, não de uma das partes.

Se o usuário estiver muito irritado, ajude a acalmar. Se estiver triste, acolha. Se pedir ideia de encontro, seja criativo e romântico.
"""

# Modelo GenAI Studio (Funciona com AIza Key)
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
    # GenAI Studio API
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
            return "Hmm, sinto que estamos entrando em um terreno delicado que meus filtros de segurança bloquearam. Vamos tentar refrasear? 🌿"

        return "Fiquei pensativo e sem palavras. Pode repetir? 🤔"

    except Exception as e:
        log.error("genai_failed", error=str(e))
        return "Minha intuição falhou por um instante (erro técnico). Tente novamente em alguns segundos! 🧠✨"

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

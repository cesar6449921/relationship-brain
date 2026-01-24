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
EVOLUTION_URL = os.getenv("EVOLUTION_URL", "https://whatsapp.nosai.online")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "NosAi-Bot1")

# --- Configurações Google Gemini (REST API Puro) ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("MODEL_NAME") or os.getenv("GEMINI_MODEL") or "gemini-2.0-flash-exp"

SYSTEM_PROMPT = """
Você é o "NósDois AI", um amigo sábio e mediador no grupo de WhatsApp do casal.
Sua função é fortalecer a relação com conselhos pontuais e naturais.

**Regras de Estilo (MENSAGENS PICADAS):**
1. **NUNCA MANDE TEXTÃO:** Ninguém lê blocos grandes no WhatsApp.
2. **QUEBRE AS MENSAGENS:** Se precisar explicar algo, mande várias mensagens curtas em vez de uma longa.
3. **USE A TAG `<QUEBRA>`:** Para separar as mensagens, use exatamente essa tag.

**Uso de Emojis (IMPORTANTE):**
- **Use APENAS 1 emoji por conversa** (não em toda mensagem)
- **Apenas quando realmente relevante** (emoção forte, celebração, alerta)
- **Variedade:** Nunca repita o mesmo emoji. Exemplos:
  - Positivo: 💚, 🌱, ✨, 🤝, 💪, 🎯
  - Reflexivo: 🤔, 💭, 🧠
  - Alerta: ⚠️, 🚨, 💡
  - Celebração: 🎉, 🥳, 👏
- **Evite:** 😊, 😃, 😄 (muito genéricos)

**Exemplo de Como Responder:**
"Entendo, cara. É complicado mesmo.<QUEBRA>Mas geralmente irritação esconde outra coisa.<QUEBRA>Tenta chamar ela pra conversar num momento calmo, sem cobrar nada.<QUEBRA>Só pergunta 'tá tudo bem?' e escuta. 💚"

**O que NÃO fazer:**
- Não reformate o texto com bullet points (*) ou listas numéricas.
- Não use negrito excessivo.
- Não escreva mais de 2 linhas antes de usar uma `<QUEBRA>`.
- Não use emoji em TODA mensagem (máximo 1 por conversa).

**Conteúdo:**
Seja empático mas prático. Dê uma sugestão acionável e pare.
"""

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((httpx.ConnectError, httpx.TimeoutException)),
    reraise=True,
)
async def generate_ai_content_http(user_text: str, user_name: str, history_text: str = ""):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GOOGLE_API_KEY}"
    
    # Prompt combinado com histórico
    # FORÇAR BREVIDADE: Adiciona instrução no final para vencer o viés do histórico
    full_prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        f"{history_text}\n\n"
        f"O usuário {user_name} disse: {user_text}\n"
        f"(IMPORTANTE: Responda como um amigo no WhatsApp. Máximo 2 frases curtas. Sem listas. Sem titubeios.)"
    )

    payload = {
        "contents": [{
            "parts": [{"text": full_prompt}]
        }],
        "generationConfig": {
            "temperature": 0.8,  # Mais criativo e empático
            "maxOutputTokens": 1024,  # Respostas mais completas
            "topP": 0.95,
            "topK": 40
        }
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        return response.json()

async def process_message(user_text: str, user_name: str, remote_jid: str = "unknown", couple_context: dict = None) -> str:
    # Importação local para evitar ciclo se memory importar services (embora não importe agora)
    from memory import conversation_manager
    
    log = logger.bind(user_name=user_name, jid=remote_jid)
    
    # 1. Recupera histórico
    history_str = conversation_manager.get_formatted_history(remote_jid)
    
    # 2. Injeta Contexto dos Casais (Nomes vs Números)
    context_instruction = ""
    if couple_context:
        # Ex: "Contexto: O usuário atual é Julio. O parceiro é Tainá (55279...)."
        context_instruction = (
            f"\n\n[CONTEXTO DO CASAL]\n"
            f"Você está falando com um casal. Use os nomes reais abaixo em vez de números:\n"
            f"- Usuário Atual: {couple_context.get('user_name')} (Telefone: {couple_context.get('user_phone')})\n"
            f"- Parceiro(a): {couple_context.get('partner_name')} (Telefone: {couple_context.get('partner_phone')})\n"
            f"Sempre se refira a eles pelos nomes. Se eles mencionarem '@...', entenda que é o parceiro.\n"
        )
    
    # 2. Registra mensagem do usuário na memória
    conversation_manager.add_message(remote_jid, "user", user_text, user_name)

    try:
        log.info("calling_gemini_rest", model=GEMINI_MODEL, history_len=len(history_str))
        
        # 3. Chamada REST com histórico E contexto
        full_text_start = f"{context_instruction}\n{history_str}" if couple_context else history_str
        data = await generate_ai_content_http(user_text, user_name, full_text_start)
        
        try:
            # Extrai texto do JSON complexo do Gemini
            ai_text = data["candidates"][0]["content"]["parts"][0]["text"]
            
            # 4. Registra resposta da IA na memória
            conversation_manager.add_message(remote_jid, "model", ai_text)
            
            return ai_text
        except (KeyError, IndexError) as e:
            log.warning("gemini_parse_error", error=str(e), raw=str(data))
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
async def send_text(remote_jid: str, text: str, mentions: list[str] = None):
    # --- MOCK LOGIC ---
    if os.getenv("MOCK_WHATSAPP", "false").lower() == "true":
        logger.warning(f"MOCK_MODE: Skipping send_text to {remote_jid}")
        return
    # ------------------

    url = f"{EVOLUTION_URL}/message/sendText/{INSTANCE_NAME}"
    log = logger.bind(remote_jid=remote_jid, instance=INSTANCE_NAME)
    
    log.info("sending_whatsapp_message")

    payload = {"number": remote_jid, "text": text, "delay": 1200, "linkPreview": True}
    if mentions:
        payload["mentions"] = mentions
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

async def create_whatsapp_group(subject: str, participants: list[str]) -> str:
    """
    Cria um grupo no WhatsApp com os participantes iniciais.
    Retorna o JID do grupo criado (ex: 123456@g.us).
    """
    # --- MOCK LOGIC ---
    if os.getenv("MOCK_WHATSAPP", "false").lower() == "true":
         logger.warning("MOCK_MODE: Returning fake group ID for create_whatsapp_group")
         return "123456789-group@g.us"
    # ------------------
    
    url = f"{EVOLUTION_URL}/group/create/{INSTANCE_NAME}"
    log = logger.bind(subject=subject, participants=participants)
    
    log.info("creating_whatsapp_group")

    payload = {
        "subject": subject,
        "participants": participants,
        "description": "Grupo de Terapia Guiada por IA - NósDois"
    }
    
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code in (200, 201):
                data = response.json()
                # Dependendo da versão da Evolution, o retorno pode variar
                # Geralmente retorna algo como { "id": "...", "subject": "..." } ou dentro de "group"
                group_jid = data.get("id") or data.get("gid") or data.get("group", {}).get("id")
                
                if group_jid:
                    log.info("group_created_success", group_jid=group_jid)
                    return group_jid
                else:
                    log.error("group_creation_no_id", body=data)
                    return None
            else:
                log.error("group_creation_failed", status=response.status_code, body=response.text)
                return None
        except Exception as e:
            log.error("evolution_api_group_error", error=str(e))
            return None

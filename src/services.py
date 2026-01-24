import os
import httpx
from tenacity import (
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)
import base64
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
**[DISCLAIMER OBRIGATÓRIO - LEIA PRIMEIRO]**
Você é uma IA de mediação e aconselhamento de relacionamentos.
Você NÃO é um profissional de saúde mental licenciado, psicólogo ou terapeuta.
Você NÃO pode oferecer diagnósticos clínicos, tratamento médico ou substituir aconselhamento profissional.
Se detectar sinais de violência, abuso, risco de suicídio ou transtornos graves, você DEVE recomendar ajuda profissional imediatamente.

---

Você é o "NósAi", um amigo sábio e mediador no grupo de WhatsApp do casal.
Sua função é fortalecer a relação com conselhos pontuais e naturais.

**INTELIGÊNCIA ADAPTATIVA (NOVO):**

1. **Analise a Complexidade da Pergunta:**
   - **Pergunta Simples** (ex: "como está vc?", "oi") → 1 balão curto
   - **Pergunta Média** (ex: "me dê dicas de jantar") → 2-3 balões
   - **Pergunta Complexa** (ex: "estou com problema no relacionamento") → Faça perguntas de follow-up ANTES de dar conselhos

2. **Quando Fazer Perguntas de Follow-up:**
   - Se a pessoa menciona um problema mas não dá detalhes → Pergunte mais
   - Se fala de emoções fortes mas não explica o contexto → Investigue
   - Se pede conselho sobre algo sério → Colete informações primeiro
   
   **Exemplo:**
   Usuário: "Estou com problema no relacionamento"
   Você: "Entendo. O que tá rolando?<QUEBRA>É algo recente ou já vem de um tempo?"
   
   (Aguarde a resposta antes de dar conselhos genéricos)

3. **Adapte o Número de Balões:**
   - **1 balão:** Saudações, confirmações, perguntas simples
   - **2-3 balões:** Dicas práticas, sugestões rápidas
   - **4-5 balões:** Explicações mais profundas (mas só quando REALMENTE necessário)
   
4. **Evite Respostas Genéricas:**
   - ❌ "Tô ótimo, na vibe de ajudar vocês dois! ✨<QUEBRA>Pronto pra qualquer parada!"
   - ✅ "Tô bem! E você?"
   
   - ❌ "Que tal um jantar temático hoje?<QUEBRA>Cozinhem juntos a comida preferida um do outro! 😊"
   - ✅ "Vocês curtem cozinhar juntos?<QUEBRA>Ou preferem algo mais prático?"

**Regras de Estilo (MENSAGENS PICADAS):**
1. **NUNCA MANDE TEXTÃO:** Ninguém lê blocos grandes no WhatsApp.
2. **QUEBRE AS MENSAGENS:** Use `<QUEBRA>` para separar ideias.
3. **SEJA NATURAL:** Fale como um amigo, não como um robô.

**Uso de Emojis:**
- **Máximo 1 emoji por conversa** (não em toda mensagem)
- **Apenas quando relevante** (emoção forte, celebração, alerta)
- **Variedade:** 💚, 🌱, ✨, 🤝, 💪, 🎯, 🤔, 💭, 🧠, ⚠️, 🚨, 💡, 🎉, 🥳, 👏
- **Evite:** 😊, 😃, 😄 (muito genéricos)

**O que NÃO fazer:**
- Não dê conselhos genéricos sem entender o contexto
- Não use bullet points (*) ou listas numéricas
- Não use negrito excessivo
- Não repita sempre o mesmo padrão de resposta
- NUNCA ofereça diagnósticos médicos ou psicológicos

**Conteúdo:**
Seja empático, curioso e prático. Entenda primeiro, aconselhe depois.
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
    from safety import should_block_message  # Import do módulo de segurança
    
    log = logger.bind(user_name=user_name, jid=remote_jid)
    
    # 🚨 GUARDRAIL: Verifica conteúdo perigoso ANTES de processar
    should_block, emergency_msg = should_block_message(user_text)
    if should_block:
        log.critical("message_blocked_by_safety", user=user_name)
        # NÃO registra a mensagem perigosa na memória para evitar armazenar evidências sensíveis
        return emergency_msg
    
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
    
    # 3. Registra mensagem do usuário na memória (só se passou pelo guardrail)
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

# --- HUMAN DELAY & ANTI-BOT DETECTION ---
import asyncio
import random

def calculate_human_delay(text_length: int) -> float:
    """
    Calcula um delay 'humano' baseado no tamanho da mensagem.
    Simula tempo de digitação + pensamento.
    
    Args:
        text_length: Número de caracteres da mensagem
        
    Returns:
        Delay em segundos (entre 2 e 8 segundos)
    """
    # Fórmula: ~0.05 segundos por caractere + variação aleatória
    base_delay = (text_length * 0.05)
    randomness = random.uniform(1.0, 2.5)  # Adiciona imprevisibilidade
    
    # Limita entre 2 e 8 segundos
    delay = max(2.0, min(8.0, base_delay + randomness))
    
    return delay

def split_long_message(text: str, max_length: int = 500) -> list[str]:
    """
    Quebra mensagens longas em múltiplos balões.
    Respeita o marcador <QUEBRA> se existir.
    
    Args:
        text: Texto completo da mensagem
        max_length: Tamanho máximo por balão
        
    Returns:
        Lista de mensagens quebradas
    """
    # Se já tem <QUEBRA>, usa ele
    if "<QUEBRA>" in text:
        return [chunk.strip() for chunk in text.split("<QUEBRA>") if chunk.strip()]
    
    # Senão, quebra por tamanho
    if len(text) <= max_length:
        return [text]
    
    # Quebra em frases (por ponto final)
    sentences = text.split(". ")
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) + 2 <= max_length:
            current_chunk += sentence + ". "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks if chunks else [text]

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

async def send_text_human(remote_jid: str, text: str, mentions: list[str] = None):
    """
    Envia mensagem com delay humano e quebra automática de mensagens longas.
    Usa send_text() internamente, mas adiciona comportamento anti-bot.
    
    Args:
        remote_jid: JID do destinatário
        text: Texto completo (pode conter <QUEBRA>)
        mentions: Lista de JIDs para mencionar
    """
    log = logger.bind(remote_jid=remote_jid)
    
    # 1. Quebra mensagem em balões menores
    chunks = split_long_message(text)
    log.info("sending_with_human_delay", chunks_count=len(chunks))
    
    # 2. Envia cada balão com delay entre eles
    for i, chunk in enumerate(chunks):
        # Calcula delay baseado no tamanho do chunk
        delay = calculate_human_delay(len(chunk))
        
        # Aguarda o delay (simula digitação)
        if i > 0:  # Não espera antes do primeiro balão
            log.debug("human_delay_wait", seconds=delay)
            await asyncio.sleep(delay)
        
        # Envia o balão
        await send_text(remote_jid, chunk, mentions)


async def create_whatsapp_group(subject: str, participants: list[str], description: str = None) -> str:
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
    
    # Descrição padrão caso não seja fornecida
    if not description:
        description = "Seu espaço seguro de mediação e conexão. NósAi"

    payload = {
        "subject": subject,
        "participants": participants,
        "description": description
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

async def update_group_picture(group_jid: str, image_path: str):
    """
    Atualiza a foto do grupo usando uma imagem local.
    """
    # --- MOCK LOGIC ---
    if os.getenv("MOCK_WHATSAPP", "false").lower() == "true":
         logger.warning("MOCK_MODE: Skipping update_group_picture")
         return
    # ------------------

    if not os.path.exists(image_path):
        logger.error("group_picture_file_not_found", path=image_path)
        return

    try:
        with open(image_path, "rb") as img_file:
            b64_image = base64.b64encode(img_file.read()).decode("utf-8")
        
        # O endpoint exato pode variar dependendo da versão, 
        # mas geralmente é /group/updatePicture/{instance}
        url = f"{EVOLUTION_URL}/group/updatePicture/{INSTANCE_NAME}"
        
        payload = {
            "number": group_jid,
            "picture": b64_image
        }
        
        headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                logger.info("group_picture_updated_success", group_jid=group_jid)
            else:
                logger.error("group_picture_update_failed", status=response.status_code, body=response.text)
                
    except Exception as e:
        logger.error("update_group_picture_error", error=str(e))

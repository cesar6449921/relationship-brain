"""
Módulo de Segurança (Guardrails)
Detecta conteúdo sensível e perigoso antes de processar com a IA
"""
import re
from logging_config import get_logger

logger = get_logger(__name__)

# Palavras-chave de alto risco (violência, suicídio, abuso)
DANGER_KEYWORDS = [
    # Violência física
    "bater", "bateu", "batendo", "soco", "chute", "empurr", "agredir", "agrediu",
    "machuc", "ferido", "sangr", "roxo", "hematoma",
    
    # Ameaças e medo
    "ameaça", "ameaçou", "medo", "com medo", "assustado", "assustada",
    "polícia", "delegacia", "denúncia", "boletim de ocorrência",
    
    # Suicídio e autolesão
    "suicídio", "suicidar", "me matar", "matar-me", "acabar com tudo",
    "não aguento mais", "quero morrer", "vou me matar",
    "cortar os pulsos", "pular da ponte", "overdose",
    
    # Abuso e coerção
    "abuso", "estupro", "forçou", "forçar", "obrigou", "obrigar",
    "não consigo sair", "me tranca", "me prende",
    
    # Drogas pesadas (contexto de dependência grave)
    "crack", "cocaína", "heroína", "viciado em",
]

# Mensagem de emergência estática (não personalizada)
EMERGENCY_MESSAGE = """⚠️ **Conteúdo Sensível Detectado**

Para sua segurança, não posso mediar essa situação.

Se você ou alguém está em perigo imediato:
🚨 **Ligue 190** (Polícia)
💜 **Ligue 180** (Central de Atendimento à Mulher)
🧠 **CVV 188** (Apoio emocional e prevenção ao suicídio)

Procure ajuda profissional especializada. Você não está sozinho(a).
"""

def contains_danger_keywords(text: str) -> bool:
    """
    Verifica se o texto contém palavras-chave perigosas.
    
    Args:
        text: Texto da mensagem do usuário
        
    Returns:
        True se contém palavras perigosas, False caso contrário
    """
    text_lower = text.lower()
    
    for keyword in DANGER_KEYWORDS:
        # Usa regex para detectar palavra completa ou parte dela
        pattern = r'\b' + re.escape(keyword)
        if re.search(pattern, text_lower):
            logger.warning("danger_keyword_detected", keyword=keyword, text_preview=text[:50])
            return True
    
    return False

def should_block_message(text: str) -> tuple[bool, str]:
    """
    Decide se a mensagem deve ser bloqueada e retorna a mensagem de emergência.
    
    Args:
        text: Texto da mensagem do usuário
        
    Returns:
        Tupla (should_block: bool, emergency_msg: str)
    """
    if contains_danger_keywords(text):
        logger.critical("message_blocked_safety", reason="danger_keywords")
        return (True, EMERGENCY_MESSAGE)
    
    return (False, "")

"""
Módulo de Mediação Ativa
Detecta conflitos e gera intervenções empáticas
"""
from datetime import datetime, timedelta
import re

# Palavras-gatilho que indicam conflito
CONFLICT_KEYWORDS = [
    "nunca", "sempre", "você só", "de novo", "toda vez",
    "não me escuta", "não liga", "não se importa",
    "culpa", "errado", "problema seu"
]

# Emojis negativos
NEGATIVE_EMOJIS = ["😡", "😤", "🙄", "😠", "💢", "😒"]

# Cooldown mínimo entre mediações (em minutos)
MEDIATION_COOLDOWN_MINUTES = 5


def analyze_conflict_level(message_text: str) -> int:
    """
    Analisa o nível de conflito de uma mensagem (0-10).
    
    Args:
        message_text: Texto da mensagem
        
    Returns:
        int: Nível de conflito (0 = neutro, 10 = alto conflito)
    """
    conflict_score = 0
    text_lower = message_text.lower()
    
    # 1. Palavras-gatilho (+2 pontos cada)
    for keyword in CONFLICT_KEYWORDS:
        if keyword in text_lower:
            conflict_score += 2
    
    # 2. Emojis negativos (+3 pontos cada)
    for emoji in NEGATIVE_EMOJIS:
        if emoji in message_text:
            conflict_score += 3
    
    # 3. Caps Lock excessivo (+2 pontos)
    if len(message_text) > 10:
        uppercase_ratio = sum(1 for c in message_text if c.isupper()) / len(message_text)
        if uppercase_ratio > 0.5:
            conflict_score += 2
    
    # 4. Pontos de exclamação múltiplos (+1 ponto)
    if message_text.count('!') >= 2:
        conflict_score += 1
    
    # Limita a 10
    return min(conflict_score, 10)


def should_mediate(
    conflict_level: int,
    last_mediation_at: datetime | None,
    manual_trigger: bool = False
) -> bool:
    """
    Decide se a IA deve intervir agora.
    
    Args:
        conflict_level: Nível de conflito (0-10)
        last_mediation_at: Timestamp da última mediação
        manual_trigger: Se foi acionado manualmente (/sos)
        
    Returns:
        bool: True se deve mediar
    """
    # Sempre mediar se for manual
    if manual_trigger:
        return True
    
    # Não mediar se conflito baixo
    if conflict_level < 4:
        return False
    
    # Verificar cooldown
    if last_mediation_at:
        time_since_last = datetime.utcnow() - last_mediation_at
        if time_since_last < timedelta(minutes=MEDIATION_COOLDOWN_MINUTES):
            return False
    
    # Mediar se conflito >= 4 e cooldown ok
    return True


def generate_mediation_prompt(
    recent_messages: list[dict],
    partner_1_name: str,
    partner_2_name: str
) -> str:
    """
    Gera o prompt especializado para mediação.
    
    Args:
        recent_messages: Lista de dicts com 'sender' e 'text'
        partner_1_name: Nome do parceiro 1
        partner_2_name: Nome do parceiro 2
        
    Returns:
        str: Prompt formatado para a IA
    """
    # Formata o histórico
    history_text = "\n".join([
        f"{msg['sender']}: {msg['text']}"
        for msg in recent_messages[-5:]  # Últimas 5 mensagens
    ])
    
    prompt = f"""Você é o NósDois.ai, um terapeuta de casal empático e não-julgador.

SITUAÇÃO ATUAL:
Você detectou sinais de conflito entre {partner_1_name} e {partner_2_name}.

ÚLTIMAS MENSAGENS:
{history_text}

SUA MISSÃO:
1. Identifique o gatilho emocional principal
2. Traduza o que cada pessoa REALMENTE quis dizer (sentimento por trás das palavras)
3. Sugira um exercício prático de 5 minutos para acalmar os ânimos

FORMATO DA RESPOSTA:
Comece com: "Pessoal, percebo que os ânimos exaltaram."

Depois, use menções (@{partner_1_name}, @{partner_2_name}) para:
- Validar os sentimentos de cada um
- Traduzir a intenção real por trás das palavras duras
- Sugerir uma pausa ou exercício (ex: "Que tal cada um escrever 3 coisas que ama no outro?")

Termine com um emoji acolhedor (🌱, 💚, 🤝).

IMPORTANTE:
- Não tome partido
- Não minimize os sentimentos
- Seja breve (máximo 4 frases)
- Use linguagem simples e acolhedora
"""
    
    return prompt


def is_manual_mediation_trigger(message_text: str) -> bool:
    """
    Verifica se a mensagem é um comando manual de mediação.
    
    Args:
        message_text: Texto da mensagem
        
    Returns:
        bool: True se for /sos ou /mediar
    """
    text_lower = message_text.strip().lower()
    return text_lower in ["/sos", "/mediar", "/ajuda"]

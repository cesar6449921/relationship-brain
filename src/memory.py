import time
from collections import deque
from typing import Dict, List, Optional
import json
import os

from logging_config import get_logger

logger = get_logger(__name__)

class ConversationManager:
    """
    Gerencia o histórico de conversas em memória.
    Futuramente pode ser migrado para Redis para persistência entre restarts.
    """
    def __init__(self, history_limit: int = 20, ttl_seconds: int = 3600):
        self.history_limit = history_limit
        self.ttl = ttl_seconds
        # Estrutura: { remote_jid: { "history": deque([...]), "updated_at": timestamp } }
        self.conversations: Dict[str, dict] = {}

    def _cleanup_old_sessions(self):
        """Remove sessões inativas para economizar memória"""
        now = time.time()
        keys_to_remove = []
        for jid, data in self.conversations.items():
            if now - data["updated_at"] > self.ttl:
                keys_to_remove.append(jid)
        
        for k in keys_to_remove:
            del self.conversations[k]

    def add_message(self, remote_jid: str, role: str, content: str, user_name: str = "Usuário"):
        self._cleanup_old_sessions()
        
        if remote_jid not in self.conversations:
            self.conversations[remote_jid] = {
                "history": deque(maxlen=self.history_limit),
                "updated_at": time.time(),
                "partner_names": set() # Tentativa de rastrear nomes no chat
            }
        
        session = self.conversations[remote_jid]
        session["updated_at"] = time.time()
        
        # Adiciona nomes detectados (simples, baseado no pushName)
        if role == "user" and user_name:
            session["partner_names"].add(user_name)

        session["history"].append({
            "role": role, # 'user' ou 'model'
            "content": content,
            "name": user_name if role == "user" else "NósAi",
            "timestamp": time.time()
        })

    def get_history(self, remote_jid: str) -> List[dict]:
        if remote_jid not in self.conversations:
            return []
        
        # Converte deque para lista
        return list(self.conversations[remote_jid]["history"])

    def get_formatted_history(self, remote_jid: str) -> str:
        """Retorna histórico formatado para o Prompt do Gemini"""
        history = self.get_history(remote_jid)
        if not history:
            return ""
        
        formatted = "--- Histórico Recente ---\n"
        for msg in history:
            formatted += f"[{msg['name']}]: {msg['content']}\n"
        formatted += "-------------------------"
        return formatted

    def clear_history(self, remote_jid: str):
        if remote_jid in self.conversations:
            del self.conversations[remote_jid]

# Instância global (Singleton simples para este app stateful)
conversation_manager = ConversationManager()

import requests
import os

EVOLUTION_URL = "http://localhost:8080" # Acessando da VM, localhost porta 8080 deve ser a Evolution (via porta mapeada ou IP interno)
# Mas espere, na VM o docker da evolution expõe qual porta?
# Vou assumir que o script roda dentro de um container ou preciso usar o IP do container da evolution.
# Melhor usar o IP local da VM ou localhost se tiver port binding.
# O output do docker ps anterior mostrou: "0.0.0.0:8081->8080/tcp" para a evolution? Não vi.
# Vou tentar localhost:8081 (comum no easypanel) ou pegar o IP do container da evolution.

API_KEY = "429683C4C977415CAAFCCE10F7D57E11"
INSTANCE = "test-bot-2"

headers = {"apikey": API_KEY}

try:
    # 1. Checar se a instância existe e status
    url_instance = f"http://evo-api_evolution-api.1.i9b9bjteqf545sp3pngf2ewl6:8080/instance/fetchInstances"
    # Nome do host docker é complicado fora da rede.
    # Vou rodar esse script DE DENTRO do container do bot-brain, que já tem acesso à rede.
    pass
except Exception as e:
    print(e)

import requests
import os
import sys

# Carrega variáveis se não existirem (para teste local fácil, mas ideal é via env)
EVOLUTION_URL = os.getenv("EVOLUTION_URL")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")
# URL do Bot na nuvem (Cloud Run ou EasyPanel domain)
BOT_URL = os.getenv("BOT_URL")
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "NosAi-Bot1")

if not all([EVOLUTION_URL, EVOLUTION_API_KEY, BOT_URL]):
    print(
        "Erro: Defina EVOLUTION_URL, EVOLUTION_API_KEY e BOT_URL (sem /webhook no final)."
    )
    sys.exit(1)


def config_webhook():
    endpoint = f"{EVOLUTION_URL}/webhook/set/{INSTANCE_NAME}"

    payload = {
        "enabled": True,
        "url": f"{BOT_URL}/webhook",
        "webhookByEvents": False,
        "events": ["MESSAGES_UPSERT"],
    }

    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}

    print(f"🔌 Conectando à Evolution em: {EVOLUTION_URL}")
    print(f"🎯 Configurando instância: {INSTANCE_NAME}")
    print(f"🔗 Apontando webhook para: {payload['url']}")

    try:
        response = requests.post(endpoint, json=payload, headers=headers)
        response.raise_for_status()
        print("✅ Sucesso! Resposta da Evolution:")
        print(response.json())
    except Exception as e:
        print(f"❌ Erro ao configurar webhook: {e}")
        if "response" in locals():
            print(f"Detalhes: {response.text}")


if __name__ == "__main__":
    config_webhook()

import httpx
import asyncio
import json

API_KEY = "429683C4C977415CAAFCCE10F7D57E11"
INSTANCE = "test-bot-2"
BASE_URL = "http://evo-api_evolution-api:8080"
# O container manual se chama 'bot-brain-manual' na rede docker
NEW_WEBHOOK_URL = "http://bot-brain-manual:8000/webhook" 

HEADERS = {
    "apikey": API_KEY,
    "Content-Type": "application/json"
}

async def update_webhook():
    print(f"--- Updating Webhook for: {INSTANCE} ---")
    print(f"Target URL: {NEW_WEBHOOK_URL}")
    
    async with httpx.AsyncClient() as client:
        try:
            # Payload para configurar o webhook
            # OBS: Evolution v2 pode exigir que o payload esteja dentro de "webhook": {...}
            final_payload = {
                "webhook": {
                    "url": NEW_WEBHOOK_URL,
                    "events": ["MESSAGES_UPSERT"],
                    "enabled": True,
                    "webhookByEvents": False,
                    "webhookBase64": False
                }
            }
            
            # Endpoint: /webhook/set/{instance}
            r = await client.post(
                f"{BASE_URL}/webhook/set/{INSTANCE}", 
                headers=HEADERS, 
                json=final_payload
            )
            
            print(f"Status Code: {r.status_code}")
            print(f"Response: {r.text}")
            
            if r.status_code == 200:
                print("✅ Webhook atualizado com sucesso!")
            else:
                print("❌ Falha ao atualizar webhook.")
                
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(update_webhook())

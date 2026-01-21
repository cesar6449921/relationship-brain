import httpx
import asyncio
import json

# Simula um webhook da Evolution API
WEBHOOK_URL = "http://localhost:8000/webhook"

# Payload de exemplo (mensagem de teste)
test_payload = {
    "event": "messages.upsert",
    "data": {
        "key": {
            "remoteJid": "5511999999999@s.whatsapp.net",
            "fromMe": False,
            "id": "TEST_MSG_ID_12345"
        },
        "pushName": "Teste Usuario",
        "messageType": "conversation",
        "message": {
            "conversation": "Oi, tudo bem?"
        }
    }
}

async def test_webhook():
    print("🧪 Enviando mensagem de teste para o webhook...")
    print(f"URL: {WEBHOOK_URL}")
    print(f"Payload: {json.dumps(test_payload, indent=2)}")
    
    async with httpx.AsyncClient() as client:
        try:
            r = await client.post(WEBHOOK_URL, json=test_payload)
            print(f"\n✅ Status: {r.status_code}")
            print(f"Response: {r.text}")
        except Exception as e:
            print(f"❌ Erro: {e}")

if __name__ == "__main__":
    asyncio.run(test_webhook())

"""
Script de teste DIRETO para atualizar foto de grupo.
Execute: python scripts/test_update_picture_direct.py
"""
import asyncio
import os
import sys
import base64
import httpx
from dotenv import load_dotenv

load_dotenv()

EVOLUTION_URL = os.getenv("EVOLUTION_URL", "https://whatsapp.nosai.online")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "NosAi-Bot1")

async def test_update_picture():
    # JID do grupo que você acabou de criar
    group_jid = input("Digite o JID do grupo (ex: 120363123456789012@g.us): ").strip()
    
    if not group_jid:
        print("❌ JID não fornecido!")
        return
    
    image_path = os.path.join("frontend", "logos", "logo-grupo-criar.png")
    
    print(f"\n📋 Configuração:")
    print(f"   Evolution URL: {EVOLUTION_URL}")
    print(f"   Instance: {INSTANCE_NAME}")
    print(f"   Group JID: {group_jid}")
    print(f"   Image Path: {image_path}")
    print(f"   Image exists: {os.path.exists(image_path)}")
    
    if not os.path.exists(image_path):
        print(f"\n❌ Imagem não encontrada em: {image_path}")
        return
    
    # Lê e codifica a imagem
    print(f"\n📸 Lendo imagem...")
    with open(image_path, "rb") as img_file:
        b64_image = base64.b64encode(img_file.read()).decode("utf-8")
    
    print(f"   ✅ Imagem codificada: {len(b64_image)} bytes")
    
    # Tenta diferentes endpoints e payloads
    attempts = [
        {
            "name": "Tentativa 1: PUT /group/updateGroupPicture com groupJid+image",
            "method": "PUT",
            "url": f"{EVOLUTION_URL}/group/updateGroupPicture/{INSTANCE_NAME}",
            "payload": {"groupJid": group_jid, "image": b64_image}
        },
        {
            "name": "Tentativa 2: POST /group/updatePicture com number+picture",
            "method": "POST",
            "url": f"{EVOLUTION_URL}/group/updatePicture/{INSTANCE_NAME}",
            "payload": {"number": group_jid, "picture": b64_image}
        },
        {
            "name": "Tentativa 3: PUT /group/updatePicture com groupJid+image",
            "method": "PUT",
            "url": f"{EVOLUTION_URL}/group/updatePicture/{INSTANCE_NAME}",
            "payload": {"groupJid": group_jid, "image": b64_image}
        },
    ]
    
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}
    
    for attempt in attempts:
        print(f"\n🔄 {attempt['name']}")
        print(f"   URL: {attempt['url']}")
        print(f"   Method: {attempt['method']}")
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                if attempt['method'] == 'PUT':
                    response = await client.put(attempt['url'], json=attempt['payload'], headers=headers)
                else:
                    response = await client.post(attempt['url'], json=attempt['payload'], headers=headers)
                
                print(f"   Status: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                
                if response.status_code in (200, 201):
                    print(f"   ✅ SUCESSO! Foto atualizada.")
                    return
                else:
                    print(f"   ❌ Falhou com status {response.status_code}")
        except Exception as e:
            print(f"   ❌ Erro: {e}")
    
    print(f"\n❌ Todas as tentativas falharam. Verifique a documentação da Evolution API.")

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 TESTE DE ATUALIZAÇÃO DE FOTO DE GRUPO - Evolution API")
    print("=" * 60)
    asyncio.run(test_update_picture())

"""
Script de teste FINAL - Todas as variações possíveis para Evolution API v2.3.7
Execute: python scripts\test_update_picture_final.py
"""
import asyncio
import os
import base64
import httpx
from dotenv import load_dotenv

load_dotenv()

EVOLUTION_URL = os.getenv("EVOLUTION_URL", "https://whatsapp.nosai.online")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY")
INSTANCE_NAME = os.getenv("INSTANCE_NAME", "NosAi-Bot1")

async def test_update_picture():
    group_jid = input("Digite o JID do grupo: ").strip()
    
    if not group_jid:
        print("❌ JID não fornecido!")
        return
    
    image_path = os.path.join("frontend", "logos", "logo-grupo-criar.png")
    
    print(f"\n📋 Configuração:")
    print(f"   Evolution URL: {EVOLUTION_URL}")
    print(f"   Instance: {INSTANCE_NAME}")
    print(f"   Group JID: {group_jid}")
    print(f"   Image Path: {image_path}")
    
    if not os.path.exists(image_path):
        print(f"\n❌ Imagem não encontrada!")
        return
    
    print(f"\n📸 Lendo imagem...")
    with open(image_path, "rb") as img_file:
        b64_image = base64.b64encode(img_file.read()).decode("utf-8")
    
    print(f"   ✅ Imagem codificada: {len(b64_image)} bytes")
    
    # TODAS as variações possíveis baseadas na análise do subagent
    attempts = [
        # Variação 1: Com prefixo /v2
        {
            "name": "POST /v2/group/updateGroupPicture/{instance}",
            "method": "POST",
            "url": f"{EVOLUTION_URL}/v2/group/updateGroupPicture/{INSTANCE_NAME}",
            "payload": {"groupJid": group_jid, "image": b64_image}
        },
        # Variação 2: updateProfilePicture
        {
            "name": "POST /group/updateProfilePicture/{instance}",
            "method": "POST",
            "url": f"{EVOLUTION_URL}/group/updateProfilePicture/{INSTANCE_NAME}",
            "payload": {"groupJid": group_jid, "image": b64_image}
        },
        # Variação 3: Query parameter
        {
            "name": "POST /group/updateGroupPicture?instance={instance}",
            "method": "POST",
            "url": f"{EVOLUTION_URL}/group/updateGroupPicture?instance={INSTANCE_NAME}",
            "payload": {"groupJid": group_jid, "image": b64_image}
        },
        # Variação 4: Sem instance na URL, no body
        {
            "name": "POST /group/updateGroupPicture (instance no body)",
            "method": "POST",
            "url": f"{EVOLUTION_URL}/group/updateGroupPicture",
            "payload": {"instance": INSTANCE_NAME, "groupJid": group_jid, "image": b64_image}
        },
        # Variação 5: Com /api prefix
        {
            "name": "POST /api/group/updateGroupPicture/{instance}",
            "method": "POST",
            "url": f"{EVOLUTION_URL}/api/group/updateGroupPicture/{INSTANCE_NAME}",
            "payload": {"groupJid": group_jid, "image": b64_image}
        },
    ]
    
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}
    
    for i, attempt in enumerate(attempts, 1):
        print(f"\n🔄 Tentativa {i}: {attempt['name']}")
        print(f"   URL: {attempt['url']}")
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(attempt['url'], json=attempt['payload'], headers=headers)
                
                print(f"   Status: {response.status_code}")
                
                if response.status_code in (200, 201):
                    print(f"   ✅ SUCESSO! Foto atualizada.")
                    print(f"   Response: {response.text[:200]}")
                    return True
                else:
                    print(f"   ❌ Falhou: {response.text[:150]}")
        except Exception as e:
            print(f"   ❌ Erro: {e}")
    
    print(f"\n❌ Todas as tentativas falharam.")
    print(f"\n💡 A Evolution API v2.3.7 pode não suportar atualização de foto de grupo.")
    print(f"   Recomendação: Atualizar manualmente ou aguardar migração para WhatsApp Cloud API.")
    return False

if __name__ == "__main__":
    print("=" * 70)
    print("🧪 TESTE COMPLETO - Evolution API v2.3.7 - Atualização de Foto")
    print("=" * 70)
    asyncio.run(test_update_picture())

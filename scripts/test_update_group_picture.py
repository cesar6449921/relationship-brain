"""
Script de teste para verificar se a atualização de foto de grupo funciona.
"""
import asyncio
import os
import sys

# Adiciona o diretório src ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from services import update_group_picture
from dotenv import load_dotenv

load_dotenv()

async def test_update_picture():
    # Use o JID do grupo que você acabou de criar
    group_jid = input("Digite o JID do grupo (ex: 120363123456789012@g.us): ")
    image_path = os.path.join("frontend", "logos", "logo-grupo-criar.png")
    
    print(f"Testando atualização de foto para grupo: {group_jid}")
    print(f"Caminho da imagem: {image_path}")
    print(f"Imagem existe? {os.path.exists(image_path)}")
    
    await update_group_picture(group_jid, image_path)
    print("Teste concluído. Verifique os logs acima para detalhes.")

if __name__ == "__main__":
    asyncio.run(test_update_picture())

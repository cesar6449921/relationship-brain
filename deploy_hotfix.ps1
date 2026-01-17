
# Script de Deploy de Hotfix para Evolution VM
# Este script atualiza o código na VM para usar Google AI Studio (API Key)

echo "🚀 Iniciando Deploy de Hotfix para evolution-vm..."

# 1. Definir variáveis
ZONE="southamerica-east1-b"
VM_NAME="evolution-vm"
REMOTE_DIR="~/relationship-app" # Ajuste se o caminho for diferente na VM

# 2. Atualizar requirements.txt
echo "📦 Atualizando requirements.txt..."
gcloud compute ssh $VM_NAME --zone=$ZONE --command="cat > $REMOTE_DIR/src/requirements.txt <<EOF
fastapi
uvicorn
httpx
google-generativeai
python-dotenv
tenacity
structlog
EOF"

# 3. Atualizar services.py (Lendo do arquivo local e enviando)
echo "📝 Atualizando services.py... (isso pode demorar uns segundos)"
# Truque para ler o arquivo local e enviar para o remoto via SSH
Get-Content d:\PROJETOS-GITHUB\NósDois\relationship-app\src\services.py | gcloud compute ssh $VM_NAME --zone=$ZONE --command="cat > $REMOTE_DIR/src/services.py"

# 4. Atualizar docker-compose.yml (para incluir GOOGLE_API_KEY)
echo "⚙️ Atualizando docker-compose.yml..."
Get-Content d:\PROJETOS-GITHUB\NósDois\relationship-app\docker-compose.yml | gcloud compute ssh $VM_NAME --zone=$ZONE --command="cat > $REMOTE_DIR/docker-compose.yml"

# 5. Rebuild e Restart
echo "🔄 Reiniciando container bot-brain..."
gcloud compute ssh $VM_NAME --zone=$ZONE --command="cd $REMOTE_DIR && docker-compose up -d --build bot-brain"

# 6. Verificação
echo "✅ Deploy concluído! Verificando logs..."
gcloud compute ssh $VM_NAME --zone=$ZONE --command="cd $REMOTE_DIR && docker-compose logs --tail=20 bot-brain"

echo "🏁 Fim do script."

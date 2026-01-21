#!/bin/bash
set -e

echo "🚀 Iniciando deploy do bot-brain..."

# Configurações
REPO_URL="https://github.com/cesar6449921/relationship-brain.git"
DEPLOY_DIR="/tmp/bot-brain-deploy"
IMAGE_NAME="bot-brain-production"
CONTAINER_NAME="bot-brain-manual"

# 1. Limpar deploy anterior
echo "📦 Limpando deploy anterior..."
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# 2. Clonar repositório
echo "📥 Clonando repositório..."
git clone $REPO_URL $DEPLOY_DIR
cd $DEPLOY_DIR

# 3. Build da imagem
echo "🔨 Construindo imagem Docker..."
cd src
docker build -f Dockerfile.prod -t $IMAGE_NAME .

# 4. Parar container antigo
echo "🛑 Parando container antigo..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 5. Iniciar novo container
echo "▶️  Iniciando novo container..."
docker run -d \
  --name $CONTAINER_NAME \
  --network easypanel \
  --restart unless-stopped \
  -e MODEL_NAME=gemini-2.0-flash-exp \
  -e GOOGLE_API_KEY=AIzaSyC2cVo2PSFm9AeueZMDcZAzJadNO5qWXek \
  -e EVOLUTION_URL=http://evo-api_evolution-api:8080 \
  -e EVOLUTION_API_KEY=429683C4C977415CAAFCCE10F7D57E11 \
  -e INSTANCE_NAME=test-bot-2 \
  -e GOOGLE_CLOUD_PROJECT=project-b65363af-4551-4776-b45 \
  -e GOOGLE_CLOUD_LOCATION=us-central1 \
  -e PORT=8000 \
  $IMAGE_NAME

# 6. Verificar status
echo "✅ Verificando status..."
sleep 3
docker ps | grep $CONTAINER_NAME

echo "🎉 Deploy concluído com sucesso!"
echo "📊 Para ver os logs: docker logs -f $CONTAINER_NAME"

# Guia de Deploy - Bot de Relacionamento

Este guia descreve como colocar o **Bot Brain** em produção no Google Cloud Run, garantindo robustez, logs estruturados e alta disponibilidade.

## 📋 Pré-requisitos

1.  **Google Cloud SDK** instalado e autenticado.
2.  Projeto no Google Cloud criado e com faturamento ativado.
3.  APIs ativadas:
    *   Cloud Run API
    *   Cloud Build API
    *   Artifact Registry API

## 🚀 Passo a Passo

### 1. Configurar Variáveis de Ambiente
Antes de rodar o script de deploy, exporte suas chaves (não as commite!):

```bash
export GOOGLE_API_KEY="sua_chave_gemini"
export EVOLUTION_URL="url_da_sua_evolution" # Ex: https://api.whatsapp.meu.com
export EVOLUTION_API_KEY="sua_chave_evolution"
```

### 2. Executar Deploy
Utilize o script automatizado na raiz do projeto:

```bash
chmod +x deploy.sh
./deploy.sh
```

O script irá:
1.  Construir a imagem Docker (`src/Dockerfile.prod`).
2.  Enviar para o Google Container Registry.
3.  Fazer o deploy no Cloud Run com configuração otimizada (`max-instances=1` para garantir deduplicação simples).

### 3. Configurar Webhook na Evolution
Após o deploy, o script exibirá a URL do serviço (ex: `https://bot-brain-xyz.a.run.app`).

1.  Vá no Manager da Evolution (`/manager`).
2.  Acesse a instância do bot.
3.  Em **Webhooks**:
    *   **URL**: `https://bot-brain-xyz.a.run.app/webhook`
    *   **Eventos**: Marque `MESSAGES_UPSERT`.
    *   **Habilitado**: Sim.

## 🛠 Monitoramento e Logs

Os logs agora são estruturados em JSON para facilitar a busca no **Cloud Logging**.

*   Busque por `jsonPayload.event="gemini_failed"` para ver erros de IA.
*   Busque por `jsonPayload.event="message_sent_success"` para ver mensagens enviadas.

## 🧩 Arquitetura

*   **FastAPI**: Servidor web assíncrono.
*   **Structlog**: Logs JSON estruturados.
*   **Tenacity**: Retry exponencial para falhas de rede/API.
*   **BackgroundTasks**: Processamento fora da thread principal para responder rápido ao webhook (200 OK).
*   **Deduplicação**: Cache em memória (LRU) para evitar mensagens duplicadas do WhatsApp.

# 💑 NósAi - Mediador de Casais Inteligente

Bot de WhatsApp especializado em mediação de casais, utilizando Gemini 2.0 Flash para oferecer suporte empático e profissional.

## 🎯 Funcionalidades

- ✅ **Mediação de Casais Automatizada**: Respostas empáticas baseadas em 15 anos de experiência simulada
- ✅ **Memória de Contexto**: Lembra das últimas 20 mensagens de cada conversa
- ✅ **IA de Última Geração**: Powered by Google Gemini 2.0 Flash Experimental
- ✅ **Integração WhatsApp**: Via Evolution API
- ✅ **Logs Estruturados**: Monitoramento completo em JSON
- ✅ **Deploy Automatizado**: Gerenciado via EasyPanel

## 📁 Estrutura do Projeto

```
relationship-brain/
├── src/                      # Código fonte principal
│   ├── main.py              # FastAPI app e webhook handler
│   ├── services.py          # Integração com Gemini e Evolution API
│   ├── memory.py            # Sistema de memória de contexto
│   ├── logging_config.py    # Configuração de logs estruturados
│   ├── requirements.txt     # Dependências Python
│   ├── Dockerfile           # Dockerfile para desenvolvimento
│   └── Dockerfile.prod      # Dockerfile para produção
├── scripts/                  # Scripts utilitários
│   └── setup_webhook.py     # Configuração inicial do webhook
├── .env.example             # Template de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── deploy.sh               # Script de deploy
├── docker-compose.yml      # Configuração Docker Compose
├── DEPLOY.md              # Documentação de deploy
└── README.md              # Este arquivo

```

## 🚀 Quick Start

### Pré-requisitos

- Python 3.10+
- Docker (opcional)
- Conta Google Cloud com API Key do Gemini
- Instância da Evolution API

### Instalação Local

1. **Clone o repositório**
```bash
git clone https://github.com/cesar6449921/relationship-brain.git
cd relationship-brain
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

3. **Instale as dependências**
```bash
cd src
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. **Execute o bot**
```bash
uvicorn main:app --reload
```

### Deploy com Docker

```bash
docker-compose up -d
```

### Deploy em Produção (EasyPanel)

Veja [DEPLOY.md](DEPLOY.md) para instruções detalhadas.

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Google Gemini
GOOGLE_API_KEY=sua_chave_aqui
MODEL_NAME=gemini-2.0-flash-exp

# Evolution API
EVOLUTION_URL=http://evolution-api:8080
EVOLUTION_API_KEY=sua_chave_evolution
INSTANCE_NAME=nome_da_instancia

# Google Cloud (opcional)
GOOGLE_CLOUD_PROJECT=seu_projeto
GOOGLE_CLOUD_LOCATION=us-central1

# Servidor
PORT=8000
```

## 🧠 Como Funciona

1. **Recepção**: Webhook recebe mensagens da Evolution API
2. **Contexto**: Sistema recupera histórico de conversa (últimas 20 mensagens)
3. **Processamento**: Gemini 2.0 gera resposta empática baseada no prompt de mediador
4. **Resposta**: Mensagem é enviada de volta via Evolution API
5. **Memória**: Conversa é armazenada para contexto futuro

## 📊 Monitoramento

Os logs são estruturados em JSON para fácil análise:

```json
{
  "event": "message_sent_success",
  "instance": "test-bot-2",
  "level": "info",
  "remote_jid": "5527996449921@s.whatsapp.net",
  "timestamp": "2026-01-21T12:34:49.027491Z"
}
```

## 🛠️ Desenvolvimento

### Estrutura de Código

- **main.py**: Endpoints FastAPI e gerenciamento de webhooks
- **services.py**: Lógica de negócio e integração com APIs
- **memory.py**: Sistema de cache de conversas em memória
- **logging_config.py**: Configuração de logs estruturados

### Adicionando Novas Funcionalidades

1. Edite o prompt em `src/services.py` (variável `SYSTEM_PROMPT`)
2. Adicione novos endpoints em `src/main.py`
3. Teste localmente com `uvicorn main:app --reload`
4. Commit e push para deploy automático

## 📝 Licença

Este projeto é privado e proprietário.

## 🤝 Contribuindo

Para contribuir:
1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ usando Google Gemini 2.0 Flash**

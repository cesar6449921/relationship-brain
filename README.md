# 💑 NósAi 2.0 - Mediação Inteligente de Relacionamentos

> **Tecnologia de ponta para garantir um espaço seguro de diálogo.**

O **NósAi** é um mediador de relacionamentos baseado em Inteligência Artificial que vive dentro do WhatsApp do casal. Ele utiliza a tecnologia avançada do **Google Gemini** para moderar conversas, reformular mensagens agressivas e sugerir dinâmicas de conexão, tudo em um ambiente criptografado e seguro.

---

## 🚫 Aviso Importante (Disclaimer)

**O NósAi NÃO substitui profissionais de saúde mental.**
Esta ferramenta é um assistente de comunicação para conflitos cotidianos. Para casos de violência doméstica, abuso, crises psicológicas graves ou risco de vida, procure imediatamente ajuda profissional ou autoridades competentes (Ligue 180/190).

---

## 🛠️ Stack Tecnológico

O projeto é construído sobre pilares de segurança e escalabilidade:

- **Cérebro (IA):** Google Gemini 2.0 Flash (via Vertex AI)
- **Interface:** WhatsApp (via Evolution API v2)
- **Backend:** Python (FastAPI) + Google Cloud Run
- **Frontend:** React + Vite + TailwindCSS
- **Banco de Dados:** Supabase (PostgreSQL)
- **Infraestrutura:** Docker + EasyPanel

---

## 🚀 Funcionalidades Principais

- **Mediação Ativa:** Intervenção em tempo real quando o tom da conversa aquece.
- **Reformulação de Mensagens:** Sugere formas mais empáticas de dizer a mesma coisa.
- **Evolução Diária:** Exercícios personalizados baseados no histórico do casal.
- **Privacidade Absoluta:** Conversas criptografadas ponta-a-ponta no WhatsApp.
- **Dashboard Web:** Painel para gerenciamento de conta, planos e visualização de progresso.

---

## 📁 Estrutura do Projeto

```bash
NoisDois AI 2.0/
├── src/                      # Backend (Python/FastAPI)
│   ├── main.py              # API Gateway & Webhooks
│   ├── services.py          # Lógica de IA e Integrações
│   ├── memory.py            # Gestão de Contexto
│   └── ...
├── frontend/                 # Frontend (React/Vite)
│   ├── src/                 # Componentes e Páginas
│   │   ├── components/      # SVGs Animados e UI Kits
│   │   ├── pages/           # Landing, Login, Dashboard
│   │   └── ...
│   └── ...
├── .agent/                   # Documentação do Agente AI
└── ...
```

---

## ⚡ Quick Start (Rodando Localmente)

### Pré-requisitos
- Python 3.10+
- Node.js 18+
- Instância Evolution API configurada
- Chave de API do Google Gemini

### 1. Backend (API)

```bash
# Clone e entre na pasta
git clone https://github.com/cesar6449921/relationship-brain.git
cd "NoisDois AI 2.0"

# Instale dependências
pip install -r src/requirements.txt

# Configure .env (copie do examplo)
cp .env.example .env

# Rode o servidor
python -m uvicorn src.main:app --reload
# Backend rodando em: http://127.0.0.1:8000
```

### 2. Frontend (Site)

```bash
# Em outro terminal, entre na pasta frontend
cd frontend

# Instale dependências
npm install

# Rode o servidor de dev
npm run dev
# Frontend rodando em: http://localhost:5173
```

---

## 🔐 Privacidade e Segurança

Levamos a segurança a sério.
- **LGPD/GDPR:** Todo usuário deve dar consentimento explícito antes de usar.
- **Isolamento:** Cada casal tem um ID único e isolado.
- **Dados:** Não vendemos dados para terceiros. O histórico é usado apenas para a memória da IA do próprio casal.

---

## 📄 Licença

Proprietário e Privado. Todos os direitos reservados à NósAi Tecnologia.
Desenvolvido com ❤️ e **Google Gemini**.

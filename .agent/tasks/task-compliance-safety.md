---
slug: compliance-safety
title: Implementar Compliance e Segurança (Meta Health Policy + LGPD)
status: in-progress
assignee: backend-specialist
priority: critical
---

# 🚨 Compliance e Segurança - Checklist

## Objetivo
Adequar o projeto às políticas da Meta (WhatsApp) e LGPD, removendo riscos legais e de banimento.

## Tarefas

### 1. Refatoração Semântica (Fim da "Terapia")
- [ ] Substituir "Terapia/Terapeuta" por "Mediação/Mediador/Coach"
- [ ] Substituir "Paciente" por "Usuário/Casal"
- [ ] Substituir "Tratamento" por "Jornada/Sessão"
- [ ] Atualizar System Prompt do Gemini com disclaimer
- [ ] Arquivos afetados: `src/services.py`, `src/main.py`, `README.md`, `frontend/`

### 2. Onboarding de Consentimento (LGPD)
- [ ] Criar tabela `user_consent` no banco
- [ ] Implementar fluxo de opt-in antes da primeira interação
- [ ] Mensagem de disclaimer obrigatória
- [ ] Só processar após "SIM" do usuário

### 3. Guardrails de Segurança (Red Flags)
- [ ] Criar módulo `src/safety.py` com filtro de palavras perigosas
- [ ] Detectar: violência, suicídio, ameaças
- [ ] Retornar mensagem estática de emergência (180/190)
- [ ] NÃO armazenar conteúdo sensível em logs

### 4. Human Delay (Anti-Ban)
- [ ] Implementar delay variável baseado no tamanho da resposta
- [ ] Quebrar respostas longas em múltiplos balões
- [ ] Simular "digitando..." antes de enviar

### 5. Preparação para API Oficial (Futuro)
- [ ] Criar classe abstrata `MessageSender` para desacoplar Evolution API
- [ ] Documentar migração futura para WhatsApp Cloud API

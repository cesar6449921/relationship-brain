---
slug: privacy-terms
title: Implementar Páginas de Privacidade e Termos de Uso
status: todo
assignee: frontend-specialist
priority: medium
---

# 📜 Implementação de Páginas Legais

## Objetivo
Criar as páginas de "Política de Privacidade" e "Termos de Uso" para o projeto **NósAi**, garantindo conformidade legal básica e transparência com o usuário.

## Escopo
1.  **Página de Privacidade (`/privacy`)**:
    *   Coleta de dados (Telefone, Nome, Mensagens).
    *   Uso de IA (Gemini).
    *   Armazenamento e segurança.
2.  **Página de Termos de Uso (`/terms`)**:
    *   O serviço é um "assistente", não substitui terapia profissional.
    *   Regras de conduta.
    *   Isenção de responsabilidade.
3.  **Rotas e Navegação**:
    *   Adicionar rotas no `App.jsx`.
    *   Adicionar links no Footer da Landing Page e Dashboard.

## Design
*   Estilo limpo, focado em leitura (tipografia clara).
*   Cabeçalho minimalista.
*   Voltar para Home/Dashboard.

## Plano de Execução
1.  [ ] Criar componente `frontend/src/pages/Privacy.jsx`.
2.  [ ] Criar componente `frontend/src/pages/Terms.jsx`.
3.  [ ] Atualizar `frontend/src/App.jsx` com as novas rotas.
4.  [ ] Adicionar Links no Footer da `Landing.jsx`.

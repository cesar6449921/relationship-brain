# 🧪 Teste da Mediação Ativa

## ✅ Implementado

### 1. Detecção Automática de Conflito
A IA agora analisa cada mensagem e atribui um "nível de conflito" (0-10) baseado em:

**Palavras-gatilho (+2 pontos cada):**
- "nunca", "sempre", "você só", "de novo", "toda vez"
- "não me escuta", "não liga", "não se importa"
- "culpa", "errado", "problema seu"

**Emojis negativos (+3 pontos cada):**
- 😡, 😤, 🙄, 😠, 💢, 😒

**Outros indicadores:**
- Caps Lock excessivo (+2 pontos)
- Múltiplos pontos de exclamação (+1 ponto)

**Threshold:** Conflito >= 4 pontos → IA intervém

### 2. Cooldown System
- **Tempo mínimo entre mediações:** 5 minutos
- Evita que a IA fique "enchendo o saco" a cada mensagem
- Contador de mediações salvo no banco de dados

### 3. Comando Manual
Qualquer parceiro pode acionar a mediação manualmente:
- `/sos`
- `/mediar`
- `/ajuda`

**Bypass:** Comandos manuais ignoram o cooldown e sempre ativam a mediação.

### 4. Prompt Especializado
Quando a mediação é ativada, a IA recebe um prompt diferente que:
- Identifica o gatilho emocional
- Traduz o que cada pessoa quis dizer
- Sugere um exercício prático de 5 minutos
- Usa menções (@Nome) para personalizar

---

## 🧪 Como Testar

### Teste 1: Detecção Automática
1. Crie um grupo de casal no Dashboard
2. Envie uma mensagem com palavras-gatilho:
   ```
   Você NUNCA me escuta quando eu falo! 😡
   ```
3. **Resultado esperado:** A IA deve intervir automaticamente com uma mensagem de mediação

### Teste 2: Cooldown
1. Após a primeira mediação, envie outra mensagem conflituosa imediatamente
2. **Resultado esperado:** A IA NÃO deve intervir (cooldown de 5 min ativo)
3. Aguarde 5 minutos e envie outra mensagem conflituosa
4. **Resultado esperado:** A IA deve intervir novamente

### Teste 3: Comando Manual
1. Em qualquer momento, envie:
   ```
   /sos
   ```
2. **Resultado esperado:** A IA intervém IMEDIATAMENTE, mesmo que o cooldown esteja ativo

### Teste 4: Menções
1. Após a mediação, verifique se a IA usou `@SeuNome` e `@NomeDoParceiro` na resposta
2. **Resultado esperado:** As menções devem aparecer como links azuis clicáveis no WhatsApp

---

## 📊 Monitoramento

### Logs do Backend
Procure por estas linhas no console do backend:
```
conflict_analysis level=7 manual=False
mediation_triggered reason=auto
```

### Banco de Dados
Verifique a tabela `couple`:
```sql
SELECT id, mediation_count, last_mediation_at FROM couple;
```

**Campos adicionados:**
- `last_mediation_at`: Timestamp da última mediação
- `mediation_count`: Contador total de mediações

---

## 🚀 Próximos Passos (Melhorias Futuras)

1. **Histórico de Mensagens:**
   - Atualmente, a IA só vê a última mensagem
   - Ideal: Guardar últimas 10 mensagens do grupo para contexto completo

2. **Análise de Sentimento Avançada:**
   - Integrar com biblioteca NLP (spaCy, TextBlob)
   - Detectar sarcasmo e ironia

3. **Personalização:**
   - Permitir que o casal configure suas próprias palavras-gatilho
   - Ajustar sensibilidade da detecção (0-10)

4. **Métricas no Dashboard:**
   - Mostrar gráfico de mediações ao longo do tempo
   - "Dias sem conflito" badge

5. **Exercícios Pós-Mediação:**
   - Enviar exercícios de conexão após cada mediação
   - Acompanhamento: "Como vocês estão se sentindo agora?"

---

## 🐛 Troubleshooting

### A IA não está intervindo
1. Verifique se o grupo está cadastrado no banco (`group_jid` correto)
2. Confirme que a mensagem tem palavras-gatilho ou emojis negativos
3. Veja os logs: `conflict_analysis level=X`
4. Se `level < 4`, a IA não vai intervir (aumente a sensibilidade)

### A IA intervém demais
1. Aumente o `MEDIATION_COOLDOWN_MINUTES` em `src/mediation.py` (padrão: 5 min)
2. Aumente o threshold de conflito (padrão: 4 pontos)

### Menções não funcionam
1. Verifique se os nomes estão corretos no banco de dados
2. Confirme que o formato do número está correto (5511999999999)
3. Veja a função `process_mention` em `main.py` (linha ~498)

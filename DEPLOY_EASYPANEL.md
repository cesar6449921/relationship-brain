# Deploy de Relationship-Brain no EasyPanel

Este tutorial ensina como fazer o deploy do **Backend** e do **Frontend** no seu servidor EasyPanel.

## 1. Pré-requisitos
- Repositório Git configurado (Github ou similar).
- Acesso ao painel do EasyPanel (http://35.247.254.108:3000).

## 2. Configurar o Repositório
Certifique-se de que todo o código está commitado:

```bash
git add .
git commit -m "Preparando para deploy"
git push
```

## 3. Deploy do Backend (API)

1. No EasyPanel, crie um novo **App (Service)**.
2. Escolha **Github** como fonte.
3. Conecte seu repositório.
4. **Build Settings**:
   - **Root Directory**: `src` (Importante! O Dockerfile está dentro da pasta src).
   - **Dockerfile Path**: `Dockerfile.prod` (ou apenas deixe automático se renomear). *Recomendado renomear para `Dockerfile` antes de subir se der erro.*
5. **Environment Variables**:
   Copie as variáveis do seu `.env` local, **EXCETO** a `MOCK_WHATSAPP`.
   ```env
   EVOLUTION_URL=http://evolution-api:8080   <-- Use o endereço interno do Docker aqui!
   EVOLUTION_API_KEY=sua_chave_real
   INSTANCE_NAME=test-bot-2
   GOOGLE_API_KEY=sua_chave_gemini
   SECRET_KEY=sua_chave_secreta
   MOCK_WHATSAPP=false  <-- Para funcionar de verdade
   ```
   *Nota: Como backend e evolution estão no mesmo EasyPanel, você pode tentar usar o nome do serviço interno (ex: `http://evolution-api:8080`) ou a URL pública (https).*

6. Salve e clique em **Deploy**.

## 4. Deploy do Frontend (React)

1. Crie outro **App (Service)** no EasyPanel.
2. Fonte: **Github** (mesmo repositório).
3. **Build Settings**:
   - **Root Directory**: `frontend`.
   - **Build Command**: `npm run build`.
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port 3000` (Ou use uma imagem Nginx para servir estático).
   
   *Melhor opção:* Use um Dockerfile para o Frontend também. (Vou criar um `frontend/Dockerfile` agora).

4. **Environment Variables**:
   ```env
   VITE_API_URL=https://seu-backend-url.easypanel.host  <-- URL pública do seu backend
   ```

## 5. Testar
Acesse a URL do Frontend e faça o cadastro. Agora a conexão será via internet real e deve funcionar!

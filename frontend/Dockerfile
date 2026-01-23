# Estágio de Build
FROM node:18-alpine as build

WORKDIR /app

# Copia arquivos de dependência
COPY package.json package-lock.json* ./

# Instala dependências
RUN npm install

# Copia o código fonte
COPY . .

# Argumentos de build (para injetar variáveis de ambiente no tempo de build se necessário)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Executa o build
RUN npm run build

# Estágio de Produção
FROM nginx:alpine

# Copia os arquivos buildados para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração customizada do Nginx para suportar React Router (SPA)
# Cria um arquivo de configuração inline simples
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

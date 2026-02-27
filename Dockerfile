# Stage 1: Build
FROM node:25-alpine AS builder

# Diretório de trabalho padrão do Node.js
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:25-alpine AS production

WORKDIR /usr/src/app

# Copia package.json e instala somente pacotes de produção
COPY package*.json ./
RUN npm install --only=production

# Copia os arquivos gerados (dist) do passo anterior
COPY --from=builder /usr/src/app/dist ./dist

# Variáveis default
ENV PORT=8787
ENV EVOLUTION_API_URL=http://localhost:8080
ENV EVOLUTION_API_KEY=

EXPOSE 8787

CMD ["npm", "start"]

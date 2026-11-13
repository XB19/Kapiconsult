# ── Étape 1 : construction du site React
FROM node:20-alpine AS front
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Étape 2 : API Node + site compilé
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=front /app/frontend/dist /app/frontend/dist
RUN mkdir -p uploads/media && chown -R node:node /app
USER node
EXPOSE 4100
# Crée le schéma (et le contenu initial si la base est vide), puis démarre le serveur
CMD ["sh", "-c", "node src/db/setup.js && node src/server.js"]

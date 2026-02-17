# ---- Build client ----
FROM node:20 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client .
RUN npm run build

# ---- Build server ----
FROM node:20
WORKDIR /app

COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci

COPY server .

# Copy built frontend into server
COPY --from=client-build /app/client/dist ./public

EXPOSE 3000
CMD ["node", "server.js"]

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all deps (including dev deps for build)
RUN npm ci --frozen-lockfile

# Copy source
COPY . .

# Build frontend (Vite) + server (tsc)
RUN npm run build

# ── Stage 2: Production ────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install all deps (tsx needed at runtime)
COPY package*.json ./
RUN npm ci --frozen-lockfile && npm cache clean --force

# Copy built artifacts
COPY --from=builder /app/dist ./dist
# Copy server source (tsx runs it directly)
COPY server.ts .

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "--import", "tsx/esm", "server.ts"]

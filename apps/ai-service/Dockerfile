# ============================================================
# RNDR – AI Service Dockerfile
# Multi-stage build for a lean production image
# ============================================================

# ---- Stage 1: Build ----------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace manifests (needed so the workspace protocol resolves)
COPY package.json turbo.json ./
COPY packages/types/package.json ./packages/types/package.json
COPY apps/ai-service/package.json ./apps/ai-service/package.json

# Install all workspace deps
RUN npm install --workspaces --include-workspace-root

# Copy source
COPY packages/types ./packages/types
COPY apps/ai-service ./apps/ai-service

# Build TypeScript
WORKDIR /app/apps/ai-service
RUN npm run build

# ---- Stage 2: Production -----------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy workspace manifests & install PRODUCTION deps only
COPY package.json turbo.json ./
COPY packages/types/package.json ./packages/types/package.json
COPY apps/ai-service/package.json ./apps/ai-service/package.json
RUN npm install --workspaces --include-workspace-root --omit=dev

# Copy compiled output
COPY --from=builder /app/apps/ai-service/dist ./apps/ai-service/dist
COPY --from=builder /app/packages/types/src ./packages/types/src

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "apps/ai-service/dist/index.js"]

# ============================================================
# RNDR – AI Service Dockerfile
# Multi-stage build for a lean production image
# ============================================================

# ---- Stage 1: Build ----------------------------------------
FROM node:20-alpine AS builder

# Enable pnpm via corepack (ships with Node.js ≥ 16.9)
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

# Copy workspace manifest and lock file first to leverage layer cache
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json turbo.json ./
COPY packages/types/package.json ./packages/types/package.json
COPY apps/ai-service/package.json ./apps/ai-service/package.json

# Install all workspace deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/types ./packages/types
COPY apps/ai-service ./apps/ai-service

# Build TypeScript
WORKDIR /app/apps/ai-service
RUN pnpm run build

# ---- Stage 2: Production -----------------------------------
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

ENV NODE_ENV=production

# Copy workspace manifests & lock file, then install production deps only
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json turbo.json ./
COPY packages/types/package.json ./packages/types/package.json
COPY apps/ai-service/package.json ./apps/ai-service/package.json
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output
COPY --from=builder /app/apps/ai-service/dist ./apps/ai-service/dist
COPY --from=builder /app/packages/types/src ./packages/types/src

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "apps/ai-service/dist/index.js"]

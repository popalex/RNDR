# ============================================================
# RNDR – Web (Next.js) Dockerfile
# ============================================================

FROM node:20-alpine AS builder

# Enable pnpm via corepack (ships with Node.js ≥ 16.9)
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

# Copy workspace manifest and lock file first to leverage layer cache
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY package.json turbo.json ./
COPY packages/types/package.json ./packages/types/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --frozen-lockfile

COPY packages/types ./packages/types
COPY apps/web ./apps/web
COPY convex ./convex

# Build Next.js (standalone output)
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# ---- Production ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]

# RNDR – AI Image Studio

> A full-stack, production-ready AI image generation platform built with **Next.js**, **Convex**, and **Vercel AI SDK** (fal.ai).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  Next.js 15 (App Router)  ·  React 19  ·  Tailwind CSS     │
│  • /studio  – prompt UI, model selector, live preview       │
│  • /gallery – masonry grid of past generations              │
│  • /settings – user preferences                             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP (fetch)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          Next.js API Route  /api/generate                   │
│  • Keeps AI_SERVICE_SECRET out of the browser bundle        │
│  • Forwards request to the AI service                       │
└────────────────────┬────────────────────────────────────────┘
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
┌──────────────────┐   ┌────────────────────────────────────┐
│  Convex Backend  │   │  AI Service  (Docker)              │
│  (real-time DB)  │   │  Hono + Vercel AI SDK              │
│                  │   │  ┌──────────────────────────────┐  │
│  • generations   │   │  │  Provider Registry           │  │
│  • users         │   │  │  ┌──────────┐ ┌───────────┐  │  │
│                  │   │  │  │  fal.ai  │ │ (future)  │  │  │
│  Subscriptions   │   │  │  └──────────┘ └───────────┘  │  │
│  push updates to │   │  └──────────────────────────────┘  │
│  all connected   │   └────────────────────────────────────┘
│  clients         │
└──────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Monorepo (Turborepo)** | Shared types, co-located tooling, single `pnpm install` |
| **Clerk** | Production-ready auth with social logins, MFA, user management UI out of the box |
| **Convex** | Real-time subscriptions, no REST boilerplate, built-in Clerk JWT verification |
| **Separate AI service (Docker)** | Isolate heavy AI deps; swap/add providers without touching the web app |
| **Provider abstraction** | Adding a new model provider = one new file + one import |
| **Vercel AI SDK** | Unified API across providers, built-in streaming support |
| **Next.js API proxy** | Keeps `AI_SERVICE_SECRET` and `FAL_KEY` server-side only |

---

## Project Structure

```
rndr/
├── apps/
│   ├── web/                      # Next.js 15 frontend
│   │   ├── app/
│   │   │   ├── (auth)/           # Sign-in / sign-up routes
│   │   │   ├── (dashboard)/      # Authenticated shell
│   │   │   │   ├── studio/       # Image generation studio
│   │   │   │   ├── gallery/      # Past generations
│   │   │   │   └── settings/     # User preferences
│   │   │   └── api/generate/     # Proxy → AI service
│   │   ├── components/
│   │   │   ├── layout/           # Sidebar, Convex provider
│   │   │   ├── studio/           # PromptForm, ModelSelector, ImageGrid
│   │   │   └── gallery/          # GalleryGrid
│   │   ├── lib/                  # utils, model catalogue
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── ai-service/               # Docker-based AI microservice
│       ├── src/
│       │   ├── app.ts            # Hono app (routes + middleware)
│       │   ├── index.ts          # HTTP server entrypoint
│       │   ├── middleware/
│       │   │   └── secret.ts     # Shared-secret auth
│       │   ├── providers/
│       │   │   ├── types.ts      # Provider interface
│       │   │   ├── fal.ts        # fal.ai implementation
│       │   │   ├── registry.ts   # Central provider registry
│       │   │   └── index.ts      # Re-exports
│       │   └── routes/
│       │       ├── generate.ts   # POST /generate
│       │       └── models.ts     # GET  /models
│       ├── Dockerfile
│       └── package.json
│
├── convex/                       # Convex backend (serverless functions)
│   ├── schema.ts                 # Database schema
│   ├── generations.ts            # Generation CRUD + queries
│   └── users.ts                  # User profile upsert
│
├── packages/
│   └── types/                    # Shared TypeScript types
│       └── src/index.ts
│
├── docker-compose.yml            # Local dev with Docker
├── turbo.json                    # Turborepo pipeline
├── .env.example                  # Environment variable template
└── package.json                  # Workspace root
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm 9 (LTS) — install via `corepack enable` or `npm i -g pnpm@9`
- [Convex account](https://dashboard.convex.dev)
- [Clerk account](https://clerk.com) — create an application and grab the API keys
- [fal.ai API key](https://fal.ai/dashboard/keys)
- Docker (optional – only needed to run the AI service in a container)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
# Fill in:
#   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
#   CLERK_SECRET_KEY
#   NEXT_PUBLIC_CONVEX_URL  (get this after step 3)
#   FAL_KEY
#   AI_SERVICE_SECRET
```

### 3. Set up Convex + Clerk JWT

```bash
pnpm convex:dev   # creates the project, generates types, starts the dev server
```

In a second terminal, set the Clerk JWT issuer so Convex can verify tokens:

```bash
# Replace with your actual Clerk Frontend API URL (found in Clerk dashboard)
pnpm dlx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-subdomain>.clerk.accounts.dev
```

> **Clerk JWT Template** – in the Clerk dashboard go to  
> *Configure → JWT Templates → New template → Convex* and save it.  
> This makes Clerk embed the subject claim Convex expects.

### 4. Run the AI service

**Option A – Node.js (fastest for dev)**

```bash
cd apps/ai-service
FAL_KEY=<your-key> pnpm dev
```

**Option B – Docker**

```bash
docker compose up ai-service
```

### 5. Run the web app

```bash
cd apps/web
pnpm dev             # http://localhost:3000
```

Or from the workspace root:

```bash
pnpm dev             # starts all apps via Turborepo
```

---

## Adding a New AI Provider

1. Create `apps/ai-service/src/providers/<name>.ts`  
   Implement the `Provider` interface from `./types`.

2. Register it in `apps/ai-service/src/providers/registry.ts`:
   ```ts
   import { MyNewProvider } from "./<name>";
   const providers: Provider[] = [new FalProvider(), new MyNewProvider()];
   ```

3. Add `"<name>"` to the `ImageProvider` union in `packages/types/src/index.ts`.

4. Add model entries to `apps/web/lib/models.ts`.

That's it – no other files need to change.

---

## Deployment

| Service | Recommended platform |
|---|---|
| **Web app** | Vercel (zero-config Next.js) |
| **Convex backend** | Convex Cloud (`npx convex deploy`) |
| **AI service** | Any Docker host: Railway, Fly.io, Cloud Run, ECS |

---

## Roadmap

- [x] Clerk authentication integration
- [ ] Image-to-image / inpainting
- [ ] Streaming generation progress via SSE
- [ ] OpenAI DALL-E 3 provider
- [ ] Stability AI provider
- [ ] Prompt library / favourites
- [ ] Team workspaces

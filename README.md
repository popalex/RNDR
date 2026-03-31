# RNDR – AI Image Studio

> A full-stack, production-ready AI image generation platform built with **Next.js**, **Convex**, and **Vercel AI SDK** (fal.ai).

---

## Architecture Overview

RNDR supports **two interchangeable generation back-ends**. Pick the one that fits your deployment:

### Option A — Convex Action *(default: `NEXT_PUBLIC_GENERATION_BACKEND=convex`)*

The browser calls a Convex Action directly. No Docker container, no extra service to host.

```
Browser (React)
    │  useAction(api.generate.generateImages)
    ▼
Convex Action  (convex/generate.ts)
    │  • FAL_KEY stored in Convex env vars — never in browser
    │  • Manages generation row lifecycle automatically
    │  • callFal() → fetch https://fal.run/{model}
    ▼
fal.ai API  →  images returned  →  persisted in Convex DB  →  back to Browser
```

### Option B — Docker ai-service *(`NEXT_PUBLIC_GENERATION_BACKEND=ai-service`)*

A standalone Hono microservice wraps the Vercel AI SDK. Useful when you need
Node.js-specific provider SDKs, custom scaling, or want to decouple the AI
layer from Convex entirely.

```
Browser (React)
    │  fetch POST /api/generate
    ▼
Next.js API Route  (apps/web/app/api/generate/route.ts)
    │  • Adds x-service-secret header
    │  • Forwards to ai-service
    ▼
ai-service Docker  (apps/ai-service)
    │  Hono + Vercel AI SDK
    │  Provider Registry → FalProvider → fal.ai API
    ▼
images returned  →  Next.js route  →  Browser
(Browser then calls markCompleted / markFailed manually)
```

### Comparison

| | **Convex Action** (A) | **Docker ai-service** (B) |
|---|---|---|
| Infrastructure | Zero — serverless | Must host a Docker container |
| `FAL_KEY` location | Convex env vars | Docker / host env |
| Extra auth secret | Not needed | `AI_SERVICE_SECRET` required |
| DB lifecycle | Automatic inside action | Manual mutations in browser |
| Timeout | 10 min (Node.js runtime) | Unlimited (your container) |
| Adding providers | Extend `convex/generate.ts` | New file in `providers/` + registry |
| Best for | Most projects | Custom scaling / non-fal providers |

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Monorepo (Turborepo)** | Shared types, co-located tooling, single `pnpm install` |
| **Clerk** | Production-ready auth with social logins, MFA, user management UI out of the box |
| **Convex** | Real-time subscriptions, no REST boilerplate, built-in Clerk JWT verification |
| **Convex Action for generation** | Serverless, zero-ops, FAL_KEY never leaves Convex |
| **Docker ai-service (optional)** | Isolate heavy AI deps; use when you need Node.js-specific SDKs or custom scaling |
| **Provider abstraction** | Adding a new model provider = one new file + one import (either back-end) |
| **Vercel AI SDK** | Unified API across providers, built-in streaming support |

---

## The ai-service — explained

`apps/ai-service` is a standalone HTTP microservice (TypeScript + [Hono](https://hono.dev/))
packaged as a Docker image. It is **Option B** — the ai-service is not required
when using the Convex Action path.

### File structure

```
apps/ai-service/src/
├── index.ts          ← HTTP server entrypoint (port 3001)
├── app.ts            ← Hono app: logger + secret middleware + routes
├── middleware/
│   └── secret.ts     ← Shared-secret auth guard (x-service-secret header)
├── providers/
│   ├── types.ts      ← Provider interface contract
│   ├── fal.ts        ← fal.ai implementation via Vercel AI SDK
│   ├── registry.ts   ← Central Map<ImageProvider, Provider>
│   └── index.ts      ← Re-exports
└── routes/
    ├── generate.ts   ← POST /generate  — validate → provider.generate() → JSON
    └── models.ts     ← GET  /models   — list registered providers
```

### Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Health check used by Docker / load balancer |
| `POST` | `/generate` | `x-service-secret` | Generate images; body is `GenerationRequest` |
| `GET` | `/models` | `x-service-secret` | List registered providers |

### How the middleware works

`middleware/secret.ts` reads `AI_SERVICE_SECRET` at startup. On every guarded
request it checks the `x-service-secret` header. If the env var is unset, the
guard is skipped (handy for local dev). This keeps the service private — only
the Next.js server (which knows the secret) can call it.

### How the provider registry works

`providers/registry.ts` holds a `Map<ImageProvider, Provider>`. At startup it
is built from an array of provider instances (`[new FalProvider()]`). To add a
new AI provider:

1. Create `apps/ai-service/src/providers/<name>.ts` implementing `Provider`.
2. Add an instance to the `providers` array in `registry.ts`.
3. Add the provider name to `ImageProvider` in `packages/types/src/index.ts`.
4. Add model entries to `apps/web/lib/models.ts`.

### Convex Action — explained

`convex/generate.ts` is the serverless equivalent. It:

1. Receives generation args from the browser via `useAction()`.
2. Inserts a `generations` row (`status: "pending"`) — userId comes from the
   verified Clerk JWT, never from client input.
3. Flips the row to `"processing"`.
4. POSTs to `https://fal.run/{model}` with `Authorization: Key {FAL_KEY}`.
   `FAL_KEY` is read from `process.env` which Convex maps to its own secure
   environment variable store.
5. On success: patches the row to `"completed"` with the returned images and
   returns `{ generationId, images, durationMs }` to the browser.
6. On failure: patches the row to `"failed"` with the error message and
   re-throws so the browser can display a toast.

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
│   ├── generate.ts               # Convex Action – calls fal.ai (Option A)
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
```

> `FAL_KEY` should **not** go in `.env.local` when using the Convex Action path.
> Set it directly in Convex (see step 4) so it stays server-side.

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

### 4. Set fal.ai key in Convex

```bash
pnpm dlx convex env set FAL_KEY your_fal_api_key_here
```

This stores the key securely in Convex — it is never sent to the browser or
bundled with the Next.js app.

### 5. Run the web app

```bash
cd apps/web
pnpm dev             # http://localhost:3000
```

Or from the workspace root:

```bash
pnpm dev             # starts all apps via Turborepo
```

That's it — no Docker container required for generation.

### (Optional) Run the Docker ai-service instead

To use Option B, set `NEXT_PUBLIC_GENERATION_BACKEND=ai-service` in
`.env.local` (see [Switching Backends](#switching-backends) below) and start
the container:

```bash
docker compose up ai-service
```

Make sure `AI_SERVICE_URL`, `AI_SERVICE_SECRET`, and `FAL_KEY` are also set in
`.env.local` (they are only read by the container and the Next.js proxy route).

---

## Switching Backends

The generation backend is controlled by a **single environment variable** in
your `.env.local`:

```
NEXT_PUBLIC_GENERATION_BACKEND=convex       # default
NEXT_PUBLIC_GENERATION_BACKEND=ai-service   # Docker container
```

No code changes are needed. Restart the Next.js dev server after changing the
value (Next.js bakes `NEXT_PUBLIC_*` variables into the bundle at startup).

### Option A — `convex` (default)

```
# .env.local
NEXT_PUBLIC_GENERATION_BACKEND=convex
NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
# FAL_KEY → set in Convex, NOT here:
#   pnpm dlx convex env set FAL_KEY <your-key>
```

Everything else is handled by the Convex Action (`convex/generate.ts`).  
No Docker container, no `AI_SERVICE_SECRET`.

### Option B — `ai-service`

```
# .env.local
NEXT_PUBLIC_GENERATION_BACKEND=ai-service
AI_SERVICE_URL=http://localhost:3001
AI_SERVICE_SECRET=change_me_in_production
FAL_KEY=your_fal_api_key_here   # read by docker-compose
```

Then start the container:

```bash
docker compose up ai-service
```

### Full comparison

| | `convex` (A) | `ai-service` (B) |
|---|---|---|
| **Start command** | `pnpm convex:dev` | `docker compose up ai-service` |
| **`FAL_KEY` location** | `convex env set` | `.env.local` / Docker env |
| **`AI_SERVICE_SECRET`** | Not needed | Required |
| **Infrastructure** | Zero — serverless | Docker container |
| **DB lifecycle** | Managed inside action | Manual mutations in browser |
| **Timeout** | ~10 min (Convex Node.js runtime) | Unlimited |
| **Best for** | Most projects | Custom scaling / non-fal providers |

---

## Adding a New AI Provider

### Via Convex Action (Option A)

1. Add the provider name to `ImageProvider` in `packages/types/src/index.ts`.
2. Add the call logic to `convex/generate.ts` (add a new `if (args.provider === "<name>")` branch or a helper function).
3. Add model entries to `apps/web/lib/models.ts`.

### Via Docker ai-service (Option B)

1. Create `apps/ai-service/src/providers/<name>.ts`  
   Implement the `Provider` interface from `./types`.

2. Register it in `apps/ai-service/src/providers/registry.ts`:
   ```ts
   import { MyNewProvider } from "./<name>";
   const providers: Provider[] = [new FalProvider(), new MyNewProvider()];
   ```

3. Add `"<name>"` to the `ImageProvider` union in `packages/types/src/index.ts`.

4. Add model entries to `apps/web/lib/models.ts`.

No other files need to change in either case.

---

## Deployment

| Service | Recommended platform |
|---|---|
| **Web app** | Vercel (zero-config Next.js) |
| **Convex backend + Action** | Convex Cloud (`pnpm convex:deploy`) |
| **AI service** *(Option B only)* | Any Docker host: Railway, Fly.io, Cloud Run, ECS |

---

## Roadmap

- [x] Clerk authentication integration
- [ ] Image-to-image / inpainting
- [ ] Streaming generation progress via SSE
- [ ] OpenAI DALL-E 3 provider
- [ ] Stability AI provider
- [ ] Prompt library / favourites
- [ ] Team workspaces

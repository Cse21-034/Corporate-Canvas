# Constructatech Ventures Web Platform

A full-stack web platform for **Constructatech Ventures**, a Botswana-based IT infrastructure, networking, and automation company.

## What's in this project

| Piece | Purpose |
|---|---|
| `artifacts/constructatech` | React + Vite frontend — public marketing site, client portal, staff admin |
| `artifacts/api-server` | Express 5 API server (TypeScript, built with esbuild) |
| `artifacts/mockup-sandbox` | Design canvas / component preview server |
| `lib/db` | Drizzle ORM schema + PostgreSQL client (shared) |
| `lib/api-spec` | OpenAPI spec + Orval codegen config |
| `lib/api-client-react` | Generated React Query hooks for the API |
| `lib/api-zod` | Generated Zod validators for the API |

## Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, Radix UI, Framer Motion, Wouter (routing), React Query
- **Backend:** Express 5, TypeScript, Pino (structured logging), cookie-parser sessions
- **Database:** PostgreSQL via Drizzle ORM (Replit managed)
- **Package manager:** pnpm (monorepo with `pnpm-workspace.yaml`)

## How to run

All workflows are pre-configured. On startup:

1. **Frontend** (`artifacts/constructatech: web`) — `pnpm --filter @workspace/constructatech run dev`
2. **API Server** (`artifacts/api-server: API Server`) — `pnpm --filter @workspace/api-server run dev` (builds with esbuild then starts)

The API server auto-builds on every `dev` start. For a standalone build:
```
pnpm --filter @workspace/api-server run build
```

## Database

The project uses Replit's managed PostgreSQL. `DATABASE_URL` is injected automatically at runtime — no manual setup needed.

To push schema changes:
```
pnpm --filter @workspace/db run push
```

To seed the database (safe to re-run — uses upserts):
```
pnpm --filter @workspace/db run seed
```

**Seed creates:**
- 4 services (IT Infrastructure, Networking, IT Supplies, Automation)
- 8 industries (Mining, Manufacturing, Healthcare, Education, Retail, Financial Services, Telecoms, Government)
- Demo staff admin → `admin@constructech.co.bw` / `Admin1234!`
- Demo portal customer → `portal@bmcorp.co.bw` / `Demo1234!` (with a project, ticket, and invoice)

## Environment variables / secrets

| Key | Where | Notes |
|---|---|---|
| `DATABASE_URL` | Runtime-managed | Auto-injected by Replit |
| `SESSION_SECRET` | Secret | Used to sign session cookies |
| `NODE_ENV` | Optional | Defaults to `development` |
| `LOG_LEVEL` | Optional | Pino log level (default: `info`) |

## Deploying to Vercel (frontend) + Render (backend)

### Render — API server

1. Connect your GitHub repo to [render.com](https://render.com) and select **"Use render.yaml"** — it auto-creates the `constructatech-api` web service and a managed PostgreSQL database.
2. After the first deploy, go to the service's **Environment** tab and set:
   - `CORS_ORIGIN` → your Vercel frontend URL (e.g. `https://your-app.vercel.app`)
3. Note the service URL (e.g. `https://constructatech-api.onrender.com`) — you'll need it for Vercel.
4. Run the schema migration once: in the Render shell run `pnpm --filter @workspace/db run push`.

### Vercel — Frontend

1. Import the repo on [vercel.com](https://vercel.com). Vercel will auto-detect `vercel.json` at the root.
2. In **Environment Variables**, add:
   - `BASE_PATH` → `/`
   - `VITE_API_URL` → your Render service URL (e.g. `https://constructatech-api.onrender.com`)
3. Deploy. All client-side routes are rewritten to `index.html` by `vercel.json`.

### Config files
| File | Purpose |
|---|---|
| `vercel.json` | Build command, output dir, SPA rewrites |
| `render.yaml` | API service + managed Postgres definition |
| `artifacts/constructatech/.env.example` | Frontend env var reference |
| `artifacts/api-server/.env.example` | Backend env var reference |

## User preferences

_None recorded yet._

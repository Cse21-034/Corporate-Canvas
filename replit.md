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

## Environment variables / secrets

| Key | Where | Notes |
|---|---|---|
| `DATABASE_URL` | Runtime-managed | Auto-injected by Replit |
| `SESSION_SECRET` | Secret | Used to sign session cookies |
| `NODE_ENV` | Optional | Defaults to `development` |
| `LOG_LEVEL` | Optional | Pino log level (default: `info`) |

## User preferences

_None recorded yet._

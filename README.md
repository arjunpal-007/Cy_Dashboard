# SentinelX

Enterprise Threat Intelligence, SIEM and SOAR platform scaffold using Next.js 16 + FastAPI detection service.

## Stack

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS 4 + Radix + lucide-react + framer-motion
- React Query data layer
- Recharts visualization
- Zod + PapaParse API validation/parsing
- Supabase client and schema scaffolding
- FastAPI detection engine microservice

## Run web app

```bash
npm install
npm run dev
```

## Run detection engine

```bash
cd detection-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Environment

Copy `.env.example` to `.env.local` and set Supabase keys.

## Current implementation scope

- Phase 1 complete:
  - production folder architecture
  - SOC layout shell and dashboard
  - role-guarded proxy protection (RBAC foundation)
  - SIEM ingestion/parse endpoint scaffolding
  - detection analyze/score API scaffolding
  - FastAPI detection service endpoints (`/detect`, `/analyze`, `/score`)
  - websocket realtime channels (`/ws/threats`, `/ws/alerts`) with broadcast manager
  - push-based dashboard updates for threats, alerts, logs, chart, timeline, and geo markers
  - supabase-backed persistence from detection engine for logs/threats/alerts/incidents
  - SOAR action triggers (`block_ip`, `mark_threat`) emitted over realtime stream
  - Supabase schema SQL

- Phase 2 Additions (Recent Updates):
  - Refactored SOC dashboard modules (`KPICards`, `AlertsFeed`, `ThreatTrendChart`, `TopIPs`, `SystemHealth`).
  - Memoized frontend components and hooks (`useMemo`, `useCallback`) to fix Next.js hydration issues and improve re-render performance.
  - Implemented Threat Intelligence dashboard at `/intel` incorporating the new `GlobeThreatMap` geospatial visualization component.
  - Resolved `Next.js` route discrepancies and 404 errors on authorization and intel pages.
  - Streamlined theme provider context layer.
  - Backend/Frontend Concurrent script optimizations (e.g. resolve dev port conflicts).

- Next phases:
  - full Supabase auth session flow
  - realtime pipeline (Supabase Realtime or WebSocket stream)
  - event correlation engine
  - incident and alert persistence workflows
  - SOAR automation rule execution and action bus

## Realtime test flow

1. Run FastAPI service:
   - `cd detection-engine`
   - `pip install -r requirements.txt`
   - `uvicorn main:app --reload --port 8001`
2. Run web app:
   - `npm run dev`
3. Open dashboard in multiple browser tabs (simulated clients).
4. Trigger burst events:
   - `POST http://localhost:8001/simulate/burst`
5. Validate all tabs update at the same time (threat feed, log table, chart, map markers, timeline).
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the front end.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.


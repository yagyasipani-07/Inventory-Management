# Paras Plywoods — Inventory Management (MVP Phase 1)

Scaffolded Phase 1: Next.js + TypeScript + Tailwind + Prisma + Postgres.

Quick start (use Supabase remote DB — recommended)

1. Copy `.env.example` to `.env` and set the values. If you use Supabase, set `DATABASE_URL` to your Supabase Postgres connection string and fill `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

2. Install dependencies and run Prisma generator / migrations against your Supabase database:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Notes:
- This project is scaffolded to use a remote Postgres (Supabase). The included `docker-compose.yml` is optional — only use it if you want a local Postgres instead of Supabase.
- When using Supabase, prefer `prisma migrate deploy` (applies existing migration files) in CI/remote workflows. `prisma migrate dev` can be used locally if you need to create new migrations against a development database.

What I created:
- Prisma schema and basic models
- Next.js App Router skeleton (`src/app`)
- `src/lib/prisma.ts` helper and `src/lib/audit.ts` service hook
- `.env.example` with Supabase placeholders

Next steps I can run for you if you want:
- Run `npm install` and create/apply migrations here (requires DATABASE_URL to be set)
- Add Auth (Supabase Auth integration) and initial UI for Products/Challans — basic product CRUD and an `/products` page are scaffolded already.
- Implement CSV import preview UI

Reply if you want me to run the install and apply migrations now against your Supabase database, or to wire Supabase Auth (signup/signin) into the app next.

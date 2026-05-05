# Tesla Clone

Tesla-inspired clone app built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, and Framer Motion.

The UI and core product flows are complete through V0.5. V0.6 is moving the app from mock-only backend behavior into real PostgreSQL-backed persistence with Prisma while keeping the current frontend behavior and routes intact. This project still does not include authentication, payments, deployment, or real Tesla copyrighted images.

## Current Version

- V0.6

## Progress

V0:
- Homepage and responsive app shell.

V0.1:
- Multi-page frontend for vehicles, ordering, and demo drives.

V0.2:
- Shared services, constants, and reusable UI states/components.

V0.3:
- Motion system and polished cross-page UX.

V0.4:
- Deeper configurator flow, comparison experience, local persistence, and supporting pages.

V0.5:
- Mock API foundation, typed response contracts, and backend-ready validation/payload preparation.

V0.6:
- PostgreSQL + Prisma foundation
- Seeded vehicle data
- Vehicle database integration
- Real order persistence
- Real demo-drive persistence
- Core product flows now save real records
- Backend cleanup and readiness pass

## Local Setup

```bash
npm install
```

## Local Backend Setup

1. Copy `.env.example` to `.env`
2. Add your PostgreSQL `DATABASE_URL`
3. Run:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

4. Start the app:

```bash
npm run dev
```

Vehicles must be seeded for the catalog pages to show data. Order submissions and demo-drive requests are stored in the database once submitted.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run prisma:generate` - generate the Prisma client
- `npm run prisma:migrate` - create and apply a development migration
- `npm run prisma:seed` - seed the vehicle catalog

## Next Major Version

- V0.7: Auth + User Dashboard foundation

## Roadmap

- V0.7: Auth + User Dashboard
- V0.8: Payments + Admin
- V1: Production hardening, testing, deployment

## Disclaimer

This is a Tesla-inspired educational project and is not affiliated with Tesla.

## Development Notes

V0.6 completed the first real backend/data layer and prepared the app for account-based features next.

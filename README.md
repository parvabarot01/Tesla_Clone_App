# Tesla Clone

Tesla-inspired clone app built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, and Framer Motion.

The UI and core product flows are complete through V0.7, including a lightweight authenticated account area layered on top of the persisted order and demo-drive flows. This project still does not include payments, deployment, or real Tesla copyrighted images.

## Current Version

- V0.7

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

V0.7:
- Authentication foundation and session handling
- User ownership links for persisted records
- Protected dashboard shell
- Orders history for authenticated users
- Demo-drive history for authenticated users
- Final auth and dashboard cleanup

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
The current local sign-in flow does not require additional OAuth provider environment variables.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run prisma:generate` - generate the Prisma client
- `npm run prisma:migrate` - create and apply a development migration
- `npm run prisma:seed` - seed the vehicle catalog

## Next Major Version

- V0.8: Payments + Admin foundation

## Roadmap

- V0.8: Payments + Admin
- V1: Production hardening, testing, deployment

## Disclaimer

This is a Tesla-inspired educational project and is not affiliated with Tesla.

## Development Notes

V0.7 completes the first account-based layer on top of the real backend and persisted data foundation.

# Tesla Clone

Tesla-inspired clone app built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, and Framer Motion.

This project remains mock and frontend-focused for now. It does not include a real database, authentication, payments, or deployment. Real Tesla copyrighted images are not used.

## Current Version

- V0.5

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
- Mock API foundation
- Vehicle API integration through the service layer
- Order validation and payload preparation
- Demo-drive validation and submission preparation
- Final backend-prep cleanup

## API Foundation

- `GET /api/vehicles` returns the mock vehicle catalog in a consistent JSON response envelope.
- `GET /api/vehicles/[slug]` returns a single vehicle by slug or a typed error payload.
- `POST /api/orders` accepts a mock order payload, validates the selected build, and returns a confirmation response without persistence.
- `POST /api/demo-drive` accepts a mock demo-drive payload, validates the request, and returns a confirmation object without real scheduling.
- `vehicleService` remains the main vehicle data access boundary while helpers prepare typed order and demo-drive submissions.

## Key Structure

```text
app/
  api/
    demo-drive/
      route.ts
    orders/
      route.ts
    vehicles/
      route.ts
      [slug]/
        route.ts
  compare/
  demo-drive/
  energy/
  order/
  vehicles/

constants/
  api.ts
  demoDrive.ts
  orderOptions.ts

data/
  vehicles.ts

lib/
  api.ts
  demoDrive.ts
  fetcher.ts
  order.ts
  storage.ts

services/
  vehicleService.ts

types/
  index.ts
```

## Local Setup

```bash
npm install
npm run dev
```

Open locally at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint

## Next Major Milestone

- Level 7: Real Backend + Database

## Roadmap

- Level 7 / Next: PostgreSQL + Prisma + real API/data persistence
- Level 8: Auth + User Dashboard
- Level 9: Payments + Admin
- V1: Production hardening, testing, deployment

## Disclaimer

This is a Tesla-inspired educational project and is not affiliated with Tesla.

## Development Notes

V0.5 completed the transition from a frontend-only architecture into a backend-ready mock API structure for both the buying flow and the demo-drive flow.

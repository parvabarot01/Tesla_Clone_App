# Tesla Clone V0

Tesla-inspired frontend clone built with Next.js. This project is frontend-only for now and is designed to scale toward backend services, authentication, database storage, payments, testing, and production deployment later.

Real Tesla assets are not used. Image references are local placeholder paths under `public/images`.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Static local data for V0, V0.1, and V0.2

## Current Version

- Current version: V0.2
- Status: Frontend architecture complete and backend-ready
- Backend: Not implemented yet
- Deployment: Not implemented yet

## Features Completed

V0:
- Fixed Tesla-inspired navbar
- Homepage hero section
- Promo cards
- Feature grid
- Energy section
- Responsive layout

V0.1:
- Multi-page frontend routes
- Vehicle overview page
- Dynamic vehicle detail pages
- Mock order/configurator flow
- Mock demo drive form flow

V0.2:
- Vehicle service layer
- Shared loading states
- Shared error states
- Shared empty states
- Centralized site config
- Centralized route constants
- Centralized order options
- Centralized demo drive time slots
- Shared UI components:
  - SectionHeader
  - SpecGrid
  - CtaGroup

## Project Structure

```text
app/
  page.tsx
  layout.tsx
  globals.css
  vehicles/
    page.tsx
    loading.tsx
    error.tsx
    [slug]/
      page.tsx
      loading.tsx
      error.tsx
  order/
    [slug]/
      page.tsx
      loading.tsx
      error.tsx
  demo-drive/
    [slug]/
      page.tsx
      loading.tsx
      error.tsx
  energy/
    page.tsx
  charging/
    page.tsx
  discover/
    page.tsx
  shop/
    page.tsx

components/
  layout/
    Navbar.tsx
  home/
    HeroSection.tsx
    PromoCards.tsx
    FeatureGrid.tsx
    EnergySection.tsx
  vehicles/
    VehicleCard.tsx
    VehicleGrid.tsx
  order/
    OrderConfigurator.tsx
  demo-drive/
    DemoDriveForm.tsx
  shared/
    PageHero.tsx
    SectionHeader.tsx
    SpecGrid.tsx
    CtaGroup.tsx
    LoadingSection.tsx
    EmptyState.tsx
    ErrorState.tsx
  ui/
    button.tsx

config/
  site.ts

constants/
  routes.ts
  orderOptions.ts
  demoDrive.ts

data/
  home.ts
  vehicles.ts

services/
  vehicleService.ts

types/
  index.ts

lib/
  utils.ts
```

## Routes

- `/`
- `/vehicles`
- `/vehicles/[slug]`
- `/order/[slug]`
- `/demo-drive/[slug]`
- `/energy`
- `/charging`
- `/discover`
- `/shop`

## Local Setup

```bash
npm install
npm run dev
```

Open the app locally:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - start the local development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint

## Backend-Ready Architecture

The vehicle service currently reads from local static data in `data/vehicles.ts`. Pages call `vehicleService` asynchronously, which keeps the UI ready for future API or database calls without rewriting the page components.

This means a later backend can replace the service internals while the route pages, shared UI components, and vehicle UI stay mostly unchanged.

## Future Roadmap

- V0.3: UX transitions and frontend polish
- V0.4: Advanced configurator and local persistence
- V0.5: Mock API layer and validation
- V1: Backend, database, auth, payments, testing, and deployment

## Disclaimer

This is a Tesla-inspired educational project. It is not affiliated with Tesla. Placeholder image paths are used instead of copyrighted Tesla assets.

## Development Notes

This project is being built incrementally:
- V0 established the homepage.
- V0.1 added multi-page vehicle flows.
- V0.2 cleaned the architecture and prepared the frontend for backend integration.

# Tesla Clone

Tesla-inspired frontend clone built with Next.js. This project is frontend-only for now and is designed to scale toward backend services, authentication, database storage, payments, testing, and production deployment later.

Real Tesla assets are not used. Image references are local placeholder paths under `public/images`.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Static local data for V0, V0.1, V0.2, V0.3, and V0.4

## Current Version

- Current version: V0.4
- Status: Frontend buying flow depth, product exploration, and ecosystem-page polish are complete for this phase.
- Backend: Not implemented yet
- Deployment: Not implemented yet

## Progress

V0:
- Core Tesla-inspired homepage and responsive shell.

V0.1:
- Multi-page vehicle, order, and demo-drive frontend flows.

V0.2:
- Shared services, constants, and reusable UI states/components.

V0.3:
- Shared motion system
- Homepage transition polish
- Scroll-aware navbar behavior
- Animated mobile menu
- Vehicle, detail, configurator, and demo-drive polish
- Energy, charging, discover, and shop page polish
- Final visual and motion consistency pass

V0.4:
- Advanced configurator depth
- Paint-based preview switching
- Selected build summary
- Local persistence for configurator selections and demo-drive drafts
- Vehicle comparison experience
- Compare 2 to 4 vehicles across key specs and pricing
- Comparison route added at `/compare`
- Richer supporting pages for energy, charging, discover, and shop
- Final frontend readiness pass

## Project Structure

```text
app/
  page.tsx
  layout.tsx
  globals.css
  compare/
    page.tsx
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
  compare/
    CompareSelector.tsx
    CompareTable.tsx
  layout/
    Navbar.tsx
    MobileMenu.tsx
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
    InfoCard.tsx
    SpecGrid.tsx
    CtaGroup.tsx
    LoadingSection.tsx
    EmptyState.tsx
    ErrorState.tsx
    Reveal.tsx
    StaggerGroup.tsx
    PageTransition.tsx
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
  order.ts
  storage.ts
  motion.ts
  utils.ts
```

## Routes

- `/`
- `/compare`
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

- V0.5: Mock API layer, validation, and backend integration prep
- Level 7 / Next Major Milestone: Real backend + database
- V1: Backend, auth, payments, testing, deployment, and production hardening

## Disclaimer

This is a Tesla-inspired educational project. It is not affiliated with Tesla. Placeholder image paths are used instead of copyrighted Tesla assets.

## Development Notes

V0.4 completed a deeper, more realistic frontend product experience and prepared the app for backend-oriented work.

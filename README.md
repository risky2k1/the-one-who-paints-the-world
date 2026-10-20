# the-one-who-paints-the-world (Pastel Odyssey — Interactive 3D Portfolio)

Public Web Storefront and Interactive 3D Portfolio service for **the-one-who-rules-them-all**, built with **Next.js App Router, TypeScript, Three.js, and React Three Fiber**.

## Quick Start (Local Development)

```bash
# Install dependencies
pnpm install

# Start development server on http://localhost:3000
pnpm dev

# Run TypeScript type check
pnpm typecheck

# Run ESLint checks
pnpm lint

# Build production bundle
pnpm build

# Start production server on http://localhost:3000
pnpm start
```

## Running via Master Orchestrator

From the root of `the-one-who-rules-them-all`:

```bash
# Start fe service alongside core infrastructure
docker compose --profile fe up -d
```

## Architecture & Key Files

- `src/data/portfolio.ts`: Centralized, strictly typed demonstration portfolio data (persona, 6 destinations, skill groups, 3 featured projects, experience timeline, and configurable contact placeholders).
- `src/types/portfolio.ts`: TypeScript interfaces for destinations, route kinematics, camera presets, and navigation state.
- `src/lib/navigation/routeController.ts`: Continuous `CatmullRomCurve3` road definition, arc-length parameterization (`sampleRouteAt`), landmark world transforms, and 5-phase quintic travel kinematics (`computeTravelPlan`, `evaluateTravelKinematics`).
- `src/lib/navigation/navigationState.ts`: Authoritative navigation state machine and reducer synchronizing menu clicks, 3D landmark clicks, bidirectional route progress, latest-destination-wins interruption, visited tracking, dock collapse/restore, floating content panels, and project detail overlay.
- `src/components/experience/`:
  - `PortfolioExperience.tsx`: Top-level client orchestrator.
  - `ExperienceCanvas.tsx` & `WorldScene.tsx`: Orthographic diorama canvas, lighting, and frame-delta travel loop.
  - `CameraController.tsx`: Automatic isometric-diorama camera transitions (Overview, Travel, Arrival with adaptive left/right/mobile panel framing, and Return to Intro).
  - `Landscape.tsx`: Minimal Geometric Landscape with pastel plateau terraces, low-poly perimeter hills, reflective lagoons, and context-aware ambient crystals.
  - `Road.tsx`: Continuous physical road ribbon, raised curbs, centerline route-progress dashes, and landmark connector plazas derived from the shared `CatmullRomCurve3`.
  - `Landmark.tsx`: Six distinctive low-poly abstract sculptures with direct 3D interaction and projected HTML badges.
  - `Vehicle.tsx`: Signature coral/peach low-poly studio coupe with distance-driven wheel rotation, curvature steering, body roll/pitch, brake-light response, arrival settling, and parked idle breathing.
- `src/components/navigation/`: `DestinationDock.tsx`, `CompactNavbar.tsx`, and `JourneyProgress.tsx`.
- `src/components/panels/`: `FloatingContentPanel.tsx`, `ProjectDetailOverlay.tsx`, and `ContactCard.tsx`.
- `src/components/ui/`: `LoadingScreen.tsx` and `ErrorFallback.tsx`.

## Docker Targets

- `dev`: Development target with hot reload.
- `prod`: Optimized multi-stage production runtime on Node.js Alpine.

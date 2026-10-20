# AGENTS.md — `the-one-who-paints-the-world` (Frontend Service)

## Purpose
This repository (`the-one-who-paints-the-world`) is the **Public Web Storefront & Interactive 3D Experience** service within the `the-one-who-rules-them-all` polyglot multi-repo architecture. It is built on **Next.js 14 (App Router), React 18, TypeScript, Three.js, and React Three Fiber**.

## Repository Layout
```text
.
├── src/
│   ├── app/                    # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   ├── components/
│   │   ├── experience/         # 3D canvas, diorama scene, road, vehicle, landmarks, camera
│   │   ├── navigation/         # UI docks, compact navbar, journey progress
│   │   ├── panels/             # Floating content panels, project overlays, contact cards
│   │   └── ui/                 # Loading screens, error fallbacks
│   ├── data/                   # Demonstration portfolio content & route definitions
│   ├── lib/
│   │   ├── navigation/         # Kinematics, road curves, navigation state machine & reducer
│   │   └── performance/        # Adaptive quality settings & Web Audio sound cues
│   └── types/                  # Strict TypeScript interfaces & definitions
├── tests/                      # Unit & integration test suites
├── public/                     # Static assets & favicon
├── Dockerfile                  # Multi-stage Docker build (base, dev, prod)
├── .dockerignore               # Docker build exclusions
├── .eslintrc.cjs               # Next.js ESLint configuration
├── next.config.mjs             # Next.js bundler & transpilePackages configuration
├── package.json                # Dependencies & scripts
└── tsconfig.json               # TypeScript compiler configuration
```

## Building the Container Image
Per project architectural rules, **this repository owns BUILD** (`Dockerfile` and frontend runtime configs), while the **master repository (`the-one-who-rules-them-all`) owns RUN** (Docker Compose, Nginx, `.env`, `Makefile`).

From the root of `services/fe`:

```bash
# Build the development target (supports hot reload via bind mounts)
docker build --target dev -t fe:dev .

# Build the production target (optimized static & SSR bundle)
docker build --target prod -t fe:prod .
```

## Mandatory Rules for Agents & Contributors
1. **Separation of BUILD vs. RUN**: Do **NOT** add `compose.yaml` or `docker-compose.yml` to this repository. All orchestration is managed by `the-one-who-rules-them-all`.
2. **Never commit secrets or `.env`**: Environment variables are injected at runtime by the master repository's `.env` and `compose.yaml`.
3. **Strict 3D & State Discipline**:
   - Maintain synchronization between menu clicks, 3D landmark clicks, camera kinematics, and floating panels.
   - Respect user accessibility preferences (`prefers-reduced-motion` and muted sound by default).
4. **Git Submodule Hygiene**: This directory is a git submodule (`the-one-who-paints-the-world`). Always commit and push changes inside this repo first, then update the submodule pointer in the master repo.

# ------------------------------------------------------------------------------
# Base Stage — Install pnpm & prepare dependencies
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-lock.yaml ./

# ------------------------------------------------------------------------------
# Development Stage — Bind-mount source & run dev server
# ------------------------------------------------------------------------------
FROM base AS dev
RUN pnpm install --frozen-lockfile
COPY . .

ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "dev"]

# ------------------------------------------------------------------------------
# Build Stage — Compile optimized production Next.js bundle
# ------------------------------------------------------------------------------
FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN pnpm build

# ------------------------------------------------------------------------------
# Production Stage — Minimal runtime image
# ------------------------------------------------------------------------------
FROM node:20-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=15s \
  CMD wget -q -O /dev/null http://127.0.0.1:3000 || exit 1

CMD ["pnpm", "start"]

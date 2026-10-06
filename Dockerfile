# syntax=docker/dockerfile:1

ARG NODE_VERSION=26.10.0
ARG ALPINE_VERSION=3.24
ARG WORKDIR=/usr/src/presk

# ---
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
ARG WORKDIR
WORKDIR ${WORKDIR}
ENV NEXT_TELEMETRY_DISABLED=1

# ---
FROM base AS prepare
COPY . .
RUN npx turbo prune web --docker

# ---
FROM base AS builder
ARG WORKDIR
# Install dependencies first (they change less often than source)
COPY --from=prepare ${WORKDIR}/out/json/ .
RUN npm ci
# Build the project
COPY --from=prepare ${WORKDIR}/out/full/ .

# Uncomment and pass build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN npx turbo build

# ---
FROM node:${NODE_VERSION}-alpine AS runner
ARG WORKDIR
WORKDIR ${WORKDIR}
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Don't run production as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=builder --chown=nextjs:nodejs ${WORKDIR}/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs ${WORKDIR}/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs ${WORKDIR}/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]

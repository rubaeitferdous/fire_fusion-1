# syntax=docker/dockerfile:1

# Stage 1: Build the application using Bun
FROM oven/bun:1.2-alpine AS builder

WORKDIR /app

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Pass through build-time public environment variables if provided
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy monorepo manifests, lockfile, packages, and web app
COPY package.json bun.lock turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

# Install dependencies using frozen lockfile
RUN bun install --frozen-lockfile

# Build the project (generates Next.js standalone output)
RUN bun run build

# Stage 2: Minimal production runtime using Node.js Alpine
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-privileged system user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set up .next cache directory with appropriate ownership
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone server, static files, and public assets
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

# Container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "apps/web/server.js"]

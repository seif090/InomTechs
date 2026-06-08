# =============================================================================
# STAGE 1: Base — shared deps
# =============================================================================
FROM node:22-alpine AS base
RUN apk add --no-cache curl tini
WORKDIR /app
COPY package*.json ./

# =============================================================================
# STAGE 2: Install — production-only deps (cache-friendly)
# =============================================================================
FROM base AS deps
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# =============================================================================
# STAGE 3: Build — full devDeps + compile
# =============================================================================
FROM base AS build
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY tsconfig.json vite.config.ts index.html ./
COPY public/ public/
COPY src/ src/
RUN npm run build

# =============================================================================
# STAGE 4: Production — nginx + static assets
# =============================================================================
FROM nginx:1.27-alpine AS production

# Security: run as non-root
RUN addgroup -g 101 -S appgroup && \
    adduser -S -D -H -u 101 -G appgroup appuser && \
    rm -f /etc/nginx/conf.d/default.conf && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid /var/cache/nginx /etc/nginx

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl tzdata

# Copy nginx config
COPY devops/docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY devops/docker/nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY devops/docker/nginx/rate-limiting.conf /etc/nginx/rate-limiting.conf
COPY devops/docker/nginx/gzip.conf /etc/nginx/gzip.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy healthcheck script
COPY devops/docker/scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443

USER appuser
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/entrypoint.sh"]

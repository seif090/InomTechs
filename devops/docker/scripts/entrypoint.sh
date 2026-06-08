#!/bin/sh
# =============================================================================
# Entrypoint for production Nginx container
# Handles environment variable injection and nginx startup
# =============================================================================
set -e

# Replace environment variables in JS bundles (runtime config)
if [ -n "${GEMINI_API_KEY}" ]; then
    find /usr/share/nginx/html -type f -name "*.js" -exec \
        sed -i "s|__GEMINI_API_KEY__|${GEMINI_API_KEY}|g" {} \;
fi

if [ -n "${APP_URL}" ]; then
    find /usr/share/nginx/html -type f -name "*.js" -exec \
        sed -i "s|__APP_URL__|${APP_URL}|g" {} \;
fi

# Start nginx
exec nginx -g "daemon off;"

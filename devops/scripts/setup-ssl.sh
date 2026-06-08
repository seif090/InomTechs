#!/bin/bash
# =============================================================================
# SSL Certificate Setup — Let's Encrypt via Certbot
# Usage: ./setup-ssl.sh [domain] [email]
# =============================================================================
set -euo pipefail

DOMAIN="${1:-inomtechs.com}"
EMAIL="${2:-admin@inomtechs.com}"
WWW_DOMAIN="www.${DOMAIN}"

log() { echo "[$(date +%H:%M:%S)] $*"; }

command -v docker >/dev/null 2>&1 || { echo "Docker required"; exit 1; }

log "Setting up SSL for ${DOMAIN} and ${WWW_DOMAIN}"

# Run certbot
docker run --rm -it \
    -v /etc/ssl/certs:/etc/letsencrypt \
    -v /var/www/certbot:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    --domains "${DOMAIN}" \
    --domains "${WWW_DOMAIN}"

log "SSL certificates obtained successfully"

# Setup auto-renewal cron
CRON_JOB="0 3 * * * docker run --rm -v /etc/ssl/certs:/etc/letsencrypt -v /var/www/certbot:/var/www/certbot certbot/certbot renew --quiet && docker exec inomtechs-app nginx -s reload"
(crontab -l 2>/dev/null | grep -v "certbot" ; echo "${CRON_JOB}") | crontab -

log "Auto-renewal cron job configured"
log "Certificates stored in /etc/ssl/certs/live/${DOMAIN}/"

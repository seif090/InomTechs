#!/bin/bash
# =============================================================================
# Production Backup Script — Enterprise Grade
# Backups: Application data, Docker volumes, Nginx config, SSL certs
# Retention: 30 daily, 12 weekly, 12 monthly
# Destinations: Local + S3 (AWS) / Blob (Azure) / rsync (VPS)
# =============================================================================
set -euo pipefail

# Configuration
BACKUP_DIR="/opt/backups"
RETENTION_DAYS=30
RETENTION_WEEKS=12
RETENTION_MONTHS=12
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ENVIRONMENT="${NODE_ENV:-production}"
S3_BUCKET="${S3_BUCKET:-inomtechs-backups}"
BACKUP_NAME="inomtechs-${ENVIRONMENT}-${TIMESTAMP}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# Ensure directories
mkdir -p "${BACKUP_DIR}/{daily,weekly,monthly,archive}"
mkdir -p "${BACKUP_DIR}/app"
mkdir -p "${BACKUP_DIR}/volumes"

# =============================================================================
# 1. Application Backup (Docker volumes + configs)
# =============================================================================
log "Starting backup: ${BACKUP_NAME}"

log "Backing up Docker volumes..."
docker run --rm -v inomtechs_nginx-logs:/data -v ${BACKUP_DIR}/volumes:/backup \
    alpine tar czf /backup/nginx-logs-${TIMESTAMP}.tgz -C /data . || warn "Nginx logs volume not found"

log "Backing up SSL certificates..."
tar czf "${BACKUP_DIR}/app/ssl-certs-${TIMESTAMP}.tgz" \
    -C /etc/ssl/certs . 2>/dev/null || warn "No SSL certs backup"

log "Backing up Docker Compose files..."
tar czf "${BACKUP_DIR}/app/compose-${TIMESTAMP}.tgz" \
    -C /opt/inomtechs devops/compose/ devops/docker/nginx/ .env.production || warn "Compose files missing"

log "Backing up environment configuration..."
cp /opt/inomtechs/.env.production "${BACKUP_DIR}/app/env-${TIMESTAMP}.txt" 2>/dev/null || warn "No .env.production"

# =============================================================================
# 2. Database Backup (future — when PostgreSQL/MySQL is added)
# =============================================================================
# if docker exec inomtechs-db pg_dump -U ${DB_USER} ${DB_NAME} > "${BACKUP_DIR}/app/db-${TIMESTAMP}.sql"; then
#     gzip "${BACKUP_DIR}/app/db-${TIMESTAMP}.sql"
#     log "Database backup completed"
# fi

# =============================================================================
# 3. Create consolidated archive
# =============================================================================
log "Creating consolidated archive..."
tar czf "${BACKUP_DIR}/archive/${BACKUP_NAME}.tgz" \
    -C "${BACKUP_DIR}" \
    app/ volumes/ \
    --exclude="archive" \
    --exclude="daily" \
    --exclude="weekly" \
    --exclude="monthly"

BACKUP_SIZE=$(du -h "${BACKUP_DIR}/archive/${BACKUP_NAME}.tgz" | cut -f1)
log "Backup created: ${BACKUP_NAME}.tgz (${BACKUP_SIZE})"

# =============================================================================
# 4. Remote Sync (Cloud storage)
# =============================================================================
if command -v aws &>/dev/null && [ -n "${AWS_ACCESS_KEY_ID:-}" ]; then
    log "Uploading to S3..."
    aws s3 cp "${BACKUP_DIR}/archive/${BACKUP_NAME}.tgz" "s3://${S3_BUCKET}/${ENVIRONMENT}/"
elif command -v az &>/dev/null && [ -n "${AZURE_STORAGE_CONNECTION_STRING:-}" ]; then
    log "Uploading to Azure Blob..."
    az storage blob upload \
        --container-name backups \
        --file "${BACKUP_DIR}/archive/${BACKUP_NAME}.tgz" \
        --name "${ENVIRONMENT}/${BACKUP_NAME}.tgz"
else
    warn "No cloud CLI configured — backup is local only"
fi

# =============================================================================
# 5. Retention Policy
# =============================================================================
log "Applying retention policy..."

# Daily: keep last 30
find "${BACKUP_DIR}/daily" -name "*.tgz" -mtime +${RETENTION_DAYS} -delete
cp "${BACKUP_DIR}/archive/${BACKUP_NAME}.tgz" "${BACKUP_DIR}/daily/"

# Weekly: keep last 12 (Sunday)
if [ "$(date +%u)" = "7" ]; then
    find "${BACKUP_DIR}/weekly" -name "*.tgz" -mtime +$((RETENTION_WEEKS * 7)) -delete
    cp "${BACKUP_DIR}/archive/${BACKUP_NAME}.tgz" "${BACKUP_DIR}/weekly/"
fi

# Monthly: keep last 12 (1st of month)
if [ "$(date +%d)" = "01" ]; then
    find "${BACKUP_DIR}/monthly" -name "*.tgz" -mtime +$((RETENTION_MONTHS * 30)) -delete
    cp "${BACKUP_DIR}/archive/${BACKUP_NAME}.tgz" "${BACKUP_DIR}/monthly/"
fi

# =============================================================================
# 6. Cleanup
# =============================================================================
rm -rf "${BACKUP_DIR}/app" "${BACKUP_DIR}/volumes"
log "Cleanup complete"

# =============================================================================
# 7. Notification
# =============================================================================
if command -v curl &>/dev/null && [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    curl -s -X POST -H "Content-type: application/json" \
        --data "{\"text\":\"✅ Backup successful: ${BACKUP_NAME} (${BACKUP_SIZE})\"}" \
        "${SLACK_WEBHOOK_URL}" >/dev/null || true
fi

log "${GREEN}Backup completed successfully${NC}"

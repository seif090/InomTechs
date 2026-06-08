#!/bin/bash
# =============================================================================
# Restore Script — Enterprise Grade
# Usage: ./restore.sh <backup-file> [environment]
# =============================================================================
set -euo pipefail

if [ $# -lt 1 ]; then
    echo "Usage: $0 <backup-file.tgz> [environment]"
    echo "Example: $0 /opt/backups/archive/inomtechs-production-20240101-120000.tgz staging"
    exit 1
fi

BACKUP_FILE=$1
ENVIRONMENT=${2:-production}
RESTORE_DIR="/tmp/restore-$(date +%s)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# Validate backup file
[ -f "${BACKUP_FILE}" ] || error "Backup file not found: ${BACKUP_FILE}"

# Confirmation
echo -e "${YELLOW}⚠️  WARNING: This will OVERWRITE the current ${ENVIRONMENT} environment.${NC}"
read -p "Are you sure? (yes/no): " CONFIRM
[ "${CONFIRM}" = "yes" ] || exit 0

log "Starting restore from: ${BACKUP_FILE}"

# Extract
mkdir -p "${RESTORE_DIR}"
tar xzf "${BACKUP_FILE}" -C "${RESTORE_DIR}"
log "Backup extracted to ${RESTORE_DIR}"

# Stop services
log "Stopping services..."
docker compose -f /opt/inomtechs/devops/compose/docker-compose.yml down || warn "No compose file"

# Restore Docker volumes
if [ -d "${RESTORE_DIR}/volumes" ]; then
    log "Restoring Docker volumes..."
    for vol_archive in "${RESTORE_DIR}"/volumes/*.tgz; do
        vol_name=$(basename "${vol_archive}" .tgz | sed 's/-[0-9]\{8\}-[0-9]\{6\}//')
        docker run --rm -v "inomtechs_${vol_name}:/data" -v "${RESTORE_DIR}/volumes:/backup" \
            alpine tar xzf "/backup/$(basename ${vol_archive})" -C /data || warn "Volume ${vol_name} restore failed"
    done
fi

# Restore SSL certs
if [ -f "${RESTORE_DIR}/app/ssl-certs-*.tgz" ]; then
    log "Restoring SSL certificates..."
    sudo tar xzf "${RESTORE_DIR}"/app/ssl-certs-*.tgz -C /etc/ssl/certs/ || warn "SSL restore failed"
fi

# Restore environment
if ls "${RESTORE_DIR}/app/env-*.txt" 1>/dev/null 2>&1; then
    log "Restoring environment configuration..."
    cp "${RESTORE_DIR}"/app/env-*.txt /opt/inomtechs/.env.production
fi

# Restore database (future)
# if ls "${RESTORE_DIR}/app/db-*.sql.gz" 1>/dev/null 2>&1; then
#     log "Restoring database..."
#     gunzip -c "${RESTORE_DIR}"/app/db-*.sql.gz | docker exec -i inomtechs-db psql -U ${DB_USER} ${DB_NAME}
# fi

# Start services
log "Starting services..."
docker compose -f /opt/inomtechs/devops/compose/docker-compose.yml up -d

# Verify
sleep 5
curl -sf http://localhost/health >/dev/null && log "Restore verified — health check passed" || warn "Health check failed"

# Cleanup
rm -rf "${RESTORE_DIR}"
log "Restore completed successfully"

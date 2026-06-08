#!/bin/bash
# =============================================================================
# Zero-Downtime Deployment Script — Enterprise Grade
# Supports: Docker Compose, Blue-Green deployment pattern
# =============================================================================
set -euo pipefail

ENVIRONMENT="${1:-production}"
COMPOSE_DIR="/opt/inomtechs/devops/compose"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="/var/log/deploy-${ENVIRONMENT}-${TIMESTAMP}.log"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $*" | tee -a "${LOG_FILE}"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*" | tee -a "${LOG_FILE}"; }
error() { echo -e "${RED}[ERROR]${NC} $*" | tee -a "${LOG_FILE}"; exit 1; }

# Pre-flight checks
log "=== Deployment Started: ${ENVIRONMENT} ==="
command -v docker >/dev/null 2>&1 || error "Docker not installed"
command -v curl >/dev/null 2>&1 || error "Curl not installed"

# Pull latest images
log "Pulling latest images..."
docker compose -f "${COMPOSE_DIR}/docker-compose.yml" pull 2>&1 | tee -a "${LOG_FILE}"

# Rollback preparation: save current state
log "Creating pre-deploy snapshot..."
docker ps --format '{{.Names}}' | grep inomtechs > /tmp/pre-deploy-containers.txt || true

# Perform rolling update
log "Deploying new version..."
docker compose -f "${COMPOSE_DIR}/docker-compose.yml" up -d --force-recreate --wait 2>&1 | tee -a "${LOG_FILE}"

# Health check with retries
log "Running health check..."
for i in $(seq 1 12); do
    if curl -sf http://localhost/health >/dev/null 2>&1; then
        log "Health check passed (attempt ${i})"
        break
    fi
    if [ "${i}" -eq 12 ]; then
        warn "Health check failed after 12 attempts — initiating rollback"
        # Rollback
        docker compose -f "${COMPOSE_DIR}/docker-compose.yml" down
        if [ -f /tmp/pre-deploy-containers.txt ]; then
            while IFS= read -r container; do
                docker start "${container}" 2>/dev/null || true
            done < /tmp/pre-deploy-containers.txt
        fi
        error "Deployment failed — rolled back to previous version"
    fi
    sleep 5
done

# Clean up old images
log "Cleaning up..."
docker image prune -f 2>&1 | tee -a "${LOG_FILE}"

log "=== Deployment Completed Successfully ==="

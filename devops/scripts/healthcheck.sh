#!/bin/bash
# =============================================================================
# Health Check — Comprehensive system health verification
# Returns: 0 (healthy), 1 (degraded), 2 (critical)
# =============================================================================
set -euo pipefail

EXIT_CODE=0

check_http() {
    local url=$1
    local label=$2
    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "${url}" 2>/dev/null || echo "000")
    if [ "${status}" = "200" ]; then
        echo "✅ ${label}: ${status}"
    else
        echo "❌ ${label}: ${status}"
        EXIT_CODE=2
    fi
}

check_docker() {
    local container=$1
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        local status
        status=$(docker inspect --format='{{.State.Status}}' "${container}")
        echo "✅ Container ${container}: ${status}"
    else
        echo "❌ Container ${container}: not running"
        EXIT_CODE=2
    fi
}

check_disk() {
    local usage
    usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "${usage}" -lt 80 ]; then
        echo "✅ Disk: ${usage}% used"
    elif [ "${usage}" -lt 90 ]; then
        echo "⚠️  Disk: ${usage}% used"
        [ "${EXIT_CODE}" -lt 1 ] && EXIT_CODE=1
    else
        echo "❌ Disk: ${usage}% used"
        EXIT_CODE=2
    fi
}

check_memory() {
    local total used percent
    total=$(free -m | awk '/^Mem:/{print $2}')
    used=$(free -m | awk '/^Mem:/{print $3}')
    percent=$((used * 100 / total))
    if [ "${percent}" -lt 80 ]; then
        echo "✅ Memory: ${percent}% used (${used}MB/${total}MB)"
    elif [ "${percent}" -lt 90 ]; then
        echo "⚠️  Memory: ${percent}% used"
        [ "${EXIT_CODE}" -lt 1 ] && EXIT_CODE=1
    else
        echo "❌ Memory: ${percent}% used"
        EXIT_CODE=2
    fi
}

echo "=== InomTechs Health Check ==="
echo "Timestamp: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo "Host: $(hostname)"
echo ""

# Application checks
check_http "http://localhost/health" "App HTTP"
check_http "https://localhost/health" "App HTTPS"

# Container checks
check_docker "inomtechs-app"

# System checks
check_disk
check_memory
check_http "http://localhost:9090/-/healthy" "Prometheus"
check_http "http://localhost:3100/ready" "Loki"

echo ""
if [ "${EXIT_CODE}" -eq 0 ]; then
    echo "✅ System: HEALTHY"
elif [ "${EXIT_CODE}" -eq 1 ]; then
    echo "⚠️  System: DEGRADED"
else
    echo "❌ System: CRITICAL"
fi

exit ${EXIT_CODE}

# Monitoring Documentation

## Stack Overview

| Component | Role | Port |
|-----------|------|------|
| **Prometheus** | Metrics collection & alerting | 9090 |
| **Grafana** | Dashboards & visualization | 3000 |
| **Loki** | Log aggregation | 3100 |
| **Promtail** | Log shipping | 9080 |
| **Alertmanager** | Alert routing & notification | 9093 |
| **Node Exporter** | System metrics | 9100 |

## Accessing Dashboards

| Service | URL | Credentials |
|---------|-----|-------------|
| Grafana | `https://monitoring.inomtechs.com:3000` | `admin` / `GF_SECURITY_ADMIN_PASSWORD` |
| Prometheus | `https://monitoring.inomtechs.com:9090` | No auth (internal) |
| Alertmanager | `https://monitoring.inomtechs.com:9093` | No auth (internal) |

## Metrics Collected

### System Metrics (Node Exporter)
- CPU usage (per core, idle/system/user)
- Memory (total, used, available, cache)
- Disk (total, used, available, I/O)
- Network (bytes in/out, errors, drops)
- Load average (1m, 5m, 15m)

### Application Metrics (Nginx Exporter)
- HTTP request rate (by status code)
- Response time (p50, p95, p99)
- Active connections
- Request size distribution

### Docker Metrics
- Container CPU/memory usage
- Container restart count
- Image pull count

## Dashboards

### 1. Application Overview
- Request rate (graph)
- Response time (P95 graph)
- Error rate (5xx graph)
- System gauges (CPU, Memory, Disk)
- Active connections
- Network traffic

### 2. Logs Explorer
- Real-time log streaming
- Filter by service, level, time range
- Error rate trends

## Alerts

### Critical Alerts (PagerDuty + Slack)
- **Instance Down**: `up == 0` for 1m
- **High CPU**: > 80% for 5m
- **High Memory**: > 85% for 5m
- **Low Disk**: < 10% free
- **High 5xx Rate**: > 5% error rate

### Warning Alerts (Slack)
- **High Disk I/O**: > 0.5 for 5m
- **High Network Traffic**: > 100 MB/s
- **High Log Error Rate**
- **P95 Response Time > 3s**

## Logging Strategy

### Log Sources
- **Nginx access logs** → JSON structured → Loki
- **Nginx error logs** → Loki
- **Docker containers** → stdout/stderr → Loki
- **System logs** → `/var/log/syslog` → Loki

### Log Retention
| Environment | Retention |
|-------------|-----------|
| Development | 7 days |
| Staging | 14 days |
| Production | 30 days |

## Runbook: Common Alerts

### CPU Usage > 80%
1. Check which process: `top -bn1 | head -20`
2. Check container CPU: `docker stats --no-stream`
3. Scale up: increase resources in compose/k8s
4. If sustained: add more replicas

### Disk Space < 10%
1. Check usage: `df -h`
2. Clean Docker: `docker system prune -af`
3. Remove old logs: `find /var/log -name "*.log" -mtime +7 -delete`
4. Expand volume if needed

### High 5xx Error Rate
1. Check nginx logs: `docker logs inomtechs-app --tail 100`
2. Check backend health: `curl -f http://localhost/health`
3. Verify SSL cert expiry: `openssl x509 -enddate -noout -in /etc/ssl/certs/fullchain.pem`
4. Restart container if needed

## Dashboard URLs
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090
- Alertmanager: http://localhost:9093
- Loki: http://localhost:3100/ready

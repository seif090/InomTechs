# Runbooks — Operational Procedures

## 1. Complete Outage

### Detection
- Alertmanager fires `InstanceDown`
- Grafana dashboard shows no data
- Users report site unreachable

### Response
```bash
# 1. SSH into server
ssh deploy@PRODUCTION_HOST

# 2. Check Docker status
docker ps -a | grep inomtechs

# 3. Check logs
docker logs inomtechs-app --tail 100

# 4. Restart services
docker compose -f /opt/inomtechs/devops/compose/docker-compose.yml restart

# 5. If still down, full redeploy
docker compose -f /opt/inomtechs/devops/compose/docker-compose.yml down
docker compose -f /opt/inomtechs/devops/compose/docker-compose.yml up -d

# 6. Verify
curl -f http://localhost/health
```

### Escalation
- If unresolved in 15 min: Page on-call engineer
- If unresolved in 30 min: Declare incident

---

## 2. Deployment Rollback

### Trigger
- Failed smoke tests after production deploy
- User-reported errors after deploy

### Procedure
```bash
# 1. SSH into production
ssh deploy@PRODUCTION_HOST

# 2. Rollback Docker image
docker compose -f /opt/inomtechs/devops/compose/docker-compose.yml down
docker compose -f /opt/inomtechs/devops/compose/docker-compose.yml up -d

# Or use backup restore
bash /opt/inomtechs/devops/scripts/restore.sh /opt/backups/archive/latest-backup.tgz

# 3. Verify
curl -f http://localhost/health
```

### Post-Rollback
- Tag the broken version in GitHub
- Create incident report
- Add regression test

---

## 3. SSL Certificate Renewal

### Auto-Renewal (Default)
Certbot auto-renews via cron at 3 AM daily.
```bash
# Check cron
crontab -l | grep certbot

# Force renewal
docker run --rm -v /etc/ssl/certs:/etc/letsencrypt certbot/certbot renew
docker exec inomtechs-app nginx -s reload
```

### Manual Renewal
```bash
bash /opt/inomtechs/devops/scripts/setup-ssl.sh
```

---

## 4. Database Recovery (Future)

### Restore from Backup
```bash
# Find latest backup
ls -lt /opt/backups/daily/ | head -5

# Restore
bash /opt/inomtechs/devops/scripts/restore.sh /opt/backups/daily/<backup-file>.tgz
```

### Point-in-Time Recovery
```bash
# Restore to specific time
PG_RESTORE_TIMESTAMP="2024-01-15 14:30:00"
# (PostgreSQL WAL replay procedure)
```

---

## 5. Backup Verification

### Monthly Validation
```bash
# 1. Restore to staging
bash /opt/inomtechs/devops/scripts/restore.sh \
    /opt/backups/monthly/last-month-backup.tgz staging

# 2. Verify content
curl -f http://staging-server/health

# 3. Document result
echo "$(date): Backup verification PASSED" >> /var/log/backup-verification.log
```

---

## 6. Monitoring Stack Restart

```bash
# Restart entire monitoring stack
docker compose -f /opt/inomtechs/devops/compose/docker-compose.monitoring.yml down
docker compose -f /opt/inomtechs/devops/compose/docker-compose.monitoring.yml up -d

# Verify
curl -f http://localhost:9090/-/healthy  # Prometheus
curl -f http://localhost:3100/ready       # Loki
curl -f http://localhost:9093/-/healthy   # Alertmanager
```

---

## 7. Emergency Contacts

| Role | Contact | Response Time |
|------|---------|---------------|
| DevOps Lead | devops@inomtechs.com | 15 min |
| Security Lead | security@inomtechs.com | 15 min |
| CTO | cto@inomtechs.com | 30 min |
| Incident Response | incident@inomtechs.com | 5 min |

---

## 8. Communication Templates

### Incident Declaration
```
🚨 INCIDENT #{ID}
Severity: {P0/P1/P2}
Service: {inomtechs.com}
Start Time: {UTC}
Description: {brief description}
Impact: {affected users/services}
Action: {current response actions}
Status: Investigating / Mitigating / Resolved
```

### Post-Mortem
```
# Post-Mortem: {TITLE}
Date: {DATE}
Severity: {LEVEL}
Duration: {DURATION}

## Summary
{one-paragraph summary}

## Timeline
{UTC} - Incident detected
{UTC} - Engineer responded
{UTC} - Root cause identified
{UTC} - Mitigation applied
{UTC} - Service restored

## Root Cause
{detailed explanation}

## Action Items
- [ ] {fix} — Owner, Due date
- [ ] {monitoring improvement} — Owner, Due date

## Lessons Learned
{what went well, what went wrong}
```

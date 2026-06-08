# =============================================================================
# InomTechs — Production Readiness Checklist
# =============================================================================
# Before going live, verify each item. Mark [x] when complete.
# =============================================================================

## 1. DNS & DOMAIN
- [ ] Domain registered (inomtechs.com)
- [ ] DNS A records point to production server IP
- [ ] DNS CNAME www → inomtechs.com
- [ ] MX records configured for email
- [ ] TXT records for SPF, DKIM, DMARC
- [ ] TTL set appropriately (300s for prod)

## 2. SSL / TLS
- [ ] Let's Encrypt certificates installed
- [ ] Auto-renewal cron job configured
- [ ] HSTS preload submitted (hstspreload.org)
- [ ] SSL Labs test grade A+ (ssllabs.com)
- [ ] HTTPS redirect (301) enforced

## 3. DOCKER & DEPLOYMENT
- [ ] Dockerfile builds successfully
- [ ] Multi-stage build produces <50MB image
- [ ] Container runs as non-root user
- [ ] Health check endpoint returns 200
- [ ] Graceful shutdown configured
- [ ] Resource limits set (CPU/Memory)
- [ ] Logging driver configured (json-file)

## 4. NGINX
- [ ] Security headers verified (securityheaders.com)
- [ ] CSP policy tested and working
- [ ] Rate limiting enabled (30 req/s)
- [ ] Gzip/Brotli compression enabled
- [ ] Static asset caching (1 year)
- [ ] SPA fallback (index.html) configured
- [ ] server_tokens off
- [ ] Client max body size limited (10M)

## 5. CI/CD
- [ ] GitHub Actions workflow created
- [ ] All 11 pipeline stages tested
- [ ] Docker image pushes to GHCR
- [ ] Staging auto-deploy works
- [ ] Smoke tests pass
- [ ] Manual approval gate configured
- [ ] Rollback procedure tested

## 6. MONITORING
- [ ] Prometheus scraping targets configured
- [ ] Grafana dashboards provisioned
- [ ] Loki receiving logs from all services
- [ ] Alertmanager routing configured
- [ ] Critical alerts firing correctly
- [ ] PagerDuty/Slack integration tested
- [ ] Node exporter collecting system metrics
- [ ] Grafana accessible (auth enabled)

## 7. BACKUPS
- [ ] Daily backup script automated (cron)
- [ ] Backup retention policy configured
- [ ] Off-site backup destination set (S3/Blob)
- [ ] Restore procedure tested end-to-end
- [ ] Backup encryption enabled
- [ ] Verification: backup integrity check

## 8. SECURITY
- [ ] All secrets in GitHub Secrets (not code)
- [ ] .env* in .gitignore
- [ ] npm audit passes (no HIGH/CRITICAL)
- [ ] Trivy scan passes (no CRITICAL)
- [ ] Firewall: only ports 22,80,443 open
- [ ] SSH key-based auth only (no password)
- [ ] Fail2ban configured
- [ ] Docker daemon in rootless mode

## 9. PERFORMANCE
- [ ] CDN configured (CloudFront/DO CDN)
- [ ] Lighthouse score > 90
- [ ] Page load < 2s (3G)
- [ ] Image optimization (WebP, lazy loading)
- [ ] Bundle size < 500KB gzipped
- [ ] Core Web Vitals pass

## 10. DISASTER RECOVERY
- [ ] High availability plan documented
- [ ] Failover procedure tested
- [ ] Recovery time objective (RTO) defined: 1 hour
- [ ] Recovery point objective (RPO) defined: 24 hours
- [ ] Runbooks printed and accessible offline

## 11. COMPLIANCE
- [ ] Privacy policy page live
- [ ] Terms & conditions page live
- [ ] Cookie consent implemented
- [ ] GDPR compliance (if EU users)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] robots.txt and sitemap.xml configured

## 12. GO-LIVE CHECKLIST
- [ ] Final staging deploy with prod data
- [ ] DNS propagation verified (whatsmydns.net)
- [ ] Email delivery tested
- [ ] Monitoring dashboards reviewed
- [ ] Team notified of go-live
- [ ] Post-launch monitoring window: 48 hours
- [ ] Rollback plan ready

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| DevOps Lead | | | |
| Security Lead| | | |
| CTO | | | |

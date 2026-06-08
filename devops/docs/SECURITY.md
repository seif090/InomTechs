# Security Documentation

## Overview
Enterprise-grade security implementation following OWASP Top 10, Mozilla Observatory, and CIS Benchmarks.

## Security Architecture

### 1. Network Security
- **HTTPS Everywhere**: TLS 1.2/1.3 only, HSTS preload
- **SSL Certificates**: Let's Encrypt auto-renewal
- **Rate Limiting**: 30 req/s per IP (global), 10 req/s (API)
- **DDoS Protection**: CloudFront/Azure Front Door WAF
- **Firewall**: UFW/iptables, port 22,80,443 only

### 2. Application Security

#### HTTP Headers (A+ Grade)
```
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [restrictive policy]
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

### 3. Secrets Management
- **At Rest**: GitHub Encrypted Secrets
- **In Transit**: HTTPS/TLS
- **In Code**: Never committed — `.env*` in `.gitignore`
- **Rotations**: Quarterly key rotation policy

### 4. Container Security
- **Base Image**: `nginx:1.27-alpine` (minimal attack surface)
- **Non-Root**: Runs as `appuser` (UID 101)
- **Read-Only FS**: Container filesystem is read-only
- **Image Scanning**: Trivy in CI/CD pipeline
- **Layered Caching**: Multi-stage build reduces layers

### 5. Dependency Security
- **npm audit**: Every CI run
- **Snyk**: Continuous monitoring (if configured)
- **Dependabot**: Auto PR for vulnerable deps
- **Lockfile**: `package-lock.json` committed

### 6. Secrets Scanning
- **Pre-commit**: TruffleHog scans every push
- **CI/CD**: Auto-block on secret leaks
- **Git History**: `git filter-branch` for past leaks

## Security Checklist

### Pre-Deployment
- [ ] All secrets stored in GitHub Secrets (not in code)
- [ ] `.env*` in `.gitignore`
- [ ] SSL certificates valid and auto-renewing
- [ ] Rate limiting configured
- [ ] Security headers verified (Mozilla Observatory)
- [ ] CSP policy tested
- [ ] Container runs as non-root user
- [ ] All ports except 80,443 blocked by firewall
- [ ] Database (future) uses encrypted connections
- [ ] Backup encryption enabled

### Regular Tasks
- [ ] Weekly: Review dependency vulnerabilities
- [ ] Monthly: Rotate API keys
- [ ] Quarterly: Full security audit
- [ ] Bi-annually: Penetration test
- [ ] On incident: Rotate all credentials

### Monitoring
- [ ] Failed authentication alerts
- [ ] Rate limit exceeded alerts
- [ ] 5xx error rate alerts
- [ ] Suspicious IP/reputation alerts
- [ ] SSL certificate expiry alerts (30 days before)

## Incident Response

### Severity Levels
| Level | Definition | Response Time |
|-------|-----------|--------------|
| P0 | Active data breach | 15 min |
| P1 | Service unavailable | 30 min |
| P2 | Degraded performance | 2 hours |
| P3 | Minor issue | 24 hours |

### Incident Response Steps
1. **Detect** — Alert from monitoring system
2. **Contain** — Isolate affected systems
3. **Eradicate** — Remove threat
4. **Recover** — Restore from backup
5. **Post-mortem** — RCA within 48 hours

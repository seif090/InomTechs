# DevOps Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Users                                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CDN (CloudFront / DO CDN)                    │
│                  ┌──────────────────────────────┐                │
│                  │    Static Assets Cache        │                │
│                  └──────────┬───────────────────┘                │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Reverse Proxy (Nginx)                            │
│  ┌─────────────┬──────────────┬──────────────┬────────────────┐  │
│  │ SSL/TLS     │ Rate Limiting│ Gzip/Brotli  │ Security       │  │
│  │ Terminator  │ (30 req/s)   │ Compression  │ Headers (CSP)  │  │
│  └─────────────┴──────────────┴──────────────┴────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Container (Nginx)                       │
│                    ┌──────────────────────┐                      │
│                    │  Static SPA Files     │                      │
│                    │  (Vite Build Output)  │                      │
│                    └──────────────────────┘                      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Monitoring Stack                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │Prometheus│  │ Grafana  │  │  Loki    │  │ Alertmanager  │   │
│  │ Metrics  │  │Dashboard │  │  Logs    │  │  Alerts       │   │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CI/CD Pipeline (GitHub Actions)                 │
│                                                                   │
│  Build → Lint → Tests → Security → Docker → Push → Deploy       │
│  ┌────┐  ┌────┐  ┌─────┐  ┌───────┐  ┌──────┐  ┌────┐  ┌──────┐│
│  │ TSC│  │ESL │  │Vitest│  │Trivy │  │Build │  │Push │  │Staging││
│  │    │  │int │  │+Play │  │+ Snyk│  │Image │  │GHCR │  │+ Smoke││
│  └────┘  └────┘  └─────┘  └───────┘  └──────┘  └────┘  └──────┘│
│                                              ┌──────────────────┐ │
│                                              │ Manual Approval  │ │
│                                              └──────────────────┘ │
│                                              ┌──────────────────┐ │
│                                              │   Production     │ │
│                                              └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backup & Disaster Recovery                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Daily Backup │  │ S3/Blob Sync │  │ Point-in-Time        │   │
│  │ (30-day ret.)│  │ (off-site)   │  │ Restore Procedure    │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Containerization** | Docker multi-stage | Minimal image size (~30MB), caching |
| **Reverse Proxy** | Nginx 1.27 | Best perf for static files, SSL, compression |
| **CI/CD** | GitHub Actions | Native GitHub integration, free tier |
| **Monitoring** | Prometheus + Grafana + Loki | CNCF standard, battle-tested at scale |
| **Deployment** | Rolling update via Compose | Zero-downtime, simple rollback |
| **Orchestration** | Docker Compose → K8s | Start simple, migrate when needed |
| **Image Registry** | GHCR (GitHub Container Registry) | Free, integrated with GitHub |
| **Secrets** | GitHub Secrets + .env | Encrypted at rest, injected at runtime |

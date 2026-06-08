# Deployment Guide — InomTechs

## Prerequisites

- Docker 24+ & Docker Compose v2+
- Node.js 22+ (local dev only)
- Domain name with DNS access
- GitHub account (for CI/CD)

## Quick Start (Local Development)

```bash
# 1. Clone
git clone https://github.com/inomtechs/inomtechs-site.git
cd inomtechs-site

# 2. Environment
cp .env.development.example .env.development
# Edit .env.development with your GEMINI_API_KEY

# 3. Run with hot-reload
docker compose -f devops/compose/docker-compose.dev.yml up -d
# Open http://localhost:3000

# 4. Stop
docker compose -f devops/compose/docker-compose.dev.yml down
```

## Production Deployment

### Single Server (VPS — Hostinger/Contabo/DigitalOcean)

```bash
# 1. Server setup
ssh root@YOUR_SERVER_IP
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# 2. Deploy
git clone https://github.com/inomtechs/inomtechs-site /opt/inomtechs
cd /opt/inomtechs
cp devops/security/.env.example .env.production
nano .env.production

# 3. Launch
docker compose -f devops/compose/docker-compose.yml up -d

# 4. SSL
bash devops/scripts/setup-ssl.sh

# 5. Monitoring
docker compose -f devops/compose/docker-compose.monitoring.yml up -d
```

### Kubernetes (AWS EKS / Azure AKS / DOKS)

```bash
kubectl apply -k devops/kubernetes/
```

### CI/CD Pipeline

Push to `main` branch → GitHub Actions auto-deploys:
1. Build → Lint → Tests → Security Scan
2. Docker Build & Push to GHCR
3. Deploy to Staging → Smoke Tests
4. Manual approval → Deploy to Production

## Environment-Specific Commands

| Environment | Command |
|------------|---------|
| Development | `docker compose -f devops/compose/docker-compose.dev.yml up` |
| Staging | `docker compose -f devops/compose/docker-compose.staging.yml up` |
| Production | `docker compose -f devops/compose/docker-compose.yml up` |
| Monitoring | `docker compose -f devops/compose/docker-compose.monitoring.yml up` |

## Rollback

```bash
# Docker: redeploy previous image tag
docker compose -f devops/compose/docker-compose.yml up -d --force-recreate

# Or use backup restore
bash devops/scripts/restore.sh /opt/backups/archive/<backup-file>.tgz
```

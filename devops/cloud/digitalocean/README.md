# DigitalOcean Deployment

## Architecture
- **Compute**: App Platform (PaaS) or Droplet (VPS)
- **CDN**: DigitalOcean CDN + Spaces
- **DNS**: DigitalOcean DNS (free)
- **SSL**: Let's Encrypt (auto via App Platform)
- **Monitoring**: DO Monitoring + Prometheus/Grafana
- **Backups**: Spaces + DO Backups

## Option A: App Platform (PaaS — Recommended)

| Service | Tier | Monthly Cost |
|---------|------|-------------|
| App Platform | Basic × 1 | ~$12 |
| Managed Database | Basic 1GB RAM | ~$15 |
| Spaces (CDN) | 10GB | ~$5 |
| **Total** | | **~$32** |

```bash
# Deploy via DO CLI
doctl apps create --spec .do/app.yaml
```

## Option B: Droplet (VPS — More Control)

| Service | Size | Monthly Cost |
|---------|------|-------------|
| Droplet | 2 vCPU, 2GB RAM | ~$24 |
| Block Storage | 50GB | ~$5 |
| Load Balancer | 1 LB | ~$12 |
| **Total** | | **~$41** |

```bash
# Deploy via Docker Compose
ssh root@DROPLET_IP "
  apt update && apt install -y docker.io docker-compose
  git clone https://github.com/inomtechs/inomtechs-site /opt/inomtechs
  cd /opt/inomtechs && docker compose -f devops/compose/docker-compose.yml up -d
"
```

## Scaling
- Vertical: Upgrade Droplet size
- Horizontal: Add Load Balancer + multiple Droplets
- CDN caches static assets globally

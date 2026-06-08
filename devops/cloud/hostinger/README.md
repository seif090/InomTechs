# Hostinger VPS Deployment

## Recommended Plan
- **VPS**: KVM 2 (2 vCPU, 4GB RAM, 100GB NVMe)
- **Cost**: ~$15/month
- **OS**: Ubuntu 22.04 LTS
- **Backups**: Hostinger automated weekly backups ($2/month extra)

## Initial Setup

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/inomtechs/inomtechs-site /opt/inomtechs
cd /opt/inomtechs

# Environment
cp devops/security/.env.example .env.production
nano .env.production  # Add your API keys

# Deploy
docker compose -f devops/compose/docker-compose.yml up -d
```

## SSL Setup
```bash
bash devops/scripts/setup-ssl.sh
```

## Monitoring
```bash
docker compose -f devops/compose/docker-compose.monitoring.yml up -d
```

## Cost Summary
| Item | Cost |
|------|------|
| VPS (KVM 2) | $15/mo |
| Domain | $10/yr |
| SSL | Free (Let's Encrypt) |
| **Total** | **~$16/mo** |

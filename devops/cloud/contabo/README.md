# Contabo VPS Deployment

## Recommended Plan
- **VPS**: Cloud VPS S (4 vCPU, 8GB RAM, 200GB SSD)
- **Cost**: ~$9/month
- **OS**: Ubuntu 22.04 LTS
- **Note**: Best price/performance ratio in the market

## Initial Setup

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# Install Docker Compose
apt install -y docker-compose

# Clone repository
git clone https://github.com/inomtechs/inomtechs-site /opt/inomtechs
cd /opt/inomtechs

# Environment
cp devops/security/.env.example .env.production
nano .env.production

# Deploy
docker compose -f devops/compose/docker-compose.yml up -d
```

## Backup Configuration
```bash
# Set up automated backups
bash devops/scripts/backup.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /opt/inomtechs/devops/scripts/backup.sh" | crontab -
```

## Cost Summary
| Item | Cost |
|------|------|
| VPS (Cloud VPS S) | $9/mo |
| Domain | $10/yr |
| SSL | Free (Let's Encrypt) |
| **Total** | **~$10/mo** |

## Performance Tuning
```bash
# Increase system limits for high traffic
echo -e "fs.file-max = 100000\nnet.core.somaxconn = 65535" >> /etc/sysctl.conf
sysctl -p
```

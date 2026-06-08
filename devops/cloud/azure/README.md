# Azure Deployment

## Architecture
- **Compute**: Azure Container Apps (serverless) or AKS (Kubernetes)
- **CDN**: Azure Front Door + CDN
- **DNS**: Azure DNS
- **SSL**: App Service Managed Certificate (free)
- **Monitoring**: Azure Monitor + Prometheus/Grafana
- **Backups**: Azure Blob Storage + lifecycle

## Recommended Setup

| Service | Tier | Monthly Cost |
|---------|------|-------------|
| Container Apps | Consumption × 2 | ~$35 |
| Front Door | Standard | ~$35 |
| Blob Storage | Hot LRS, 10GB | ~$1 |
| Azure DNS | 1 zone | ~$1 |
| Monitor | Pay-as-you-go | ~$5 |
| **Total** | | **~$77** |

## Deployment

```bash
# Deploy using Azure CLI
az containerapp update --name inomtechs --resource-group rg-inomtechs --image ghcr.io/inomtechs/inomtechs-site:latest
```

## Scaling
- Container Apps KEDA auto-scaling
- Min: 1 replica, Max: 10 replicas
- Scale based on HTTP request count

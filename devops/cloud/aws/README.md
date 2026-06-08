# AWS Deployment

## Architecture
- **Compute**: ECS Fargate (serverless containers) or EKS (Kubernetes)
- **CDN**: CloudFront + S3 origin
- **DNS**: Route 53
- **SSL**: AWS Certificate Manager (free)
- **Monitoring**: CloudWatch + Prometheus/Grafana
- **Backups**: S3 + lifecycle policies
- **WAF**: AWS WAF for DDoS protection

## Recommended Setup

| Service | Size | Monthly Cost |
|---------|------|-------------|
| ECS Fargate | 0.25 vCPU, 512MB × 2 tasks | ~$30 |
| Application Load Balancer | 1 ALB | ~$20 |
| CloudFront | 50GB transfer | ~$10 |
| S3 (assets + backups) | 10GB | ~$1 |
| Route 53 | 1 hosted zone | ~$0.50 |
| CloudWatch | Basic | ~$5 |
| **Total** | | **~$66.50** |

## Deployment

```bash
# Deploy using ECS CLI
aws ecs update-service --cluster inomtechs --service app --force-new-deployment

# Or Terraform
terraform apply -auto-approve
```

## Scaling
- ECS Service Auto Scaling (CPU > 70% → scale up)
- Min: 2 tasks, Max: 10 tasks
- CloudFront edge caching reduces origin load

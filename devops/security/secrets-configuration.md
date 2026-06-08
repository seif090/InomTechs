# =============================================================================
# GitHub Actions Secrets Configuration
# Add these secrets to your GitHub repository:
# Settings → Secrets and variables → Actions → New repository secret
# =============================================================================

# === Required Secrets ===
GEMINI_API_KEY            # Google Gemini AI API key
SSH_PRIVATE_KEY           # SSH key for deployment server access
STAGING_HOST              # Staging server hostname/IP
PRODUCTION_HOST           # Production server hostname/IP

# === Optional but recommended ===
SNYK_TOKEN                # Snyk API token for dependency scanning
SLACK_WEBHOOK_URL         # Slack webhook for deployment notifications
PAGERDUTY_ROUTING_KEY     # PagerDuty integration key
S3_BUCKET                 # S3 bucket name for backups
AWS_ACCESS_KEY_ID         # AWS credentials for backup upload
AWS_SECRET_ACCESS_KEY     # AWS credentials for backup upload
GRAFANA_ADMIN_USER        # Grafana admin username
GRAFANA_ADMIN_PASSWORD    # Grafana admin password

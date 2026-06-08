# =============================================================================
# Makefile — InomTechs DevOps convenience commands
# =============================================================================
.PHONY: dev build deploy staging prod logs clean help

# Load .env if present
ifneq (,$(wildcard .env.production))
    include .env.production
    export
endif

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ---------------------------------------------------------------------------
# Development
# ---------------------------------------------------------------------------
dev: ## Start dev environment with hot-reload
	docker compose -f devops/compose/docker-compose.dev.yml up -d

dev-down: ## Stop dev environment
	docker compose -f devops/compose/docker-compose.dev.yml down

dev-logs: ## Tail dev logs
	docker compose -f devops/compose/docker-compose.dev.yml logs -f

dev-shell: ## Open shell in dev container
	docker compose -f devops/compose/docker-compose.dev.yml exec app-dev sh

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
build: ## Build production Docker image
	docker build -f devops/docker/Dockerfile -t inomtechs-site:latest --target production .

build-local: ## Build locally (without Docker)
	npm ci && npm run build

# ---------------------------------------------------------------------------
# Production (single server)
# ---------------------------------------------------------------------------
prod: ## Start production services
	docker compose -f devops/compose/docker-compose.yml up -d

prod-down: ## Stop production services
	docker compose -f devops/compose/docker-compose.yml down

prod-logs: ## Tail production logs
	docker compose -f devops/compose/docker-compose.yml logs -f

prod-restart: ## Restart production services
	docker compose -f devops/compose/docker-compose.yml restart

prod-pull: ## Pull latest images
	docker compose -f devops/compose/docker-compose.yml pull

# ---------------------------------------------------------------------------
# Staging
# ---------------------------------------------------------------------------
staging: ## Start staging services
	docker compose -f devops/compose/docker-compose.staging.yml up -d

staging-down: ## Stop staging services
	docker compose -f devops/compose/docker-compose.staging.yml down

# ---------------------------------------------------------------------------
# Monitoring
# ---------------------------------------------------------------------------
monitoring: ## Start monitoring stack
	docker compose -f devops/compose/docker-compose.monitoring.yml up -d

monitoring-down: ## Stop monitoring stack
	docker compose -f devops/compose/docker-compose.monitoring.yml down

monitoring-logs: ## Tail monitoring logs
	docker compose -f devops/compose/docker-compose.monitoring.yml logs -f

# ---------------------------------------------------------------------------
# SSL
# ---------------------------------------------------------------------------
ssl: ## Setup/renew SSL certificates
	bash devops/scripts/setup-ssl.sh

# ---------------------------------------------------------------------------
# Backup & Restore
# ---------------------------------------------------------------------------
backup: ## Run production backup
	bash devops/scripts/backup.sh

restore: ## Restore from backup (usage: make restore FILE=<path>)
	bash devops/scripts/restore.sh $(FILE)

# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
health: ## Run health check
	bash devops/scripts/healthcheck.sh

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------
clean: ## Clean Docker resources
	docker system prune -af --volumes

clean-dangling: ## Remove dangling images
	docker image prune -f

# ---------------------------------------------------------------------------
# Deploy
# ---------------------------------------------------------------------------
deploy: ## Deploy to production
	bash devops/scripts/deploy.sh production

deploy-staging: ## Deploy to staging
	bash devops/scripts/deploy.sh staging

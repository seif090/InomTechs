# CI/CD Pipeline Documentation

## Overview

GitHub Actions workflow: `.github/workflows/ci-cd.yml`

Full pipeline: **11 stages**, end-to-end from commit to production.

## Pipeline Stages

### 1. Build
- **Trigger**: Every push & PR
- **Action**: `npm ci` + `npm run build`
- **Output**: Uploaded as artifact (retained 7 days)

### 2. Lint
- **Trigger**: After build
- **Action**: TypeScript type check (`tsc --noEmit`)
- **Gate**: Blocks merge on type errors

### 3. Unit Tests
- **Trigger**: After build
- **Action**: Vitest runner (add tests in `src/**/*.test.ts`)
- **Note**: Placeholder — add real tests

### 4. Integration Tests
- **Trigger**: After build
- **Action**: Preview server + Playwright E2E
- **Note**: Placeholder — configure Playwright

### 5. Security Scan
- **Trigger**: After build
- **Actions**:
  - `npm audit` — dependency vulnerabilities
  - **Snyk** — Snyk Open Source scan (if `SNYK_TOKEN` set)
  - **Trivy** — filesystem vulnerability scan (SARIF output)
  - **TruffleHog** — secret scanning
- **Results**: Uploaded to GitHub Security tab

### 6. Docker Build
- **Trigger**: After lint + tests + security (non-PR)
- **Action**: Multi-stage Docker build with BuildKit
- **Tags**: `latest`, `sha-<commit>`, `v<semver>`

### 7. Push Images
- **Trigger**: `main` branch only
- **Action**: Push to `ghcr.io/inomtechs/inomtechs-site`
- **Registry**: GitHub Container Registry (free)

### 8. Deploy Staging
- **Trigger**: After push
- **Action**: SSH into staging server → `docker compose pull && up -d`
- **Environment**: `staging.inomtechs.com`

### 9. Smoke Tests
- **Trigger**: After staging deploy
- **Checks**:
  - Health endpoint (HTTP 200)
  - Page content contains "InomTechs"

### 10. Manual Approval
- **Trigger**: After smoke tests pass
- **Action**: GitHub Environments approval gate
- **Approvers**: Repository admins/owners

### 11. Deploy Production
- **Trigger**: Approval granted
- **Action**: Pre-deploy backup → rolling update → post-deploy smoke test
- **Rollback**: Automatic on smoke test failure

## Branch Strategy

```
main        → Production (protected, requires PR)
develop     → Staging (auto-deploy)
release/*   → Staging (manual trigger)
feature/*   → Build + Lint + Tests only
```

## Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `GEMINI_API_KEY` | Google Gemini AI key |
| `SSH_PRIVATE_KEY` | Deploy server SSH key |
| `STAGING_HOST` | Staging server IP |
| `PRODUCTION_HOST` | Production server IP |
| `SNYK_TOKEN` | Snyk API token (optional) |
| `SLACK_WEBHOOK_URL` | Slack notifications (optional) |

## Manual Triggers

```bash
# Deploy specific environment via workflow_dispatch
gh workflow run "CI/CD Pipeline" --ref main -f environment=staging
```

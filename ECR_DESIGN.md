# ECR Repository Design - Single Repo Per Environment

## Repository Structure

### Two Repositories Total:
```
fintechops-dev
fintechops-prod
```

## Image Tagging Strategy

### Tag Format: `{service-name}:{version}-{git-commit}`

### Examples:
```
fintechops-dev:auth-backend-v1.0.0-abc1234
fintechops-dev:auth-frontend-v1.0.0-abc1234
fintechops-dev:payment-service-v1.2.3-def5678
fintechops-dev:account-service-v2.0.1-ghi9012

fintechops-prod:auth-backend-v1.0.0-abc1234
fintechops-prod:auth-frontend-v1.0.0-abc1234
fintechops-prod:payment-service-v1.2.3-def5678
```

### Latest Tags:
```
fintechops-dev:auth-backend-latest
fintechops-dev:payment-service-latest

fintechops-prod:auth-backend-latest
fintechops-prod:payment-service-latest
```

## Benefits

1. **Simple Management** - Only 2 repos to manage
2. **Cost Effective** - Reduced storage costs
3. **Easy Access Control** - One policy per environment
4. **Clear Separation** - Dev and Prod isolated

## Create Repositories

```bash
# Create DEV repository
aws ecr create-repository \
  --repository-name fintechops-dev \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Create PROD repository
aws ecr create-repository \
  --repository-name fintechops-prod \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256
```

## Lifecycle Policy

Keep last 20 images per service:

```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep last 20 images per service",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 20
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
```

Apply policy:
```bash
aws ecr put-lifecycle-policy \
  --repository-name fintechops-dev \
  --lifecycle-policy-text file://ecr-lifecycle-policy.json

aws ecr put-lifecycle-policy \
  --repository-name fintechops-prod \
  --lifecycle-policy-text file://ecr-lifecycle-policy.json
```

## Usage in Jenkins

All services push to same repo with different tags:
- auth-backend → `fintechops-dev:auth-backend-{version}`
- payment-service → `fintechops-dev:payment-service-{version}`
- account-service → `fintechops-dev:account-service-{version}`

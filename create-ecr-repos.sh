#!/bin/bash

AWS_REGION="us-east-1"

SERVICES=(
  "auth/auth-backend"
  "auth/auth-frontend"
  "auth/user-service"
  "payment/payment-processor"
  "payment/payment-gateway"
  "payment/payment-webhook"
  "account/account-service"
  "account/profile-service"
  "transaction/transaction-service"
  "transaction/ledger-service"
  "notification/email-service"
  "notification/sms-service"
  "notification/push-service"
  "analytics/reporting-service"
  "analytics/dashboard-service"
  "gateway/api-gateway"
  "gateway/admin-gateway"
  "common/config-service"
  "common/logging-service"
  "common/monitoring-service"
)

echo "Creating ECR repositories for FintechOps microservices..."

for service in "${SERVICES[@]}"; do
  echo "Creating repository: fintechops/$service"
  aws ecr create-repository \
    --repository-name "fintechops/$service" \
    --region $AWS_REGION \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256 \
    --tags Key=Project,Value=FintechOps Key=ManagedBy,Value=Script || echo "Repository already exists or error occurred"
done

echo "Applying lifecycle policies..."

for service in "${SERVICES[@]}"; do
  echo "Applying lifecycle policy to: fintechops/$service"
  aws ecr put-lifecycle-policy \
    --repository-name "fintechops/$service" \
    --region $AWS_REGION \
    --lifecycle-policy-text file://ecr-lifecycle-policy.json || echo "Failed to apply policy"
done

echo "Done! Created ${#SERVICES[@]} repositories."

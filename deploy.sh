#!/bin/bash

# Stop and remove old containers
docker stop auth-backend frontend market-data-backend news-backend 2>/dev/null || true
docker rm auth-backend frontend market-data-backend news-backend 2>/dev/null || true

# Create network if not exists
docker network create fintechops 2>/dev/null || true

# Pull latest images from ECR
docker pull 196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:auth-service-backend-latest
docker pull 196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:auth-service-frontend-latest
docker pull 196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:market-data-service-backend-latest
docker pull 196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:news-service-backend-latest

# Run auth backend
docker run -d --network fintechops --name auth-backend \
  -p 3000:3000 \
  -e AWS_REGION=ap-south-1 \
  -e COGNITO_USER_POOL_ID=us-east-1_LpJTIudpS \
  -e COGNITO_CLIENT_ID=6joqm59k47njd251dfrt25gvef \
  196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:auth-service-backend-latest

# Run market data backend
docker run -d --network fintechops --name market-data-backend \
  -p 4000:4000 \
  196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:market-data-service-backend-latest

# Run news backend
docker run -d --network fintechops --name news-backend \
  -p 5000:5000 \
  196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:news-service-backend-latest

# Run frontend
docker run -d --network fintechops --name frontend \
  -p 80:80 \
  196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:auth-service-frontend-latest

echo "✅ All services deployed!"
docker ps --filter "network=fintechops"

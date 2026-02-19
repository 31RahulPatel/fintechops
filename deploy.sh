#!/bin/bash

# FintechOps EC2 Deployment Script
set -e

echo "🚀 Deploying FintechOps to EC2"

# AWS ECR Login
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 196390795701.dkr.ecr.ap-south-1.amazonaws.com

# Stop and remove old containers
echo "🛑 Stopping old containers..."
docker stop auth-backend frontend market-data-backend news-backend 2>/dev/null || true
docker rm auth-backend frontend market-data-backend news-backend 2>/dev/null || true

# Create network if not exists
docker network create fintechops 2>/dev/null || true

# Pull latest images from ECR
echo "📥 Pulling latest images..."
docker pull 196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:auth-service-backend-latest
docker pull 196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:auth-service-frontend-latest
docker pull 196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:market-data-service-backend-latest
docker pull 196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:news-service-backend-latest

# Run auth backend
echo "🚀 Starting auth-backend..."
docker run -d --network fintechops --name auth-backend \
  -p 3000:3000 \
  -e AWS_REGION=us-east-1 \
  -e COGNITO_USER_POOL_ID=us-east-1_LpJTIudpS \
  -e COGNITO_CLIENT_ID=6joqm59k47njd251dfrt25gvef \
  196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:auth-service-backend-latest

# Run market data backend
echo "🚀 Starting market-data-backend..."
docker run -d --network fintechops --name market-data-backend \
  -p 4000:4000 \
  196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:market-data-service-backend-latest

# Run news backend
echo "🚀 Starting news-backend..."
docker run -d --network fintechops --name news-backend \
  -p 5000:5000 \
  196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:news-service-backend-latest

# Run frontend
echo "🚀 Starting frontend..."
docker run -d --network fintechops --name frontend \
  -p 80:80 \
  196390795701.dkr.ecr.ap-south-1.amazonaws.com/fintechops-dev:auth-service-frontend-latest

echo ""
echo "✅ All services deployed!"
echo ""
echo "📊 Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🌐 Access your application at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP')"
echo ""

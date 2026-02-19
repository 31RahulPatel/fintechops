#!/bin/bash

# FintechOps EKS Deployment Script

set -e

CLUSTER_NAME="infrafin-cluster"
REGION="us-east-1"
ECR_REGISTRY="196390795701.dkr.ecr.us-east-1.amazonaws.com"

echo "🚀 Starting FintechOps deployment to EKS..."

# Configure kubectl
echo "📝 Configuring kubectl..."
aws eks update-kubeconfig --name $CLUSTER_NAME --region $REGION

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Build and push Docker images
echo "🐳 Building and pushing Docker images..."

services=("auth-service" "market-data-service" "news-service" "calculator-service")

for service in "${services[@]}"; do
  echo "Building $service..."
  cd $service/backend
  docker build -t $ECR_REGISTRY/$service:latest .
  docker push $ECR_REGISTRY/$service:latest
  cd ../..
done

# Build and push frontend
echo "Building frontend..."
cd frontend
docker build -t $ECR_REGISTRY/frontend:latest .
docker push $ECR_REGISTRY/frontend:latest
cd ..

# Apply Kubernetes manifests
echo "☸️  Applying Kubernetes manifests..."

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/auth-service/deployment.yaml
kubectl apply -f k8s/market-data-service/deployment.yaml
kubectl apply -f k8s/news-service/deployment.yaml
kubectl apply -f k8s/calculator-service/deployment.yaml
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment --all -n fintechops

# Get ALB URL
echo "🌐 Getting ALB URL..."
sleep 30
ALB_URL=$(kubectl get ingress fintechops-ingress -n fintechops -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo "✅ Deployment complete!"
echo "🔗 Application URL: http://$ALB_URL"
echo ""
echo "📊 Check status:"
echo "  kubectl get pods -n fintechops"
echo "  kubectl get svc -n fintechops"
echo "  kubectl get ingress -n fintechops"

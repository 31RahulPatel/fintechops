#!/bin/bash

# FintechOps Kubernetes Deployment Script
set -e

echo "🚀 Deploying FintechOps to Kubernetes"

# 1. Create namespace
echo "📦 Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# 2. Create secrets
echo "🔐 Creating secrets..."
kubectl apply -f k8s/secrets.yaml

# 3. Create configmap
echo "⚙️  Creating configmap..."
kubectl apply -f k8s/configmap.yaml

# 4. Deploy backend services
echo "🚀 Deploying backend services..."
kubectl apply -f k8s/auth-service/deployment.yaml
kubectl apply -f k8s/market-data-service/deployment.yaml
kubectl apply -f k8s/news-service/deployment.yaml

# 5. Deploy frontend
echo "🎨 Deploying frontend..."
kubectl apply -f k8s/frontend/deployment.yaml

# 6. Create ingress
echo "🌐 Creating ingress..."
kubectl apply -f k8s/ingress-combined.yaml

# Wait for deployments
echo ""
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s \
  deployment/auth-service \
  deployment/market-data-service \
  deployment/news-service \
  deployment/frontend \
  -n fintechops

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Pod Status:"
kubectl get pods -n fintechops

echo ""
echo "🌐 Services:"
kubectl get svc -n fintechops

echo ""
echo "🔗 Ingress:"
kubectl get ingress -n fintechops

echo ""
echo "🌍 Get Load Balancer URL:"
echo "kubectl get ingress fintechops-all-ingress -n fintechops -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'"

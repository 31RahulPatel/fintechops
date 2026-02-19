#!/bin/bash

# Quick Deploy Script for FintechOps

set -e

ECR_REGISTRY="196390795701.dkr.ecr.us-east-1.amazonaws.com"
REGION="us-east-1"

echo "🚀 FintechOps Quick Deploy"
echo "=========================="

# Step 1: Update secrets
echo "📝 Step 1: Applying secrets and config..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Step 2: Apply ServiceMonitor
echo "📊 Step 2: Applying ServiceMonitor..."
kubectl apply -f k8s/servicemonitor.yaml

# Step 3: Setup ArgoCD Application
echo "🚀 Step 3: Setting up ArgoCD..."
echo "⚠️  Update argocd-app.yaml with your Git repo URL first!"
read -p "Have you updated argocd-app.yaml? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    kubectl apply -f argocd-app.yaml
    echo "✅ ArgoCD application created!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Push k8s/ folder to your Git repository"
    echo "  2. ArgoCD will automatically sync and deploy"
    echo ""
    echo "🔍 Monitor deployment:"
    echo "  kubectl get applications -n argocd"
    echo "  kubectl get pods -n fintechops -w"
else
    echo "❌ Please update argocd-app.yaml first"
    exit 1
fi

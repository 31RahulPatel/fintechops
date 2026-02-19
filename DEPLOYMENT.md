# FintechOps Deployment Guide

## Prerequisites
✅ Prometheus installed
✅ Grafana installed  
✅ ArgoCD installed
✅ EKS Cluster: infrafin-cluster
✅ RDS: infrafin-db.cy1oi4esixnv.us-east-1.rds.amazonaws.com

## Step 1: Update Secrets
```bash
# Edit k8s/secrets.yaml with your actual values
kubectl apply -f k8s/secrets.yaml
```

## Step 2: Build and Push Docker Images to ECR
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 196390795701.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repositories
aws ecr create-repository --repository-name auth-service --region us-east-1
aws ecr create-repository --repository-name market-data-service --region us-east-1
aws ecr create-repository --repository-name news-service --region us-east-1
aws ecr create-repository --repository-name calculator-service --region us-east-1
aws ecr create-repository --repository-name frontend --region us-east-1

# Build and push images
cd auth-service/backend
docker build -t 196390795701.dkr.ecr.us-east-1.amazonaws.com/auth-service:latest .
docker push 196390795701.dkr.ecr.us-east-1.amazonaws.com/auth-service:latest

cd ../../market-data-service/backend
docker build -t 196390795701.dkr.ecr.us-east-1.amazonaws.com/market-data-service:latest .
docker push 196390795701.dkr.ecr.us-east-1.amazonaws.com/market-data-service:latest

cd ../../news-service/backend
docker build -t 196390795701.dkr.ecr.us-east-1.amazonaws.com/news-service:latest .
docker push 196390795701.dkr.ecr.us-east-1.amazonaws.com/news-service:latest

cd ../../calculator-service/backend
docker build -t 196390795701.dkr.ecr.us-east-1.amazonaws.com/calculator-service:latest .
docker push 196390795701.dkr.ecr.us-east-1.amazonaws.com/calculator-service:latest

cd ../../frontend
docker build -t 196390795701.dkr.ecr.us-east-1.amazonaws.com/frontend:latest .
docker push 196390795701.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
```

## Step 3: Push k8s manifests to Git
```bash
# Initialize git repo (if not already)
git init
git add k8s/
git commit -m "Add Kubernetes manifests"
git remote add origin https://github.com/your-username/fintechops.git
git push -u origin main
```

## Step 4: Deploy with ArgoCD
```bash
# Update argocd-app.yaml with your Git repo URL
# Then apply:
kubectl apply -f argocd-app.yaml

# Check ArgoCD application status
kubectl get applications -n argocd

# Sync application (if not auto-synced)
argocd app sync fintechops
```

## Step 5: Verify Deployment
```bash
# Check pods
kubectl get pods -n fintechops

# Check services
kubectl get svc -n fintechops

# Check ingress and get ALB URL
kubectl get ingress -n fintechops
```

## Step 6: Configure Grafana Dashboards
```bash
# Get Grafana URL
kubectl get svc -n monitoring

# Login to Grafana (admin/admin123)
# Import Kubernetes dashboards:
# - Dashboard ID: 15760 (Kubernetes Views - Pods)
# - Dashboard ID: 15761 (Kubernetes Views - Nodes)
# - Dashboard ID: 13770 (Kubernetes Cluster Monitoring)
```

## Useful Commands
```bash
# Watch ArgoCD sync status
kubectl get applications -n argocd -w

# View ArgoCD logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-server

# Force sync
argocd app sync fintechops --force

# Rollback
argocd app rollback fintechops

# View application details
argocd app get fintechops

# Check Prometheus targets
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
# Visit: http://localhost:9090/targets
```

## Monitoring Endpoints
- Grafana: http://<grafana-lb-url>
- Prometheus: http://<prometheus-lb-url>:9090
- ArgoCD: http://<argocd-lb-url>
- Application: http://<alb-url>

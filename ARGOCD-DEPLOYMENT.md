# FintechOps ArgoCD Deployment Guide

## Step 1: Update ArgoCD Application Manifest

Edit `argocd-app.yaml` and replace `YOUR_USERNAME` with your GitHub username:
```yaml
repoURL: https://github.com/YOUR_USERNAME/Fintechops.git
```

## Step 2: Push K8s Manifests to GitHub

```bash
cd /Users/rahulpatel/Downloads/Fintechops

# Add all K8s files
git add k8s/ argocd-app.yaml

# Commit
git commit -m "Add Kubernetes manifests for ArgoCD deployment"

# Push to GitHub
git push origin main
```

## Step 3: Access ArgoCD UI

```bash
# Get ArgoCD admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
echo

# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:80
```

Open browser: `http://localhost:8080`
- Username: `admin`
- Password: (from command above)

## Step 4: Deploy via ArgoCD

### Option A: Using ArgoCD UI
1. Login to ArgoCD UI
2. Click "New App"
3. Fill in:
   - Application Name: `fintechops`
   - Project: `default`
   - Sync Policy: `Automatic`
   - Repository URL: `https://github.com/YOUR_USERNAME/Fintechops.git`
   - Revision: `main`
   - Path: `k8s`
   - Cluster: `https://kubernetes.default.svc`
   - Namespace: `fintechops`
4. Click "Create"
5. Click "Sync"

### Option B: Using kubectl (Recommended)

```bash
# Apply ArgoCD Application
kubectl apply -f argocd-app.yaml

# Watch deployment
kubectl get app -n argocd
kubectl get pods -n fintechops -w
```

## Step 5: Verify Deployment

```bash
# Check ArgoCD app status
kubectl get app fintechops -n argocd

# Check pods
kubectl get pods -n fintechops

# Check services
kubectl get svc -n fintechops

# Check ingress
kubectl get ingress -n fintechops

# Get Load Balancer URL
kubectl get ingress fintechops-all-ingress -n fintechops -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

## Step 6: Access Application

```bash
# Get ALB URL
ALB_URL=$(kubectl get ingress fintechops-all-ingress -n fintechops -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Application URL: http://$ALB_URL"
```

Open browser: `http://YOUR_ALB_URL`

## ArgoCD Sync Modes

### Automatic Sync (Configured)
- ArgoCD automatically syncs when Git changes
- Self-healing enabled (auto-fixes drift)
- Just push to Git and ArgoCD deploys!

### Manual Sync
```bash
# Sync via CLI
argocd app sync fintechops

# Or via UI: Click "Sync" button
```

## Update Application

```bash
# 1. Make changes to code
# 2. Push to GitHub (Jenkins builds new images)
# 3. ArgoCD auto-detects and syncs (if using :latest tag)

# Or manually trigger sync
kubectl patch app fintechops -n argocd --type merge -p '{"metadata":{"annotations":{"argocd.argoproj.io/refresh":"hard"}}}'
```

## Troubleshooting

### Check ArgoCD app status
```bash
kubectl describe app fintechops -n argocd
```

### Check pod logs
```bash
kubectl logs -f deployment/auth-service -n fintechops
kubectl logs -f deployment/market-data-service -n fintechops
kubectl logs -f deployment/news-service -n fintechops
kubectl logs -f deployment/frontend -n fintechops
```

### Force sync
```bash
kubectl delete app fintechops -n argocd
kubectl apply -f argocd-app.yaml
```

### Check ingress
```bash
kubectl describe ingress fintechops-all-ingress -n fintechops
```

## Clean Up

```bash
# Delete application (keeps ArgoCD)
kubectl delete app fintechops -n argocd

# Delete namespace
kubectl delete namespace fintechops
```

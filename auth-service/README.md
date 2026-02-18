# Auth Service - Microservice Architecture

## Architecture Overview
- **Frontend**: React.js with AWS Cognito authentication
- **Backend**: Node.js/Express API
- **Database**: AWS RDS PostgreSQL
- **Authentication**: AWS Cognito
- **Deployment**: AWS EKS with ALB

## Prerequisites
1. AWS EKS cluster running
2. AWS ALB Ingress Controller installed
3. AWS Cognito User Pool created
4. AWS RDS PostgreSQL instance
5. ECR repositories for Docker images
6. ACM certificate for HTTPS

## Setup Instructions

### 1. Database Setup
```bash
# Connect to RDS and run schema
psql -h <rds-endpoint> -U <username> -d authdb -f backend/schema.sql
```

### 2. Build and Push Docker Images
```bash
# Backend
cd backend
docker build -t <account-id>.dkr.ecr.<region>.amazonaws.com/auth-backend:latest .
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/auth-backend:latest

# Frontend
cd ../frontend
docker build -t <account-id>.dkr.ecr.<region>.amazonaws.com/auth-frontend:latest .
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/auth-frontend:latest
```

### 3. Update Kubernetes Manifests
Update the following in k8s files:
- `configmap.yaml`: Cognito User Pool ID, Client ID
- `secret.yaml`: RDS credentials
- `ingress.yaml`: ACM certificate ARN, Cognito User Pool ARN, domain
- `backend-deployment.yaml` & `frontend-deployment.yaml`: ECR image URIs

### 4. Deploy to EKS
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/serviceaccount.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### 5. Verify Deployment
```bash
kubectl get pods
kubectl get svc
kubectl get ingress
kubectl logs -f deployment/auth-backend
```

## API Endpoints

### Backend (via ALB)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/confirm` - Confirm email
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile (authenticated)
- `GET /health` - Health check

## Environment Variables

### Backend
See `backend/.env.example`

### Frontend
See `frontend/.env.example`

## ALB + Cognito Integration
The ALB is configured with Cognito authentication at the ingress level, providing an additional layer of security before requests reach the backend services.

## Monitoring
- CloudWatch Logs for application logs
- ALB access logs
- EKS cluster metrics
- RDS performance insights

# Deployment Checklist

## ✅ Pre-Deployment Verification

### Backend Services

#### Market Data Service
- [ ] `cd market-data-service/backend && npm install`
- [ ] `npm start` - Verify runs on port 4000
- [ ] Test: `curl http://localhost:4000/health`
- [ ] Test: `curl http://localhost:4000/api/market/indices`
- [ ] Test: `curl http://localhost:4000/api/market/stocks`
- [ ] Docker build: `docker build -t market-data-service .`
- [ ] Docker run: `docker run -p 4000:4000 market-data-service`

#### News Service
- [ ] `cd news-service/backend && npm install`
- [ ] `npm start` - Verify runs on port 5000
- [ ] Test: `curl http://localhost:5000/health`
- [ ] Test: `curl http://localhost:5000/api/news/india`
- [ ] Test: `curl http://localhost:5000/api/news/trending`
- [ ] Docker build: `docker build -t news-service .`
- [ ] Docker run: `docker run -p 5000:5000 news-service`

### Frontend

#### Environment Setup
- [ ] Create `.env` file in `auth-service/frontend/`
- [ ] Add `REACT_APP_MARKET_API_URL=http://localhost:4000/api/market`
- [ ] Add `REACT_APP_NEWS_API_URL=http://localhost:5000/api/news`
- [ ] Add Cognito credentials (USER_POOL_ID, CLIENT_ID)

#### Build & Test
- [ ] `cd auth-service/frontend && npm install`
- [ ] `npm start` - Verify runs on port 3001
- [ ] Open `http://localhost:3001`
- [ ] Test login flow
- [ ] Verify redirect to `/home` after login
- [ ] Check market indices auto-refresh (5s)
- [ ] Test all news tabs
- [ ] Verify responsive design on mobile
- [ ] Test all navigation links

## 🐳 Docker Deployment

### Build All Images
```bash
# Market Data Service
cd market-data-service/backend
docker build -t fintechops-market-data:latest .

# News Service
cd news-service/backend
docker build -t fintechops-news:latest .

# Auth Backend
cd auth-service/backend
docker build -t fintechops-auth-backend:latest .

# Frontend
cd auth-service/frontend
docker build -t fintechops-frontend:latest .
```

### Run Containers
```bash
docker run -d -p 4000:4000 --name market-data fintechops-market-data:latest
docker run -d -p 5000:5000 --name news fintechops-news:latest
docker run -d -p 3000:3000 --name auth-backend fintechops-auth-backend:latest
docker run -d -p 3001:80 --name frontend fintechops-frontend:latest
```

### Verify Containers
```bash
docker ps
docker logs market-data
docker logs news
docker logs auth-backend
docker logs frontend
```

## 🚀 Jenkins Pipeline

### Update Jenkinsfile
- [ ] Add market-data-service to SERVICE parameter
- [ ] Add news-service to SERVICE parameter
- [ ] Update ECR repository names if needed

### Run Pipeline
- [ ] Select service: `market-data-service`
- [ ] Select environment: `dev`
- [ ] Run build
- [ ] Verify SonarQube analysis passes
- [ ] Verify Trivy scan completes
- [ ] Verify ECR push successful

- [ ] Select service: `news-service`
- [ ] Select environment: `dev`
- [ ] Run build
- [ ] Verify all stages pass

- [ ] Select service: `auth-service`
- [ ] Select environment: `dev`
- [ ] Run build (includes frontend)
- [ ] Verify all stages pass

## ☁️ AWS Deployment

### ECR Setup
- [ ] Create ECR repositories:
  - `fintechops-dev/market-data-service`
  - `fintechops-dev/news-service`
- [ ] Update ECR lifecycle policies
- [ ] Verify IAM permissions

### ECS/EKS Deployment
- [ ] Update task definitions
- [ ] Configure service discovery
- [ ] Set up load balancers
- [ ] Configure auto-scaling
- [ ] Update security groups
- [ ] Set environment variables

### DNS & SSL
- [ ] Configure Route 53
- [ ] Set up SSL certificates
- [ ] Update CORS origins
- [ ] Configure CloudFront (optional)

## 🔒 Security Checklist

- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] CORS properly configured
- [ ] JWT tokens secured
- [ ] HTTPS enabled in production
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented

## 📊 Monitoring Setup

- [ ] CloudWatch logs enabled
- [ ] Application metrics configured
- [ ] Error tracking setup (Sentry/Rollbar)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Cost monitoring

## 🧪 Post-Deployment Testing

### Smoke Tests
- [ ] Health endpoints respond
- [ ] Login/Signup works
- [ ] Dashboard loads
- [ ] Market data displays
- [ ] News feed loads
- [ ] All tabs functional
- [ ] Mobile responsive
- [ ] No console errors

### Load Testing
- [ ] Test concurrent users
- [ ] Verify auto-scaling
- [ ] Check response times
- [ ] Monitor error rates

### Integration Tests
- [ ] Frontend → Market Data Service
- [ ] Frontend → News Service
- [ ] Frontend → Auth Service
- [ ] All API endpoints working

## 📝 Documentation

- [ ] Update README with production URLs
- [ ] Document API endpoints
- [ ] Create runbook for operations
- [ ] Document troubleshooting steps
- [ ] Update architecture diagrams

## 🎯 Go-Live Checklist

- [ ] All services deployed
- [ ] DNS configured
- [ ] SSL certificates active
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Team notified
- [ ] Rollback plan ready
- [ ] Support team briefed

## 🔄 Post-Launch

- [ ] Monitor logs for errors
- [ ] Check performance metrics
- [ ] Verify user feedback
- [ ] Plan next iteration
- [ ] Document lessons learned

---

## Quick Commands Reference

### Start All Services Locally
```bash
# Terminal 1 - Market Data
cd market-data-service/backend && npm start

# Terminal 2 - News
cd news-service/backend && npm start

# Terminal 3 - Auth Backend
cd auth-service/backend && npm start

# Terminal 4 - Frontend
cd auth-service/frontend && npm start
```

### Stop All Docker Containers
```bash
docker stop market-data news auth-backend frontend
docker rm market-data news auth-backend frontend
```

### View Logs
```bash
# Service logs
docker logs -f market-data
docker logs -f news

# Application logs
tail -f market-data-service/backend/logs/app.log
tail -f news-service/backend/logs/app.log
```

### Emergency Rollback
```bash
# Revert to previous ECR image tag
aws ecs update-service --cluster fintechops --service market-data --force-new-deployment --task-definition market-data:previous
```

---

**Last Updated**: February 19, 2026
**Status**: Ready for Deployment

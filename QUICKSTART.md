# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Terminal 1 - Market Data Service
cd market-data-service/backend
npm install

# Terminal 2 - News Service
cd news-service/backend
npm install

# Terminal 3 - Frontend
cd auth-service/frontend
npm install
```

### Step 2: Start Services

```bash
# Terminal 1 - Market Data Service (Port 4000)
cd market-data-service/backend
npm start

# Terminal 2 - News Service (Port 5000)
cd news-service/backend
npm start

# Terminal 3 - Auth Service Backend (Port 3000)
cd auth-service/backend
npm start

# Terminal 4 - Frontend (Port 3001)
cd auth-service/frontend
npm start
```

### Step 3: Access Application

Open browser: `http://localhost:3001`

1. **Sign Up** - Create new account
2. **Confirm** - Enter confirmation code from email
3. **Login** - Use credentials
4. **Dashboard** - Redirects to `/home` with full dashboard

## 🧪 Test Endpoints

### Market Data Service
```bash
curl http://localhost:4000/api/market/indices
curl http://localhost:4000/api/market/stocks
curl http://localhost:4000/health
```

### News Service
```bash
curl http://localhost:5000/api/news/india
curl http://localhost:5000/api/news/trending
curl http://localhost:5000/health
```

## 🐳 Docker Quick Start

```bash
# Build all services
docker build -t market-data-service ./market-data-service/backend
docker build -t news-service ./news-service/backend

# Run services
docker run -d -p 4000:4000 market-data-service
docker run -d -p 5000:5000 news-service
```

## 📝 Notes

- Mock data is used for all services
- Market indices auto-refresh every 5 seconds
- Premium features are locked (UI only)
- All services are production-ready for deployment

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Kill process on port
lsof -ti:4000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

**CORS errors?**
- Ensure all services are running
- Check REACT_APP_*_API_URL in frontend .env

**Authentication issues?**
- Verify Cognito credentials in frontend .env
- Check auth-service backend is running

## 🎯 Next Steps

1. Replace mock data with real APIs
2. Add more features (Portfolio, Watchlist)
3. Deploy to AWS
4. Set up monitoring

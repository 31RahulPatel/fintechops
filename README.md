# FintechOps - Financial Dashboard Platform

Complete financial platform with microservices architecture, real-time market data, news, and premium features.

## 🏗️ Architecture

```
Fintechops/
├── auth-service/
│   ├── backend/          # Authentication service
│   └── frontend/         # React SPA (shared across all services)
├── market-data-service/
│   └── backend/          # Market data API
├── news-service/
│   └── backend/          # News API
└── Jenkinsfile           # CI/CD pipeline
```

## 🚀 Services

### 1. Auth Service
- **Backend**: Port 3000
- **Frontend**: Port 3001
- AWS Cognito authentication
- Login/Signup/Confirmation flows

### 2. Market Data Service
- **Backend**: Port 4000
- Real-time market indices
- Stock data (gainers, losers, Nifty 50)
- Commodities, currencies, bonds
- IPO information

### 3. News Service
- **Backend**: Port 5000
- India, Global, Tech news
- Personal finance, Politics
- Trending news

## 🎨 Frontend Features

### Home Dashboard
- **Live Market Indices Bar** - Auto-refreshes every 5 seconds
- **News Feed** - Tabbed interface with 6 categories
- **Stock Lists** - Pro stocks (premium), Top gainers/losers, Mutual funds
- **Market Overview** - Commodities, Currencies, Bonds
- **IPO Section** - Upcoming IPOs with subscription status
- **Newsletter Subscription**
- **Responsive Design** - Mobile, tablet, desktop

### Design System
- **Font**: Poppins (Google Fonts)
- **Colors**: Professional fintech theme (blue/green)
- **Fully Responsive**: Mobile-first approach
- **Accessibility**: ARIA labels included

## 🛠️ Tech Stack

### Backend
- Node.js 18
- Express.js
- CORS enabled
- Docker containerized

### Frontend
- React 18
- React Router v6
- Axios
- CSS3 (no external UI libraries)

### DevOps
- Jenkins CI/CD
- SonarQube code analysis
- Trivy security scanning
- AWS ECR
- Docker

## 📦 Installation

### Prerequisites
- Node.js 18+
- Docker
- AWS Account (for Cognito)

### Backend Services

```bash
# Market Data Service
cd market-data-service/backend
npm install
npm start

# News Service
cd news-service/backend
npm install
npm start

# Auth Service Backend
cd auth-service/backend
npm install
npm start
```

### Frontend

```bash
cd auth-service/frontend
npm install
npm start
```

## 🔧 Environment Variables

### Market Data Service (.env)
```
PORT=4000
NODE_ENV=development
```

### News Service (.env)
```
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_MARKET_API_URL=http://localhost:4000/api/market
REACT_APP_NEWS_API_URL=http://localhost:5000/api/news
REACT_APP_COGNITO_USER_POOL_ID=your_pool_id
REACT_APP_COGNITO_CLIENT_ID=your_client_id
```

## 🐳 Docker

### Build Images

```bash
# Market Data Service
cd market-data-service/backend
docker build -t market-data-service .

# News Service
cd news-service/backend
docker build -t news-service .
```

### Run Containers

```bash
docker run -p 4000:4000 market-data-service
docker run -p 5000:5000 news-service
```

## 🚢 CI/CD Pipeline

Jenkins pipeline includes:
1. **Checkout** - Git repository
2. **SonarQube Analysis** - Code quality
3. **Quality Gate** - Pass/fail criteria
4. **Build Images** - Docker images
5. **Trivy Scan** - Security vulnerabilities
6. **Push to ECR** - AWS container registry
7. **Cleanup** - Remove local images

### Pipeline Parameters
- `SERVICE`: auth-service, market-data-service, news-service, all
- `ENVIRONMENT`: dev, staging, prod

## 📱 API Endpoints

### Market Data Service (Port 4000)
```
GET /api/market/indices      - Market indices
GET /api/market/stocks       - Stock data
GET /api/market/commodities  - Commodities
GET /api/market/currencies   - Currencies
GET /api/market/bonds        - Bonds
GET /api/market/ipos         - IPOs
GET /health                  - Health check
```

### News Service (Port 5000)
```
GET /api/news/india          - India news
GET /api/news/global         - Global news
GET /api/news/tech           - Technology news
GET /api/news/finance        - Personal finance
GET /api/news/politics       - Politics news
GET /api/news/trending       - Trending news
GET /health                  - Health check
```

## 🎯 Features

### Implemented
✅ Authentication (Cognito)
✅ Market data API with mock data
✅ News API with mock data
✅ Responsive dashboard
✅ Live market indices
✅ Stock lists (gainers, losers, Nifty 50)
✅ News feed with tabs
✅ Premium features (locked)
✅ IPO section
✅ Newsletter subscription
✅ Protected routes
✅ CI/CD pipeline

### Coming Soon
🔜 Real API integration
🔜 Portfolio management
🔜 Watchlist
🔜 Premium subscription
🔜 Advanced charts
🔜 Alerts & notifications

## 🔐 Security

- JWT authentication
- Protected routes
- CORS configured
- Trivy vulnerability scanning
- SonarQube code analysis
- Environment variables for secrets

## 📄 License

© 2026 FintechOps. All rights reserved.

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For issues and questions, please open a GitHub issue.

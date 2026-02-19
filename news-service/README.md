# News Service

Microservice providing financial news for FintechOps platform.

## Features
- India news
- Global news
- Technology news
- Personal finance news
- Politics news
- Trending news

## Tech Stack
- Node.js
- Express.js
- CORS enabled

## Setup

```bash
cd backend
npm install
npm start
```

Server runs on port 5000.

## API Endpoints

- `GET /api/news/india` - India news
- `GET /api/news/global` - Global news
- `GET /api/news/tech` - Technology news
- `GET /api/news/finance` - Personal finance news
- `GET /api/news/politics` - Politics news
- `GET /api/news/trending` - Trending news
- `GET /health` - Health check

## Docker

```bash
docker build -t news-service .
docker run -p 5000:5000 news-service
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

# Market Data Service

Microservice providing real-time market data for FintechOps platform.

## Features
- Live market indices (Nifty 50, Sensex, Bank Nifty, etc.)
- Stock data (Top gainers, losers, Nifty 50 stocks)
- Commodities prices (Gold, Silver, Crude Oil)
- Currency exchange rates
- Bond yields
- IPO information

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

Server runs on port 4000.

## API Endpoints

- `GET /api/market/indices` - Market indices
- `GET /api/market/stocks` - Stock data
- `GET /api/market/commodities` - Commodities
- `GET /api/market/currencies` - Currencies
- `GET /api/market/bonds` - Bonds
- `GET /api/market/ipos` - IPOs
- `GET /health` - Health check

## Docker

```bash
docker build -t market-data-service .
docker run -p 4000:4000 market-data-service
```

## Environment Variables

- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)

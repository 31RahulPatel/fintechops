# Frontend Service

React-based frontend for FintechOps platform.

## Port
- **Frontend**: 80 (nginx)

## Features
- Authentication UI
- Dashboard with market data
- News feed
- Stock lists
- IPO section
- Responsive design

## Build
```bash
npm install
npm run build
```

## Docker
```bash
docker build -t frontend .
docker run -p 80:80 frontend
```

#rahul
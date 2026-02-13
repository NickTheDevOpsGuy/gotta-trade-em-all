# Gotta Trade 'Em All (TradeDex)

A React-based trading game inspired by collectible monster card mechanics. Build your collection, add cards from the catalog, and trade to complete your set.

[![Build](https://github.com/YOUR_ORG/gotta-trade-em-all/actions/workflows/build.yml/badge.svg)](https://github.com/YOUR_ORG/gotta-trade-em-all/actions)

## Features

- **Card catalog** — Browse all available cards (common, rare, epic)
- **Add to collection** — One-click add any card from the catalog to your inventory
- **Trade cards** — Select cards from your collection and trade for new ones based on value
- **Quantity tracking** — Duplicate cards are tracked; trade or add more to grow your collection

## Tech Stack

| Layer    | Tech                     |
| -------- | ------------------------ |
| Frontend | React 18, TypeScript, Vite |
| Backend  | Node.js, Express, TypeScript |
| Database | SQLite (better-sqlite3)   |

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_ORG/gotta-trade-em-all.git
cd gotta-trade-em-all

# Install dependencies (from project root)
npm install
```

### Development

Run both frontend and backend together:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 — Backend API (port 3001)
npm run dev:backend

# Terminal 2 — Frontend (port 5173)
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

This builds:
- **Backend** → `backend/dist/`
- **Frontend** → `frontend/dist/`

Run the backend:

```bash
cd backend && npm start
```

Serve the frontend `dist/` with any static file server (e.g. `npx serve frontend/dist`).

## Project Structure

```
gotta-trade-em-all/
├── backend/
│   ├── db/
│   │   └── schema.sql      # Database schema & seed data
│   └── src/
│       ├── index.ts        # Express app
│       ├── db.ts           # SQLite connection
│       └── routes/
│           ├── cards.ts    # Card catalog API
│           └── inventory.ts # Collection & trade API
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── types/
│   │   └── components/
│   └── index.html
├── docs/                   # Additional documentation
└── .github/workflows/      # CI/CD
```

## API Reference

See [docs/API.md](docs/API.md) for full API documentation.

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| GET    | `/api/cards`       | List all cards in catalog  |
| GET    | `/api/inventory`   | List your collection       |
| POST   | `/api/inventory`   | Add a card to collection   |
| POST   | `/api/inventory/trade` | Trade cards for new ones |

## Documentation

- [API Reference](docs/API.md) — Endpoints and request/response formats
- [Architecture](docs/ARCHITECTURE.md) — System design and data flow
- [Contributing](docs/CONTRIBUTING.md) — How to contribute
- [Database Schema](docs/DATABASE.md) — Tables and relationships

## License

MIT

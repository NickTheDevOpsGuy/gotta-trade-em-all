# Architecture

## Overview

TradeDex is a client-server application:

```
┌─────────────────┐         ┌─────────────────┐
│   React SPA     │  HTTP   │  Express API     │
│   (Vite)        │ ◀─────▶ │  (Node.js)       │
│   Port 5173     │         │  Port 3001       │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  SQLite DB      │
                            │  (better-sqlite3)│
                            └─────────────────┘
```

## Data Flow

1. **Catalog** — Cards are stored in the `cards` table (seed data). The frontend fetches them for display.
2. **Collection** — User inventory is in the `inventory` table (card_id, quantity). Adding a card increments quantity or inserts a new row.
3. **Trade** — User offers card IDs; backend deducts from inventory, selects cards from the pool by value, and adds them to inventory.

## Frontend

- **App.tsx** — Main orchestrator; fetches catalog and inventory, handles add/trade.
- **CardGrid** — Renders cards in a grid; supports modes: `display`, `add` (catalog), `trade` (collection selection).
- **CardView** — Single card UI; shows quantity, rarity color, and action buttons based on mode.

## Backend

- **index.ts** — Express app with CORS and JSON middleware.
- **db.ts** — SQLite connection; runs schema on load.
- **routes/cards.ts** — GET catalog.
- **routes/inventory.ts** — GET collection, POST add, POST trade.

## Database

See [DATABASE.md](DATABASE.md) for schema details.

# Database Schema

TradeDex uses SQLite via `better-sqlite3`. The database file is `backend/db/game.db` (created on first run).

## Tables

### cards

The catalog of all available cards.

| Column | Type    | Description                |
| ------ | ------- | -------------------------- |
| id     | TEXT    | Primary key (e.g. "001")   |
| name   | TEXT    | Card name                  |
| rarity | TEXT    | common, rare, or epic      |
| value  | INTEGER | Trade value (1, 3, or 6)   |

### inventory

User's card collection.

| Column   | Type    | Description                |
| -------- | ------- | -------------------------- |
| id       | INTEGER | Auto-increment primary key |
| card_id  | TEXT    | FK to cards.id             |
| quantity | INTEGER | How many of this card      |

Rows with `quantity <= 0` are cleaned up after trades.

## Seed Data

Initial cards:

- **Common** (value 1): Leafling, Flametail, Aquabat
- **Rare** (value 3): Stonehog, Voltwing
- **Epic** (value 6): Drakono

Initial inventory includes one each of Leafling, Flametail, and Stonehog.

## Schema File

The schema and seed data live in `backend/db/schema.sql` and are applied on server startup via `db.ts`.

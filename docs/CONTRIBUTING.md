# Contributing

Thanks for considering contributing to TradeDex.

## Development Setup

1. Fork and clone the repo.
2. `npm install` from the project root.
3. `npm run dev` to start frontend and backend.
4. Make your changes.

## Code Style

- **TypeScript** — Strict mode enabled; avoid `any`.
- **Formatting** — Use consistent 2-space indent.
- **Components** — Functional components with hooks; keep components focused.

## Pull Requests

1. Branch from `develop` (or `main`).
2. Ensure `npm run build` succeeds.
3. Open a PR with a clear description of changes.
4. The GitHub Action will run the build on push.

## Adding New Cards

Edit `backend/db/schema.sql` and add rows to the `INSERT OR IGNORE INTO cards` statement, or create a migration script that appends to the catalog.

## Testing

Run the build before submitting:

```bash
npm run build
```

Manual testing: add cards, trade, verify inventory updates correctly.

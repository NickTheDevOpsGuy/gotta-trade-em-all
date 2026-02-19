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

## Testing

Run tests before submitting:

```bash
npm run test      # Unit tests (Vitest)
npm run test:e2e  # E2E tests (Playwright; starts dev server automatically; requires .env with Supabase vars)
npm run build     # Full build (frontend)
```

The CI workflow runs `npm run test` and builds the frontend on push.

## Pull Requests

1. Branch from `develop` (or `main`).
2. Ensure `npm run test` and `npm run build` succeed.
3. Open a PR with a clear description of changes.
4. The GitHub Action will run tests and build on push.

## Adding New Cards

Edit `backend/db/schema.sql` and add rows to the `INSERT OR IGNORE INTO cards` statement, or create a Supabase migration that appends to the catalog.

## Security

Run `npm audit` before releases. Some vulnerabilities may be in transitive dependencies (Vercel, Vite, etc.); these require upstream updates. Avoid `npm audit fix --force` unless you are prepared to handle breaking changes.

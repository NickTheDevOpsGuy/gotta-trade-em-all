# Contributing

Thanks for considering contributing to TradeDex.

## Development Setup

1. Fork and clone the repo.
2. `npm install` from the project root (required — the prepare script configures Husky pre-commit hooks).
3. `npm run dev` to start frontend and backend.
4. Make your changes.

If Git hooks don't run on commit, run `npm run husky:setup` from the project root.

## Code Style

- **TypeScript** — Strict mode enabled; avoid `any`.
- **Lint** — Run `npm run lint` (or `npm run lint:fix`) before committing.
- **Format** — Run `npm run format` (or `npm run format:check`) before committing.
- **Components** — Functional components with hooks; keep components focused.

## Testing

Run tests before submitting:

```bash
npm run lint      # Lint (or lint:fix for auto-fix)
npm run format    # Format (or format:check to verify)
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

Run `npm audit` before releases. The project uses `overrides` in `package.json` to fix high-severity transitive vulns (minimatch, tar, path-to-regexp, undici, esbuild). The ajv override is omitted because it breaks ESLint; moderate ajv vulns remain until upstream fixes.

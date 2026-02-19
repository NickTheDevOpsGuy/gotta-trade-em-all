# Staging / Preview Deployments

## Vercel

By default, Vercel creates a unique preview URL for each branch/PR (e.g. `gotta-trade-em-all-abc123.vercel.app`). Use these for staging.

### Separate staging project (optional)

1. Create a second Vercel project (e.g. `tradedex-staging`).
2. Connect it to the same repo.
3. Set **Production Branch** to `develop` (or `staging`).
4. Use this project for pre-production testing.
5. Keep the main project for `main` → production.

### Environment variables

Staging can use the same Supabase project or a separate one:

- **Same Supabase** — Use a separate schema or database for staging data.
- **Separate Supabase** — Create a staging project and use its keys in the staging Vercel project.

## Local preview with production build

```bash
npm run build:frontend
cd frontend && npm run preview
```

Open http://localhost:4173 and point `.env` to staging Supabase if needed.

## Health check CI

The [Health Check workflow](../../.github/workflows/health-check.yml) pings `/api/health` to verify deployments. Run it manually: **Actions → Health Check → Run workflow**, then enter your deploy URL (e.g. `https://gotta-trade-em-all.vercel.app`).

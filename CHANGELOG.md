# Changelog

All notable changes to this project will be documented in this file.

## [1.4.4] - 2025-02-17

### Added
- CI: lint and format:check in build workflow
- .vscode/settings.json (format on save, ESLint)
- .vscode/extensions.json (recommended ESLint + Prettier)
- ESLint + Prettier for backend and api workspaces
- Root scripts: lint, lint:fix, format, format:check run across all workspaces
- README Lint & Format section

### Changed
- Removed unused `db` import from backend/src/index.ts

## [1.4.3] - 2025-02-17

### Changed
- npm overrides: reduced high-severity vulns to 0 (minimatch, tar, path-to-regexp, undici, esbuild). ajv omitted (breaks ESLint); 12 moderate remain
- Removed eslint-plugin-react-refresh (required ESLint 9, conflicted with ESLint 8)

## [1.4.2] - 2025-02-17

### Changed
- Added npm `overrides` to fix transitive vulnerabilities (minimatch, tar, path-to-regexp, undici, esbuild) without breaking changes

## [1.4.1] - 2025-02-17

### Added
- MIT LICENSE file
- Permissions-Policy header (camera, microphone, geolocation disabled) in vercel.json
- Health check workflow docs in STAGING.md
- Security section in CONTRIBUTING (npm audit guidance)

### Changed
- CONTRIBUTING: E2E tests start dev server automatically

## [1.4.0] - 2025-02-17

### Added
- High-contrast theme (cycle: dark → light → high-contrast → dark)
- Share URL with LZString compression (`/share#compressed`)
- Bundle analyzer script: `npm run build:analyze` in frontend
- og-image.png (1200×630) for social previews
- Renovate config (Dependabot removed to avoid duplicate PRs)

### Changed
- Theme applied in HTML head before React to prevent flash of wrong theme
- README: themes list, screenshot, dependency update notes
- E2E tests: wait for app load (30s timeout) before assertions; require Supabase env vars

## [1.3.0] - 2025-02-17

### Added
- Skip-to-content link for keyboard users
- Focus-visible styles (`:focus-visible` outline)
- robots.txt and sitemap.xml
- og:image and Twitter card meta tags
- Offline banner when navigator.onLine is false
- Retry with exponential backoff (fetchWithRetry) for API calls
- Onboarding modal on first visit
- Help modal (press ? or click ? button)
- Husky pre-commit hook with lint-staged (typecheck + test on staged frontend files)
- Dependabot config for weekly npm updates

## [1.2.0] - 2025-02-17

### Added
- Accessibility: aria-labels, keyboard nav (Enter/Space on cards), role="main", aria-labelledby
- 401 handling: "Session expired. Refresh to continue." banner with refresh button
- Share: "Copied!" feedback, button disabled for 2s after copy
- Unit test: searchCards "no match returns empty"
- Version in footer (from package.json)
- i18n prep: `frontend/src/lib/i18n.ts` with extracted strings
- Lighthouse script: `npm run lighthouse` (run preview first)
- Haptic feedback: vibrate on add, trade, click (mobile)
- Confirmation dialog for Import
- Undo: button to undo last add (DELETE /api/inventory)
- WCAG contrast: dark text on accent buttons for better readability

## [1.1.0] - 2025-02-17

### Added
- Export/import loading states
- Share collection link (copy URL with collection encoded)
- Collection stats (total cards, total value, most owned)
- Card tooltip on hover
- Dismissible trade history section
- Optional Sentry error tracking (`VITE_SENTRY_DSN`)
- Health check endpoint `GET /api/health`
- Leaderboard `GET /api/leaderboard` (top collectors by unique cards)
- Achievements badge (Complete Set, First Trade)
- CI runs unit tests before build
- CONTRIBUTING.md updated with test commands
- CHANGELOG.md

## [1.0.0] - 2025-02-16

### Added
- Card catalog with 16 cards (common, rare, epic)
- Add cards to collection, trade for new ones
- Anonymous auth via Supabase
- Progress bar, filters, sort, search
- Export/import, trade history
- Dark/light theme, sound effects, PWA
- Rate limiting, keyboard shortcuts, toasts
- Vercel + Supabase deployment

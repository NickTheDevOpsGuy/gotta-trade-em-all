# Changelog

All notable changes to this project will be documented in this file.

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

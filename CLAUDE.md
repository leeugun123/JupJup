# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (runs quasar dev, opens browser automatically)
npm run build     # Production build
npm run lint      # ESLint (flat config, vue-tsc type checking runs in parallel via vite-plugin-checker)
npm run format    # Prettier
```

TypeScript type errors surface in the browser overlay during `dev` via `vite-plugin-checker`. The same checker runs `vue-tsc` + ESLint simultaneously, so type errors block the overlay even if the page renders.

## Architecture

**Stack:** Quasar v2 (Vue 3 + Vite) · TypeScript strict mode · Pinia · Vue Router v5 · SCSS

**Router mode:** `hash` (configured in `quasar.config.ts`). All routes are nested under `MainLayout.vue`.

**Layout:** `MainLayout.vue` wraps every page with a top header and a bottom tab bar (홈 / 찜). The tab bar syncs its active state with `route.path` via a watcher — not from router-link's active class.

**Pages and routes:**

| Route | Page | Notes |
|---|---|---|
| `/` | `HomePage.vue` | Product grid with inline search input |
| `/product/:id` | `ProductDetailPage.vue` | Static mock data, not yet wired to route param |
| `/favorites` | `FavoritesPage.vue` | Favorites list |
| `SearchPage.vue` | (not yet routed) | Full search UI with recent/popular keywords |

`SearchPage.vue` exists but is **not registered in `routes.ts`**. It has a richer search experience (recent searches, popular keywords, category grid) compared to `HomePage.vue`'s inline search.

**Shared types:** `src/types/product.ts` exports the `Product` interface. Import from here — not from individual `.vue` files (Vue `<script setup>` does not allow named type exports).

**Mock data:** All product data is hardcoded in page components. There is no API layer or store yet.

**Styling:** Global SCSS variables in `src/css/quasar.variables.scss`. Brand colors: primary `#FF4757` (red), secondary `#FFA502` (orange), accent `#5352ED` (purple). Scoped SCSS inside each component uses `lang="scss"`.

**Quasar auto-import:** Quasar components (`q-card`, `q-btn`, etc.) are auto-imported — no manual import needed in templates.

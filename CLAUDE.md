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

**Layout:** `MainLayout.vue` wraps every page with a top header (red gradient) and a bottom tab bar (홈 / 검색 / 찜 / 마이). 탭바는 `q-route-tab`을 사용해 라우트 기반으로 활성 상태를 자동 감지한다.

**Pages and routes:**

| Route | Page | Notes |
|---|---|---|
| `/` | `HomePage.vue` | 2열 상품 그리드, 검색바 탭 시 `/search`로 이동 |
| `/search` | `SearchPage.vue` | 최근 검색어, 인기 검색어, 카테고리, 검색 결과 |
| `/favorites` | `FavoritesPage.vue` | 찜 목록 2열 그리드, 빈 상태 UI 포함 |
| `/my` | `MyPage.vue` | 프로필, 통계 카드, 메뉴 섹션, 로그인 다이얼로그 |
| `/product/:id` | `ProductDetailPage.vue` | 히어로 이미지, 가격 정보, 하단 고정 액션바, 라우트 파라미터로 상품 조회 |

**Shared types:** `src/types/product.ts` exports the `Product` interface. Import from here — not from individual `.vue` files.

**Mock data:** `src/data/mockProducts.ts`에서 중앙 관리. `HomePage`, `SearchPage`, `ProductDetailPage`가 공통으로 import해서 사용. API 레이어 없음.

**State management:** Pinia 사용. `src/boot/pinia.ts`에서 초기화 후 `quasar.config.ts` boot 배열에 등록. 새 스토어 추가 시 `src/stores/` 디렉토리에 생성하면 되고, boot 파일 재등록은 불필요.

**Stores:**
- `src/stores/favorites.ts` — 찜한 상품 ID 목록 관리. `toggle(id)`, `isFavorite(id)`, `favoriteProducts` (computed) 제공.

**Styling:** Global SCSS variables in `src/css/quasar.variables.scss`. Brand colors: primary `#FF4757` (red), secondary `#FFA502` (orange), accent `#5352ED` (purple). Background color for pages: `#F7F8FA`. Scoped SCSS inside each component uses `lang="scss"`.

**Quasar auto-import:** Quasar components (`q-card`, `q-btn`, etc.) are auto-imported — no manual import needed in templates.

## Component Notes

**ProductCard.vue**
- 할인 배지는 `position: absolute`로 이미지 위에 오버레이됨 (`.img-wrap`이 `position: relative`)
- 유통기한 D-2 이하이면 우하단에 마감 임박 배지 자동 표시 (`daysLeft` computed)
- 우상단 하트 버튼 — `useFavoritesStore()`로 찜 토글, `@click.stop`으로 카드 클릭 이벤트와 분리
- `@click` emit으로 클릭 이벤트를 부모에 전달

**MainLayout.vue**
- 헤더: 빨간 그라디언트 (`#FF4757 → #FF6B6B`), 브랜드명 + "마감 할인 특가" 태그라인
- 탭바: `q-route-tab` 사용 — `v-model` / watcher 불필요, 라우트 기반 자동 활성화
- 탭바: `inactive-color="grey-5"`, `align="justify"` 필수 (없으면 비활성 탭 안 보임)
- 홈 탭에 `exact` 속성 필수 — 없으면 모든 경로에서 홈 탭이 활성으로 표시됨
- `q-tab` + `to` + `v-model` 조합은 라우팅 충돌 발생 — 반드시 `q-route-tab` 사용

**ProductDetailPage.vue**
- `useRoute().params.id`로 `mockProducts`에서 상품 조회, 없으면 "찾을 수 없어요" 화면 표시
- 하단 액션바가 `position: fixed`이므로 페이지에 `padding-bottom: 80px` 필요

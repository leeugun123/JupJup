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

| Route          | Page                    | Notes                                                                           |
| -------------- | ----------------------- | ------------------------------------------------------------------------------- |
| `/`            | `HomePage.vue`          | 카테고리·편의점 브랜드 필터 칩 + 2열 상품 그리드, 검색바 탭 시 `/search`로 이동 |
| `/search`      | `SearchPage.vue`        | 최근 검색어(localStorage 유지), 인기 검색어, 카테고리 필터, 텍스트 검색 결과    |
| `/favorites`   | `FavoritesPage.vue`     | 찜 목록 2열 그리드, 빈 상태 UI 포함                                             |
| `/my`          | `MyPage.vue`            | 프로필, 통계 카드, 메뉴 섹션, 로그인 다이얼로그                                 |
| `/product/:id` | `ProductDetailPage.vue` | 히어로 이미지, 가격 정보, 하단 고정 액션바, 라우트 파라미터로 상품 조회         |
| `/history`     | `HistoryPage.vue`       | 구매 요약 카드(총 건수 + 총 절약), 구매 내역 리스트, 빈 상태 UI                 |

**Shared types:** `src/types/product.ts` exports the `Product` interface. Import from here — not from individual `.vue` files.

**Mock data:** `src/data/mockProducts.ts`에서 중앙 관리. `HomePage`, `SearchPage`, `ProductDetailPage`, `FavoritesPage`가 공통으로 import해서 사용. API 레이어 없음.

**State management:** Pinia 사용. `src/boot/pinia.ts`에서 초기화 후 `quasar.config.ts` boot 배열에 등록. 새 스토어 추가 시 `src/stores/` 디렉토리에 생성하면 되고, boot 파일 재등록은 불필요.

**Stores:**

- `src/stores/favorites.ts` — 찜한 상품 ID 목록 관리. `toggle(id)`, `isFavorite(id)`, `favoriteProducts` (computed) 제공.
- `src/stores/purchases.ts` — 구매 내역 관리. `add(product)` 호출 시 랜덤 코드와 함께 `Purchase` 객체 생성 및 반환. `totalSavings()` 로 누적 절약 금액 계산.
- `src/stores/auth.ts` — 로그인 상태 관리. `login(provider)` / `logout()` / `init()` 제공. `init()`은 `onMounted`에서 호출해 localStorage(`jupjup_auth`)에서 상태 복원. `isLoggedIn` computed. mock 로그인 전용 (실제 OAuth 미구현).

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
- 탭바 색상: `:deep(.q-tab:not(.q-tab--active))` CSS로 명시 강제 (`inactive-color` prop만으로는 환경에 따라 미적용)
- 홈 탭에 `exact` 속성 필수 — 없으면 모든 경로에서 홈 탭이 활성으로 표시됨
- `q-tab` + `to` + `v-model` 조합은 라우팅 충돌 발생 — 반드시 `q-route-tab` 사용

**ProductDetailPage.vue**

- `useRoute().params.id`로 `mockProducts`에서 상품 조회, 없으면 "찾을 수 없어요" 화면 표시
- 하단 액션바: `position: fixed; bottom: 60px` — 탭바(60px) 위에 위치해야 함. `bottom: 0`으로 설정하면 탭바에 가려짐
- 구매 플로우: 구매하기 버튼 → 확인 바텀시트 → 구매 완료 다이얼로그(코드 + 바코드) → 홈으로 이동
- 구매 완료 시 `usePurchasesStore().add(product)` 호출

**MyPage.vue**

- 찜 목록 배지: `favStore.ids.length > 0`일 때만 표시, 값은 동적 바인딩
- 이용 내역 배지: `purchasesStore.history.length > 0`일 때만 표시
- 이용 내역 메뉴 클릭 시 `/history`로 이동
- `authStore.init()`을 `onMounted`에서 호출 — localStorage 로그인 상태 복원
- 로그인 시: 프로필에 이름/이메일 표시, 아바타 우하단 제공자 배지(K/N), 계정 섹션 + 로그아웃 메뉴 표시, 로그인 배너 숨김
- 비로그인 시: "게스트 사용자" 표시, 로그인 배너 표시, chevron 클릭 시 로그인 다이얼로그 오픈
- 로그아웃 확인 다이얼로그 포함

**HistoryPage.vue**

- `usePurchasesStore().history`를 순서대로 렌더링 (최신순, `unshift`로 추가됨)
- 상단 요약 카드: 총 구매 건수 + `totalSavings()` 누적 절약 금액
- 내역 없을 때 빈 상태 UI 표시

**HomePage.vue**

- 카테고리 필터: `selectedCategory` ref, `'all'`이면 전체. `p.category`와 `cat.key`(영어)로 매칭
- 편의점 필터: `selectedStore` ref, `p.storeId`(`'store1'`=CU, `'store2'`=GS25, `'store3'`=세븐일레븐)와 매칭
- 두 필터 AND 조건으로 `filteredProducts` computed. 결과 0개 시 빈 상태 + 필터 초기화 버튼
- 필터 행은 가로 스크롤 (`overflow-x: auto`, 스크롤바 숨김)

**SearchPage.vue**

- 최근 검색어: `localStorage` (`jupjup_recent_searches` 키)에 저장/불러오기, 최대 10개
- 텍스트 검색: `p.name`, `p.storeName` 대상, 대소문자 무관 (`toLowerCase`)
- 카테고리 필터: `cat.key` 기반으로 `p.category`와 매칭 — `cat.label`(한글)로 비교하면 안 됨
- 텍스트 + 카테고리 동시 필터링 가능. `isSearching = !!query || !!selectedCategory`로 결과 화면 전환
- 카테고리 재클릭 시 토글 해제. 활성 카테고리는 결과 상단에 칩으로 표시

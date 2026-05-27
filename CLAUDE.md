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

**App.vue**

- 온보딩: `localStorage('jupjup_onboarded')` 미존재 시 첫 실행 풀스크린 온보딩 오버레이 표시. 4슬라이드 `q-carousel` (환영/할인/찜/시작하기). "건너뛰기" + 마지막 슬라이드 "시작하기" 버튼으로 완료 처리. `<Transition name="fade">`로 진입/퇴장 애니메이션.

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

**Mock data:** `src/data/mockProducts.ts`에서 중앙 관리 (37개). `HomePage`, `SearchPage`, `ProductDetailPage`, `FavoritesPage`가 공통으로 import해서 사용. API 레이어 없음.

**Store brand config:** `src/data/stores.ts` — 편의점 브랜드 색상 중앙 관리. `storeConfig` Record로 `storeId`를 key로 `{ label, color, bgColor }` 반환. `ProductCard`, `ProductDetailPage`에서 import해 브랜드 색상 적용.

**State management:** Pinia 사용. `src/boot/pinia.ts`에서 초기화 후 `quasar.config.ts` boot 배열에 등록. 새 스토어 추가 시 `src/stores/` 디렉토리에 생성하면 되고, boot 파일 재등록은 불필요. `pinia-plugin-persistedstate` 등록됨 — 스토어에 `persist: true` 옵션만 추가하면 localStorage 자동 저장.

**Stores:**

- `src/stores/favorites.ts` — 찜한 상품 ID 목록 관리. `toggle(id)`, `isFavorite(id)`, `favoriteProducts` (computed) 제공. `persist: true`로 localStorage 자동 저장.
- `src/stores/purchases.ts` — 구매 내역 관리. `add(product)` 호출 시 랜덤 코드와 함께 `Purchase` 객체 생성 및 반환. `totalSavings()` 로 누적 절약 금액 계산. `persist: true`로 localStorage 자동 저장.
- `src/stores/auth.ts` — 로그인 상태 관리. `login(provider)` / `logout()` / `init()` 제공. `init()`은 `onMounted`에서 호출해 localStorage(`jupjup_auth`)에서 상태 복원. `isLoggedIn` computed. mock 로그인 전용 (실제 OAuth 미구현).

**Styling:** Global SCSS variables in `src/css/quasar.variables.scss`. Brand colors: primary `#FF4757` (red), secondary `#FFA502` (orange), accent `#5352ED` (purple). Background color for pages: `#F7F8FA`. Scoped SCSS inside each component uses `lang="scss"`.

**다크 모드:** `src/css/app.scss`에 `.body--dark` 전역 오버라이드 정의. Quasar가 `$q.dark.set(true)` 시 `body` 태그에 `body--dark` 클래스를 추가하면 전역 CSS가 적용됨. 스코프드 CSS의 클래스명은 HTML에 그대로 남아 있으므로 전역 `.body--dark .class` 셀렉터로 오버라이드 가능.

**Quasar auto-import:** Quasar components (`q-card`, `q-btn`, etc.) are auto-imported — no manual import needed in templates.

## Component Notes

**ProductCardSkeleton.vue**

- ProductCard와 동일한 레이아웃의 shimmer 스켈레톤. `pinia-plugin-persistedstate` 없이 순수 CSS 애니메이션(`@keyframes shimmer`).
- HomePage/FavoritesPage: `onMounted` + `setTimeout`으로 첫 진입 시 600/500ms 표시.
- SearchPage: `watch(isSearching)`으로 검색/카테고리 전환 시 400ms 표시.

**ProductCard.vue**

- 할인 배지는 `position: absolute`로 이미지 위에 오버레이됨 (`.img-wrap`이 `position: relative`)
- 유통기한 D-2 이하이면 우하단에 마감 임박 배지 자동 표시 (`daysLeft` computed)
- 우상단 하트 버튼 — `useFavoritesStore()`로 찜 토글, `@click.stop`으로 카드 클릭 이벤트와 분리
- `@click` emit으로 클릭 이벤트를 부모에 전달
- 스토어명 표시: `storeConfig[product.storeId]`로 브랜드 컬러 배지(CU/GS25/세븐일레븐) + 지점명 분리 (`.store-brand-badge` + `.store-branch`)

**MainLayout.vue**

- 헤더: 빨간 그라디언트 (`#FF4757 → #FF6B6B`), 브랜드명 + "마감 할인 특가" 태그라인 + 위치 칩 + 알림 벨
- 위치 칩: 클릭 시 `q-dialog position="bottom"`으로 서울 16개 구 선택. 선택값 `localStorage('jupjup_location')`에 저장, `onMounted`에서 복원
- 알림 벨: 마감 임박(D-2 이하) 상품 수 뱃지 표시. 클릭 시 `q-dialog position="bottom"`으로 임박 상품 목록 표시. 상품 클릭 시 상세 페이지 이동. `q-bottom-sheet`는 Quasar v2에서 플러그인이므로 템플릿에서 사용 불가 — 반드시 `q-dialog position="bottom"` 사용
- 페이지 전환 애니메이션: `router.beforeEach`에서 `to.meta.depth` vs `from.meta.depth` 비교 → `transitionName` ref 결정. `router-view v-slot="{ Component, route }"` + `<Transition :name="transitionName" mode="out-in">` 패턴 사용. 탭 전환(depth 동일) → `fade`, 상세 진입(depth 증가) → `slide-left`, 뒤로 가기(depth 감소) → `slide-right`. 전환 CSS는 `app.scss`에 전역 정의. `q-page-container`에 `overflow: hidden` 필수 (`.page-container-clip`)
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
- 편의점 정보 카드: `storeConfig[product.storeId]`로 브랜드 컬러 좌측 보더 + 아이콘 색상 적용 (`.store-info-card`)
- "이 편의점의 다른 특가" 섹션: `relatedProducts` computed — 같은 `storeId`이고 현재 상품 제외, 최대 8개. 가로 스크롤(`.related-scroll`, `flex: 0 0 155px`). 카드 클릭 시 `router.push('/product/:id')`로 이동
- 공유 버튼: 액션바에 찜 버튼 옆 추가. `navigator.share` 지원 시 네이티브 공유 시트, 미지원 시 클립보드 복사 + `useQuasar().$q.notify` 토스트
- 마감 알림 토글: 편의점 정보 아래 `q-toggle` + 벨 아이콘 섹션. `localStorage('jupjup_alert_${id}')` 로 상품별 저장. `watch(product.id)` 로 상품 전환 시 상태 복원. 토글 시 토스트 피드백
- mock 지도: 편의점 정보 카드 우측 지도 아이콘 클릭 시 CSS 기반 mock 지도 토글 (`showMap` ref). 도로/핀/주소/거리 표시
- 리뷰/평점: `src/data/mockReviews.ts`에서 상품 ID 해시 기반으로 3~5개 리뷰 결정론적 생성. `getProductReviews(id)` + `getAverageRating(reviews)`. 별점 평균 + 리뷰 리스트 표시

**MyPage.vue**

- 찜 목록 배지: `favStore.ids.length > 0`일 때만 표시, 값은 동적 바인딩
- 이용 내역 배지: `purchasesStore.history.length > 0`일 때만 표시
- 이용 내역 메뉴 클릭 시 `/history`로 이동
- `authStore.init()`을 `onMounted`에서 호출 — localStorage 로그인 상태 복원
- 로그인 시: 프로필에 이름/이메일 표시, 아바타 우하단 제공자 배지(K/N), 계정 섹션 + 로그아웃 메뉴 표시, 로그인 배너 숨김
- 비로그인 시: "게스트 사용자" 표시, 로그인 배너 표시, chevron 클릭 시 로그인 다이얼로그 오픈
- 로그아웃 확인 다이얼로그 포함
- 쿠폰 지갑: 내 활동 섹션에 메뉴 추가. 클릭 시 `q-dialog position="bottom"`으로 전체 구매 코드 목록 표시
- 다크 모드: 앱 정보 섹션에 토글. `useQuasar().$q.dark.toggle()` + `localStorage('jupjup_dark')` 저장. `onMounted`에서 복원

**FavoritesPage.vue**

- 카테고리/편의점 필터: 찜한 상품에 실제로 존재하는 카테고리/편의점만 칩으로 표시 (`availableCategories`, `availableStores` computed)
- 정렬: HomePage와 동일한 `sortBy`/`sortOptions` 패턴. `filteredSortedProducts` computed에서 필터 + 정렬 동시 처리
- 필터 결과 0개 시 빈 상태 + "필터 초기화" 버튼 (`selectedCategory`/`selectedStore` → `'all'` 리셋)
- 찜한 상품 자체가 0개일 때는 별도 빈 상태 UI ("아직 찜한 상품이 없어요") 표시

**HistoryPage.vue**

- `usePurchasesStore().history`를 순서대로 렌더링 (최신순, `unshift`로 추가됨)
- 상단 요약 카드: 총 구매 건수 + `totalSavings()` 누적 절약 금액
- 내역 없을 때 빈 상태 UI 표시
- 카드 클릭 시 구매 상세 다이얼로그 (`q-dialog position="bottom"`): 상품 이미지/이름/가격, 절약 금액 배지, 구매 코드 + 바코드. `selectedPurchase` ref로 관리

**HomePage.vue**

- 상단 배너: `q-carousel` 3장 자동 재생(3.5초), 커스텀 dot indicator (`.banner-dots`)
- 카테고리 필터: `selectedCategory` ref, `'all'`이면 전체. `p.category`와 `cat.key`(영어)로 매칭
- 편의점 필터: `selectedStore` ref, `p.storeId`(`'store1'`=CU, `'store2'`=GS25, `'store3'`=세븐일레븐)와 매칭. 활성 시 각 브랜드 고유 색상 inline style로 적용 (CSS class 아님)
- "⚡ 마감 임박" 섹션: `daysLeftFor()` 함수로 0~2일 남은 상품만 가로 스크롤(`.urgent-scroll`, `flex: 0 0 160px`)로 표시
- 두 필터 AND 조건으로 `filteredProducts` computed. 결과 0개 시 빈 상태 + 필터 초기화 버튼
- 필터 행은 가로 스크롤 (`overflow-x: auto`, 스크롤바 숨김)
- 정렬: `sortBy` ref + `sortOptions` (기본순/할인율순/마감임박순/낮은가격순/높은가격순). `sortedProducts` computed가 `filteredProducts`를 정렬해 그리드에 공급. 정렬 버튼은 `q-btn` + `q-menu` 패턴 (섹션 헤더 우측)
- 인라인 검색바: 배너 아래 클릭 전용 검색바. 탭 시 `/search`로 이동. `readonly` div 스타일로 구현 (실제 input 아님)
- 풀-투-리프레시: `q-pull-to-refresh`로 전체 콘텐츠 래핑. `onRefresh(done)` 콜백에서 `loading = true` → 800ms 후 `loading = false` + `done()` 호출

**SearchPage.vue**

- 최근 검색어: `localStorage` (`jupjup_recent_searches` 키)에 저장/불러오기, 최대 10개
- 텍스트 검색: `p.name`, `p.storeName` 대상, 대소문자 무관 (`toLowerCase`)
- 카테고리 필터: `cat.key` 기반으로 `p.category`와 매칭 — `cat.label`(한글)로 비교하면 안 됨
- 텍스트 + 카테고리 동시 필터링 가능. `isSearching = !!query || !!selectedCategory`로 결과 화면 전환
- 카테고리 재클릭 시 토글 해제. 활성 카테고리는 결과 상단에 칩으로 표시
- 정렬: HomePage와 동일한 `sortBy`/`sortOptions`/`sortedProducts` 패턴. 정렬 버튼은 결과 수 표시 행(`result-count-row`) 우측

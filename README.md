# jupjup 🛒

> **편의점 마감 임박 특가 중개 플랫폼**  
> 유통기한 임박 상품을 최대 50% 할인된 가격으로 만나보세요

---

## 📱 화면 구성

| 홈 | 상품 상세 | 검색 | 찜 목록 |
|:--:|:--:|:--:|:--:|
| 베스트 · 임박특가 · 필터 | 구매 플로우 · 리뷰 | 자동완성 · 카테고리 | 필터 · 정렬 |

---

## ✨ 주요 기능

### 🏠 홈
- **스플래시 스크린** — 앱 실행 시 브랜드 로고 pop-in 애니메이션
- **온보딩** — 첫 실행 시 4슬라이드 튜토리얼 (건너뛰기 가능)
- **오늘의 베스트 🏆** — 할인율 TOP 5 랭킹 카드 (🥇🥈🥉)
- **최근 본 상품** — 방문한 상품 자동 저장, 가로 스크롤 표시
- **마감 임박 ⚡** — D-2 이내 상품 별도 강조 섹션
- **카테고리 · 편의점 필터** — AND 조건 필터링 + 5가지 정렬
- **풀-투-리프레시** — 당겨서 새로고침

### 🔍 검색
- **실시간 자동완성** — 입력 즉시 상품명 드롭다운 (최대 6개, 일치 부분 빨간 강조)
- **최근 검색어** — localStorage 유지, 개별 삭제 / 전체 삭제
- **인기 검색어** — 상승/하락/NEW 트렌드 표시
- **카테고리 퀵링크** — 6개 카테고리 카드 필터
- **스켈레톤 로딩** — 검색/카테고리 전환 시 shimmer 애니메이션

### ❤️ 찜
- **찜 토글** — 카드 하트 버튼으로 즉시 찜/해제 (Pinia + localStorage 영구 저장)
- **카테고리 · 편의점 필터** — 찜한 상품에 실제 존재하는 옵션만 표시
- **정렬** — 기본순 / 할인율 / 마감임박 / 가격 낮은순 / 높은순

### 👤 마이
- **소셜 로그인** — 카카오 / 네이버 Mock 로그인
- **쿠폰 지갑** — 구매 완료 코드 목록 바텀시트
- **구매 이용 내역** — 총 절약 금액 통계
- **다크 모드** — 토글 즉시 적용, localStorage 유지
- **지역 설정** — 서울 16개 구 선택

### 📦 상품 상세
- **구매 플로우** — 구매하기 → 확인 → 바코드 코드 발급
- **마감 알림 토글** — 상품별 알림 설정 (localStorage)
- **공유 버튼** — 네이티브 공유 시트 / 클립보드 복사 폴백
- **리뷰 · 평점** — 상품 ID 해시 기반 결정론적 리뷰 생성
- **Mock 지도** — CSS 기반 위치 지도 토글
- **연관 상품** — 같은 편의점 다른 특가 가로 스크롤

### 🎨 UX
- **페이지 전환 애니메이션** — 탭: fade / 상세 진입: slide-left / 뒤로 가기: slide-right
- **빈 상태 애니메이션** — 이모지 float + 컬러 dot pulse 공통 컴포넌트
- **스켈레톤 로딩** — 홈 / 검색 / 찜 shimmer 카드
- **다크 모드** — 전체 페이지 · 카드 · 다이얼로그 대응

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | [Quasar v2](https://quasar.dev) (Vue 3 + Vite) |
| 언어 | TypeScript (strict mode) |
| 상태 관리 | Pinia + pinia-plugin-persistedstate |
| 라우터 | Vue Router v5 (hash mode) |
| 스타일 | SCSS (scoped + global `app.scss`) |
| 린트 | ESLint flat config + Prettier |
| 타입 검사 | vue-tsc + vite-plugin-checker |

---

## 📁 프로젝트 구조

```
src/
├── App.vue                   # 스플래시 + 온보딩 오버레이
├── layouts/
│   └── MainLayout.vue        # 헤더 · 탭바 · 페이지 전환 · 위치/알림 다이얼로그
├── pages/
│   ├── HomePage.vue          # 홈 (베스트 · 최근본 · 임박 · 그리드)
│   ├── SearchPage.vue        # 검색 (자동완성 · 인기어 · 결과)
│   ├── FavoritesPage.vue     # 찜 목록
│   ├── ProductDetailPage.vue # 상품 상세
│   ├── MyPage.vue            # 마이페이지
│   └── HistoryPage.vue       # 구매 내역
├── components/
│   ├── ProductCard.vue       # 상품 카드 (할인배지 · 찜버튼 · 임박배지)
│   ├── ProductCardSkeleton.vue  # shimmer 스켈레톤
│   └── EmptyState.vue        # 빈 상태 애니메이션 공통 컴포넌트
├── stores/
│   ├── favorites.ts          # 찜 목록 (persist)
│   ├── purchases.ts          # 구매 내역 (persist)
│   ├── auth.ts               # 로그인 상태
│   └── recentlyViewed.ts     # 최근 본 상품 (persist)
├── data/
│   ├── mockProducts.ts       # 상품 Mock 데이터 (37개)
│   ├── mockReviews.ts        # 리뷰 Mock 데이터 + 결정론적 생성
│   └── stores.ts             # 편의점 브랜드 컬러 설정
├── types/
│   └── product.ts            # Product 공용 인터페이스
├── router/
│   └── routes.ts             # 라우트 정의 (meta.depth로 전환 방향 결정)
├── boot/
│   └── pinia.ts              # Pinia + persistedstate 초기화
└── css/
    ├── app.scss              # 전역 CSS (다크모드 · 페이지 전환 애니메이션)
    └── quasar.variables.scss # 브랜드 컬러 변수
```

---

## 🗂 라우트 구조

| 경로 | 페이지 | depth |
|------|--------|-------|
| `/` | 홈 | 1 |
| `/search` | 검색 | 1 |
| `/favorites` | 찜 목록 | 1 |
| `/my` | 마이페이지 | 1 |
| `/product/:id` | 상품 상세 | 2 |
| `/history` | 구매 내역 | 2 |

> `meta.depth`로 페이지 전환 방향 결정  
> `depth 1 → 2` : slide-left / `depth 2 → 1` : slide-right / 동일 depth : fade

---

## 💾 로컬 스토리지 키

| 키 | 설명 |
|----|------|
| `jupjup_onboarded` | 온보딩 완료 여부 |
| `jupjup_location` | 선택된 지역 (구) |
| `jupjup_dark` | 다크 모드 설정 |
| `jupjup_recent_searches` | 최근 검색어 목록 |
| `jupjup_alert_${id}` | 상품별 마감 알림 설정 |
| `jupjup_auth` | 로그인 상태 (mock) |
| `pinia/favorites` | 찜 목록 (Pinia persist) |
| `pinia/purchases` | 구매 내역 (Pinia persist) |
| `pinia/recentlyViewed` | 최근 본 상품 (Pinia persist) |

---

## 🎨 브랜드 컬러

| 변수 | 색상 | 용도 |
|------|------|------|
| `primary` | `#FF4757` | 메인 레드 (헤더 · 할인 배지) |
| `secondary` | `#FFA502` | 오렌지 (강조) |
| `accent` | `#5352ED` | 퍼플 (포인트) |
| 배경 | `#F7F8FA` | 페이지 기본 배경 |

---

## 📝 개발 노트

- **Mock 데이터 전용** — API 서버 없음. `src/data/mockProducts.ts`에서 37개 상품 관리
- **Quasar 바텀시트** — `q-bottom-sheet`는 플러그인 방식이므로 `q-dialog position="bottom"` 사용
- **다크 모드 CSS** — scoped CSS 대신 `app.scss`의 `.body--dark .class` 전역 셀렉터로 오버라이드
- **Pinia persist** — setup store에서 `defineStore(id, fn, { persist: true })` 형태로 적용

---

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

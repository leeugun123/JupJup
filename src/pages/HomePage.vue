<template>
  <q-page class="home-page">
    <!-- Search -->
    <div class="q-px-md q-pt-sm q-pb-xs">
      <q-input
        v-model="searchQuery"
        outlined dense rounded
        placeholder="편의점 할인 상품 검색"
        bg-color="white"
        class="search-bar"
      >
        <template #prepend>
          <q-icon name="search" color="grey-5" size="18px" />
        </template>
        <template #append>
          <q-icon v-if="searchQuery" name="close" color="grey-5" size="16px"
                  class="cursor-pointer" @click="searchQuery = ''" />
        </template>
      </q-input>
    </div>

    <!-- Banner -->
    <div class="q-px-md q-py-sm">
      <q-carousel
        v-model="bannerSlide"
        animated infinite autoplay :autoplay-speed="4000"
        height="140px" navigation navigation-color="white"
        class="banner-carousel"
      >
        <q-carousel-slide name="1" style="padding:0">
          <div class="slide-inner slide-red">
            <div class="text-caption text-white op80">✨ 오늘의 특가</div>
            <div class="text-h5 text-white text-weight-bold slide-heading">
              유통기한 임박<br>최대 50% 할인
            </div>
            <div class="slide-chip">지금 바로 확인 →</div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="2" style="padding:0">
          <div class="slide-inner slide-purple">
            <div class="text-caption text-white op80">🔔 놓치지 마세요</div>
            <div class="text-h5 text-white text-weight-bold slide-heading">
              내 주변 편의점<br>할인 알림 설정
            </div>
            <div class="slide-chip slide-chip-blue">알림 받기 →</div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- Category Filter -->
    <div class="q-px-md q-pb-sm">
      <div class="cat-row">
        <div
          v-for="cat in categories" :key="cat.key"
          class="cat-pill" :class="{ 'cat-active': selectedCategory === cat.key }"
          @click="selectedCategory = cat.key"
        >
          <span class="cat-emoji">{{ cat.emoji }}</span>
          <span>{{ cat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Urgent Section -->
    <section v-if="urgentProducts.length" class="q-mb-md">
      <div class="section-header q-px-md q-mb-sm">
        <div class="row items-center" style="gap:6px">
          <span class="section-title">⚡ 마감 임박</span>
          <q-badge rounded color="negative" label="오늘·내일 마감" style="font-size:9px; font-weight:700" />
        </div>
        <span class="more-link">전체보기</span>
      </div>
      <div class="horiz-scroll q-px-md" style="gap:10px">
        <ProductCard
          v-for="p in urgentProducts" :key="p.id"
          :product="p" :compact="true"
          @click="goToDetail(p.id)"
        />
      </div>
    </section>

    <!-- Product Grid -->
    <section class="q-px-md q-pb-xl">
      <div class="section-header q-mb-sm">
        <span class="section-title">🔥 지금 할인 중</span>
        <span class="more-link text-grey-5">{{ filteredProducts.length }}개</span>
      </div>

      <div v-if="filteredProducts.length" class="row q-col-gutter-sm">
        <div v-for="product in filteredProducts" :key="product.id" class="col-6">
          <ProductCard :product="product" @click="goToDetail(product.id)" />
        </div>
      </div>

      <div v-else class="column items-center q-py-xl text-grey-5">
        <q-icon name="search_off" size="48px" />
        <div class="text-body2 q-mt-sm">검색 결과가 없어요</div>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import type { Product } from '../components/ProductCard.vue'

const router = useRouter()
const searchQuery = ref('')
const bannerSlide = ref('1')
const selectedCategory = ref('all')

const categories = [
  { key: 'all', emoji: '🏪', label: '전체' },
  { key: 'beverage', emoji: '🧃', label: '음료' },
  { key: 'snack', emoji: '🍫', label: '간식' },
  { key: 'food', emoji: '🍱', label: '식품' },
  { key: 'dairy', emoji: '🥛', label: '유제품' },
  { key: 'frozen', emoji: '❄️', label: '냉동' },
]

const mockProducts = ref<Product[]>([
  {
    id: '1',
    name: '딸기 우유',
    originalPrice: 2500,
    discountPrice: 1500,
    discountPercent: 40,
    expiryDate: '2026-05-19',
    storeId: 'store1',
    storeName: 'CU 강남점',
    location: '서울 강남구 역삼동 123',
    image: 'https://picsum.photos/seed/milk1/400/300',
    category: 'dairy',
  },
  {
    id: '2',
    name: '초코파이 (12개입)',
    originalPrice: 3000,
    discountPrice: 1800,
    discountPercent: 40,
    expiryDate: '2026-05-25',
    storeId: 'store1',
    storeName: 'CU 강남점',
    location: '서울 강남구 역삼동 123',
    image: 'https://picsum.photos/seed/choco2/400/300',
    category: 'snack',
  },
  {
    id: '3',
    name: '참치 김밥',
    originalPrice: 4000,
    discountPrice: 2000,
    discountPercent: 50,
    expiryDate: '2026-05-19',
    storeId: 'store2',
    storeName: 'GS25 역삼점',
    location: '서울 강남구 역삼동 456',
    image: 'https://picsum.photos/seed/kimbap3/400/300',
    category: 'food',
  },
  {
    id: '4',
    name: '오렌지 주스 500ml',
    originalPrice: 1800,
    discountPrice: 900,
    discountPercent: 50,
    expiryDate: '2026-05-20',
    storeId: 'store2',
    storeName: 'GS25 역삼점',
    location: '서울 강남구 역삼동 456',
    image: 'https://picsum.photos/seed/orange4/400/300',
    category: 'beverage',
  },
  {
    id: '5',
    name: '통밀 크래커',
    originalPrice: 2200,
    discountPrice: 1100,
    discountPercent: 50,
    expiryDate: '2026-05-22',
    storeId: 'store3',
    storeName: '세븐일레븐 삼성점',
    location: '서울 강남구 삼성동 789',
    image: 'https://picsum.photos/seed/cracker5/400/300',
    category: 'snack',
  },
  {
    id: '6',
    name: '그릭 요거트',
    originalPrice: 3500,
    discountPrice: 2100,
    discountPercent: 40,
    expiryDate: '2026-05-19',
    storeId: 'store1',
    storeName: 'CU 강남점',
    location: '서울 강남구 역삼동 123',
    image: 'https://picsum.photos/seed/yogurt6/400/300',
    category: 'dairy',
  },
  {
    id: '7',
    name: '바나나 우유',
    originalPrice: 1500,
    discountPrice: 800,
    discountPercent: 47,
    expiryDate: '2026-05-21',
    storeId: 'store2',
    storeName: 'GS25 역삼점',
    location: '서울 강남구 역삼동 456',
    image: 'https://picsum.photos/seed/banana7/400/300',
    category: 'dairy',
  },
  {
    id: '8',
    name: '매운 컵라면',
    originalPrice: 1200,
    discountPrice: 700,
    discountPercent: 42,
    expiryDate: '2026-06-01',
    storeId: 'store3',
    storeName: '세븐일레븐 삼성점',
    location: '서울 강남구 삼성동 789',
    image: 'https://picsum.photos/seed/ramen8/400/300',
    category: 'food',
  },
])

const urgentProducts = computed(() =>
  mockProducts.value.filter((p) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(p.expiryDate)
    expiry.setHours(0, 0, 0, 0)
    const days = Math.ceil((expiry.getTime() - today.getTime()) / 86400000)
    return days <= 1
  })
)

const filteredProducts = computed(() =>
  mockProducts.value.filter((p) => {
    const matchCat = selectedCategory.value === 'all' || p.category === selectedCategory.value
    const matchSearch =
      !searchQuery.value ||
      p.name.includes(searchQuery.value) ||
      p.storeName.includes(searchQuery.value)
    return matchCat && matchSearch
  })
)

function goToDetail(id: string) {
  void router.push(`/product/${id}`)
}
</script>

<style scoped lang="scss">
.home-page {
  background: #F5F6F8;
  padding-bottom: 80px;
}

.search-bar {
  :deep(.q-field__control) {
    background: white !important;
    border-radius: 12px !important;
    height: 44px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    border: none !important;
  }
  :deep(.q-field__marginal) { height: 44px; }
  :deep(.q-field__bottom) { display: none; }
}

// ── Banner ────────────────────────────────────
.banner-carousel {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.14);

  :deep(.q-carousel__navigation--bottom) { bottom: 10px; }
  :deep(.q-btn.q-carousel__navigation-icon) {
    width: 6px;
    height: 6px;
    min-width: unset;
    border-radius: 3px;
    padding: 0;
    background: rgba(255,255,255,0.5);
    margin: 0 3px;
    transition: width 0.2s;

    &.q-carousel__navigation-icon--active {
      background: white;
      width: 18px;
    }
    .q-icon { display: none; }
  }
}

.slide-inner {
  width: 100%;
  height: 100%;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.slide-red { background: linear-gradient(135deg, #FF4757 0%, #FF8E53 100%); }
.slide-purple { background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%); }

.slide-heading { line-height: 1.25; }

.op80 { opacity: 0.85; }

.slide-chip {
  display: inline-block;
  background: rgba(255,255,255,0.25);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  width: fit-content;
  margin-top: 4px;
  backdrop-filter: blur(4px);
}

.slide-chip-blue {
  background: rgba(255,255,255,0.2);
}

// ── Category ──────────────────────────────────
.cat-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.cat-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 20px;
  background: white;
  border: 1.5px solid #EEEEEE;
  font-size: 12px;
  font-weight: 500;
  color: #555555;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  .cat-emoji { font-size: 14px; }

  &.cat-active {
    background: #FF4757;
    color: white;
    border-color: #FF4757;
    box-shadow: 0 3px 10px rgba(255, 71, 87, 0.3);
    font-weight: 700;
  }
}

// ── Sections ──────────────────────────────────
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1A1A2E;
  letter-spacing: -0.3px;
}

.more-link {
  font-size: 12px;
  color: #AAAAAA;
  cursor: pointer;
}

.horiz-scroll {
  display: flex;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}
</style>

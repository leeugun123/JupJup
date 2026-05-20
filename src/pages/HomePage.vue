<template>
  <q-page class="home-page">
    <!-- Search Shortcut -->
    <div class="search-shortcut q-px-md q-pt-md q-pb-sm" @click="goToSearch">
      <div class="search-fake">
        <q-icon name="search" color="grey-5" size="18px" />
        <span class="search-placeholder">오늘의 마감 특가 찾기...</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-section q-pt-sm q-pb-xs">
      <!-- 카테고리 -->
      <div class="filter-row">
        <div
          v-for="cat in categories" :key="cat.key"
          class="filter-chip"
          :class="{ 'filter-chip--active': selectedCategory === cat.key }"
          @click="selectedCategory = cat.key"
        >
          <span class="chip-emoji">{{ cat.emoji }}</span>
          <span>{{ cat.label }}</span>
        </div>
      </div>
      <!-- 편의점 브랜드 -->
      <div class="filter-row">
        <div
          v-for="store in stores" :key="store.key"
          class="filter-chip filter-chip--store"
          :class="{ 'filter-chip--active': selectedStore === store.key }"
          @click="selectedStore = store.key"
        >
          {{ store.label }}
        </div>
      </div>
    </div>

    <!-- Section Header -->
    <div class="section-header q-px-md q-pt-xs q-pb-xs">
      <div class="section-title">오늘의 특가 🔥</div>
      <div class="section-count text-grey-5">{{ filteredProducts.length }}개</div>
    </div>

    <!-- Product Grid -->
    <div class="q-px-md q-pb-xl">
      <div v-if="filteredProducts.length" class="row q-col-gutter-sm">
        <div v-for="product in filteredProducts" :key="product.id" class="col-6">
          <ProductCard :product="product" @click="goToDetail(product.id)" />
        </div>
      </div>

      <div v-else class="empty-state column items-center q-py-xl">
        <q-icon name="search_off" size="56px" color="grey-3" />
        <div class="empty-title q-mt-md">해당 상품이 없어요</div>
        <div class="empty-sub q-mt-xs">다른 카테고리를 선택해보세요</div>
        <q-btn flat label="전체 보기" color="primary" class="q-mt-sm"
               @click="selectedCategory = 'all'; selectedStore = 'all'" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { mockProducts } from '../data/mockProducts'

const router = useRouter()

const selectedCategory = ref('all')
const selectedStore = ref('all')

const categories = [
  { key: 'all',      emoji: '🏷️', label: '전체' },
  { key: 'beverage', emoji: '🧃', label: '음료' },
  { key: 'snack',    emoji: '🍫', label: '간식' },
  { key: 'food',     emoji: '🍱', label: '식품' },
  { key: 'dairy',    emoji: '🥛', label: '유제품' },
  { key: 'frozen',   emoji: '❄️', label: '냉동' },
  { key: 'instant',  emoji: '🍜', label: '즉석식품' },
]

const stores = [
  { key: 'all',    label: '전체' },
  { key: 'store1', label: 'CU' },
  { key: 'store2', label: 'GS25' },
  { key: 'store3', label: '세븐일레븐' },
]

const filteredProducts = computed(() =>
  mockProducts.filter((p) => {
    const matchCat   = selectedCategory.value === 'all' || p.category === selectedCategory.value
    const matchStore = selectedStore.value === 'all'    || p.storeId  === selectedStore.value
    return matchCat && matchStore
  })
)

function goToDetail(id: string) {
  void router.push(`/product/${id}`)
}

function goToSearch() {
  void router.push('/search')
}
</script>

<style scoped lang="scss">
.home-page {
  background: #F7F8FA;
  min-height: 100vh;
}

.search-shortcut {
  cursor: pointer;
}

.search-fake {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 14px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}

.search-placeholder {
  font-size: 14px;
  color: #BBBBBB;
}

// ── Filters ────────────────────────────────────
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-row {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  background: white;
  border: 1.5px solid #EEEEEE;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;

  &:active { transform: scale(0.96); }

  &--active {
    background: #FF4757;
    border-color: #FF4757;
    color: white;
  }

  &--store {
    font-size: 12px;
    padding: 5px 12px;
  }
}

.chip-emoji {
  font-size: 14px;
  line-height: 1;
}

// ── Section Header ─────────────────────────────
.section-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #1A1A2E;
  letter-spacing: -0.5px;
}

.section-count {
  font-size: 13px;
}

// ── Empty State ────────────────────────────────
.empty-state {
  text-align: center;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #444;
}

.empty-sub {
  font-size: 13px;
  color: #AAAAAA;
}
</style>

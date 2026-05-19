<template>
  <q-page class="fav-page">
    <!-- Header -->
    <div class="fav-header q-px-md q-pt-md q-pb-sm">
      <div class="text-h6 text-weight-bold" style="color:#1A1A2E">찜한 상품</div>
      <div class="text-caption text-grey-5">{{ favorites.length }}개</div>
    </div>

    <!-- Empty State -->
    <div v-if="favorites.length === 0" class="empty-state">
      <div class="empty-icon-wrap">
        <q-icon name="favorite_border" size="48px" color="grey-4" />
      </div>
      <div class="text-body1 text-weight-bold text-grey-6 q-mt-md">찜한 상품이 없어요</div>
      <div class="text-caption text-grey-4 q-mt-xs text-center" style="line-height:1.6">
        할인 중인 상품의 하트를 눌러<br>찜 목록에 추가해보세요!
      </div>
      <q-btn
        label="할인 상품 보러가기"
        color="primary" unelevated
        class="q-mt-xl go-btn"
        icon="local_offer"
        @click="$router.push('/')"
      />
    </div>

    <!-- Favorites Grid -->
    <div v-else>
      <!-- Sort/Filter bar -->
      <div class="filter-bar q-px-md q-mb-sm">
        <q-btn-toggle
          v-model="sortMode"
          flat dense no-caps
          :options="[
            { label: '최신순', value: 'recent' },
            { label: '할인율순', value: 'discount' },
            { label: '마감 임박순', value: 'expiry' },
          ]"
          class="sort-toggle"
        />
      </div>

      <div class="q-px-md q-pb-xl">
        <div class="row q-col-gutter-sm">
          <div v-for="product in sortedFavorites" :key="product.id" class="col-6">
            <ProductCard
              :product="product"
              @click="$router.push(`/product/${product.id}`)"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import type { Product } from '../components/ProductCard.vue'

const sortMode = ref<'recent' | 'discount' | 'expiry'>('recent')

const favorites = ref<Product[]>([
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
])

function getDays(date: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(date)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000)
}

const sortedFavorites = computed(() => {
  const list = [...favorites.value]
  if (sortMode.value === 'discount') return list.sort((a, b) => b.discountPercent - a.discountPercent)
  if (sortMode.value === 'expiry') return list.sort((a, b) => getDays(a.expiryDate) - getDays(b.expiryDate))
  return list
})
</script>

<style scoped lang="scss">
.fav-page {
  background: #F5F6F8;
  padding-bottom: 80px;
}

.fav-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 40px 40px;
}

.empty-icon-wrap {
  width: 96px;
  height: 96px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.go-btn {
  border-radius: 12px !important;
  padding: 12px 24px;
  font-weight: 700;
}

.filter-bar {
  display: flex;
  align-items: center;
}

.sort-toggle {
  :deep(.q-btn) {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px !important;
    color: #AAAAAA;

    &.q-btn--active {
      background: #FF4757 !important;
      color: white !important;
    }
  }
}
</style>

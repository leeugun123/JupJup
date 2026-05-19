<template>
  <q-page class="fav-page">
    <div class="fav-header q-px-md q-pt-md q-pb-sm">
      <span class="fav-title">찜한 상품</span>
      <span class="fav-count text-grey-5">{{ favorites.length }}개</span>
    </div>

    <div v-if="favorites.length" class="q-px-md q-pb-xl">
      <div class="row q-col-gutter-sm">
        <div v-for="product in favorites" :key="product.id" class="col-6">
          <ProductCard :product="product" @click="goToDetail(product.id)" />
        </div>
      </div>
    </div>

    <div v-else class="empty-state column items-center justify-center">
      <q-icon name="favorite_border" size="64px" color="grey-3" />
      <div class="empty-title q-mt-md">아직 찜한 상품이 없어요</div>
      <div class="empty-sub q-mt-xs">마음에 드는 상품을 찜해보세요!</div>
      <q-btn
        unelevated color="primary" rounded label="특가 상품 보러가기"
        class="q-mt-lg" to="/"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import type { Product } from '../types/product'

const router = useRouter()

const favorites = ref<Product[]>([
  {
    id: '1',
    name: '딸기 우유',
    originalPrice: 2500,
    discountPrice: 1500,
    discountPercent: 40,
    expiryDate: '2026-05-21',
    storeId: 'store1',
    storeName: 'CU 강남점',
    location: '서울 강남구',
    image: 'https://picsum.photos/seed/milk1/400/300',
    category: 'dairy'
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
    location: '서울 강남구',
    image: 'https://picsum.photos/seed/yogurt6/400/300',
    category: 'dairy'
  },
])

function goToDetail(id: string) {
  void router.push(`/product/${id}`)
}
</script>

<style scoped lang="scss">
.fav-page {
  background: #F7F8FA;
  min-height: 100vh;
}

.fav-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.fav-title {
  font-size: 22px;
  font-weight: 800;
  color: #1A1A2E;
  letter-spacing: -0.5px;
}

.fav-count {
  font-size: 14px;
}

.empty-state {
  height: calc(100vh - 140px);
  text-align: center;
  padding: 0 32px;
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

<template>
  <q-page class="home-page">
    <div class="search-shortcut q-px-md q-pt-md q-pb-sm" @click="goToSearch">
      <div class="search-fake">
        <q-icon name="search" color="grey-5" size="18px" />
        <span class="search-placeholder">오늘의 마감 특가 찾기...</span>
      </div>
    </div>

    <div class="section-header q-px-md q-pt-sm q-pb-xs">
      <div class="section-title">오늘의 특가 🔥</div>
      <div class="section-count text-grey-5">{{ mockProducts.length }}개</div>
    </div>

    <div class="q-px-md q-pb-xl">
      <div class="row q-col-gutter-sm">
        <div v-for="product in mockProducts" :key="product.id" class="col-6">
          <ProductCard :product="product" @click="goToDetail(product.id)" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()

const mockProducts = ref([
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
    id: '2',
    name: '초코파이 (12개입)',
    originalPrice: 3000,
    discountPrice: 1800,
    discountPercent: 40,
    expiryDate: '2026-05-25',
    storeId: 'store1',
    storeName: 'CU 강남점',
    location: '서울 강남구',
    image: 'https://picsum.photos/seed/choco2/400/300',
    category: 'snack'
  },
  {
    id: '3',
    name: '참치 김밥',
    originalPrice: 4000,
    discountPrice: 2000,
    discountPercent: 50,
    expiryDate: '2026-05-20',
    storeId: 'store2',
    storeName: 'GS25 역삼점',
    location: '서울 강남구',
    image: 'https://picsum.photos/seed/kimbap3/400/300',
    category: 'food'
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
    location: '서울 강남구',
    image: 'https://picsum.photos/seed/orange4/400/300',
    category: 'beverage'
  },
  {
    id: '5',
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
  {
    id: '6',
    name: '바나나 우유',
    originalPrice: 1500,
    discountPrice: 800,
    discountPercent: 47,
    expiryDate: '2026-05-21',
    storeId: 'store2',
    storeName: 'GS25 역삼점',
    location: '서울 강남구',
    image: 'https://picsum.photos/seed/banana7/400/300',
    category: 'dairy'
  },
])

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
</style>

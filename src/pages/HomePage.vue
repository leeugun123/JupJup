<template>
  <q-page class="q-pa-md">
    <q-input v-model="searchQuery" outlined dense placeholder="상품 검색..." prefix-icon="search" class="q-mb-md" />
    <div class="row q-col-gutter-md">
      <div v-for="product in mockProducts" :key="product.id" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <ProductCard :product="product" @click="goToDetail(product.id)" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const searchQuery = ref('')

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
    image: 'https://via.placeholder.com/200',
    category: 'beverage'
  },
  {
    id: '2',
    name: '초코파이',
    originalPrice: 3000,
    discountPrice: 1800,
    discountPercent: 40,
    expiryDate: '2026-05-25',
    storeId: 'store1',
    storeName: 'CU 강남점',
    location: '서울 강남구',
    image: 'https://via.placeholder.com/200',
    category: 'snack'
  },
  {
    id: '3',
    name: '김밥',
    originalPrice: 4000,
    discountPrice: 2000,
    discountPercent: 50,
    expiryDate: '2026-05-20',
    storeId: 'store2',
    storeName: 'GS25 역삼점',
    location: '서울 강남구',
    image: 'https://via.placeholder.com/200',
    category: 'food'
  }
])

function goToDetail(id: string) {
  void router.push(`/product/${id}`)
}
</script>

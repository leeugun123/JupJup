<template>
  <q-page class="q-pa-md">
    <h1 class="q-my-none q-mb-md">상품 목록</h1>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <ProductCard :product="mockProduct" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'

const mockProduct = {
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
}
</script>

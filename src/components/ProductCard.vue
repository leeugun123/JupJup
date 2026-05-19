<template>
  <q-card class="product-card cursor-pointer">
    <q-img :src="product.image" height="200px" />
    <q-card-section>
      <div class="discount-badge">-{{ product.discountPercent }}%</div>
      <div class="text-h6 ellipsis-2-lines q-mt-md">{{ product.name }}</div>
      <div class="text-caption text-grey">{{ product.storeName }}</div>
      <div class="q-mt-md">
        <div class="text-caption text-strike">₩{{ product.originalPrice.toLocaleString() }}</div>
        <div class="text-h6 text-primary">₩{{ product.discountPrice.toLocaleString() }}</div>
      </div>
      <div class="text-caption text-grey q-mt-md">유통기한: {{ formatDate(product.expiryDate) }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Product } from '../types/product'

interface Props {
  product: Product
}

defineProps<Props>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR')
}
</script>

<style scoped lang="scss">
.product-card {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}
.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
}
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.text-strike {
  text-decoration: line-through;
}
</style>

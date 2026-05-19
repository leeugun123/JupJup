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
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { mockProducts } from '../data/mockProducts'

const router = useRouter()

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

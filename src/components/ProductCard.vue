<template>
  <q-card class="product-card cursor-pointer" flat @click="emit('click')">
    <div class="img-wrap">
      <q-img :src="product.image" height="150px" fit="cover" class="product-img" />
      <div class="badge-discount">-{{ product.discountPercent }}%</div>
      <div v-if="daysLeft <= 2" class="badge-expiry" :class="{ today: daysLeft === 0 }">
        {{ daysLeft === 0 ? '오늘 마감' : `D-${daysLeft}` }}
      </div>
      <q-btn
        flat round dense
        :icon="isFav ? 'favorite' : 'favorite_border'"
        :color="isFav ? 'negative' : 'white'"
        class="fav-btn"
        size="sm"
        @click.stop="toggleFav"
      />
    </div>
    <div class="card-body">
      <div class="store-name">{{ product.storeName }}</div>
      <div class="product-name">{{ product.name }}</div>
      <div class="price-wrap">
        <span class="original-price">{{ product.originalPrice.toLocaleString() }}원</span>
        <span class="discount-price">{{ product.discountPrice.toLocaleString() }}원</span>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../types/product'
import { useFavoritesStore } from '../stores/favorites'

const props = defineProps<{ product: Product }>()
const emit = defineEmits(['click'])

const favStore = useFavoritesStore()
const isFav = computed(() => favStore.isFavorite(props.product.id))
function toggleFav() { favStore.toggle(props.product.id) }

const daysLeft = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(props.product.expiryDate)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
})
</script>

<style scoped lang="scss">
.product-card {
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s, box-shadow 0.15s;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  }
}

.img-wrap {
  position: relative;
  overflow: hidden;
}

.product-img {
  display: block;
}

.badge-discount {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #FF4757;
  color: white;
  font-size: 12px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 8px;
  letter-spacing: -0.3px;
}

.fav-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
}

.badge-expiry {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(255, 71, 87, 0.85);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 8px;
  backdrop-filter: blur(4px);

  &.today {
    background: rgba(30, 30, 30, 0.85);
  }
}

.card-body {
  padding: 10px 12px 14px;
}

.store-name {
  font-size: 11px;
  color: #AAAAAA;
  font-weight: 500;
  margin-bottom: 3px;
}

.product-name {
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.original-price {
  font-size: 11px;
  color: #CCCCCC;
  text-decoration: line-through;
}

.discount-price {
  font-size: 16px;
  font-weight: 800;
  color: #FF4757;
  letter-spacing: -0.5px;
}
</style>

<template>
  <!-- Compact card for horizontal scroll -->
  <div v-if="compact" class="compact-card" @click="$emit('click')">
    <div class="compact-img-wrap">
      <q-img :src="product.image" height="100px" style="border-radius: 10px 10px 0 0" />
      <div class="urgency-badge-sm" :class="`bg-${urgencyColor}`">
        {{ urgencyText }}
      </div>
    </div>
    <div class="compact-body">
      <div class="store-badge-sm" :style="`background: ${storeColor}`">
        {{ storeShortName }}
      </div>
      <div class="compact-name">{{ product.name }}</div>
      <div class="compact-price">{{ product.discountPrice.toLocaleString() }}원</div>
      <div class="compact-original">{{ product.originalPrice.toLocaleString() }}원</div>
    </div>
  </div>

  <!-- Regular grid card -->
  <q-card v-else flat class="product-card" @click="$emit('click')">
    <div class="img-wrap">
      <q-img :src="product.image" height="140px" />
      <div class="gradient-overlay" />

      <div class="urgency-badge" :class="`bg-${urgencyColor}`">
        {{ urgencyText }}
      </div>

      <div class="discount-badge">-{{ product.discountPercent }}%</div>

      <q-btn flat round dense icon="favorite_border"
             color="white" size="10px"
             class="heart-btn"
             @click.stop="$emit('favorite', product.id)" />
    </div>

    <q-card-section class="q-pa-sm q-pb-md">
      <div class="store-badge" :style="`background: ${storeColor}`">
        {{ storeShortName }}
      </div>

      <div class="product-name q-mt-xs">{{ product.name }}</div>

      <div class="q-mt-sm">
        <div class="original-price">{{ product.originalPrice.toLocaleString() }}원</div>
        <div class="row items-center justify-between q-mt-xs">
          <div class="discount-price">{{ product.discountPrice.toLocaleString() }}원</div>
          <div class="save-chip">
            {{ (product.originalPrice - product.discountPrice).toLocaleString() }}원 절약
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Product {
  id: string
  name: string
  originalPrice: number
  discountPrice: number
  discountPercent: number
  expiryDate: string
  storeId: string
  storeName: string
  location: string
  image: string
  category: string
}

interface Props {
  product: Product
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), { compact: false })
defineEmits<{ click: []; favorite: [id: string] }>()

function getDays(date: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(date)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000)
}

const days = computed(() => getDays(props.product.expiryDate))

const urgencyColor = computed(() => {
  if (days.value <= 0) return 'negative'
  if (days.value === 1) return 'deep-orange'
  if (days.value <= 3) return 'warning'
  return 'positive'
})

const urgencyText = computed(() => {
  if (days.value <= 0) return '오늘 마감'
  if (days.value === 1) return '내일 마감'
  return `D-${days.value}`
})

const storeColor = computed(() => {
  const name = props.product.storeName.toLowerCase()
  if (name.includes('cu')) return '#005BAC'
  if (name.includes('gs')) return '#007DC6'
  if (name.includes('세븐') || name.includes('seven') || name.includes('7')) return '#00875A'
  if (name.includes('이마트')) return '#F5A623'
  return '#666666'
})

const storeShortName = computed(() => {
  const name = props.product.storeName
  if (name.includes('CU')) return 'CU'
  if (name.includes('GS')) return 'GS25'
  if (name.includes('세븐') || name.includes('7')) return '7EV'
  if (name.includes('이마트')) return 'emart24'
  return name.split(' ')[0] ?? name
})
</script>

<style scoped lang="scss">
// ── Grid Card ──────────────────────────────────
.product-card {
  border-radius: 12px !important;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition: transform 0.15s ease;

  &:active { transform: scale(0.97); }
}

.img-wrap {
  position: relative;
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.18));
  pointer-events: none;
}

.urgency-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: -0.2px;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #FF4757;
  color: white;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: -0.3px;
}

.heart-btn {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.28);
}

.store-badge {
  display: inline-block;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.3px;
}

.product-name {
  font-size: 12px;
  font-weight: 600;
  color: #1A1A2E;
  line-height: 1.35;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.original-price {
  font-size: 10px;
  color: #BBBBBB;
  text-decoration: line-through;
}

.discount-price {
  font-size: 15px;
  font-weight: 800;
  color: #1A1A2E;
  letter-spacing: -0.5px;
}

.save-chip {
  font-size: 9px;
  color: #FF4757;
  font-weight: 700;
  background: rgba(255, 71, 87, 0.1);
  padding: 2px 5px;
  border-radius: 4px;
}

// ── Compact Card ──────────────────────────────
.compact-card {
  width: 140px;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease;
  cursor: pointer;

  &:active { transform: scale(0.97); }
}

.compact-img-wrap {
  position: relative;
}

.urgency-badge-sm {
  position: absolute;
  top: 6px;
  left: 6px;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 20px;
}

.compact-body {
  padding: 7px 8px 10px;
}

.store-badge-sm {
  display: inline-block;
  color: white;
  font-size: 8px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  margin-bottom: 4px;
}

.compact-name {
  font-size: 11px;
  font-weight: 600;
  color: #1A1A2E;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.compact-price {
  font-size: 13px;
  font-weight: 800;
  color: #FF4757;
  margin-top: 3px;
  letter-spacing: -0.4px;
}

.compact-original {
  font-size: 10px;
  color: #CCCCCC;
  text-decoration: line-through;
  margin-top: 1px;
}
</style>

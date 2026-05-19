<template>
  <q-page class="detail-page" v-if="product">
    <!-- Hero Image -->
    <div class="hero-wrap">
      <q-img :src="product.image" height="280px" style="width:100%" />
      <div class="hero-gradient" />

      <!-- Back button -->
      <q-btn
        flat round dense icon="arrow_back" color="white"
        class="back-btn"
        @click="$router.back()"
      />

      <!-- Discount badge -->
      <div class="hero-discount-badge">-{{ product.discountPercent }}%</div>

      <!-- Urgency badge -->
      <div class="hero-urgency-badge" :class="`bg-${urgencyColor}`">
        {{ urgencyText }}
      </div>
    </div>

    <!-- Content Card -->
    <div class="content-card">
      <!-- Store + Chain -->
      <div class="row items-center q-mb-sm" style="gap:8px">
        <div class="chain-badge" :style="`background: ${storeColor}`">
          {{ storeShortName }}
        </div>
        <span class="text-body2 text-grey-7 text-weight-medium">{{ product.storeName }}</span>
      </div>

      <!-- Product Name -->
      <div class="product-title">{{ product.name }}</div>

      <!-- D-day indicator -->
      <div class="dday-row q-mt-sm">
        <q-icon name="access_time" size="14px" :color="urgencyColor === 'negative' ? 'negative' : urgencyColor" />
        <span class="dday-text" :class="`text-${urgencyColor}`">
          유통기한 {{ urgencyText }} · {{ formatDate(product.expiryDate) }}까지
        </span>
      </div>

      <q-separator class="q-my-md" />

      <!-- Price Section -->
      <div class="price-section">
        <div class="row items-start justify-between">
          <div>
            <div class="price-label">정가</div>
            <div class="original-price">{{ product.originalPrice.toLocaleString() }}원</div>
          </div>
          <div class="text-center">
            <div class="price-label">할인율</div>
            <div class="discount-rate">-{{ product.discountPercent }}%</div>
          </div>
          <div class="text-right">
            <div class="price-label">할인가</div>
            <div class="final-price">{{ product.discountPrice.toLocaleString() }}원</div>
          </div>
        </div>

        <div class="save-banner q-mt-md">
          <q-icon name="savings" size="16px" color="positive" />
          <span>
            <strong>{{ (product.originalPrice - product.discountPrice).toLocaleString() }}원</strong> 절약!
          </span>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- Store Location -->
      <div class="q-mb-md">
        <div class="section-label q-mb-sm">📍 편의점 위치</div>
        <div class="map-placeholder">
          <q-icon name="map" size="32px" color="grey-4" />
          <div class="text-caption text-grey-5 q-mt-sm">지도 연동 예정</div>
        </div>
        <div class="store-info-row q-mt-sm">
          <div class="text-body2 text-weight-medium">{{ product.storeName }}</div>
          <div class="text-caption text-grey-6 q-mt-xs">{{ product.location }}</div>
          <div class="text-caption text-primary q-mt-xs cursor-pointer">
            <q-icon name="directions_walk" size="12px" /> 도보 약 5분 · 350m
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="row q-gutter-sm q-pb-xl">
        <q-btn
          flat round icon="favorite_border"
          color="primary"
          class="fav-btn col-auto"
          size="15px"
        />
        <q-btn
          label="길 찾기"
          color="primary"
          unelevated
          class="col action-btn"
          icon="directions"
        />
        <q-btn
          label="공유하기"
          color="grey-2"
          text-color="dark"
          unelevated
          class="col action-btn"
          icon="share"
        />
      </div>
    </div>
  </q-page>

  <!-- Not Found -->
  <q-page v-else class="column items-center justify-center">
    <q-icon name="search_off" size="64px" color="grey-4" />
    <div class="text-body1 text-grey-5 q-mt-md">상품을 찾을 수 없어요</div>
    <q-btn label="홈으로" color="primary" flat class="q-mt-md" @click="$router.push('/')" />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '../components/ProductCard.vue'

const route = useRoute()

const allProducts: Product[] = [
  { id: '1', name: '딸기 우유', originalPrice: 2500, discountPrice: 1500, discountPercent: 40, expiryDate: '2026-05-19', storeId: 'store1', storeName: 'CU 강남점', location: '서울 강남구 역삼동 123', image: 'https://picsum.photos/seed/milk1/800/600', category: 'dairy' },
  { id: '2', name: '초코파이 (12개입)', originalPrice: 3000, discountPrice: 1800, discountPercent: 40, expiryDate: '2026-05-25', storeId: 'store1', storeName: 'CU 강남점', location: '서울 강남구 역삼동 123', image: 'https://picsum.photos/seed/choco2/800/600', category: 'snack' },
  { id: '3', name: '참치 김밥', originalPrice: 4000, discountPrice: 2000, discountPercent: 50, expiryDate: '2026-05-19', storeId: 'store2', storeName: 'GS25 역삼점', location: '서울 강남구 역삼동 456', image: 'https://picsum.photos/seed/kimbap3/800/600', category: 'food' },
  { id: '4', name: '오렌지 주스 500ml', originalPrice: 1800, discountPrice: 900, discountPercent: 50, expiryDate: '2026-05-20', storeId: 'store2', storeName: 'GS25 역삼점', location: '서울 강남구 역삼동 456', image: 'https://picsum.photos/seed/orange4/800/600', category: 'beverage' },
  { id: '5', name: '통밀 크래커', originalPrice: 2200, discountPrice: 1100, discountPercent: 50, expiryDate: '2026-05-22', storeId: 'store3', storeName: '세븐일레븐 삼성점', location: '서울 강남구 삼성동 789', image: 'https://picsum.photos/seed/cracker5/800/600', category: 'snack' },
  { id: '6', name: '그릭 요거트', originalPrice: 3500, discountPrice: 2100, discountPercent: 40, expiryDate: '2026-05-19', storeId: 'store1', storeName: 'CU 강남점', location: '서울 강남구 역삼동 123', image: 'https://picsum.photos/seed/yogurt6/800/600', category: 'dairy' },
  { id: '7', name: '바나나 우유', originalPrice: 1500, discountPrice: 800, discountPercent: 47, expiryDate: '2026-05-21', storeId: 'store2', storeName: 'GS25 역삼점', location: '서울 강남구 역삼동 456', image: 'https://picsum.photos/seed/banana7/800/600', category: 'dairy' },
  { id: '8', name: '매운 컵라면', originalPrice: 1200, discountPrice: 700, discountPercent: 42, expiryDate: '2026-06-01', storeId: 'store3', storeName: '세븐일레븐 삼성점', location: '서울 강남구 삼성동 789', image: 'https://picsum.photos/seed/ramen8/800/600', category: 'food' },
]

const product = computed(() =>
  allProducts.find((p) => p.id === String(route.params['id']))
)

function getDays(date: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(date)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000)
}

const days = computed(() => (product.value ? getDays(product.value.expiryDate) : 0))

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
  const name = (product.value?.storeName ?? '').toLowerCase()
  if (name.includes('cu')) return '#005BAC'
  if (name.includes('gs')) return '#007DC6'
  if (name.includes('세븐') || name.includes('7')) return '#00875A'
  if (name.includes('이마트')) return '#F5A623'
  return '#666666'
})

const storeShortName = computed(() => {
  const name = product.value?.storeName ?? ''
  if (name.includes('CU')) return 'CU'
  if (name.includes('GS')) return 'GS25'
  if (name.includes('세븐') || name.includes('7')) return '7EV'
  if (name.includes('이마트')) return 'emart24'
  return name.split(' ')[0] ?? ''
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped lang="scss">
.detail-page {
  background: #F5F6F8;
  padding-bottom: 80px;
}

// ── Hero ─────────────────────────────────────
.hero-wrap {
  position: relative;
}

.hero-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
  pointer-events: none;
}

.back-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}

.hero-discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #FF4757;
  color: white;
  font-size: 14px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: -0.3px;
}

.hero-urgency-badge {
  position: absolute;
  bottom: 16px;
  left: 16px;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
}

// ── Content Card ──────────────────────────────
.content-card {
  background: white;
  border-radius: 24px 24px 0 0;
  margin-top: -20px;
  padding: 24px 20px 20px;
  position: relative;
  min-height: calc(100vh - 260px);
}

.chain-badge {
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 5px;
  letter-spacing: 0.3px;
}

.product-title {
  font-size: 22px;
  font-weight: 800;
  color: #1A1A2E;
  letter-spacing: -0.5px;
  line-height: 1.3;
}

.dday-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dday-text {
  font-size: 12px;
  font-weight: 600;
}

// ── Price ─────────────────────────────────────
.price-label {
  font-size: 11px;
  color: #AAAAAA;
  margin-bottom: 3px;
}

.original-price {
  font-size: 16px;
  color: #CCCCCC;
  text-decoration: line-through;
  font-weight: 500;
}

.discount-rate {
  font-size: 22px;
  font-weight: 800;
  color: #FF4757;
  letter-spacing: -0.5px;
}

.final-price {
  font-size: 24px;
  font-weight: 900;
  color: #1A1A2E;
  letter-spacing: -0.8px;
}

.save-banner {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(46, 213, 115, 0.1);
  border: 1.5px solid rgba(46, 213, 115, 0.3);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #1A1A2E;
}

// ── Location ──────────────────────────────────
.section-label {
  font-size: 13px;
  font-weight: 700;
  color: #1A1A2E;
  letter-spacing: -0.2px;
}

.map-placeholder {
  background: #F5F6F8;
  border-radius: 12px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.store-info-row {
  padding: 12px 0 0;
}

// ── Actions ───────────────────────────────────
.fav-btn {
  border: 1.5px solid #FF4757;
  border-radius: 12px !important;
  min-width: 48px;
  height: 48px;
}

.action-btn {
  border-radius: 12px !important;
  height: 48px;
  font-weight: 700;
  font-size: 14px;
}
</style>

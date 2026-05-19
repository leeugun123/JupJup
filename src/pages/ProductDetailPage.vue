<template>
  <q-page class="detail-page">
    <!-- Not Found -->
    <div v-if="!product" class="column items-center justify-center" style="height: 60vh">
      <q-icon name="search_off" size="64px" color="grey-3" />
      <div class="text-body2 text-grey-5 q-mt-md">상품을 찾을 수 없어요</div>
      <q-btn flat label="돌아가기" color="primary" class="q-mt-sm" @click="$router.back()" />
    </div>

    <template v-else>
      <!-- Hero Image -->
      <div class="hero-wrap">
        <q-img
          :src="product.image"
          height="300px"
          fit="cover"
          class="hero-img"
        />
        <div class="hero-overlay" />
        <q-btn
          flat round dense
          icon="arrow_back"
          class="back-btn"
          @click="$router.back()"
        />
        <div class="hero-badge">-{{ product.discountPercent }}%</div>
      </div>

      <!-- Content -->
      <div class="content-wrap">
        <!-- Title Card -->
        <div class="title-section">
          <div class="store-label">
            <q-icon name="storefront" size="14px" color="grey-5" />
            <span>{{ product.storeName }}</span>
          </div>
          <div class="product-name">{{ product.name }}</div>
          <div class="expiry-row">
            <q-icon name="schedule" size="14px" color="negative" />
            <span class="expiry-text text-negative">
              {{ daysLeft === 0 ? '오늘 마감' : `D-${daysLeft}` }} · {{ formatDate(product.expiryDate) }} 마감
            </span>
          </div>
        </div>

        <div class="divider" />

        <!-- Price Section -->
        <div class="price-section">
          <div class="price-label">가격 정보</div>
          <div class="price-row">
            <div class="price-item">
              <div class="price-item-label">정가</div>
              <div class="price-item-value original">{{ product.originalPrice.toLocaleString() }}원</div>
            </div>
            <q-icon name="arrow_forward" color="grey-4" size="18px" />
            <div class="price-item">
              <div class="price-item-label">할인가</div>
              <div class="price-item-value discount">{{ product.discountPrice.toLocaleString() }}원</div>
            </div>
            <div class="price-item">
              <div class="price-item-label">절약</div>
              <div class="price-item-value saving">{{ (product.originalPrice - product.discountPrice).toLocaleString() }}원</div>
            </div>
          </div>
        </div>

        <div class="divider" />

        <!-- Store Info -->
        <div class="info-section">
          <div class="info-label">편의점 정보</div>
          <div class="info-row">
            <div class="info-icon-wrap">
              <q-icon name="storefront" size="18px" color="primary" />
            </div>
            <div>
              <div class="info-main">{{ product.storeName }}</div>
              <div class="info-sub">{{ product.location }}</div>
            </div>
            <q-space />
            <q-btn flat round dense icon="map" color="grey-5" size="sm" />
          </div>
        </div>
      </div>

      <!-- Bottom Action Bar -->
      <div class="action-bar">
        <q-btn flat round icon="favorite_border" color="grey-5" class="fav-btn" />
        <q-btn unelevated label="구매하기" color="primary" class="buy-btn" rounded />
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockProducts } from '../data/mockProducts'

const route = useRoute()

const product = computed(() =>
  mockProducts.find((p) => p.id === route.params.id)
)

const daysLeft = computed(() => {
  if (!product.value) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(product.value.expiryDate)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}
</script>

<style scoped lang="scss">
.detail-page {
  background: #F7F8FA;
  padding-bottom: 80px;
}

// ── Hero ───────────────────────────────────────
.hero-wrap {
  position: relative;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 50%);
}

.back-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.35);
  color: white;
  backdrop-filter: blur(4px);
}

.hero-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #FF4757;
  color: white;
  font-size: 15px;
  font-weight: 900;
  padding: 5px 12px;
  border-radius: 10px;
  letter-spacing: -0.5px;
}

// ── Content ────────────────────────────────────
.content-wrap {
  background: white;
  border-radius: 24px 24px 0 0;
  margin-top: -20px;
  position: relative;
  z-index: 1;
  padding: 24px 20px 0;
}

.title-section {
  margin-bottom: 20px;
}

.store-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #AAAAAA;
  font-weight: 500;
  margin-bottom: 6px;
}

.product-name {
  font-size: 24px;
  font-weight: 800;
  color: #1A1A2E;
  letter-spacing: -0.8px;
  line-height: 1.2;
  margin-bottom: 10px;
}

.expiry-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.expiry-text {
  font-size: 13px;
  font-weight: 600;
}

.divider {
  height: 1px;
  background: #F5F5F5;
  margin: 0 -20px 20px;
}

// ── Price ──────────────────────────────────────
.price-section {
  margin-bottom: 20px;
}

.price-label,
.info-label {
  font-size: 12px;
  font-weight: 700;
  color: #AAAAAA;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price-item {
  flex: 1;
  text-align: center;
}

.price-item-label {
  font-size: 11px;
  color: #AAAAAA;
  margin-bottom: 4px;
}

.price-item-value {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.5px;

  &.original {
    font-size: 15px;
    color: #CCCCCC;
    text-decoration: line-through;
    font-weight: 500;
  }

  &.discount {
    color: #FF4757;
    font-size: 20px;
  }

  &.saving {
    color: #2ED573;
  }
}

// ── Store Info ─────────────────────────────────
.info-section {
  padding-bottom: 24px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon-wrap {
  width: 40px;
  height: 40px;
  background: #FFF0F1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-main {
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.info-sub {
  font-size: 12px;
  color: #AAAAAA;
  margin-top: 2px;
}

// ── Action Bar ────────────────────────────────
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -1px 0 #F0F0F0, 0 -4px 16px rgba(0, 0, 0, 0.06);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
}

.fav-btn {
  border: 1.5px solid #EEEEEE;
  border-radius: 12px;
  width: 48px;
  height: 48px;
}

.buy-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
</style>

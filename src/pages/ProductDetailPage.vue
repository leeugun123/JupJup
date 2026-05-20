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
        <q-img :src="product.image" height="300px" fit="cover" />
        <div class="hero-overlay" />
        <q-btn flat round dense icon="arrow_back" class="back-btn" @click="$router.back()" />
        <div class="hero-badge">-{{ product.discountPercent }}%</div>
      </div>

      <!-- Content -->
      <div class="content-wrap">
        <div class="title-section">
          <div class="store-label">
            <q-icon name="storefront" size="14px" color="grey-5" />
            <span>{{ product.storeName }}</span>
          </div>
          <div class="product-name">{{ product.name }}</div>
          <div class="expiry-row">
            <q-icon name="schedule" size="14px" color="negative" />
            <span class="expiry-text text-negative">
              {{ daysLeft === 0 ? '오늘 마감' : `D-${daysLeft}` }} ·
              {{ formatDate(product.expiryDate) }} 마감
            </span>
          </div>
        </div>

        <div class="divider" />

        <div class="price-section">
          <div class="price-label">가격 정보</div>
          <div class="price-row">
            <div class="price-item">
              <div class="price-item-label">정가</div>
              <div class="price-item-value original">
                {{ product.originalPrice.toLocaleString() }}원
              </div>
            </div>
            <q-icon name="arrow_forward" color="grey-4" size="18px" />
            <div class="price-item">
              <div class="price-item-label">할인가</div>
              <div class="price-item-value discount">
                {{ product.discountPrice.toLocaleString() }}원
              </div>
            </div>
            <div class="price-item">
              <div class="price-item-label">절약</div>
              <div class="price-item-value saving">
                {{ (product.originalPrice - product.discountPrice).toLocaleString() }}원
              </div>
            </div>
          </div>
        </div>

        <div class="divider" />

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
        <q-btn
          flat
          round
          :icon="isFav ? 'favorite' : 'favorite_border'"
          :color="isFav ? 'negative' : 'grey-5'"
          class="fav-btn"
          @click="favStore.toggle(product.id)"
        />
        <q-btn
          unelevated
          label="구매하기"
          color="primary"
          class="buy-btn"
          rounded
          @click="showConfirm = true"
        />
      </div>
    </template>

    <!-- 구매 확인 바텀시트 -->
    <q-dialog v-model="showConfirm" position="bottom">
      <q-card class="confirm-sheet" v-if="product">
        <div class="confirm-handle" />
        <div class="confirm-body">
          <div class="confirm-title">구매하기</div>
          <div class="confirm-product-row">
            <q-img
              :src="product.image"
              width="60px"
              height="60px"
              fit="cover"
              class="confirm-img"
            />
            <div class="confirm-product-info">
              <div class="confirm-store">{{ product.storeName }}</div>
              <div class="confirm-name">{{ product.name }}</div>
              <div class="confirm-price">{{ product.discountPrice.toLocaleString() }}원</div>
            </div>
          </div>
          <div class="confirm-savings-row">
            <q-icon name="savings" color="positive" size="16px" />
            <span class="confirm-savings-text">
              정가 대비
              <strong
                >{{ (product.originalPrice - product.discountPrice).toLocaleString() }}원</strong
              >
              절약!
            </span>
          </div>
          <div class="confirm-actions">
            <q-btn
              flat
              label="취소"
              color="grey-5"
              class="confirm-cancel"
              @click="showConfirm = false"
            />
            <q-btn
              unelevated
              label="구매 확인"
              color="primary"
              class="confirm-ok"
              rounded
              @click="doPurchase"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- 구매 완료 다이얼로그 -->
    <q-dialog v-model="showSuccess">
      <q-card class="success-dialog" v-if="lastPurchase">
        <div class="success-icon-wrap">
          <q-icon name="check_circle" color="positive" size="56px" />
        </div>
        <div class="success-title">구매 완료!</div>
        <div class="success-sub">편의점에서 아래 코드를 제시해주세요</div>

        <div class="success-code-wrap">
          <div class="success-code">{{ lastPurchase.code }}</div>
          <div class="barcode-wrap">
            <div
              v-for="i in 40"
              :key="i"
              class="barcode-bar"
              :style="{ width: `${Math.random() > 0.5 ? 3 : 2}px` }"
            />
          </div>
        </div>

        <div class="success-info">
          <div class="success-info-row">
            <span class="success-info-label">상품</span>
            <span class="success-info-value">{{ lastPurchase.product.name }}</span>
          </div>
          <div class="success-info-row">
            <span class="success-info-label">결제금액</span>
            <span class="success-info-value text-primary"
              >{{ lastPurchase.product.discountPrice.toLocaleString() }}원</span
            >
          </div>
          <div class="success-info-row">
            <span class="success-info-label">절약금액</span>
            <span class="success-info-value text-positive"
              >{{ lastPurchase.savings.toLocaleString() }}원</span
            >
          </div>
        </div>

        <q-btn
          unelevated
          label="확인"
          color="primary"
          class="success-close-btn"
          rounded
          @click="onSuccessClose"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { mockProducts } from '../data/mockProducts';
import { useFavoritesStore } from '../stores/favorites';
import { usePurchasesStore } from '../stores/purchases';
import type { Purchase } from '../stores/purchases';

const route = useRoute();
const router = useRouter();
const favStore = useFavoritesStore();
const purchasesStore = usePurchasesStore();

const showConfirm = ref(false);
const showSuccess = ref(false);
const lastPurchase = ref<Purchase | null>(null);

const product = computed(() => mockProducts.find((p) => p.id === route.params.id));

const isFav = computed(() => (product.value ? favStore.isFavorite(product.value.id) : false));

const daysLeft = computed(() => {
  if (!product.value) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(product.value.expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

function doPurchase() {
  if (!product.value) return;
  showConfirm.value = false;
  lastPurchase.value = purchasesStore.add(product.value);
  showSuccess.value = true;
}

function onSuccessClose() {
  showSuccess.value = false;
  void router.push('/');
}
</script>

<style scoped lang="scss">
.detail-page {
  background: #f7f8fa;
  padding-bottom: 80px;
}

// ── Hero ───────────────────────────────────────
.hero-wrap {
  position: relative;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 0%, transparent 50%);
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
  background: #ff4757;
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
  color: #aaaaaa;
  font-weight: 500;
  margin-bottom: 6px;
}

.product-name {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a2e;
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
  background: #f5f5f5;
  margin: 0 -20px 20px;
}

.price-section {
  margin-bottom: 20px;
}

.price-label,
.info-label {
  font-size: 12px;
  font-weight: 700;
  color: #aaaaaa;
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
  color: #aaaaaa;
  margin-bottom: 4px;
}

.price-item-value {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.5px;

  &.original {
    font-size: 15px;
    color: #cccccc;
    text-decoration: line-through;
    font-weight: 500;
  }
  &.discount {
    color: #ff4757;
    font-size: 20px;
  }
  &.saving {
    color: #2ed573;
  }
}

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
  background: #fff0f1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-main {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}
.info-sub {
  font-size: 12px;
  color: #aaaaaa;
  margin-top: 2px;
}

// ── Action Bar ────────────────────────────────
.action-bar {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  background: white;
  box-shadow:
    0 -1px 0 #f0f0f0,
    0 -4px 16px rgba(0, 0, 0, 0.06);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
}

.fav-btn {
  border: 1.5px solid #eeeeee;
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

// ── Confirm Sheet ─────────────────────────────
.confirm-sheet {
  border-radius: 24px 24px 0 0 !important;
  padding-bottom: env(safe-area-inset-bottom);
}

.confirm-handle {
  width: 36px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 12px auto 0;
}

.confirm-body {
  padding: 20px 20px 24px;
}

.confirm-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
  margin-bottom: 16px;
}

.confirm-product-row {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #f7f8fa;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 12px;
}

.confirm-img {
  border-radius: 10px;
  flex-shrink: 0;
}

.confirm-store {
  font-size: 11px;
  color: #aaaaaa;
  margin-bottom: 2px;
}
.confirm-name {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 4px;
}
.confirm-price {
  font-size: 18px;
  font-weight: 800;
  color: #ff4757;
  letter-spacing: -0.5px;
}

.confirm-savings-row {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0fff4;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 20px;
}

.confirm-savings-text {
  font-size: 13px;
  color: #444;
}

.confirm-actions {
  display: flex;
  gap: 10px;
}

.confirm-cancel {
  flex: 1;
  height: 48px;
}
.confirm-ok {
  flex: 2;
  height: 48px;
  font-weight: 700;
}

// ── Success Dialog ────────────────────────────
.success-dialog {
  width: 320px;
  border-radius: 24px !important;
  padding: 28px 24px 24px;
  text-align: center;
}

.success-icon-wrap {
  margin-bottom: 12px;
}

.success-title {
  font-size: 22px;
  font-weight: 900;
  color: #1a1a2e;
  letter-spacing: -0.8px;
  margin-bottom: 6px;
}

.success-sub {
  font-size: 13px;
  color: #aaaaaa;
  margin-bottom: 20px;
}

.success-code-wrap {
  background: #f7f8fa;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 20px;
}

.success-code {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 6px;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.barcode-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 40px;
}

.barcode-bar {
  height: 100%;
  background: #1a1a2e;
  border-radius: 1px;
}

.success-info {
  text-align: left;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.success-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.success-info-label {
  font-size: 13px;
  color: #aaaaaa;
}
.success-info-value {
  font-size: 13px;
  font-weight: 700;
  color: #1a1a2e;
}

.success-close-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 800;
}
</style>

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
          <div class="store-info-card" :style="`border-left: 4px solid ${storeColor}`">
            <div class="info-row">
              <div class="info-icon-wrap" :style="`background: ${storeBgColor}`">
                <q-icon name="storefront" size="18px" :style="`color: ${storeColor}`" />
              </div>
              <div>
                <div class="info-main">
                  <span class="store-brand-label" :style="`color: ${storeColor}`">{{ storeBrand }}</span>
                  {{ product.storeName.replace(storeBrand, '').trim() }}
                </div>
                <div class="info-sub">{{ product.location }}</div>
              </div>
              <q-space />
              <q-btn flat round dense icon="map" color="grey-5" size="sm" @click="showMap = !showMap" />
            </div>
          </div>

          <!-- Mock Map -->
          <div v-if="showMap" class="mock-map">
            <div class="map-tile">
              <div class="map-road map-road--h" style="top: 40%" />
              <div class="map-road map-road--v" style="left: 35%" />
              <div class="map-road map-road--h map-road--sub" style="top: 65%" />
              <div class="map-road map-road--v map-road--sub" style="left: 65%" />
              <div class="map-pin-wrap">
                <div class="map-pin" :style="`background: ${storeColor}`">
                  <q-icon name="storefront" size="14px" color="white" />
                </div>
                <div class="map-pin-label" :style="`color: ${storeColor}`">{{ storeBrand }}</div>
              </div>
              <div class="map-overlay-text">{{ product.location }}</div>
            </div>
            <div class="map-footer">
              <q-icon name="location_on" size="14px" color="grey-5" />
              <span class="map-addr">{{ product.location }}</span>
              <q-space />
              <span class="map-distance">약 350m</span>
            </div>
          </div>
        </div>

        <!-- Alert Toggle -->
        <div class="alert-section">
          <div class="divider" />
          <div class="alert-row" @click="toggleAlert">
            <div class="alert-left">
              <div class="alert-icon-wrap" :class="{ 'alert-icon-wrap--on': alertOn }">
                <q-icon
                  :name="alertOn ? 'notifications_active' : 'notifications_none'"
                  size="20px"
                  :color="alertOn ? 'white' : 'grey-5'"
                />
              </div>
              <div>
                <div class="alert-title">마감 알림</div>
                <div class="alert-sub">{{ alertOn ? '알림이 설정됐어요' : '마감 시 알림을 받아보세요' }}</div>
              </div>
            </div>
            <q-toggle
              :model-value="alertOn"
              color="primary"
              @update:model-value="toggleAlert"
              @click.stop
            />
          </div>
        </div>

        <!-- Reviews -->
        <div class="review-section">
          <div class="divider" />
          <div class="review-header">
            <span class="review-title">구매 후기</span>
            <div class="review-avg-wrap">
              <span class="review-avg">{{ avgRating }}</span>
              <div class="stars-row">
                <q-icon
                  v-for="s in 5"
                  :key="s"
                  :name="s <= Math.round(avgRating) ? 'star' : 'star_border'"
                  size="14px"
                  color="warning"
                />
              </div>
              <span class="review-count text-grey-5">({{ reviews.length }})</span>
            </div>
          </div>
          <div class="review-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-top">
                <div class="review-avatar">{{ review.initial }}</div>
                <div class="review-meta">
                  <div class="review-name">{{ review.name }}</div>
                  <div class="stars-row">
                    <q-icon
                      v-for="s in 5"
                      :key="s"
                      :name="s <= review.rating ? 'star' : 'star_border'"
                      size="12px"
                      color="warning"
                    />
                  </div>
                </div>
                <span class="review-date text-grey-5">{{ review.date }}</span>
              </div>
              <div class="review-text">{{ review.text }}</div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div v-if="relatedProducts.length" class="related-section">
          <div class="divider" />
          <div class="related-header">
            <span class="related-title">이 편의점의 다른 특가</span>
            <span class="related-store" :style="`color: ${storeColor}`">{{ product.storeName }}</span>
          </div>
          <div class="related-scroll">
            <div v-for="p in relatedProducts" :key="p.id" class="related-item">
              <ProductCard :product="p" @click="router.push(`/product/${p.id}`)" />
            </div>
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
          flat
          round
          icon="share"
          color="grey-5"
          class="fav-btn"
          @click="shareProduct"
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
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { mockProducts } from '../data/mockProducts';
import { useFavoritesStore } from '../stores/favorites';
import { usePurchasesStore } from '../stores/purchases';
import { useRecentlyViewedStore } from '../stores/recentlyViewed';
import type { Purchase } from '../stores/purchases';
import { storeConfig } from '../data/stores';
import ProductCard from '../components/ProductCard.vue';
import { getProductReviews, getAverageRating } from '../data/mockReviews';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const favStore = useFavoritesStore();
const purchasesStore = usePurchasesStore();
const recentlyViewedStore = useRecentlyViewedStore();

const showConfirm = ref(false);
const showSuccess = ref(false);
const showMap = ref(false);
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

const storeInfo = computed(() =>
  product.value ? storeConfig[product.value.storeId] : null,
);
const storeColor = computed(() => storeInfo.value?.color ?? '#ff4757');
const storeBgColor = computed(() => storeInfo.value?.bgColor ?? '#fff0f1');
const storeBrand = computed(() => storeInfo.value?.label ?? '');

const reviews = computed(() => (product.value ? getProductReviews(product.value.id) : []));
const avgRating = computed(() => getAverageRating(reviews.value));

const relatedProducts = computed(() => {
  if (!product.value) return [];
  return mockProducts
    .filter((p) => p.storeId === product.value!.storeId && p.id !== product.value!.id)
    .slice(0, 8);
});

const ALERT_KEY = (id: string) => `jupjup_alert_${id}`;
const alertOn = ref(false);

watch(
  () => product.value?.id,
  (id) => {
    if (id) {
      alertOn.value = !!localStorage.getItem(ALERT_KEY(id));
      recentlyViewedStore.add(id); // 최근 본 상품 저장
    }
  },
  { immediate: true },
);

function toggleAlert() {
  if (!product.value) return;
  const key = ALERT_KEY(product.value.id);
  alertOn.value = !alertOn.value;
  if (alertOn.value) {
    localStorage.setItem(key, '1');
    $q.notify({ message: '마감 알림이 설정됐어요! 🔔', color: 'dark', timeout: 1800 });
  } else {
    localStorage.removeItem(key);
    $q.notify({ message: '알림이 해제됐어요', color: 'grey-7', timeout: 1600 });
  }
}

async function shareProduct() {
  if (!product.value) return;
  const text = `${product.value.name} · ${product.value.discountPercent}% 할인 · ${product.value.discountPrice.toLocaleString()}원\n${product.value.storeName}`;
  if (navigator.share) {
    await navigator.share({ title: product.value.name, text, url: window.location.href });
  } else {
    await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    $q.notify({ message: '링크가 복사됐어요!', icon: 'link', color: 'dark', timeout: 1800 });
  }
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

.store-info-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 12px;
}

.store-brand-label {
  font-weight: 800;
  margin-right: 2px;
}

// ── Alert Toggle ──────────────────────────────
.alert-section {
  padding-bottom: 4px;
}

.alert-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 20px;
  cursor: pointer;
}

.alert-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;

  &--on {
    background: #ff4757;
  }
}

.alert-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}

.alert-sub {
  font-size: 12px;
  color: #aaaaaa;
  margin-top: 2px;
}

// ── Related Products ───────────────────────────
.related-section {
  padding-bottom: 24px;
}

.related-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.related-title {
  font-size: 15px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.3px;
}

.related-store {
  font-size: 12px;
  font-weight: 600;
}

.related-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;
  &::-webkit-scrollbar {
    display: none;
  }
}

.related-item {
  flex: 0 0 155px;
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

// ── Mock Map ──────────────────────────────────
.mock-map {
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eeeeee;
}

.map-tile {
  position: relative;
  height: 140px;
  background: #e8f0e4;
  overflow: hidden;
}

.map-road {
  position: absolute;
  background: white;

  &--h { width: 100%; height: 10px; }
  &--v { width: 10px; height: 100%; }
  &--sub { background: rgba(255,255,255,0.6); height: 6px; width: 6px; }
  &--h#{&}--sub { width: 100%; height: 6px; }
  &--v#{&}--sub { width: 6px; height: 100%; }
}

.map-pin-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.map-pin {
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0,0,0,0.25);

  .q-icon { transform: rotate(45deg); }
}

.map-pin-label {
  font-size: 11px;
  font-weight: 800;
  background: white;
  padding: 2px 6px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
}

.map-overlay-text {
  position: absolute;
  bottom: 6px;
  left: 8px;
  font-size: 10px;
  color: #555;
  background: rgba(255,255,255,0.85);
  padding: 2px 6px;
  border-radius: 4px;
}

.map-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.map-addr {
  font-size: 12px;
  color: #666;
  flex: 1;
}

.map-distance {
  font-size: 11px;
  color: #ff4757;
  font-weight: 600;
}

// ── Reviews ───────────────────────────────────
.review-section {
  padding-bottom: 20px;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.review-title {
  font-size: 15px;
  font-weight: 800;
  color: #1a1a2e;
}

.review-avg-wrap {
  display: flex;
  align-items: center;
  gap: 5px;
}

.review-avg {
  font-size: 16px;
  font-weight: 800;
  color: #1a1a2e;
}

.stars-row {
  display: flex;
  gap: 1px;
}

.review-count {
  font-size: 12px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.review-item {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 12px;
}

.review-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.review-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4757, #ff6b6b);
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.review-meta {
  flex: 1;
}

.review-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 2px;
}

.review-date {
  font-size: 11px;
}

.review-text {
  font-size: 13px;
  color: #444;
  line-height: 1.5;
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

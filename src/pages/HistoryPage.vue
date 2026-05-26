<template>
  <q-page class="history-page">
    <div class="history-header q-px-md q-pt-md q-pb-sm">
      <span class="history-title">이용 내역</span>
      <span class="history-count text-grey-5">{{ purchasesStore.history.length }}건</span>
    </div>

    <div v-if="purchasesStore.history.length" class="q-px-md q-pb-xl">
      <div class="summary-card q-mb-md">
        <div class="summary-item">
          <div class="summary-value text-primary">{{ purchasesStore.history.length }}</div>
          <div class="summary-label">총 구매</div>
        </div>
        <div class="summary-divider" />
        <div class="summary-item">
          <div class="summary-value text-positive">
            {{ purchasesStore.totalSavings().toLocaleString() }}원
          </div>
          <div class="summary-label">총 절약</div>
        </div>
      </div>

      <div
        v-for="purchase in purchasesStore.history"
        :key="purchase.id"
        class="history-card"
        @click="openDetail(purchase)"
      >
        <div class="history-card-top">
          <q-img
            :src="purchase.product.image"
            width="64px"
            height="64px"
            fit="cover"
            class="history-img"
          />
          <div class="history-info">
            <div class="history-store">{{ purchase.product.storeName }}</div>
            <div class="history-name">{{ purchase.product.name }}</div>
            <div class="history-price-row">
              <span class="history-price">{{ purchase.product.discountPrice.toLocaleString() }}원</span>
              <span class="history-saving">{{ purchase.savings.toLocaleString() }}원 절약</span>
            </div>
          </div>
          <q-icon name="chevron_right" color="grey-3" size="20px" />
        </div>
        <div class="history-card-bottom">
          <div class="history-code-wrap">
            <q-icon name="qr_code" size="14px" color="grey-5" />
            <span class="history-code">{{ purchase.code }}</span>
          </div>
          <span class="history-date">{{ formatDate(purchase.purchasedAt) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state column items-center justify-center">
      <q-icon name="receipt_long" size="64px" color="grey-3" />
      <div class="empty-title q-mt-md">이용 내역이 없어요</div>
      <div class="empty-sub q-mt-xs">마감 할인 상품을 구매해보세요!</div>
      <q-btn unelevated color="primary" rounded label="특가 상품 보러가기" class="q-mt-lg" to="/" />
    </div>

    <!-- 구매 내역 상세 다이얼로그 -->
    <q-dialog v-model="showDetail" position="bottom">
      <q-card v-if="selectedPurchase" class="detail-sheet">
        <div class="dialog-handle" />

        <div class="detail-header">
          <span class="detail-title">구매 상세</span>
          <span class="detail-date">{{ formatDate(selectedPurchase.purchasedAt) }}</span>
        </div>

        <!-- 상품 정보 -->
        <div class="detail-product-row">
          <q-img
            :src="selectedPurchase.product.image"
            width="72px"
            height="72px"
            fit="cover"
            class="detail-img"
          />
          <div class="detail-product-info">
            <div class="detail-store">{{ selectedPurchase.product.storeName }}</div>
            <div class="detail-name">{{ selectedPurchase.product.name }}</div>
            <div class="detail-price-row">
              <span class="detail-original">{{ selectedPurchase.product.originalPrice.toLocaleString() }}원</span>
              <q-icon name="arrow_forward" color="grey-4" size="14px" />
              <span class="detail-discount">{{ selectedPurchase.product.discountPrice.toLocaleString() }}원</span>
            </div>
          </div>
        </div>

        <!-- 절약 배지 -->
        <div class="detail-saving-row">
          <q-icon name="savings" color="positive" size="16px" />
          <span class="detail-saving-text">
            <strong>{{ selectedPurchase.savings.toLocaleString() }}원</strong> 절약 ·
            <strong>{{ selectedPurchase.product.discountPercent }}%</strong> 할인
          </span>
        </div>

        <div class="detail-divider" />

        <!-- 바코드 -->
        <div class="detail-code-section">
          <div class="detail-code-label">구매 코드</div>
          <div class="detail-code">{{ selectedPurchase.code }}</div>
          <div class="barcode-wrap">
            <div
              v-for="i in 44"
              :key="i"
              class="barcode-bar"
              :style="{ width: `${i % 3 === 0 ? 3 : 2}px`, height: `${i % 5 === 0 ? 44 : 36}px` }"
            />
          </div>
          <div class="detail-code-hint">편의점 직원에게 이 코드를 제시해주세요</div>
        </div>

        <q-btn
          flat
          label="닫기"
          color="grey-5"
          class="detail-close-btn"
          @click="showDetail = false"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePurchasesStore } from '../stores/purchases';
import type { Purchase } from '../stores/purchases';

const purchasesStore = usePurchasesStore();

const showDetail = ref(false);
const selectedPurchase = ref<Purchase | null>(null);

function openDetail(purchase: Purchase) {
  selectedPurchase.value = purchase;
  showDetail.value = true;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<style scoped lang="scss">
.history-page {
  background: #f7f8fa;
  min-height: 100vh;
}

.history-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.history-title {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.history-count {
  font-size: 14px;
}

// ── Summary ───────────────────────────────────
.summary-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  padding: 16px 0;
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.summary-label {
  font-size: 11px;
  color: #aaaaaa;
  font-weight: 500;
}

.summary-divider {
  width: 1px;
  height: 32px;
  background: #f0f0f0;
}

// ── History Card ──────────────────────────────
.history-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.99);
  }
}

.history-card-top {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 14px;
}

.history-img {
  border-radius: 10px;
  flex-shrink: 0;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-store {
  font-size: 11px;
  color: #aaaaaa;
  margin-bottom: 2px;
}

.history-name {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-price {
  font-size: 15px;
  font-weight: 800;
  color: #ff4757;
  letter-spacing: -0.3px;
}

.history-saving {
  font-size: 11px;
  font-weight: 600;
  color: #2ed573;
  background: #f0fff4;
  padding: 2px 6px;
  border-radius: 6px;
}

.history-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-top: 1px solid #f5f5f5;
  background: #fafafa;
}

.history-code-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.history-code {
  font-size: 13px;
  font-weight: 700;
  color: #444;
  letter-spacing: 2px;
}

.history-date {
  font-size: 11px;
  color: #aaaaaa;
}

// ── Empty State ───────────────────────────────
.empty-state {
  height: calc(100vh - 140px);
  text-align: center;
  padding: 0 32px;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #444;
}

.empty-sub {
  font-size: 13px;
  color: #aaaaaa;
}

// ── Detail Sheet ──────────────────────────────
.detail-sheet {
  width: 100%;
  max-width: 480px;
  border-radius: 24px 24px 0 0 !important;
  padding-bottom: 28px;
}

.dialog-handle {
  width: 36px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 12px auto 0;
}

.detail-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 16px 20px 12px;
}

.detail-title {
  font-size: 16px;
  font-weight: 800;
  color: #1a1a2e;
}

.detail-date {
  font-size: 12px;
  color: #aaaaaa;
}

.detail-product-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 0 20px 12px;
  background: #f7f8fa;
  border-radius: 14px;
  padding: 12px;
}

.detail-img {
  border-radius: 10px;
  flex-shrink: 0;
}

.detail-product-info {
  flex: 1;
  min-width: 0;
}

.detail-store {
  font-size: 11px;
  color: #aaaaaa;
  margin-bottom: 3px;
}

.detail-name {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-price-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-original {
  font-size: 12px;
  color: #ccc;
  text-decoration: line-through;
}

.detail-discount {
  font-size: 15px;
  font-weight: 800;
  color: #ff4757;
  letter-spacing: -0.3px;
}

.detail-saving-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 20px 16px;
  background: #f0fff4;
  border-radius: 10px;
  padding: 10px 12px;
}

.detail-saving-text {
  font-size: 13px;
  color: #444;
}

.detail-divider {
  height: 1px;
  background: #f5f5f5;
  margin: 0 20px 16px;
}

.detail-code-section {
  text-align: center;
  padding: 0 20px;
}

.detail-code-label {
  font-size: 11px;
  font-weight: 700;
  color: #aaaaaa;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.detail-code {
  font-size: 26px;
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
  margin-bottom: 10px;
}

.barcode-bar {
  background: #1a1a2e;
  border-radius: 1px;
}

.detail-code-hint {
  font-size: 11px;
  color: #aaaaaa;
  margin-bottom: 20px;
}

.detail-close-btn {
  display: block;
  width: calc(100% - 40px);
  margin: 0 20px;
  height: 44px;
  border: 1.5px solid #eeeeee;
  border-radius: 12px;
}
</style>

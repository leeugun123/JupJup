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
          <div class="summary-value text-positive">{{ purchasesStore.totalSavings().toLocaleString() }}원</div>
          <div class="summary-label">총 절약</div>
        </div>
      </div>

      <div v-for="purchase in purchasesStore.history" :key="purchase.id" class="history-card">
        <div class="history-card-top">
          <q-img :src="purchase.product.image" width="64px" height="64px" fit="cover" class="history-img" />
          <div class="history-info">
            <div class="history-store">{{ purchase.product.storeName }}</div>
            <div class="history-name">{{ purchase.product.name }}</div>
            <div class="history-price-row">
              <span class="history-price">{{ purchase.product.discountPrice.toLocaleString() }}원</span>
              <span class="history-saving">{{ purchase.savings.toLocaleString() }}원 절약</span>
            </div>
          </div>
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
      <q-btn
        unelevated color="primary" rounded label="특가 상품 보러가기"
        class="q-mt-lg" to="/"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { usePurchasesStore } from '../stores/purchases'

const purchasesStore = usePurchasesStore()

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped lang="scss">
.history-page {
  background: #F7F8FA;
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
  color: #1A1A2E;
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
  color: #AAAAAA;
  font-weight: 500;
}

.summary-divider {
  width: 1px;
  height: 32px;
  background: #F0F0F0;
}

// ── History Card ──────────────────────────────
.history-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  margin-bottom: 12px;
  overflow: hidden;
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
  color: #AAAAAA;
  margin-bottom: 2px;
}

.history-name {
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
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
  color: #FF4757;
  letter-spacing: -0.3px;
}

.history-saving {
  font-size: 11px;
  font-weight: 600;
  color: #2ED573;
  background: #F0FFF4;
  padding: 2px 6px;
  border-radius: 6px;
}

.history-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-top: 1px solid #F5F5F5;
  background: #FAFAFA;
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
  color: #AAAAAA;
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
  color: #AAAAAA;
}
</style>

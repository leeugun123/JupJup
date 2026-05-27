<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="app-header">
      <q-toolbar class="header-inner">
        <div class="brand-wrap">
          <span class="brand-logo">jupjup</span>
          <span class="brand-tagline">마감 할인 특가</span>
        </div>
        <q-space />
        <div class="location-chip" @click="showLocationDialog = true">
          <q-icon name="location_on" size="12px" />
          <span>{{ location }}</span>
          <q-icon name="expand_more" size="12px" />
        </div>
        <q-btn
          flat
          round
          dense
          size="sm"
          class="notif-btn q-ml-xs"
          @click="showNotifSheet = true"
        >
          <q-icon name="notifications_none" size="20px" />
          <q-badge
            v-if="urgentProducts.length"
            color="yellow-8"
            floating
            rounded
            style="font-size: 9px; padding: 2px 4px"
          >
            {{ urgentProducts.length }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-footer class="app-footer">
      <q-tabs
        active-color="primary"
        inactive-color="grey-5"
        indicator-color="transparent"
        align="justify"
        class="footer-tabs"
      >
        <q-route-tab to="/" exact icon="home" label="홈" class="footer-tab" />
        <q-route-tab to="/search" icon="search" label="검색" class="footer-tab" />
        <q-route-tab to="/favorites" icon="favorite" label="찜" class="footer-tab" />
        <q-route-tab to="/my" icon="person" label="마이" class="footer-tab" />
      </q-tabs>
    </q-footer>

    <q-page-container class="page-container-clip">
      <router-view v-slot="{ Component, route }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </q-page-container>

    <!-- Location Dialog -->
    <q-dialog v-model="showLocationDialog" position="bottom">
      <q-card class="location-dialog">
        <div class="dialog-handle" />
        <div class="dialog-title">지역 선택</div>
        <q-list>
          <q-item
            v-for="district in districts"
            :key="district"
            clickable
            v-ripple
            class="district-item"
            :class="{ 'district-item--active': location === district }"
            @click="selectLocation(district)"
          >
            <q-item-section avatar>
              <q-icon
                name="location_on"
                :color="location === district ? 'primary' : 'grey-4'"
                size="18px"
              />
            </q-item-section>
            <q-item-section>{{ district }}</q-item-section>
            <q-item-section side>
              <q-icon v-if="location === district" name="check" color="primary" size="16px" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>

    <!-- Notification Bottom Sheet -->
    <q-dialog v-model="showNotifSheet" position="bottom">
      <q-card class="notif-sheet">
        <div class="dialog-handle" />
        <div class="notif-header">
          <span class="notif-title">마감 임박 알림</span>
          <span class="notif-sub">{{ urgentProducts.length }}개 상품이 곧 마감돼요</span>
        </div>

        <div v-if="urgentProducts.length" class="notif-list">
          <div
            v-for="product in urgentProducts"
            :key="product.id"
            class="notif-item"
            @click="goToProduct(product.id)"
          >
            <div class="notif-item-left">
              <div
                class="notif-badge"
                :class="daysLeft(product.expiryDate) === 0 ? 'notif-badge--today' : 'notif-badge--soon'"
              >
                {{ daysLeft(product.expiryDate) === 0 ? '오늘 마감' : `D-${daysLeft(product.expiryDate)}` }}
              </div>
              <div class="notif-name">{{ product.name }}</div>
              <div class="notif-store">{{ product.storeName }}</div>
            </div>
            <div class="notif-item-right">
              <div class="notif-price">{{ product.discountPrice.toLocaleString() }}원</div>
              <div class="notif-discount">{{ product.discountPercent }}% 할인</div>
            </div>
          </div>
        </div>

        <div v-else class="notif-empty">
          <q-icon name="notifications_off" size="40px" color="grey-3" />
          <div class="q-mt-sm text-grey-5" style="font-size: 13px">마감 임박 상품이 없어요</div>
        </div>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { mockProducts } from '../data/mockProducts';

const router = useRouter();

// ── 페이지 전환 애니메이션 ───────────────────────
const transitionName = ref('fade');

router.beforeEach((to, from) => {
  const toDepth = to.meta?.depth ?? 1;
  const fromDepth = from.meta?.depth ?? 1;
  if (toDepth === fromDepth) {
    transitionName.value = 'fade';
  } else if (toDepth > fromDepth) {
    transitionName.value = 'slide-left';
  } else {
    transitionName.value = 'slide-right';
  }
});

const LOCATION_KEY = 'jupjup_location';

const location = ref('강남구');
const showLocationDialog = ref(false);
const showNotifSheet = ref(false);

const districts = [
  '강남구', '강북구', '강서구', '관악구', '광진구',
  '구로구', '노원구', '동작구', '마포구', '서초구',
  '송파구', '영등포구', '용산구', '은평구', '종로구', '중구',
];

onMounted(() => {
  const saved = localStorage.getItem(LOCATION_KEY);
  if (saved) location.value = saved;
});

function selectLocation(district: string) {
  location.value = district;
  localStorage.setItem(LOCATION_KEY, district);
  showLocationDialog.value = false;
}

function daysLeft(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const urgentProducts = computed(() =>
  mockProducts.filter((p) => {
    const d = daysLeft(p.expiryDate);
    return d >= 0 && d <= 2;
  }),
);

function goToProduct(id: string) {
  showNotifSheet.value = false;
  void router.push(`/product/${id}`);
}
</script>

<style scoped lang="scss">
.app-header {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b6b 100%);
  box-shadow: 0 2px 12px rgba(255, 71, 87, 0.25);
}

.header-inner {
  padding: 8px 16px;
  min-height: 56px;
}

.brand-wrap {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.brand-logo {
  font-size: 22px;
  font-weight: 900;
  color: white;
  letter-spacing: -1px;
}

.brand-tagline {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
}

.location-chip {
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: -0.2px;
  cursor: pointer;
  transition: background 0.15s;

  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
}

.notif-btn {
  color: rgba(255, 255, 255, 0.9);
  position: relative;
}

.app-footer {
  background: white;
  box-shadow:
    0 -1px 0 #f0f0f0,
    0 -4px 16px rgba(0, 0, 0, 0.05);
}

.footer-tabs {
  height: 60px;

  :deep(.q-tab:not(.q-tab--active)) {
    color: #9e9e9e;
    opacity: 1;
  }

  :deep(.q-tab--active) {
    color: #ff4757;
  }
}

.footer-tab {
  font-size: 11px;
  font-weight: 600;
  flex: 1;
}

// ── Location Dialog ─────────────────────────────
.location-dialog {
  width: 100%;
  max-width: 480px;
  border-radius: 20px 20px 0 0;
  padding-bottom: 24px;
}

.dialog-handle {
  width: 36px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 12px auto 8px;
}

.dialog-title {
  font-size: 16px;
  font-weight: 800;
  color: #1a1a2e;
  padding: 8px 20px 12px;
}

.district-item {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #444;

  &--active {
    color: #ff4757;
    font-weight: 700;
  }
}

// ── Notification Sheet ──────────────────────────
.notif-sheet {
  border-radius: 20px 20px 0 0;
  padding-bottom: 32px;
}

.notif-header {
  padding: 4px 20px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.notif-title {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: #1a1a2e;
}

.notif-sub {
  display: block;
  font-size: 12px;
  color: #ff4757;
  font-weight: 600;
  margin-top: 2px;
}

.notif-list {
  max-height: 60vh;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f7f7f7;
  cursor: pointer;
  transition: background 0.1s;

  &:active {
    background: #fafafa;
  }
}

.notif-item-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.notif-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  width: fit-content;

  &--today {
    background: #fff0f1;
    color: #ff4757;
  }

  &--soon {
    background: #fff8e1;
    color: #f57f17;
  }
}

.notif-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.notif-store {
  font-size: 12px;
  color: #aaa;
}

.notif-item-right {
  text-align: right;
}

.notif-price {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}

.notif-discount {
  font-size: 11px;
  color: #ff4757;
  font-weight: 600;
}

.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}
</style>

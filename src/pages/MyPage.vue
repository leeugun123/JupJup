<template>
  <q-page class="my-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-gradient" />
      <div class="profile-content q-px-md q-pt-lg q-pb-xl">
        <div class="profile-row">
          <div class="avatar-wrap">
            <q-icon name="person" size="32px" color="white" />
            <div
              v-if="authStore.isLoggedIn"
              class="provider-badge"
              :class="authStore.user!.provider === 'kakao' ? 'badge-kakao' : 'badge-naver'"
            >
              {{ authStore.user!.provider === 'kakao' ? 'K' : 'N' }}
            </div>
          </div>
          <div class="profile-info">
            <div class="profile-name">
              {{ authStore.isLoggedIn ? authStore.user!.name : '게스트 사용자' }}
            </div>
            <div class="profile-sub">
              {{
                authStore.isLoggedIn ? authStore.user!.email : '로그인하고 더 많은 혜택을 받으세요'
              }}
            </div>
          </div>
          <q-btn
            v-if="!authStore.isLoggedIn"
            flat
            dense
            round
            icon="chevron_right"
            color="white"
            size="12px"
            @click="showLoginDialog = true"
          />
        </div>
      </div>

      <!-- Stats Card -->
      <div class="stats-card q-mx-md">
        <div class="stat-item">
          <div class="stat-value text-primary">{{ favStore.ids.length }}</div>
          <div class="stat-label">찜한 상품</div>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <div class="stat-value text-primary">{{ purchasesStore.history.length }}</div>
          <div class="stat-label">이용 내역</div>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <div class="stat-value text-positive">{{ totalSavings.toLocaleString() }}원</div>
          <div class="stat-label">총 절약 금액</div>
        </div>
      </div>
    </div>

    <!-- Menu Sections -->
    <div class="menu-sections q-px-md q-pb-xl">
      <!-- 내 활동 -->
      <div class="menu-section">
        <div class="menu-section-title">내 활동</div>
        <div class="menu-card">
          <div class="menu-item" @click="$router.push('/favorites')">
            <div class="menu-icon-wrap" style="background: #fff0f1">
              <q-icon name="favorite" color="negative" size="18px" />
            </div>
            <span class="menu-label">찜 목록</span>
            <div class="menu-right">
              <q-badge
                v-if="favStore.ids.length > 0"
                color="negative"
                :label="favStore.ids.length"
                rounded
              />
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item" @click="$router.push('/history')">
            <div class="menu-icon-wrap" style="background: #f0f4ff">
              <q-icon name="receipt_long" color="info" size="18px" />
            </div>
            <span class="menu-label">이용 내역</span>
            <div class="menu-right">
              <q-badge
                v-if="purchasesStore.history.length > 0"
                color="info"
                :label="purchasesStore.history.length"
                rounded
              />
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background: #fff8e7">
              <q-icon name="star" color="warning" size="18px" />
            </div>
            <span class="menu-label">리뷰 내역</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
        </div>
      </div>

      <!-- 편의점 -->
      <div class="menu-section">
        <div class="menu-section-title">편의점</div>
        <div class="menu-card">
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background: #f0fff4">
              <q-icon name="store" color="positive" size="18px" />
            </div>
            <span class="menu-label">관심 편의점</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background: #f3f0ff">
              <q-icon name="notifications" color="accent" size="18px" />
            </div>
            <span class="menu-label">알림 설정</span>
            <div class="menu-right">
              <q-toggle v-model="notifOn" color="primary" dense size="sm" />
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background: #fff0f8">
              <q-icon name="location_on" color="pink" size="18px" />
            </div>
            <span class="menu-label">내 위치 설정</span>
            <div class="menu-right">
              <span class="menu-value">서울 강남구</span>
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
        </div>
      </div>

      <!-- 앱 정보 -->
      <div class="menu-section">
        <div class="menu-section-title">앱 정보</div>
        <div class="menu-card">
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background: #fff8f0">
              <q-icon name="campaign" color="secondary" size="18px" />
            </div>
            <span class="menu-label">공지사항</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background: #f0faff">
              <q-icon name="headset_mic" color="info" size="18px" />
            </div>
            <span class="menu-label">고객센터</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background: #f5f5f5">
              <q-icon name="info_outline" color="grey-6" size="18px" />
            </div>
            <span class="menu-label">앱 버전</span>
            <span class="menu-value">v1.0.0</span>
          </div>
        </div>
      </div>

      <!-- 계정 (로그인 시) -->
      <div v-if="authStore.isLoggedIn" class="menu-section">
        <div class="menu-section-title">계정</div>
        <div class="menu-card">
          <div class="menu-item" @click="showLogoutDialog = true">
            <div class="menu-icon-wrap" style="background: #fff5f5">
              <q-icon name="logout" color="negative" size="18px" />
            </div>
            <span class="menu-label" style="color: #ff4757">로그아웃</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
        </div>
      </div>

      <!-- Login Banner -->
      <div v-if="!authStore.isLoggedIn" class="login-banner" @click="showLoginDialog = true">
        <div class="login-banner-text">
          <div class="login-banner-title">로그인하고 개인화된 할인을 받아보세요</div>
          <div class="login-banner-sub">찜 목록, 알림 설정이 저장돼요</div>
        </div>
        <q-btn label="로그인" color="primary" unelevated class="login-btn" />
      </div>
    </div>

    <!-- Logout Confirm Dialog -->
    <q-dialog v-model="showLogoutDialog">
      <q-card class="logout-dialog">
        <q-card-section class="text-center q-pt-xl q-pb-md">
          <q-icon name="logout" size="40px" color="negative" />
          <div class="logout-title q-mt-md">로그아웃</div>
          <div class="logout-sub q-mt-sm">정말 로그아웃 하시겠어요?</div>
        </q-card-section>
        <q-card-section class="logout-actions q-px-lg q-pb-xl">
          <q-btn
            flat
            label="취소"
            color="grey-5"
            class="logout-cancel-btn"
            @click="showLogoutDialog = false"
          />
          <q-btn
            unelevated
            label="로그아웃"
            color="negative"
            rounded
            class="logout-confirm-btn"
            @click="doLogout"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Login Dialog -->
    <q-dialog v-model="showLoginDialog">
      <q-card class="login-dialog">
        <q-card-section class="text-center q-pt-xl q-pb-md">
          <div class="dialog-logo">jupjup</div>
          <div class="dialog-sub q-mt-sm">로그인하고 더 많은 혜택을 누리세요</div>
        </q-card-section>
        <q-card-section class="dialog-actions q-px-lg q-pb-xl">
          <q-btn label="카카오로 시작하기" unelevated class="kakao-btn" @click="doLogin('kakao')" />
          <q-btn label="네이버로 시작하기" unelevated class="naver-btn" @click="doLogin('naver')" />
          <q-btn flat label="닫기" color="grey-5" @click="showLoginDialog = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFavoritesStore } from '../stores/favorites';
import { usePurchasesStore } from '../stores/purchases';
import { useAuthStore } from '../stores/auth';

const favStore = useFavoritesStore();
const purchasesStore = usePurchasesStore();
const authStore = useAuthStore();
const totalSavings = computed(() => purchasesStore.totalSavings());
const notifOn = ref(true);
const showLoginDialog = ref(false);
const showLogoutDialog = ref(false);

onMounted(() => authStore.init());

function doLogin(provider: 'kakao' | 'naver') {
  authStore.login(provider);
  showLoginDialog.value = false;
}

function doLogout() {
  authStore.logout();
  showLogoutDialog.value = false;
}
</script>

<style scoped lang="scss">
.my-page {
  background: #f7f8fa;
  padding-bottom: 80px;
}

// ── Profile Header ────────────────────────────
.profile-header {
  position: relative;
  margin-bottom: 60px;
}

.profile-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 170px;
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
}

.profile-content {
  position: relative;
  z-index: 1;
}

.profile-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-wrap {
  position: relative;
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.provider-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
  border: 2px solid white;

  &.badge-kakao {
    background: #fee500;
    color: #3c1e1e;
  }
  &.badge-naver {
    background: #03c75a;
    color: white;
  }
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.3px;
}

.profile-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 3px;
}

.stats-card {
  position: absolute;
  bottom: -52px;
  left: 16px;
  right: 16px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 18px 0;
  z-index: 2;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.stat-label {
  font-size: 11px;
  color: #aaaaaa;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #f0f0f0;
}

// ── Menu ──────────────────────────────────────
.menu-sections {
  padding-top: 16px;
}

.menu-section {
  margin-bottom: 20px;
}

.menu-section-title {
  font-size: 12px;
  font-weight: 700;
  color: #aaaaaa;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding-left: 4px;
}

.menu-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;

  &:active {
    background: #fafafa;
  }
}

.menu-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a2e;
  letter-spacing: -0.2px;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-value {
  font-size: 12px;
  color: #aaaaaa;
}

// ── Login Banner ──────────────────────────────
.login-banner {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  border: 1.5px solid rgba(255, 71, 87, 0.15);
  transition: border-color 0.2s;

  &:active {
    border-color: rgba(255, 71, 87, 0.4);
  }
}

.login-banner-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}

.login-banner-sub {
  font-size: 12px;
  color: #aaaaaa;
  margin-top: 2px;
}

.login-btn {
  border-radius: 10px;
  font-weight: 700;
  min-width: 68px;
  font-size: 13px;
}

// ── Login Dialog ──────────────────────────────
.login-dialog {
  width: 320px;
  border-radius: 24px !important;
}

.dialog-logo {
  font-size: 26px;
  font-weight: 900;
  color: #ff4757;
  letter-spacing: -1px;
}

.dialog-sub {
  font-size: 14px;
  color: #aaaaaa;
}

.dialog-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kakao-btn {
  background: #fee500;
  color: #3c1e1e;
  border-radius: 12px;
  height: 48px;
  font-weight: 700;
  font-size: 14px;
}

.naver-btn {
  background: #03c75a;
  color: white;
  border-radius: 12px;
  height: 48px;
  font-weight: 700;
  font-size: 14px;
}

// ── Logout Dialog ─────────────────────────────
.logout-dialog {
  width: 300px;
  border-radius: 24px !important;
}

.logout-title {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.logout-sub {
  font-size: 14px;
  color: #aaaaaa;
}

.logout-actions {
  display: flex;
  gap: 10px;
}

.logout-cancel-btn {
  flex: 1;
  height: 44px;
}
.logout-confirm-btn {
  flex: 2;
  height: 44px;
  font-weight: 700;
}
</style>

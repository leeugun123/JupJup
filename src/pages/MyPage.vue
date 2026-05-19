<template>
  <q-page class="my-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-gradient" />
      <div class="profile-content q-px-md q-pt-lg q-pb-xl">
        <div class="profile-row">
          <div class="avatar-wrap">
            <q-icon name="person" size="32px" color="white" />
          </div>
          <div class="profile-info">
            <div class="profile-name">게스트 사용자</div>
            <div class="profile-sub">로그인하고 더 많은 혜택을 받으세요</div>
          </div>
          <q-btn flat dense round icon="chevron_right" color="white" size="12px" />
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
          <div class="stat-value text-primary">2</div>
          <div class="stat-label">방문 편의점</div>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <div class="stat-value text-positive">2,700원</div>
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
            <div class="menu-icon-wrap" style="background:#FFF0F1">
              <q-icon name="favorite" color="negative" size="18px" />
            </div>
            <span class="menu-label">찜 목록</span>
            <div class="menu-right">
              <q-badge color="negative" label="3" rounded />
              <q-icon name="chevron_right" color="grey-4" size="18px" />
            </div>
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background:#F0F4FF">
              <q-icon name="receipt_long" color="info" size="18px" />
            </div>
            <span class="menu-label">이용 내역</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background:#FFF8E7">
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
            <div class="menu-icon-wrap" style="background:#F0FFF4">
              <q-icon name="store" color="positive" size="18px" />
            </div>
            <span class="menu-label">관심 편의점</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background:#F3F0FF">
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
            <div class="menu-icon-wrap" style="background:#FFF0F8">
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
            <div class="menu-icon-wrap" style="background:#FFF8F0">
              <q-icon name="campaign" color="secondary" size="18px" />
            </div>
            <span class="menu-label">공지사항</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background:#F0FAFF">
              <q-icon name="headset_mic" color="info" size="18px" />
            </div>
            <span class="menu-label">고객센터</span>
            <q-icon name="chevron_right" color="grey-4" size="18px" />
          </div>
          <q-separator inset />
          <div class="menu-item">
            <div class="menu-icon-wrap" style="background:#F5F5F5">
              <q-icon name="info_outline" color="grey-6" size="18px" />
            </div>
            <span class="menu-label">앱 버전</span>
            <span class="menu-value">v1.0.0</span>
          </div>
        </div>
      </div>

      <!-- Login Banner -->
      <div class="login-banner" @click="showLoginDialog = true">
        <div class="login-banner-text">
          <div class="login-banner-title">로그인하고 개인화된 할인을 받아보세요</div>
          <div class="login-banner-sub">찜 목록, 알림 설정이 저장돼요</div>
        </div>
        <q-btn label="로그인" color="primary" unelevated class="login-btn" />
      </div>
    </div>

    <!-- Login Dialog -->
    <q-dialog v-model="showLoginDialog">
      <q-card class="login-dialog">
        <q-card-section class="text-center q-pt-xl q-pb-md">
          <div class="dialog-logo">jupjup</div>
          <div class="dialog-sub q-mt-sm">로그인하고 더 많은 혜택을 누리세요</div>
        </q-card-section>
        <q-card-section class="dialog-actions q-px-lg q-pb-xl">
          <q-btn
            label="카카오로 시작하기"
            unelevated
            class="kakao-btn"
          />
          <q-btn
            label="네이버로 시작하기"
            unelevated
            class="naver-btn"
          />
          <q-btn flat label="닫기" color="grey-5" @click="showLoginDialog = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFavoritesStore } from '../stores/favorites'

const favStore = useFavoritesStore()
const notifOn = ref(true)
const showLoginDialog = ref(false)
</script>

<style scoped lang="scss">
.my-page {
  background: #F7F8FA;
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
  background: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
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
  color: #AAAAAA;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #F0F0F0;
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
  color: #AAAAAA;
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

  &:active { background: #FAFAFA; }
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
  color: #1A1A2E;
  letter-spacing: -0.2px;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-value {
  font-size: 12px;
  color: #AAAAAA;
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

  &:active { border-color: rgba(255, 71, 87, 0.4); }
}

.login-banner-title {
  font-size: 14px;
  font-weight: 700;
  color: #1A1A2E;
}

.login-banner-sub {
  font-size: 12px;
  color: #AAAAAA;
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
  color: #FF4757;
  letter-spacing: -1px;
}

.dialog-sub {
  font-size: 14px;
  color: #AAAAAA;
}

.dialog-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kakao-btn {
  background: #FEE500;
  color: #3C1E1E;
  border-radius: 12px;
  height: 48px;
  font-weight: 700;
  font-size: 14px;
}

.naver-btn {
  background: #03C75A;
  color: white;
  border-radius: 12px;
  height: 48px;
  font-weight: 700;
  font-size: 14px;
}
</style>

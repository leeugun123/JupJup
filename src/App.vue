<template>
  <router-view />

  <!-- 스플래시 스크린 -->
  <Transition name="splash-fade">
    <div v-if="showSplash" class="splash-screen">
      <div class="splash-inner">
        <div class="splash-logo-wrap">
          <div class="splash-logo">jupjup</div>
          <div class="splash-tagline">편의점 마감 할인 특가</div>
        </div>
        <div class="splash-dots">
          <span class="splash-dot" />
          <span class="splash-dot" />
          <span class="splash-dot" />
        </div>
      </div>
    </div>
  </Transition>

  <!-- 온보딩 오버레이 -->
  <Transition name="fade">
    <div v-if="showOnboarding" class="onboarding-overlay">
      <q-carousel
        v-model="slide"
        animated
        swipeable
        transition-prev="slide-right"
        transition-next="slide-left"
        class="onboarding-carousel"
      >
        <q-carousel-slide :name="0" class="q-pa-none">
          <div class="ob-slide ob-slide--1">
            <div class="ob-emoji">🎉</div>
            <div class="ob-title">jupjup에<br />오신 걸 환영해요!</div>
            <div class="ob-sub">편의점 마감 임박 특가를<br />한 곳에서 확인하세요</div>
          </div>
        </q-carousel-slide>

        <q-carousel-slide :name="1" class="q-pa-none">
          <div class="ob-slide ob-slide--2">
            <div class="ob-emoji">⚡</div>
            <div class="ob-title">마감 임박 =<br />최대 50% 할인</div>
            <div class="ob-sub">유통기한 임박 상품을<br />초특가로 만나보세요</div>
          </div>
        </q-carousel-slide>

        <q-carousel-slide :name="2" class="q-pa-none">
          <div class="ob-slide ob-slide--3">
            <div class="ob-emoji">❤️</div>
            <div class="ob-title">찜하고<br />놓치지 마세요</div>
            <div class="ob-sub">관심 상품을 찜하면<br />언제든 바로 구매할 수 있어요</div>
          </div>
        </q-carousel-slide>

        <q-carousel-slide :name="3" class="q-pa-none">
          <div class="ob-slide ob-slide--4">
            <div class="ob-emoji">🛒</div>
            <div class="ob-title">지금 바로<br />시작해요!</div>
            <div class="ob-sub">오늘의 특가 상품이<br />기다리고 있어요</div>
            <button class="ob-start-btn" @click="finishOnboarding">시작하기</button>
          </div>
        </q-carousel-slide>
      </q-carousel>

      <!-- Dots -->
      <div class="ob-dots">
        <span
          v-for="i in 4"
          :key="i"
          class="ob-dot"
          :class="{ 'ob-dot--active': slide === i - 1 }"
        />
      </div>

      <!-- Skip -->
      <button v-if="slide < 3" class="ob-skip" @click="finishOnboarding">건너뛰기</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const ONBOARD_KEY = 'jupjup_onboarded';
const SPLASH_DURATION = 1800; // ms

const showSplash = ref(true);
const showOnboarding = ref(false);
const slide = ref(0);

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false;
    // 스플래시 페이드아웃 완료 후 온보딩 체크 (300ms = transition duration)
    if (!localStorage.getItem(ONBOARD_KEY)) {
      setTimeout(() => {
        showOnboarding.value = true;
      }, 300);
    }
  }, SPLASH_DURATION);
});

function finishOnboarding() {
  localStorage.setItem(ONBOARD_KEY, '1');
  showOnboarding.value = false;
}
</script>

<style scoped lang="scss">
// ── Splash Screen ───────────────────────────────
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: linear-gradient(160deg, #ff4757 0%, #ff6b6b 60%, #ff8a65 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.splash-logo-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: splash-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.splash-logo {
  font-size: 52px;
  font-weight: 900;
  color: white;
  letter-spacing: -2.5px;
  line-height: 1;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.splash-tagline {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 10px;
  animation: splash-fadein 0.5s ease 0.35s both;
}

.splash-dots {
  display: flex;
  gap: 7px;
  margin-top: 56px;
  animation: splash-fadein 0.4s ease 0.5s both;
}

.splash-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: splash-pulse 1.1s ease-in-out infinite;

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.18s; }
  &:nth-child(3) { animation-delay: 0.36s; }
}

@keyframes splash-pop {
  0%   { transform: scale(0.6); opacity: 0; }
  70%  { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1);    opacity: 1; }
}

@keyframes splash-fadein {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes splash-pulse {
  0%, 100% { transform: scale(1);   opacity: 0.5; }
  50%       { transform: scale(1.4); opacity: 1; }
}

// Splash 종료 전환
.splash-fade-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.splash-fade-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

// ── Onboarding ──────────────────────────────────
.onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.onboarding-carousel {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;

  :deep(.q-carousel__prev-btn),
  :deep(.q-carousel__next-btn) {
    display: none;
  }
}

.ob-slide {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  text-align: center;

  &--1 { background: linear-gradient(160deg, #ff4757 0%, #ff8a65 100%); }
  &--2 { background: linear-gradient(160deg, #5352ed 0%, #8e8ffa 100%); }
  &--3 { background: linear-gradient(160deg, #ff4757 0%, #ff6b6b 100%); }
  &--4 { background: linear-gradient(160deg, #2ed573 0%, #1abc9c 100%); }
}

.ob-emoji {
  font-size: 80px;
  margin-bottom: 28px;
  animation: bounce 1.2s infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to   { transform: translateY(-10px); }
}

.ob-title {
  font-size: 30px;
  font-weight: 900;
  color: white;
  letter-spacing: -1px;
  line-height: 1.2;
  margin-bottom: 16px;
}

.ob-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin-bottom: 40px;
}

.ob-start-btn {
  background: white;
  color: #1abc9c;
  font-size: 17px;
  font-weight: 800;
  padding: 16px 48px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  letter-spacing: -0.3px;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.97);
  }
}

.ob-dots {
  position: absolute;
  bottom: 100px;
  display: flex;
  gap: 8px;
  z-index: 1;
}

.ob-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.2s;

  &--active {
    width: 24px;
    border-radius: 4px;
    background: white;
  }
}

.ob-skip {
  position: absolute;
  top: 56px;
  right: 20px;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  z-index: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

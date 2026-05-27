<template>
  <div class="empty-anim">
    <div class="icon-stage">
      <span class="icon-float">{{ icon }}</span>
      <span class="dot dot--1" />
      <span class="dot dot--2" />
      <span class="dot dot--3" />
      <span class="dot dot--4" />
    </div>
    <p class="ea-title">{{ title }}</p>
    <p v-if="subtitle" class="ea-sub">{{ subtitle }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  subtitle?: string;
}>();
</script>

<style scoped lang="scss">
.empty-anim {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 24px 24px;
  animation: ea-fadein 0.4s ease both;
}

// ── Icon Stage ─────────────────────────────────
.icon-stage {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.icon-float {
  font-size: 60px;
  line-height: 1;
  display: block;
  animation: ea-float 2.4s ease-in-out infinite alternate;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08));
}

// ── Orbit Dots ─────────────────────────────────
.dot {
  position: absolute;
  border-radius: 50%;
  background: #ff4757;
}

.dot--1 {
  width: 8px;  height: 8px;
  top: 8px;    left: 10px;
  opacity: 0.35;
  animation: ea-pulse 2s ease-in-out infinite;
}
.dot--2 {
  width: 6px;  height: 6px;
  top: 14px;   right: 8px;
  opacity: 0.25;
  background: #5352ed;
  animation: ea-pulse 2s ease-in-out 0.5s infinite;
}
.dot--3 {
  width: 10px; height: 10px;
  bottom: 10px; left: 14px;
  opacity: 0.2;
  background: #ffa502;
  animation: ea-pulse 2s ease-in-out 0.9s infinite;
}
.dot--4 {
  width: 5px;  height: 5px;
  bottom: 14px; right: 12px;
  opacity: 0.3;
  animation: ea-pulse 2s ease-in-out 1.3s infinite;
}

// ── Text ───────────────────────────────────────
.ea-title {
  font-size: 16px;
  font-weight: 700;
  color: #444;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
  animation: ea-fadein 0.4s ease 0.1s both;
}

.ea-sub {
  font-size: 13px;
  color: #aaaaaa;
  margin: 0 0 16px;
  line-height: 1.5;
  animation: ea-fadein 0.4s ease 0.2s both;
}

// ── Animations ─────────────────────────────────
@keyframes ea-float {
  0%   { transform: translateY(0px) rotate(-2deg); }
  100% { transform: translateY(-14px) rotate(2deg); }
}

@keyframes ea-pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.7); }
}

@keyframes ea-fadein {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

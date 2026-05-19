<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="app-header">
      <q-toolbar class="header-inner">
        <div class="brand-wrap">
          <span class="brand-logo">jupjup</span>
          <span class="brand-tagline">마감 할인 특가</span>
        </div>
        <q-space />
        <q-btn flat round dense icon="notifications_none" size="sm" class="notif-btn" />
      </q-toolbar>
    </q-header>

    <q-footer class="app-footer">
      <q-tabs
        v-model="tab"
        active-color="primary"
        indicator-color="transparent"
        class="footer-tabs"
      >
        <q-tab name="home" icon="home" label="홈" to="/" class="footer-tab" />
        <q-tab name="search" icon="search" label="검색" to="/search" class="footer-tab" />
        <q-tab name="favorites" icon="favorite" label="찜" to="/favorites" class="footer-tab" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tab = ref('home')

watch(() => route.path, (path) => {
  if (path.includes('favorites')) tab.value = 'favorites'
  else if (path.includes('search')) tab.value = 'search'
  else tab.value = 'home'
}, { immediate: true })
</script>

<style scoped lang="scss">
.app-header {
  background: linear-gradient(135deg, #FF4757 0%, #FF6B6B 100%);
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

.notif-btn {
  color: rgba(255, 255, 255, 0.9);
}

.app-footer {
  background: white;
  box-shadow: 0 -1px 0 #F0F0F0, 0 -4px 16px rgba(0, 0, 0, 0.05);
}

.footer-tabs {
  height: 60px;
}

.footer-tab {
  font-size: 11px;
  font-weight: 600;
  flex: 1;
}
</style>

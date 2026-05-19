<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header-gradient">
      <q-toolbar class="q-px-md" style="min-height: 52px">
        <div class="col">
          <div class="row items-center cursor-pointer" style="width: fit-content; gap: 2px">
            <q-icon name="location_on" color="white" size="15px" />
            <span class="text-weight-bold text-white" style="font-size:15px">서울 강남구</span>
            <q-icon name="keyboard_arrow_down" color="white" size="18px" />
          </div>
        </div>
        <q-space />
        <q-btn flat round dense icon="notifications_none" color="white" size="12px" />
      </q-toolbar>
    </q-header>

    <q-footer class="footer-nav">
      <q-tabs v-model="currentTab" class="nav-tabs">
        <q-tab name="home" to="/" :ripple="false">
          <div class="column items-center q-py-xs">
            <q-icon :name="currentTab === 'home' ? 'home' : 'home'"
                    :color="currentTab === 'home' ? 'primary' : 'grey-5'" size="20px" />
            <span class="nav-label" :class="currentTab === 'home' ? 'text-primary' : 'text-grey-5'">홈</span>
          </div>
        </q-tab>
        <q-tab name="search" :ripple="false">
          <div class="column items-center q-py-xs">
            <q-icon name="search" :color="currentTab === 'search' ? 'primary' : 'grey-5'" size="20px" />
            <span class="nav-label" :class="currentTab === 'search' ? 'text-primary' : 'text-grey-5'">검색</span>
          </div>
        </q-tab>
        <q-tab name="favorites" to="/favorites" :ripple="false">
          <div class="column items-center q-py-xs">
            <q-icon :name="currentTab === 'favorites' ? 'favorite' : 'favorite_border'"
                    :color="currentTab === 'favorites' ? 'primary' : 'grey-5'" size="20px" />
            <span class="nav-label" :class="currentTab === 'favorites' ? 'text-primary' : 'text-grey-5'">찜</span>
          </div>
        </q-tab>
        <q-tab name="my" :ripple="false">
          <div class="column items-center q-py-xs">
            <q-icon :name="currentTab === 'my' ? 'person' : 'person_outline'"
                    :color="currentTab === 'my' ? 'primary' : 'grey-5'" size="20px" />
            <span class="nav-label" :class="currentTab === 'my' ? 'text-primary' : 'text-grey-5'">MY</span>
          </div>
        </q-tab>
      </q-tabs>
    </q-footer>

    <q-page-container style="background: #F5F6F8">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentTab = ref('home')

watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/favorites')) currentTab.value = 'favorites'
    else if (path.startsWith('/search')) currentTab.value = 'search'
    else if (path.startsWith('/my')) currentTab.value = 'my'
    else currentTab.value = 'home'
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.header-gradient {
  background: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
  box-shadow: 0 2px 16px rgba(255, 71, 87, 0.3) !important;
}

.footer-nav {
  background: #ffffff;
  border-top: 1px solid #F0F0F0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}

.nav-tabs {
  height: 58px;

  :deep(.q-tab) {
    min-height: 58px;
    padding: 0;
    flex: 1;
  }

  :deep(.q-tab__content) {
    padding: 0;
    flex-direction: column;
  }

  :deep(.q-tab__indicator) {
    display: none;
  }

  :deep(.q-focus-helper) {
    border-radius: 12px;
  }
}

.nav-label {
  font-size: 10px;
  margin-top: 2px;
  font-weight: 500;
  letter-spacing: -0.2px;
}
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          🛍️ JupJup
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer elevated class="bg-white">
      <q-tabs
        v-model="tab"
        active-color="primary"
        indicator-color="primary"
        class="text-grey"
      >
        <q-tab
          name="home"
          icon="home"
          label="홈"
          to="/"
        />
        <q-tab
          name="favorites"
          icon="favorite"
          label="찜"
          to="/favorites"
        />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tab = ref('home')

// 현재 라우트에 따라 탭 업데이트
watch(() => route.path, (path) => {
  if (path.includes('favorites')) {
    tab.value = 'favorites'
  } else {
    tab.value = 'home'
  }
}, { immediate: true })

import { watch } from 'vue'
</script>

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue'), meta: { depth: 1 } },
      { path: 'product/:id', component: () => import('pages/ProductDetailPage.vue'), meta: { depth: 2 } },
      { path: 'favorites', component: () => import('pages/FavoritesPage.vue'), meta: { depth: 1 } },
      { path: 'search', component: () => import('pages/SearchPage.vue'), meta: { depth: 1 } },
      { path: 'my', component: () => import('pages/MyPage.vue'), meta: { depth: 1 } },
      { path: 'history', component: () => import('pages/HistoryPage.vue'), meta: { depth: 2 } },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

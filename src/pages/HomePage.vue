<template>
  <q-page class="home-page">
    <q-pull-to-refresh @refresh="onRefresh">
    <!-- Banner Carousel -->
    <div class="banner-section">
      <q-carousel
        v-model="bannerSlide"
        animated
        infinite
        :autoplay="3500"
        transition-prev="slide-right"
        transition-next="slide-left"
        height="152px"
        class="banner-carousel"
      >
        <q-carousel-slide v-for="(banner, i) in banners" :key="i" :name="i" class="q-pa-none">
          <div class="banner-slide" :style="`background: ${banner.gradient}`">
            <div class="banner-text">
              <div class="banner-tag">{{ banner.tag }}</div>
              <div class="banner-title">{{ banner.title }}</div>
              <div class="banner-sub">{{ banner.sub }}</div>
            </div>
            <div class="banner-emoji">{{ banner.emoji }}</div>
          </div>
        </q-carousel-slide>
      </q-carousel>
      <div class="banner-dots">
        <span
          v-for="(_, i) in banners"
          :key="i"
          class="dot"
          :class="{ 'dot--active': bannerSlide === i }"
        />
      </div>
    </div>

    <!-- Search Bar -->
    <div class="home-search-wrap q-px-md q-pt-sm q-pb-xs" @click="router.push('/search')">
      <div class="home-search-bar">
        <q-icon name="search" size="18px" color="grey-5" />
        <span class="home-search-placeholder">상품명, 편의점 검색</span>
      </div>
    </div>

    <!-- 최근 본 상품 -->
    <section v-if="recentlyViewed.products.length" class="recently-section q-pt-sm q-pb-xs">
      <div class="section-header q-px-md q-mb-xs">
        <div class="section-title-sm">최근 본 상품</div>
        <q-space />
        <span class="recent-clear" @click="recentlyViewed.clear()">지우기</span>
      </div>
      <div class="recently-scroll">
        <div
          v-for="product in recentlyViewed.products.slice(0, 6)"
          :key="product.id"
          class="recently-item"
        >
          <ProductCard :product="product" @click="goToDetail(product.id)" />
        </div>
      </div>
    </section>

    <!-- Filters -->
    <div class="filter-section q-pt-sm q-pb-xs">
      <div class="filter-row">
        <div
          v-for="cat in categories"
          :key="cat.key"
          class="filter-chip"
          :class="{ 'filter-chip--active': selectedCategory === cat.key }"
          @click="selectedCategory = cat.key"
        >
          <span class="chip-emoji">{{ cat.emoji }}</span>
          <span>{{ cat.label }}</span>
        </div>
      </div>
      <div class="filter-row">
        <div
          v-for="store in stores"
          :key="store.key"
          class="filter-chip filter-chip--store"
          :style="
            selectedStore === store.key
              ? { background: store.color, borderColor: store.color, color: 'white' }
              : {}
          "
          @click="selectedStore = store.key"
        >
          {{ store.label }}
        </div>
      </div>
    </div>

    <!-- Urgent Section -->
    <section v-if="urgentProducts.length" class="q-px-md q-mb-md">
      <div class="section-header q-mb-sm">
        <div class="section-title">⚡ 마감 임박</div>
        <div class="urgent-sub">지금 바로 구매하세요!</div>
      </div>
      <div class="urgent-scroll">
        <div v-for="product in urgentProducts" :key="product.id" class="urgent-item">
          <ProductCard :product="product" @click="goToDetail(product.id)" />
        </div>
      </div>
    </section>

    <!-- Section Header -->
    <div class="section-header q-px-md q-pt-xs q-pb-xs">
      <div class="section-title">오늘의 특가 🔥</div>
      <span class="section-count text-grey-5">{{ sortedProducts.length }}개</span>
      <q-space />
      <q-btn flat dense rounded size="sm" class="sort-btn">
        <q-icon name="sort" size="14px" class="q-mr-xs" />
        <span>{{ currentSortLabel }}</span>
        <q-icon name="expand_more" size="14px" />
        <q-menu anchor="bottom right" self="top right">
          <q-list dense style="min-width: 130px">
            <q-item
              v-for="opt in sortOptions"
              :key="opt.value"
              clickable
              v-close-popup
              @click="sortBy = opt.value"
            >
              <q-item-section>{{ opt.label }}</q-item-section>
              <q-item-section side>
                <q-icon v-if="sortBy === opt.value" name="check" color="primary" size="14px" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- Product Grid -->
    <div class="q-px-md q-pb-xl">
      <!-- 스켈레톤 -->
      <div v-if="loading" class="row q-col-gutter-sm">
        <div v-for="i in 6" :key="i" class="col-6">
          <ProductCardSkeleton />
        </div>
      </div>

      <div v-else-if="sortedProducts.length" class="row q-col-gutter-sm">
        <div v-for="product in sortedProducts" :key="product.id" class="col-6">
          <ProductCard :product="product" @click="goToDetail(product.id)" />
        </div>
      </div>

      <div v-else class="empty-state column items-center q-py-xl">
        <q-icon name="search_off" size="56px" color="grey-3" />
        <div class="empty-title q-mt-md">해당 상품이 없어요</div>
        <div class="empty-sub q-mt-xs">다른 카테고리를 선택해보세요</div>
        <q-btn
          flat
          label="전체 보기"
          color="primary"
          class="q-mt-sm"
          @click="selectedCategory = 'all'; selectedStore = 'all';"
        />
      </div>
    </div>
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import ProductCardSkeleton from '../components/ProductCardSkeleton.vue';
import { mockProducts } from '../data/mockProducts';
import { useRecentlyViewedStore } from '../stores/recentlyViewed';

const router = useRouter();
const recentlyViewed = useRecentlyViewedStore();

const loading = ref(true);
onMounted(() => { setTimeout(() => { loading.value = false; }, 600); });

const bannerSlide = ref(0);
const selectedCategory = ref('all');
const selectedStore = ref('all');
const sortBy = ref('default');

const sortOptions = [
  { value: 'default', label: '기본순' },
  { value: 'discount', label: '할인율순' },
  { value: 'expiry', label: '마감임박순' },
  { value: 'price_low', label: '낮은 가격순' },
  { value: 'price_high', label: '높은 가격순' },
];

const currentSortLabel = computed(
  () => sortOptions.find((o) => o.value === sortBy.value)?.label ?? '기본순',
);

const banners = [
  {
    gradient: 'linear-gradient(135deg, #FF4757 0%, #FF8A65 100%)',
    emoji: '⚡',
    tag: '오늘만!',
    title: '마감 임박 특가',
    sub: '매일 최대 50% 할인 혜택',
  },
  {
    gradient: 'linear-gradient(135deg, #5352ED 0%, #8E8FFA 100%)',
    emoji: '🎁',
    tag: '이 주의 픽',
    title: '편의점 베스트 특가',
    sub: '엄선된 할인 상품만 모았어요',
  },
  {
    gradient: 'linear-gradient(135deg, #2ED573 0%, #1ABC9C 100%)',
    emoji: '🌱',
    tag: '캠페인',
    title: '음식 낭비를 줄여요',
    sub: '마감 특가로 지구도 살리고 절약도!',
  },
];

const categories = [
  { key: 'all', emoji: '🏷️', label: '전체' },
  { key: 'beverage', emoji: '🧃', label: '음료' },
  { key: 'snack', emoji: '🍫', label: '간식' },
  { key: 'food', emoji: '🍱', label: '식품' },
  { key: 'dairy', emoji: '🥛', label: '유제품' },
  { key: 'frozen', emoji: '❄️', label: '냉동' },
  { key: 'instant', emoji: '🍜', label: '즉석식품' },
];

const stores = [
  { key: 'all', label: '전체', color: '#ff4757' },
  { key: 'store1', label: 'CU', color: '#0051A1' },
  { key: 'store2', label: 'GS25', color: '#F05014' },
  { key: 'store3', label: '세븐일레븐', color: '#007A33' },
];

function daysLeftFor(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const urgentProducts = computed(() =>
  mockProducts.filter((p) => {
    const d = daysLeftFor(p.expiryDate);
    return d >= 0 && d <= 2;
  }),
);

const filteredProducts = computed(() =>
  mockProducts.filter((p) => {
    const matchCat = selectedCategory.value === 'all' || p.category === selectedCategory.value;
    const matchStore = selectedStore.value === 'all' || p.storeId === selectedStore.value;
    return matchCat && matchStore;
  }),
);

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value];
  switch (sortBy.value) {
    case 'discount':
      return list.sort((a, b) => b.discountPercent - a.discountPercent);
    case 'expiry':
      return list.sort(
        (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
      );
    case 'price_low':
      return list.sort((a, b) => a.discountPrice - b.discountPrice);
    case 'price_high':
      return list.sort((a, b) => b.discountPrice - a.discountPrice);
    default:
      return list;
  }
});

function goToDetail(id: string) {
  void router.push(`/product/${id}`);
}

function onRefresh(done: () => void) {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    done();
  }, 800);
}
</script>

<style scoped lang="scss">
.home-page {
  background: #f7f8fa;
  min-height: 100vh;
}

// ── Search Bar ─────────────────────────────────
.home-search-wrap {
  background: white;
  cursor: pointer;
}

.home-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f6f8;
  border-radius: 12px;
  padding: 11px 14px;
  transition: background 0.15s;

  &:active {
    background: #ecedf0;
  }
}

.home-search-placeholder {
  font-size: 14px;
  color: #aaaaaa;
  flex: 1;
}

// ── Banner ─────────────────────────────────────
.banner-section {
  position: relative;
}

.banner-carousel {
  :deep(.q-carousel__prev-btn),
  :deep(.q-carousel__next-btn) {
    display: none;
  }
}

.banner-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.banner-text {
  flex: 1;
}

.banner-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.banner-title {
  font-size: 20px;
  font-weight: 900;
  color: white;
  letter-spacing: -0.8px;
  line-height: 1.2;
  margin-bottom: 6px;
}

.banner-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.banner-emoji {
  font-size: 56px;
  line-height: 1;
  flex-shrink: 0;
}

.banner-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 8px 0 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #dddddd;
  transition: all 0.2s;

  &--active {
    width: 18px;
    border-radius: 3px;
    background: #ff4757;
  }
}

// ── Filters ────────────────────────────────────
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-row {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  background: white;
  border: 1.5px solid #eeeeee;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;

  &:active {
    transform: scale(0.96);
  }

  &--active {
    background: #ff4757;
    border-color: #ff4757;
    color: white;
  }

  &--store {
    font-size: 12px;
    padding: 5px 12px;
  }
}

.chip-emoji {
  font-size: 14px;
  line-height: 1;
}

// ── Recently Viewed ────────────────────────────
.recently-section {
  background: white;
  padding-bottom: 12px;
}

.section-title-sm {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: -0.3px;
}

.recent-clear {
  font-size: 12px;
  color: #aaaaaa;
  cursor: pointer;
}

.recently-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 4px 16px 0;
  &::-webkit-scrollbar {
    display: none;
  }
}

.recently-item {
  flex: 0 0 148px;
}

// ── Urgent Section ─────────────────────────────
.urgent-sub {
  font-size: 12px;
  color: #ff4757;
  font-weight: 600;
}

.urgent-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;
  &::-webkit-scrollbar {
    display: none;
  }
}

.urgent-item {
  flex: 0 0 160px;
}

// ── Section Header ─────────────────────────────
.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.section-count {
  font-size: 13px;
}

.sort-btn {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  border: 1.5px solid #eeeeee;
  border-radius: 20px;
  padding: 4px 10px;
  background: white;
  gap: 2px;
}

// ── Empty State ────────────────────────────────
.empty-state {
  text-align: center;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #444;
}

.empty-sub {
  font-size: 13px;
  color: #aaaaaa;
}
</style>

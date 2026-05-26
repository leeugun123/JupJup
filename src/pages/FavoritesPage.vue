<template>
  <q-page class="fav-page">
    <!-- Header -->
    <div class="fav-header q-px-md q-pt-md q-pb-sm">
      <span class="fav-title">찜한 상품</span>
      <span class="fav-count text-grey-5">{{ filteredSortedProducts.length }}개</span>
    </div>

    <template v-if="favStore.favoriteProducts.length">
      <!-- Category Filter -->
      <div class="filter-row q-pb-xs">
        <div
          v-for="cat in availableCategories"
          :key="cat.key"
          class="filter-chip"
          :class="{ 'filter-chip--active': selectedCategory === cat.key }"
          @click="selectedCategory = cat.key"
        >
          <span class="chip-emoji">{{ cat.emoji }}</span>
          <span>{{ cat.label }}</span>
        </div>
      </div>

      <!-- Store Filter -->
      <div class="filter-row q-pb-sm">
        <div
          v-for="store in availableStores"
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

      <!-- Result count + Sort -->
      <div class="result-row q-px-md q-pb-xs">
        <span class="result-count text-grey-5">{{ filteredSortedProducts.length }}개</span>
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
        <div v-if="loading" class="row q-col-gutter-sm">
          <div v-for="i in 4" :key="i" class="col-6">
            <ProductCardSkeleton />
          </div>
        </div>

        <div v-else-if="filteredSortedProducts.length" class="row q-col-gutter-sm">
          <div v-for="product in filteredSortedProducts" :key="product.id" class="col-6">
            <ProductCard :product="product" @click="goToDetail(product.id)" />
          </div>
        </div>

        <div v-else class="empty-filter column items-center q-py-xl">
          <q-icon name="search_off" size="48px" color="grey-3" />
          <div class="empty-title q-mt-md">해당 상품이 없어요</div>
          <div class="empty-sub q-mt-xs">다른 조건으로 찾아보세요</div>
          <q-btn
            flat
            label="필터 초기화"
            color="primary"
            class="q-mt-sm"
            @click="selectedCategory = 'all'; selectedStore = 'all';"
          />
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="empty-state column items-center justify-center">
      <q-icon name="favorite_border" size="64px" color="grey-3" />
      <div class="empty-title q-mt-md">아직 찜한 상품이 없어요</div>
      <div class="empty-sub q-mt-xs">마음에 드는 상품을 찜해보세요!</div>
      <q-btn unelevated color="primary" rounded label="특가 상품 보러가기" class="q-mt-lg" to="/" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import ProductCardSkeleton from '../components/ProductCardSkeleton.vue';
import { useFavoritesStore } from '../stores/favorites';

const router = useRouter();
const favStore = useFavoritesStore();

const loading = ref(true);
onMounted(() => { setTimeout(() => { loading.value = false; }, 500); });

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

const allCategories = [
  { key: 'all', emoji: '🏷️', label: '전체' },
  { key: 'beverage', emoji: '🧃', label: '음료' },
  { key: 'snack', emoji: '🍫', label: '간식' },
  { key: 'food', emoji: '🍱', label: '식품' },
  { key: 'dairy', emoji: '🥛', label: '유제품' },
  { key: 'frozen', emoji: '❄️', label: '냉동' },
  { key: 'instant', emoji: '🍜', label: '즉석식품' },
];

const allStores = [
  { key: 'all', label: '전체', color: '#ff4757' },
  { key: 'store1', label: 'CU', color: '#0051A1' },
  { key: 'store2', label: 'GS25', color: '#F05014' },
  { key: 'store3', label: '세븐일레븐', color: '#007A33' },
];

const availableCategories = computed(() => {
  const catKeys = new Set(favStore.favoriteProducts.map((p) => p.category));
  return allCategories.filter((c) => c.key === 'all' || catKeys.has(c.key));
});

const availableStores = computed(() => {
  const storeKeys = new Set(favStore.favoriteProducts.map((p) => p.storeId));
  return allStores.filter((s) => s.key === 'all' || storeKeys.has(s.key));
});

const filteredSortedProducts = computed(() => {
  const list = favStore.favoriteProducts.filter((p) => {
    const matchCat = selectedCategory.value === 'all' || p.category === selectedCategory.value;
    const matchStore = selectedStore.value === 'all' || p.storeId === selectedStore.value;
    return matchCat && matchStore;
  });

  switch (sortBy.value) {
    case 'discount':
      return [...list].sort((a, b) => b.discountPercent - a.discountPercent);
    case 'expiry':
      return [...list].sort(
        (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
      );
    case 'price_low':
      return [...list].sort((a, b) => a.discountPrice - b.discountPrice);
    case 'price_high':
      return [...list].sort((a, b) => b.discountPrice - a.discountPrice);
    default:
      return list;
  }
});

function goToDetail(id: string) {
  void router.push(`/product/${id}`);
}
</script>

<style scoped lang="scss">
.fav-page {
  background: #f7f8fa;
  min-height: 100vh;
}

.fav-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.fav-title {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.fav-count {
  font-size: 14px;
}

// ── Filters ────────────────────────────────────
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

// ── Result Row ─────────────────────────────────
.result-row {
  display: flex;
  align-items: center;
}

.result-count {
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

// ── Empty States ───────────────────────────────
.empty-state {
  height: calc(100vh - 140px);
  text-align: center;
  padding: 0 32px;
}

.empty-filter {
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

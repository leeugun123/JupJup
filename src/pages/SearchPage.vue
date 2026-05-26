<template>
  <q-page class="search-page">
    <!-- Search Bar -->
    <div class="search-bar-wrap q-px-md q-pt-sm q-pb-md">
      <q-input
        ref="inputRef"
        v-model="query"
        outlined
        dense
        rounded
        placeholder="상품명, 편의점 검색"
        bg-color="white"
        class="search-input"
        @keyup.enter="onEnter"
      >
        <template #prepend>
          <q-icon name="search" color="grey-5" size="18px" />
        </template>
        <template #append>
          <q-icon
            v-if="query"
            name="close"
            color="grey-5"
            size="16px"
            class="cursor-pointer"
            @click="query = ''"
          />
        </template>
      </q-input>
    </div>

    <!-- Default: Recent + Popular + Category -->
    <template v-if="!isSearching">
      <!-- Recent Searches -->
      <section v-if="recentSearches.length" class="q-px-md q-mb-lg">
        <div class="section-header q-mb-sm">
          <span class="section-title">최근 검색어</span>
          <span class="clear-btn" @click="clearRecent">전체 삭제</span>
        </div>
        <div class="chips-row">
          <div
            v-for="(keyword, i) in recentSearches"
            :key="i"
            class="recent-chip"
            @click="selectKeyword(keyword)"
          >
            <q-icon name="history" size="13px" color="grey-5" />
            <span>{{ keyword }}</span>
            <q-icon
              name="close"
              size="12px"
              color="grey-4"
              class="cursor-pointer"
              @click.stop="removeRecent(i)"
            />
          </div>
        </div>
      </section>

      <!-- Popular Keywords -->
      <section class="q-px-md q-mb-lg">
        <div class="section-header q-mb-sm">
          <span class="section-title">🔥 인기 검색어</span>
          <span class="section-sub text-grey-5">{{ todayDate }} 기준</span>
        </div>
        <div class="popular-list">
          <div
            v-for="(kw, i) in popularKeywords"
            :key="i"
            class="popular-item"
            @click="selectKeyword(kw.word)"
          >
            <span class="popular-rank" :class="i < 3 ? 'rank-hot' : 'rank-normal'">
              {{ i + 1 }}
            </span>
            <span class="popular-word">{{ kw.word }}</span>
            <div class="popular-trend">
              <q-icon
                :name="
                  kw.trend === 'up'
                    ? 'arrow_drop_up'
                    : kw.trend === 'down'
                      ? 'arrow_drop_down'
                      : 'remove'
                "
                :color="kw.trend === 'up' ? 'negative' : kw.trend === 'down' ? 'info' : 'grey-4'"
                size="18px"
              />
              <span
                class="trend-label"
                :class="
                  kw.trend === 'up'
                    ? 'text-negative'
                    : kw.trend === 'down'
                      ? 'text-info'
                      : 'text-grey-4'
                "
              >
                {{ kw.trend === 'new' ? 'NEW' : '' }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Quick Links -->
      <section class="q-px-md">
        <div class="section-title q-mb-sm">카테고리</div>
        <div class="cat-grid">
          <div
            v-for="cat in categories"
            :key="cat.key"
            class="cat-card"
            :class="{ 'cat-card--active': selectedCategory === cat.key }"
            :style="`background: ${cat.color}18; border-color: ${selectedCategory === cat.key ? cat.color : cat.color + '30'}`"
            @click="selectCategory(cat.key)"
          >
            <span class="cat-emoji">{{ cat.emoji }}</span>
            <span class="cat-label" :style="`color: ${cat.color}`">{{ cat.label }}</span>
          </div>
        </div>
      </section>
    </template>

    <!-- Search Results -->
    <template v-else>
      <div class="q-px-md">
        <div class="result-meta q-mb-sm">
          <!-- Active category chip -->
          <div v-if="selectedCategory" class="active-cat-chip">
            <span class="cat-emoji-sm">{{ activeCategoryEmoji }}</span>
            <span>{{ activeCategoryLabel }}</span>
            <q-icon
              name="close"
              size="13px"
              color="grey-5"
              class="cursor-pointer"
              @click="selectedCategory = ''"
            />
          </div>
          <div class="result-count-row">
            <span class="text-grey-6 text-caption">
              <template v-if="query">
                <strong class="text-dark">"{{ query }}"</strong> 검색 결과
              </template>
              <template v-else> 카테고리 검색 결과 </template>
              {{ sortedProducts.length }}개
            </span>
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
                      <q-icon
                        v-if="sortBy === opt.value"
                        name="check"
                        color="primary"
                        size="14px"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>

        <div v-if="loading" class="row q-col-gutter-sm q-pb-xl">
          <div v-for="i in 6" :key="i" class="col-6">
            <ProductCardSkeleton />
          </div>
        </div>

        <div v-else-if="sortedProducts.length" class="row q-col-gutter-sm q-pb-xl">
          <div v-for="p in sortedProducts" :key="p.id" class="col-6">
            <ProductCard :product="p" @click="goToDetail(p.id)" />
          </div>
        </div>

        <div v-else class="column items-center q-py-xl text-grey-5">
          <q-icon name="search_off" size="56px" color="grey-3" />
          <div class="text-body2 text-weight-medium q-mt-md">검색 결과가 없어요</div>
          <div class="text-caption q-mt-xs">다른 검색어를 입력해보세요</div>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import ProductCardSkeleton from '../components/ProductCardSkeleton.vue';
import { mockProducts } from '../data/mockProducts';

const router = useRouter();
const inputRef = ref<{ focus: () => void } | null>(null);
const query = ref('');
const selectedCategory = ref('');
const loading = ref(false);

onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 100);
  recentSearches.value = loadRecent();
});

const todayDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });

// ── Recent searches (localStorage) ──────────────
const RECENT_KEY = 'jupjup_recent_searches';

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function saveRecent(list: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

const recentSearches = ref<string[]>([]);

function addToRecent(word: string) {
  const trimmed = word.trim();
  if (!trimmed) return;
  const updated = [trimmed, ...recentSearches.value.filter((w) => w !== trimmed)].slice(0, 10);
  recentSearches.value = updated;
  saveRecent(updated);
}

function removeRecent(i: number) {
  recentSearches.value.splice(i, 1);
  saveRecent([...recentSearches.value]);
}

function clearRecent() {
  recentSearches.value = [];
  saveRecent([]);
}

// ── Keyword selection ───────────────────────────
function selectKeyword(word: string) {
  query.value = word;
  selectedCategory.value = '';
  addToRecent(word);
}

function onEnter() {
  if (query.value.trim()) addToRecent(query.value);
}

// ── Category ────────────────────────────────────
const categories = [
  { key: 'beverage', emoji: '🧃', label: '음료', color: '#2196F3' },
  { key: 'snack', emoji: '🍫', label: '간식', color: '#9C27B0' },
  { key: 'food', emoji: '🍱', label: '식품', color: '#FF9800' },
  { key: 'dairy', emoji: '🥛', label: '유제품', color: '#00BCD4' },
  { key: 'frozen', emoji: '❄️', label: '냉동', color: '#3F51B5' },
  { key: 'instant', emoji: '🍜', label: '즉석식품', color: '#F44336' },
];

function selectCategory(key: string) {
  selectedCategory.value = selectedCategory.value === key ? '' : key;
  query.value = '';
}

const activeCategoryEmoji = computed(
  () => categories.find((c) => c.key === selectedCategory.value)?.emoji ?? '',
);
const activeCategoryLabel = computed(
  () => categories.find((c) => c.key === selectedCategory.value)?.label ?? '',
);

// ── Popular keywords ─────────────────────────────
const popularKeywords = [
  { word: '김밥', trend: 'up' },
  { word: '바나나 우유', trend: 'up' },
  { word: '샌드위치', trend: 'new' },
  { word: '삼각김밥', trend: 'down' },
  { word: '컵라면', trend: 'up' },
  { word: '그릭 요거트', trend: 'up' },
  { word: '초코파이', trend: 'down' },
  { word: '오렌지 주스', trend: '-' },
  { word: '크래커', trend: '-' },
  { word: '아이스크림', trend: 'new' },
];

// ── Filtering & Sorting ──────────────────────────
const isSearching = computed(() => !!query.value || !!selectedCategory.value);

let loadingTimer: ReturnType<typeof setTimeout> | null = null;
watch(isSearching, (val) => {
  if (val) {
    loading.value = true;
    if (loadingTimer) clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => { loading.value = false; }, 400);
  } else {
    loading.value = false;
  }
});

const filteredProducts = computed(() => {
  const q = query.value.toLowerCase();
  return mockProducts.filter((p) => {
    const matchesCategory = !selectedCategory.value || p.category === selectedCategory.value;
    const matchesQuery =
      !q || p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
});

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
  if (query.value.trim()) addToRecent(query.value);
  void router.push(`/product/${id}`);
}
</script>

<style scoped lang="scss">
.search-page {
  background: #f5f6f8;
  padding-bottom: 80px;
}

.search-bar-wrap {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-input {
  :deep(.q-field__control) {
    background: #f5f6f8 !important;
    border-radius: 12px !important;
    height: 44px;
    border: none !important;
    box-shadow: none;
  }
  :deep(.q-field__marginal) {
    height: 44px;
  }
  :deep(.q-field__bottom) {
    display: none;
  }
}

// ── Section Headers ────────────────────────────
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: -0.3px;
}

.section-sub {
  font-size: 11px;
}

.clear-btn {
  font-size: 12px;
  color: #aaaaaa;
  cursor: pointer;
}

// ── Recent Chips ───────────────────────────────
.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recent-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  background: white;
  border: 1.5px solid #eeeeee;
  font-size: 13px;
  color: #444;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: background 0.15s;

  &:active {
    background: #f5f5f5;
  }
}

// ── Popular List ───────────────────────────────
.popular-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}

.popular-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;

  &:active {
    background: #fafafa;
  }
  &:nth-child(odd) {
    border-right: 1px solid #f5f5f5;
  }
  &:nth-last-child(-n + 2) {
    border-bottom: none;
  }
}

.popular-rank {
  font-size: 15px;
  font-weight: 800;
  min-width: 18px;
  letter-spacing: -0.5px;

  &.rank-hot {
    color: #ff4757;
  }
  &.rank-normal {
    color: #aaaaaa;
  }
}

.popular-word {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popular-trend {
  display: flex;
  align-items: center;
}

.trend-label {
  font-size: 9px;
  font-weight: 700;
}

// ── Category Grid ──────────────────────────────
.cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px 8px;
  border-radius: 14px;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.96);
  }

  &--active {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
    transform: scale(0.97);
  }
}

.cat-emoji {
  font-size: 24px;
}
.cat-label {
  font-size: 12px;
  font-weight: 700;
}

// ── Results ────────────────────────────────────
.result-meta {
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-count-row {
  display: flex;
  align-items: center;
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

.active-cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: white;
  border: 1.5px solid #eeeeee;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.cat-emoji-sm {
  font-size: 14px;
}
</style>

<template>
  <q-page class="search-page">
    <!-- Search Bar -->
    <div class="search-bar-wrap q-px-md q-pt-sm q-pb-md">
      <q-input
        ref="inputRef"
        v-model="query"
        outlined dense rounded
        placeholder="상품명, 편의점 검색"
        bg-color="white"
        class="search-input"
        @keyup.enter="addToRecent(query)"
      >
        <template #prepend>
          <q-icon name="search" color="grey-5" size="18px" />
        </template>
        <template #append>
          <q-icon v-if="query" name="close" color="grey-5" size="16px"
                  class="cursor-pointer" @click="query = ''" />
        </template>
      </q-input>
    </div>

    <!-- Empty State: Recent + Popular -->
    <template v-if="!query">
      <!-- Recent Searches -->
      <section v-if="recentSearches.length" class="q-px-md q-mb-lg">
        <div class="section-header q-mb-sm">
          <span class="section-title">최근 검색어</span>
          <span class="clear-btn" @click="recentSearches = []">전체 삭제</span>
        </div>
        <div class="chips-row">
          <div
            v-for="(keyword, i) in recentSearches" :key="i"
            class="recent-chip"
            @click="query = keyword"
          >
            <q-icon name="history" size="13px" color="grey-5" />
            <span>{{ keyword }}</span>
            <q-icon name="close" size="12px" color="grey-4" class="cursor-pointer"
                    @click.stop="removeRecent(i)" />
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
            v-for="(kw, i) in popularKeywords" :key="i"
            class="popular-item"
            @click="query = kw.word"
          >
            <span class="popular-rank" :class="i < 3 ? 'rank-hot' : 'rank-normal'">
              {{ i + 1 }}
            </span>
            <span class="popular-word">{{ kw.word }}</span>
            <div class="popular-trend">
              <q-icon
                :name="kw.trend === 'up' ? 'arrow_drop_up' : kw.trend === 'down' ? 'arrow_drop_down' : 'remove'"
                :color="kw.trend === 'up' ? 'negative' : kw.trend === 'down' ? 'info' : 'grey-4'"
                size="18px"
              />
              <span
                class="trend-label"
                :class="kw.trend === 'up' ? 'text-negative' : kw.trend === 'down' ? 'text-info' : 'text-grey-4'"
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
            v-for="cat in categories" :key="cat.key"
            class="cat-card"
            :style="`background: ${cat.color}18; border-color: ${cat.color}30`"
            @click="query = cat.label"
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
          <span class="text-grey-6 text-caption">
            <strong class="text-dark">"{{ query }}"</strong> 검색 결과 {{ filteredProducts.length }}개
          </span>
        </div>

        <div v-if="filteredProducts.length" class="row q-col-gutter-sm q-pb-xl">
          <div v-for="p in filteredProducts" :key="p.id" class="col-6">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { mockProducts } from '../data/mockProducts'

const router = useRouter()
const inputRef = ref<{ focus: () => void } | null>(null)
const query = ref('')

onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 100)
})

const todayDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })

const recentSearches = ref(['김밥', '딸기 우유', '요거트'])

function addToRecent(word: string) {
  const trimmed = word.trim()
  if (!trimmed) return
  recentSearches.value = [trimmed, ...recentSearches.value.filter((w) => w !== trimmed)].slice(0, 10)
}

function removeRecent(i: number) {
  recentSearches.value.splice(i, 1)
}

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
]

const categories = [
  { key: 'beverage', emoji: '🧃', label: '음료', color: '#2196F3' },
  { key: 'snack', emoji: '🍫', label: '간식', color: '#9C27B0' },
  { key: 'food', emoji: '🍱', label: '식품', color: '#FF9800' },
  { key: 'dairy', emoji: '🥛', label: '유제품', color: '#00BCD4' },
  { key: 'frozen', emoji: '❄️', label: '냉동', color: '#3F51B5' },
  { key: 'instant', emoji: '🍜', label: '즉석식품', color: '#F44336' },
]

const filteredProducts = computed(() =>
  mockProducts.filter(
    (p) =>
      p.name.includes(query.value) ||
      p.storeName.includes(query.value) ||
      p.category.includes(query.value)
  )
)

function goToDetail(id: string) {
  addToRecent(query.value)
  void router.push(`/product/${id}`)
}
</script>

<style scoped lang="scss">
.search-page {
  background: #F5F6F8;
  padding-bottom: 80px;
}

.search-bar-wrap {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.search-input {
  :deep(.q-field__control) {
    background: #F5F6F8 !important;
    border-radius: 12px !important;
    height: 44px;
    border: none !important;
    box-shadow: none;
  }
  :deep(.q-field__marginal) { height: 44px; }
  :deep(.q-field__bottom) { display: none; }
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
  color: #1A1A2E;
  letter-spacing: -0.3px;
}

.section-sub {
  font-size: 11px;
}

.clear-btn {
  font-size: 12px;
  color: #AAAAAA;
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
  border: 1.5px solid #EEEEEE;
  font-size: 13px;
  color: #444;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  transition: background 0.15s;

  &:active { background: #f5f5f5; }
}

// ── Popular List ───────────────────────────────
.popular-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.popular-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  cursor: pointer;
  border-bottom: 1px solid #F5F5F5;
  transition: background 0.15s;

  &:active { background: #FAFAFA; }
  &:nth-child(odd) { border-right: 1px solid #F5F5F5; }
  &:nth-last-child(-n+2) { border-bottom: none; }
}

.popular-rank {
  font-size: 15px;
  font-weight: 800;
  min-width: 18px;
  letter-spacing: -0.5px;

  &.rank-hot { color: #FF4757; }
  &.rank-normal { color: #AAAAAA; }
}

.popular-word {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #1A1A2E;
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

  &:active { transform: scale(0.96); }
}

.cat-emoji { font-size: 24px; }
.cat-label { font-size: 12px; font-weight: 700; }

// ── Results ────────────────────────────────────
.result-meta { padding-top: 4px; }
</style>

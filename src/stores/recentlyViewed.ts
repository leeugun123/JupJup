import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mockProducts } from '../data/mockProducts';
import type { Product } from '../types/product';

export const useRecentlyViewedStore = defineStore(
  'recentlyViewed',
  () => {
    const ids = ref<string[]>([]);

    function add(id: string) {
      const filtered = ids.value.filter((i) => i !== id);
      ids.value = [id, ...filtered].slice(0, 10);
    }

    function clear() {
      ids.value = [];
    }

    const products = computed<Product[]>(() =>
      ids.value
        .map((id) => mockProducts.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined),
    );

    return { ids, add, clear, products };
  },
  { persist: true },
);

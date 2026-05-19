import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockProducts } from '../data/mockProducts'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>([])

  const favoriteProducts = computed(() =>
    mockProducts.filter((p) => ids.value.includes(p.id))
  )

  function toggle(id: string) {
    const idx = ids.value.indexOf(id)
    if (idx === -1) ids.value.push(id)
    else ids.value.splice(idx, 1)
  }

  function isFavorite(id: string) {
    return ids.value.includes(id)
  }

  return { ids, favoriteProducts, toggle, isFavorite }
})

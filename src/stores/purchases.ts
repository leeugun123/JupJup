import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '../types/product'

export interface Purchase {
  id: string
  product: Product
  purchasedAt: string
  code: string
  savings: number
}

export const usePurchasesStore = defineStore('purchases', () => {
  const history = ref<Purchase[]>([])

  function add(product: Product): Purchase {
    const purchase: Purchase = {
      id: crypto.randomUUID(),
      product,
      purchasedAt: new Date().toISOString(),
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
      savings: product.originalPrice - product.discountPrice,
    }
    history.value.unshift(purchase)
    return purchase
  }

  const totalSavings = () =>
    history.value.reduce((sum, p) => sum + p.savings, 0)

  return { history, add, totalSavings }
})

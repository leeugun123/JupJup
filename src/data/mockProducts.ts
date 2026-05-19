import type { Product } from '../types/product'

export const mockProducts: Product[] = [
  { id: '1', name: '딸기 우유', originalPrice: 2500, discountPrice: 1500, discountPercent: 40, expiryDate: '2026-05-21', storeId: 'store1', storeName: 'CU 강남점', location: '서울 강남구 역삼동 123', image: 'https://picsum.photos/seed/milk1/400/300', category: 'dairy' },
  { id: '2', name: '초코파이 (12개입)', originalPrice: 3000, discountPrice: 1800, discountPercent: 40, expiryDate: '2026-05-25', storeId: 'store1', storeName: 'CU 강남점', location: '서울 강남구 역삼동 123', image: 'https://picsum.photos/seed/choco2/400/300', category: 'snack' },
  { id: '3', name: '참치 김밥', originalPrice: 4000, discountPrice: 2000, discountPercent: 50, expiryDate: '2026-05-20', storeId: 'store2', storeName: 'GS25 역삼점', location: '서울 강남구 역삼동 456', image: 'https://picsum.photos/seed/kimbap3/400/300', category: 'food' },
  { id: '4', name: '오렌지 주스 500ml', originalPrice: 1800, discountPrice: 900, discountPercent: 50, expiryDate: '2026-05-20', storeId: 'store2', storeName: 'GS25 역삼점', location: '서울 강남구 역삼동 456', image: 'https://picsum.photos/seed/orange4/400/300', category: 'beverage' },
  { id: '5', name: '통밀 크래커', originalPrice: 2200, discountPrice: 1100, discountPercent: 50, expiryDate: '2026-05-22', storeId: 'store3', storeName: '세븐일레븐 삼성점', location: '서울 강남구 삼성동 789', image: 'https://picsum.photos/seed/cracker5/400/300', category: 'snack' },
  { id: '6', name: '그릭 요거트', originalPrice: 3500, discountPrice: 2100, discountPercent: 40, expiryDate: '2026-05-19', storeId: 'store1', storeName: 'CU 강남점', location: '서울 강남구 역삼동 123', image: 'https://picsum.photos/seed/yogurt6/400/300', category: 'dairy' },
  { id: '7', name: '바나나 우유', originalPrice: 1500, discountPrice: 800, discountPercent: 47, expiryDate: '2026-05-21', storeId: 'store2', storeName: 'GS25 역삼점', location: '서울 강남구 역삼동 456', image: 'https://picsum.photos/seed/banana7/400/300', category: 'dairy' },
  { id: '8', name: '매운 컵라면', originalPrice: 1200, discountPrice: 700, discountPercent: 42, expiryDate: '2026-06-01', storeId: 'store3', storeName: '세븐일레븐 삼성점', location: '서울 강남구 삼성동 789', image: 'https://picsum.photos/seed/ramen8/400/300', category: 'food' },
]

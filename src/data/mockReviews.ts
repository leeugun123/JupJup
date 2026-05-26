export interface Review {
  id: string;
  name: string;
  initial: string;
  rating: number;
  text: string;
  date: string;
}

const reviewPool: Review[] = [
  { id: 'r1', name: '김**', initial: '김', rating: 5, text: '정말 맛있어요! 가격도 저렴하고 편의점에서 이런 특가를 만나다니 행운이에요.', date: '2025-05-20' },
  { id: 'r2', name: '이**', initial: '이', rating: 4, text: '맛은 좋은데 양이 조금 적어요. 그래도 가격 대비 훌륭합니다.', date: '2025-05-18' },
  { id: 'r3', name: '박**', initial: '박', rating: 5, text: '마감 임박이라 걱정했는데 신선했어요! 다음에도 구매할게요.', date: '2025-05-15' },
  { id: 'r4', name: '최**', initial: '최', rating: 3, text: '평범한 편이에요. 할인가 기준으론 괜찮습니다.', date: '2025-05-12' },
  { id: 'r5', name: '정**', initial: '정', rating: 5, text: '강추합니다! 할인율이 커서 자주 이용하고 있어요.', date: '2025-05-10' },
  { id: 'r6', name: '강**', initial: '강', rating: 4, text: '편의점에서 이 가격에 살 수 있다니 놀랍네요.', date: '2025-05-08' },
  { id: 'r7', name: '조**', initial: '조', rating: 5, text: '유통기한 걱정 없었어요. 신선하고 맛있었습니다!', date: '2025-05-05' },
  { id: 'r8', name: '윤**', initial: '윤', rating: 4, text: '할인율이 높아서 부담 없이 구매했어요. 만족합니다.', date: '2025-05-03' },
];

export function getProductReviews(productId: string): Review[] {
  const hash = productId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const count = (hash % 3) + 3; // 3~5개
  const start = hash % reviewPool.length;
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    reviews.push(reviewPool[(start + i) % reviewPool.length]!);
  }
  return reviews;
}

export function getAverageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
}

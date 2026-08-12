export const CATEGORIES = [
  "특가 할인템",
  "첫자취를 위한 가구",
  "컨텐츠에 사용된 가구",
  "자취꿀템",
  "자취식품창고",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const PRODUCT_TYPES = [
  "책상",
  "침대",
  "식탁",
  "의자",
  "화장대",
  "선반",
  "수납장",
  "식탁의자",
  "소파",
  "리클라이너",
  "액자",
  "커튼",
  "테이블조명",
  "펜던트조명",
  "플로어조명",
  "식품",
  "인테리어소품",
  "비품",
] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export type Product = {
  id: number;
  created_at: string;
  name: string;
  price: string;
  image_url: string;
  category: string;
  product_type: string;
  coupang_url: string;
  sort_order: number;
  active: boolean;
};

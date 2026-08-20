export const CATEGORIES = [
  "컨텐츠에 사용된 가구",
  "첫자취를 위한 가구",
  "자취꿀템",
  "자취식품창고",
  "특가 할인템",
] as const;
export type Category = (typeof CATEGORIES)[number];

const PRODUCT_TYPES_UNSORTED = [
  "책상",
  "침대",
  "식탁",
  "커피테이블",
  "사이드테이블",
  "의자",
  "안락의자",
  "화장대",
  "선반",
  "수납장",
  "서랍장",
  "옷장",
  "식탁의자",
  "소파",
  "리클라이너",
  "액자",
  "거울",
  "커튼",
  "러그",
  "무타공파티션",
  "테이블조명",
  "펜던트조명",
  "플로어조명",
  "스피커",
  "식물",
  "식품",
  "인테리어소품",
  "비품",
] as const;

export const PRODUCT_TYPES = [...PRODUCT_TYPES_UNSORTED].sort((a, b) =>
  a.localeCompare(b, "ko")
) as unknown as typeof PRODUCT_TYPES_UNSORTED;
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

export type FeaturedProduct = Product & { reg_number: number };

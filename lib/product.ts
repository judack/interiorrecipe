export const CATEGORIES = [
  "특가 할인템",
  "첫자취를 위한 가구",
  "컨텐츠에 사용된 가구",
  "자취꿀템",
  "자취식품창고",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: number;
  created_at: string;
  name: string;
  price: string;
  image_url: string;
  category: string;
  coupang_url: string;
  sort_order: number;
  active: boolean;
};

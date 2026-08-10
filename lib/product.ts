export const SEASONS = ["봄", "여름", "가을", "겨울", "전체"] as const;
export type Season = (typeof SEASONS)[number];

export type Product = {
  id: number;
  created_at: string;
  name: string;
  price: string;
  image_url: string;
  category: string;
  season: Season;
  coupang_url: string;
  sort_order: number;
  active: boolean;
};

export function getCurrentSeason(): Season {
  const month = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      month: "numeric",
    }).format(new Date())
  );

  if (month >= 3 && month <= 5) return "봄";
  if (month >= 6 && month <= 8) return "여름";
  if (month >= 9 && month <= 11) return "가을";
  return "겨울";
}

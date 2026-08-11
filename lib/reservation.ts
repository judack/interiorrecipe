export const STATUSES = ["접수", "상담", "진행", "완료"] as const;
export type ReservationStatus = (typeof STATUSES)[number];

export type Reservation = {
  id: number;
  created_at: string;
  service_type: string;
  space_type: string;
  size: string;
  budget: string;
  furniture_budget: string;
  styles: string;
  pains: string;
  name: string;
  contact: string;
  gender: string | null;
  birth_year: string | null;
  birth_month: string | null;
  region: string;
  address_detail: string | null;
  message: string | null;
  visit_date: string | null;
  photo_urls: string | null;
  mbti_result: string | null;
  status: ReservationStatus;
};

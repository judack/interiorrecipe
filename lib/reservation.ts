export const STATUSES = ["접수", "상담", "진행", "완료"] as const;
export type ReservationStatus = (typeof STATUSES)[number];

export type Reservation = {
  id: number;
  created_at: string;
  service_type: string;
  space_type: string;
  size: string;
  budget: string;
  styles: string;
  pains: string;
  name: string;
  contact: string;
  message: string | null;
  status: ReservationStatus;
};

import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function ensureReservationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      space_type TEXT NOT NULL,
      size TEXT NOT NULL,
      budget TEXT NOT NULL,
      styles TEXT NOT NULL,
      pains TEXT NOT NULL,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      message TEXT
    )
  `;
}

export type Reservation = {
  id: number;
  created_at: string;
  space_type: string;
  size: string;
  budget: string;
  styles: string;
  pains: string;
  name: string;
  contact: string;
  message: string | null;
};

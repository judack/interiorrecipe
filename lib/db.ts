import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function ensureReservationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      service_type TEXT NOT NULL DEFAULT '',
      space_type TEXT NOT NULL,
      size TEXT NOT NULL,
      budget TEXT NOT NULL,
      styles TEXT NOT NULL,
      pains TEXT NOT NULL,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT '접수'
    )
  `;
  await sql`
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT '접수'
  `;
  await sql`
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS service_type TEXT NOT NULL DEFAULT ''
  `;
}

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
  await sql`
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS visit_date TEXT
  `;
  await sql`
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS furniture_budget TEXT NOT NULL DEFAULT ''
  `;
}

export async function ensureProductsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      season TEXT NOT NULL DEFAULT '전체',
      coupang_url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true
    )
  `;
}

import { ensureReservationsTable, sql } from "@/lib/db";
import type { Reservation } from "@/lib/reservation";
import { SITE } from "@/lib/site-config";
import { AdminReservationsTable } from "@/components/admin-reservations-table";

export const dynamic = "force-dynamic";

async function getReservations(): Promise<Reservation[]> {
  await ensureReservationsTable();
  const rows = await sql`
    SELECT * FROM reservations ORDER BY created_at DESC
  `;
  return rows as Reservation[];
}

export default async function AdminPage() {
  const reservations = await getReservations();

  return (
    <main className="min-h-screen bg-paper px-6 py-16 text-ink md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-2">
          <img src={SITE.logoSrc} alt="" className="h-7 w-auto" />
          <span className="text-sm font-semibold tracking-tight">
            {SITE.name}
          </span>
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          상담 신청 목록
        </h1>
        <p className="mt-2 text-sm text-mute">
          총 {reservations.length}건 · 최신 순
        </p>

        <div className="mt-10">
          <AdminReservationsTable initialReservations={reservations} />
        </div>
      </div>
    </main>
  );
}

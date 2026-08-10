import { ensureReservationsTable, sql } from "@/lib/db";
import { SITE } from "@/lib/site-config";
import { AdminNav } from "@/components/admin-nav";
import { AdminCalendar } from "@/components/admin-calendar";

export const dynamic = "force-dynamic";

async function getVisitReservations() {
  await ensureReservationsTable();
  const rows = await sql`
    SELECT id, name, visit_date FROM reservations
    WHERE visit_date IS NOT NULL
  `;
  return rows as { id: number; name: string; visit_date: string }[];
}

export default async function AdminCalendarPage() {
  const reservations = await getVisitReservations();

  return (
    <main className="min-h-screen bg-paper px-6 py-16 text-ink md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2">
          <img src={SITE.logoSrc} alt="" className="h-7 w-auto" />
          <span className="text-sm font-semibold tracking-tight">
            {SITE.name}
          </span>
        </div>

        <div className="mt-8">
          <AdminNav />
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          방문 상담 캘린더
        </h1>
        <p className="mt-2 text-sm text-mute">
          날짜에 마우스를 올리면 신청자 수와 이름을 볼 수 있어요.
        </p>

        <div className="mt-10">
          <AdminCalendar reservations={reservations} />
        </div>
      </div>
    </main>
  );
}

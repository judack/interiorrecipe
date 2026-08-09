import { ensureReservationsTable, sql, type Reservation } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getReservations(): Promise<Reservation[]> {
  await ensureReservationsTable();
  const rows = await sql`
    SELECT * FROM reservations ORDER BY created_at DESC
  `;
  return rows as Reservation[];
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  const reservations = await getReservations();

  return (
    <main className="min-h-screen bg-paper px-6 py-16 text-ink md:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          상담 신청 목록
        </h1>
        <p className="mt-2 text-sm text-mute">
          총 {reservations.length}건 · 최신 순
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-mute">
                <th className="py-3 pr-4 font-medium">신청일시</th>
                <th className="py-3 pr-4 font-medium">이름</th>
                <th className="py-3 pr-4 font-medium">연락처</th>
                <th className="py-3 pr-4 font-medium">공간 유형</th>
                <th className="py-3 pr-4 font-medium">평수</th>
                <th className="py-3 pr-4 font-medium">예산</th>
                <th className="py-3 pr-4 font-medium">스타일</th>
                <th className="py-3 pr-4 font-medium">불편한 점</th>
                <th className="py-3 pr-4 font-medium">요청사항</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-line align-top">
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="py-3 pr-4 font-medium">{r.name}</td>
                  <td className="py-3 pr-4">{r.contact}</td>
                  <td className="py-3 pr-4">{r.space_type}</td>
                  <td className="py-3 pr-4">{r.size}</td>
                  <td className="py-3 pr-4">{r.budget}</td>
                  <td className="py-3 pr-4">{r.styles || "-"}</td>
                  <td className="py-3 pr-4">{r.pains || "-"}</td>
                  <td className="py-3 pr-4">{r.message || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {reservations.length === 0 && (
            <p className="mt-10 text-sm text-mute">
              아직 접수된 상담 신청이 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

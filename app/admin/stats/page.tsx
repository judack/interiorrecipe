import { ensurePageViewsTable, sql } from "@/lib/db";
import { SITE } from "@/lib/site-config";
import { AdminNav } from "@/components/admin-nav";

export const dynamic = "force-dynamic";

async function getStats() {
  await ensurePageViewsTable();

  const summaryRows = await sql`
    SELECT
      (SELECT count(*) FROM page_views) AS total_views,
      (SELECT count(DISTINCT visitor_id) FROM page_views) AS total_visitors,
      (SELECT count(*) FROM page_views
        WHERE (created_at AT TIME ZONE 'Asia/Seoul')::date = (now() AT TIME ZONE 'Asia/Seoul')::date
      ) AS today_views,
      (SELECT count(DISTINCT visitor_id) FROM page_views
        WHERE (created_at AT TIME ZONE 'Asia/Seoul')::date = (now() AT TIME ZONE 'Asia/Seoul')::date
      ) AS today_visitors
  `;

  const dailyRows = await sql`
    SELECT
      (created_at AT TIME ZONE 'Asia/Seoul')::date AS day,
      count(*) AS views,
      count(DISTINCT visitor_id) AS visitors
    FROM page_views
    WHERE created_at > now() - interval '14 days'
    GROUP BY day
    ORDER BY day DESC
  `;

  const s = summaryRows[0];

  return {
    totalViews: Number(s.total_views),
    totalVisitors: Number(s.total_visitors),
    todayViews: Number(s.today_views),
    todayVisitors: Number(s.today_visitors),
    daily: dailyRows.map((row) => ({
      day: new Date(row.day as string),
      views: Number(row.views),
      visitors: Number(row.visitors),
    })),
  };
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line p-6">
      <p className="text-sm text-mute">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default async function AdminStatsPage() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-paper px-6 py-16 text-ink md:px-10">
      <div className="mx-auto max-w-6xl">
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
          방문자 통계
        </h1>
        <p className="mt-2 text-sm text-mute">
          홈페이지 방문 데이터예요 (관리자 페이지 방문은 집계하지 않아요).
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="오늘 방문자" value={stats.todayVisitors} />
          <StatCard label="오늘 조회수" value={stats.todayViews} />
          <StatCard label="전체 방문자" value={stats.totalVisitors} />
          <StatCard label="전체 조회수" value={stats.totalViews} />
        </div>

        <h2 className="mt-12 text-lg font-semibold tracking-tight">
          최근 14일
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-mute">
                <th className="py-3 pr-6 font-medium">날짜</th>
                <th className="py-3 pr-6 font-medium">방문자</th>
                <th className="py-3 pr-6 font-medium">조회수</th>
              </tr>
            </thead>
            <tbody>
              {stats.daily.map((row) => (
                <tr key={row.day.toISOString()} className="border-b border-line">
                  <td className="py-3 pr-6">
                    {row.day.toLocaleDateString("ko-KR", {
                      timeZone: "UTC",
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </td>
                  <td className="py-3 pr-6">{row.visitors.toLocaleString()}</td>
                  <td className="py-3 pr-6">{row.views.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {stats.daily.length === 0 && (
            <p className="mt-6 text-sm text-mute">
              아직 방문 데이터가 없습니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

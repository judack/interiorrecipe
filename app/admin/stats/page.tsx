import Link from "next/link";
import { ensurePageViewsTable, ensureReservationsTable, sql } from "@/lib/db";
import { SITE } from "@/lib/site-config";
import { AdminNav } from "@/components/admin-nav";

export const dynamic = "force-dynamic";

const RANGE_OPTIONS = [
  { key: "15", label: "최근 15일", days: 15 },
  { key: "30", label: "최근 30일", days: 30 },
  { key: "60", label: "최근 60일", days: 60 },
  { key: "90", label: "최근 90일", days: 90 },
  { key: "all", label: "전체", days: null },
] as const;

function resolveRange(key: string | undefined) {
  return RANGE_OPTIONS.find((r) => r.key === key) ?? RANGE_OPTIONS[1];
}

async function getVisitStats(rangeDays: number | null) {
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

  const cutoff =
    rangeDays === null
      ? new Date(0)
      : new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

  const rangeRows = await sql`
    SELECT count(*) AS views, count(DISTINCT visitor_id) AS visitors
    FROM page_views
    WHERE created_at > ${cutoff.toISOString()}
  `;

  const dailyRows = await sql`
    SELECT
      (created_at AT TIME ZONE 'Asia/Seoul')::date AS day,
      count(*) AS views,
      count(DISTINCT visitor_id) AS visitors
    FROM page_views
    WHERE created_at > ${cutoff.toISOString()}
    GROUP BY day
    ORDER BY day DESC
    LIMIT 366
  `;

  const s = summaryRows[0];
  const r = rangeRows[0];

  return {
    totalViews: Number(s.total_views),
    totalVisitors: Number(s.total_visitors),
    todayViews: Number(s.today_views),
    todayVisitors: Number(s.today_visitors),
    rangeViews: Number(r.views),
    rangeVisitors: Number(r.visitors),
    daily: dailyRows.map((row) => ({
      day: new Date(row.day as string),
      views: Number(row.views),
      visitors: Number(row.visitors),
    })),
  };
}

function ageBucket(age: number) {
  if (age < 10) return "10대 미만";
  return `${Math.floor(age / 10) * 10}대`;
}

async function getApplicantDemographics() {
  await ensureReservationsTable();

  const genderRows = await sql`
    SELECT gender, count(*) AS count
    FROM reservations
    WHERE gender IS NOT NULL AND gender != ''
    GROUP BY gender
  `;

  const birthYearRows = await sql`
    SELECT birth_year
    FROM reservations
    WHERE birth_year IS NOT NULL AND birth_year != ''
  `;

  const currentYear = new Date().getFullYear();
  const ageCounts = new Map<string, number>();
  for (const row of birthYearRows) {
    const year = Number(row.birth_year);
    if (!year) continue;
    const bucket = ageBucket(currentYear - year);
    ageCounts.set(bucket, (ageCounts.get(bucket) ?? 0) + 1);
  }

  const totalGender = genderRows.reduce((sum, g) => sum + Number(g.count), 0);
  const totalAge = [...ageCounts.values()].reduce((sum, c) => sum + c, 0);

  return {
    gender: genderRows
      .map((g) => ({ label: g.gender as string, count: Number(g.count) }))
      .sort((a, b) => b.count - a.count),
    totalGender,
    age: [...ageCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => Number(a.label.replace(/\D/g, "")) - Number(b.label.replace(/\D/g, ""))),
    totalAge,
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

function BreakdownList({
  title,
  items,
  total,
}: {
  title: string;
  items: { label: string; count: number }[];
  total: number;
}) {
  return (
    <div>
      <h3 className="text-base font-medium">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-mute">아직 데이터가 없습니다.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {items.map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="text-mute">
                    {item.count.toLocaleString()}명 · {pct}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-mist">
                  <div
                    className="h-full rounded-full bg-ink"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeKey } = await searchParams;
  const range = resolveRange(rangeKey);
  const stats = await getVisitStats(range.days);
  const demographics = await getApplicantDemographics();

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
          홈페이지 방문 데이터예요 (관리자 페이지 방문은 집계하지 않아요). 전체
          방문자·조회수는 지금까지 누적된 값이에요.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="오늘 방문자" value={stats.todayVisitors} />
          <StatCard label="오늘 조회수" value={stats.todayViews} />
          <StatCard label="누적 방문자 (전체)" value={stats.totalVisitors} />
          <StatCard label="누적 조회수 (전체)" value={stats.totalViews} />
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <Link
              key={opt.key}
              href={`/admin/stats?range=${opt.key}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                opt.key === range.key
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:bg-mist"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:w-1/2">
          <StatCard label={`${range.label} 방문자`} value={stats.rangeVisitors} />
          <StatCard label={`${range.label} 조회수`} value={stats.rangeViews} />
        </div>

        <h2 className="mt-10 text-lg font-semibold tracking-tight">
          {range.label} 일별 현황
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

        <h2 className="mt-16 text-lg font-semibold tracking-tight">
          상담 신청자 성별·연령 분포
        </h2>
        <p className="mt-2 text-sm text-mute">
          홈페이지 방문자는 익명이라 성별·연령을 알 수 없어요. 대신 상담
          신청서에 입력된 성별·출생연도를 기준으로 집계했어요.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
          <BreakdownList
            title="성별"
            items={demographics.gender}
            total={demographics.totalGender}
          />
          <BreakdownList
            title="연령대"
            items={demographics.age}
            total={demographics.totalAge}
          />
        </div>
      </div>
    </main>
  );
}

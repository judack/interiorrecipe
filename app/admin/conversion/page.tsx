import Link from "next/link";
import {
  ensureAnalyticsEventsTable,
  ensurePageViewsTable,
  ensureProductsTable,
  sql,
} from "@/lib/db";
import { SITE } from "@/lib/site-config";
import { AdminNav } from "@/components/admin-nav";

export const dynamic = "force-dynamic";

const RANGE_OPTIONS = [
  { key: "30", label: "최근 30일", days: 30 },
  { key: "90", label: "90일", days: 90 },
  { key: "120", label: "120일", days: 120 },
  { key: "365", label: "1년", days: 365 },
] as const;

function resolvePreset(key: string | undefined) {
  return RANGE_OPTIONS.find((r) => r.key === key) ?? RANGE_OPTIONS[0];
}

function isValidDateStr(s: string | undefined): s is string {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

type ResolvedRange = {
  fromIso: string;
  toIso: string;
  label: string;
  activeKey: string | null;
  fromDate: string;
  toDate: string;
};

function resolveDateRange(
  rangeKey: string | undefined,
  fromParam: string | undefined,
  toParam: string | undefined
): ResolvedRange {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  if (isValidDateStr(fromParam) && isValidDateStr(toParam) && fromParam <= toParam) {
    return {
      fromIso: new Date(`${fromParam}T00:00:00.000`).toISOString(),
      toIso: new Date(`${toParam}T23:59:59.999`).toISOString(),
      label: `${fromParam} ~ ${toParam}`,
      activeKey: null,
      fromDate: fromParam,
      toDate: toParam,
    };
  }

  const preset = resolvePreset(rangeKey);
  const fromDate = new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000);
  return {
    fromIso: fromDate.toISOString(),
    toIso: now.toISOString(),
    label: preset.label,
    activeKey: preset.key,
    fromDate: fromDate.toISOString().slice(0, 10),
    toDate: todayStr,
  };
}

async function countEvents(eventName: string, fromIso: string, toIso: string) {
  const rows = await sql`
    SELECT count(DISTINCT visitor_id) AS c
    FROM analytics_events
    WHERE event_name = ${eventName} AND created_at > ${fromIso} AND created_at <= ${toIso}
  `;
  return Number(rows[0].c);
}

async function countProductClicksByLocation(
  location: string,
  fromIso: string,
  toIso: string
) {
  const rows = await sql`
    SELECT count(*) AS c
    FROM analytics_events
    WHERE event_name = 'product_click'
      AND properties->>'cta_location' = ${location}
      AND created_at > ${fromIso} AND created_at <= ${toIso}
  `;
  return Number(rows[0].c);
}

async function getPartnerClicks(fromIso: string, toIso: string) {
  const totalRows = await sql`
    SELECT count(*) AS c
    FROM analytics_events
    WHERE event_name = 'partner_click' AND created_at > ${fromIso} AND created_at <= ${toIso}
  `;
  const recentRows = await sql`
    SELECT properties->>'content_id' AS partner, created_at
    FROM analytics_events
    WHERE event_name = 'partner_click' AND created_at > ${fromIso} AND created_at <= ${toIso}
    ORDER BY created_at DESC
    LIMIT 10
  `;
  return {
    total: Number(totalRows[0].c),
    recent: recentRows.map((r) => ({
      partner: (r.partner as string) || "(미상)",
      createdAt: r.created_at as string,
    })),
  };
}

async function countLandingVisitors(fromIso: string, toIso: string) {
  const rows = await sql`
    SELECT count(DISTINCT visitor_id) AS c
    FROM page_views
    WHERE created_at > ${fromIso} AND created_at <= ${toIso}
  `;
  return Number(rows[0].c);
}

async function countSearchVisitors(fromIso: string, toIso: string) {
  const rows = await sql`
    SELECT count(DISTINCT visitor_id) AS c
    FROM page_views
    WHERE created_at > ${fromIso} AND created_at <= ${toIso}
      AND (referrer ILIKE '%google%' OR referrer ILIKE '%naver%')
  `;
  return Number(rows[0].c);
}

async function getInstagramFunnel(fromIso: string, toIso: string) {
  const rows = await sql`
    WITH ig_visitors AS (
      SELECT DISTINCT visitor_id
      FROM analytics_events
      WHERE event_name = 'instagram_landing_view' AND created_at > ${fromIso} AND created_at <= ${toIso}
    )
    SELECT
      (SELECT count(*) FROM ig_visitors) AS landing,
      (SELECT count(DISTINCT visitor_id) FROM analytics_events
        WHERE event_name = 'guide_view' AND created_at > ${fromIso} AND created_at <= ${toIso}
          AND visitor_id IN (SELECT visitor_id FROM ig_visitors)) AS guide_view,
      (SELECT count(DISTINCT visitor_id) FROM analytics_events
        WHERE event_name IN ('product_click', 'consulting_cta_click') AND created_at > ${fromIso} AND created_at <= ${toIso}
          AND visitor_id IN (SELECT visitor_id FROM ig_visitors)) AS key_action,
      (SELECT count(DISTINCT visitor_id) FROM analytics_events
        WHERE event_name = 'consulting_start' AND created_at > ${fromIso} AND created_at <= ${toIso}
          AND visitor_id IN (SELECT visitor_id FROM ig_visitors)) AS start,
      (SELECT count(DISTINCT visitor_id) FROM analytics_events
        WHERE event_name = 'consulting_complete' AND created_at > ${fromIso} AND created_at <= ${toIso}
          AND visitor_id IN (SELECT visitor_id FROM ig_visitors)) AS complete
  `;
  const r = rows[0];
  return {
    landing: Number(r.landing),
    guideView: Number(r.guide_view),
    keyAction: Number(r.key_action),
    start: Number(r.start),
    complete: Number(r.complete),
  };
}

async function getConversionStats(fromIso: string, toIso: string) {
  await ensureAnalyticsEventsTable();
  await ensurePageViewsTable();
  await ensureProductsTable();

  const [
    searchVisitors,
    guideViews,
    guideProductClicks,
    landingVisitors,
    consultingStart,
    consultingComplete,
    igFunnel,
    productCount,
    partnerClicks,
  ] = await Promise.all([
    countSearchVisitors(fromIso, toIso),
    countEvents("guide_view", fromIso, toIso),
    countProductClicksByLocation("guide_detail", fromIso, toIso),
    countLandingVisitors(fromIso, toIso),
    countEvents("consulting_start", fromIso, toIso),
    countEvents("consulting_complete", fromIso, toIso),
    getInstagramFunnel(fromIso, toIso),
    sql`SELECT count(*) AS c FROM products`.then((r) => Number(r[0].c)),
    getPartnerClicks(fromIso, toIso),
  ]);

  return {
    searchVisitors,
    guideViews,
    guideProductClicks,
    landingVisitors,
    consultingStart,
    consultingComplete,
    igFunnel,
    productCount,
    partnerClicks,
  };
}

function pct(numerator: number, denominator: number) {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-line p-6">
      <p className="text-sm text-mute">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-mute">{hint}</p>
    </div>
  );
}

function FunnelStep({
  label,
  eventName,
  count,
  fromCount,
}: {
  label: string;
  eventName: string;
  count: number;
  fromCount: number | null;
}) {
  const conversion = fromCount !== null ? pct(count, fromCount) : null;
  return (
    <div className="rounded-2xl border border-line p-5">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs text-mute">{eventName}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight">
        {count.toLocaleString()}명
      </p>
      {conversion !== null && (
        <p className="mt-1 text-xs text-mute">이전 단계 대비 {conversion}%</p>
      )}
    </div>
  );
}

function GuardedMetricRow({
  label,
  source,
  target,
  reason,
}: {
  label: string;
  source: string;
  target: string;
  reason: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3">
      <div>
        <p className="text-sm">{label}</p>
        <p className="mt-0.5 text-xs text-mute">{reason}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-mute">—</p>
        <p className="text-xs text-mute">{source} · {target}</p>
      </div>
    </div>
  );
}

export default async function AdminConversionPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const { range: rangeKey, from: fromParam, to: toParam } = await searchParams;
  const range = resolveDateRange(rangeKey, fromParam, toParam);
  const stats = await getConversionStats(range.fromIso, range.toIso);

  const guideToProductCtr = pct(stats.guideProductClicks, stats.guideViews);
  const consultingStartRate = pct(stats.consultingStart, stats.landingVisitors);
  const consultingCompleteRate = pct(
    stats.consultingComplete,
    stats.consultingStart
  );

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
          전환 대시보드
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-mute">
          홈페이지 수정 후에는 단순 방문자 수보다 유입 → 콘텐츠 소비 → 상품
          클릭 → 상담 시작 → 상담 완료 전환을 중심으로 봐야 해요.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <Link
              key={opt.key}
              href={`/admin/conversion?range=${opt.key}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                opt.key === range.activeKey
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:bg-mist"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        <form
          method="get"
          className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-line p-4"
        >
          <div>
            <label className="block text-xs text-mute" htmlFor="from">
              시작일
            </label>
            <input
              id="from"
              name="from"
              type="date"
              defaultValue={range.fromDate}
              max={range.toDate}
              className="mt-1 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-xs text-mute" htmlFor="to">
              종료일
            </label>
            <input
              id="to"
              name="to"
              type="date"
              defaultValue={range.toDate}
              className="mt-1 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-ink"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-80"
          >
            맞춤 기간 적용
          </button>
          {range.activeKey === null && (
            <span className="text-xs text-mute">
              맞춤 기간 적용 중: {range.label}
            </span>
          )}
        </form>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <KpiCard
            label="검색 유입"
            value={stats.searchVisitors.toLocaleString()}
            hint="구글·네이버 방문자 (Bing·AI 추천 유입은 별도 연동 필요)"
          />
          <KpiCard
            label="가이드→상품 CTR"
            value={guideToProductCtr !== null ? `${guideToProductCtr}%` : "—"}
            hint="상품 클릭(가이드) ÷ 가이드 방문"
          />
          <KpiCard
            label="상담 시작률"
            value={
              consultingStartRate !== null ? `${consultingStartRate}%` : "—"
            }
            hint="상담 시작 ÷ 랜딩 방문"
          />
          <KpiCard
            label="상담 완료율"
            value={
              consultingCompleteRate !== null
                ? `${consultingCompleteRate}%`
                : "—"
            }
            hint="완료 ÷ 상담 시작"
          />
        </div>

        <h2 className="mt-14 text-lg font-semibold tracking-tight">
          인스타그램 유입 전환 퍼널
        </h2>
        <p className="mt-2 text-sm text-mute">
          {range.label} 동안 인스타그램에서 랜딩한 방문자(visitor_id 기준)가
          이후 단계까지 이어졌는지 추적한 값이에요.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <FunnelStep
            label="랜딩 방문"
            eventName="instagram_landing_view"
            count={stats.igFunnel.landing}
            fromCount={null}
          />
          <FunnelStep
            label="가이드 열람"
            eventName="guide_view"
            count={stats.igFunnel.guideView}
            fromCount={stats.igFunnel.landing}
          />
          <FunnelStep
            label="핵심 행동"
            eventName="상품 클릭 또는 상담 CTA"
            count={stats.igFunnel.keyAction}
            fromCount={stats.igFunnel.guideView}
          />
          <FunnelStep
            label="상담 시작"
            eventName="consulting_start"
            count={stats.igFunnel.start}
            fromCount={stats.igFunnel.keyAction}
          />
          <FunnelStep
            label="상담 완료"
            eventName="consulting_complete"
            count={stats.igFunnel.complete}
            fromCount={stats.igFunnel.start}
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              AEO·GEO 검색 성장
            </h2>
            <p className="mt-2 text-xs text-mute">
              아래 항목은 구글 서치 콘솔·GA4를 실제로 연동해야 값이 채워져요.
              지금은 연동된 도구가 없어 임의로 숫자를 만들지 않았어요.
            </p>
            <div className="mt-4">
              <GuardedMetricRow
                label="비브랜드 검색 클릭"
                source="Search Console"
                target="전월 대비"
                reason="Search Console API 미연동"
              />
              <GuardedMetricRow
                label="질문형 검색어 노출·CTR"
                source="Search Console"
                target="전월 대비"
                reason="Search Console API 미연동"
              />
              <GuardedMetricRow
                label="가이드 색인 수"
                source="Search Console"
                target="전월 대비"
                reason="Search Console API 미연동"
              />
              <GuardedMetricRow
                label="AI 추천 유입 세션"
                source="GA4"
                target="유입경로"
                reason="GA4 미연동"
              />
              <GuardedMetricRow
                label="가이드 참여율·체류시간"
                source="GA4"
                target="—"
                reason="GA4 미연동"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              상품·판매 보호
            </h2>
            <p className="mt-2 text-xs text-mute">
              매일 이상 감지용 항목이에요. 실제 데이터가 있는 건 값을 보여주고,
              해당 기능이 아예 없는 건 만들지 않고 이유를 표시했어요.
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between border-b border-line py-3">
                <div>
                  <p className="text-sm">판매 상품 수</p>
                  <p className="mt-0.5 text-xs text-mute">
                    products 테이블 실시간 집계
                  </p>
                </div>
                <p className="text-lg font-semibold">
                  {stats.productCount.toLocaleString()}개
                </p>
              </div>
              <GuardedMetricRow
                label="상품 페이지 정상 응답률"
                source="목표 100%"
                target="—"
                reason="내부 상품 상세 페이지가 없어 측정 대상 없음"
              />
              <GuardedMetricRow
                label="구매 링크 오류 수"
                source="목표 0건"
                target="—"
                reason="구매 링크 자동 점검이 아직 연동되지 않음"
              />
              <GuardedMetricRow
                label="장바구니→결제 완료율"
                source="전후 비교"
                target="—"
                reason="이 사이트에는 장바구니·결제 기능 자체가 없음"
              />
              <GuardedMetricRow
                label="상품 매출·객단가"
                source="전후 비교"
                target="—"
                reason="결제 시스템이 없어 매출 데이터가 존재하지 않음"
              />
            </div>
          </div>
        </div>

        <h2 className="mt-14 text-lg font-semibold tracking-tight">
          파트너사 클릭
        </h2>
        <p className="mt-2 text-sm text-mute">
          홈페이지 하단 파트너사 로고를 눌러 외부 사이트로 이동한 기록이에요.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-line p-6 md:col-span-1">
            <p className="text-sm text-mute">{range.label} 클릭 수</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {stats.partnerClicks.total.toLocaleString()}회
            </p>
            <p className="mt-2 text-xs text-mute">OFRAME (oframe.kr/shop)</p>
          </div>
          <div className="rounded-2xl border border-line p-6 md:col-span-2">
            <p className="text-sm font-medium">최근 클릭 기록</p>
            {stats.partnerClicks.recent.length === 0 ? (
              <p className="mt-3 text-sm text-mute">
                아직 클릭 기록이 없습니다.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                {stats.partnerClicks.recent.map((click, i) => (
                  <div
                    key={`${click.createdAt}-${i}`}
                    className="flex items-center justify-between border-b border-line py-2 text-sm last:border-b-0"
                  >
                    <span>{click.partner}</span>
                    <span className="text-mute">
                      {new Date(click.createdAt).toLocaleString("ko-KR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

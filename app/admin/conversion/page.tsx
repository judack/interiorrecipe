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
] as const;

function resolveRange(key: string | undefined) {
  return RANGE_OPTIONS.find((r) => r.key === key) ?? RANGE_OPTIONS[0];
}

async function countEvents(eventName: string, cutoffIso: string) {
  const rows = await sql`
    SELECT count(DISTINCT visitor_id) AS c
    FROM analytics_events
    WHERE event_name = ${eventName} AND created_at > ${cutoffIso}
  `;
  return Number(rows[0].c);
}

async function countProductClicksByLocation(location: string, cutoffIso: string) {
  const rows = await sql`
    SELECT count(*) AS c
    FROM analytics_events
    WHERE event_name = 'product_click'
      AND properties->>'cta_location' = ${location}
      AND created_at > ${cutoffIso}
  `;
  return Number(rows[0].c);
}

async function countLandingVisitors(cutoffIso: string) {
  const rows = await sql`
    SELECT count(DISTINCT visitor_id) AS c
    FROM page_views
    WHERE created_at > ${cutoffIso}
  `;
  return Number(rows[0].c);
}

async function countSearchVisitors(cutoffIso: string) {
  const rows = await sql`
    SELECT count(DISTINCT visitor_id) AS c
    FROM page_views
    WHERE created_at > ${cutoffIso}
      AND (referrer ILIKE '%google%' OR referrer ILIKE '%naver%')
  `;
  return Number(rows[0].c);
}

async function getInstagramFunnel(cutoffIso: string) {
  const rows = await sql`
    WITH ig_visitors AS (
      SELECT DISTINCT visitor_id
      FROM analytics_events
      WHERE event_name = 'instagram_landing_view' AND created_at > ${cutoffIso}
    )
    SELECT
      (SELECT count(*) FROM ig_visitors) AS landing,
      (SELECT count(DISTINCT visitor_id) FROM analytics_events
        WHERE event_name = 'guide_view' AND created_at > ${cutoffIso}
          AND visitor_id IN (SELECT visitor_id FROM ig_visitors)) AS guide_view,
      (SELECT count(DISTINCT visitor_id) FROM analytics_events
        WHERE event_name IN ('product_click', 'consulting_cta_click') AND created_at > ${cutoffIso}
          AND visitor_id IN (SELECT visitor_id FROM ig_visitors)) AS key_action,
      (SELECT count(DISTINCT visitor_id) FROM analytics_events
        WHERE event_name = 'consulting_start' AND created_at > ${cutoffIso}
          AND visitor_id IN (SELECT visitor_id FROM ig_visitors)) AS start,
      (SELECT count(DISTINCT visitor_id) FROM analytics_events
        WHERE event_name = 'consulting_complete' AND created_at > ${cutoffIso}
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

async function getConversionStats(days: number) {
  await ensureAnalyticsEventsTable();
  await ensurePageViewsTable();
  await ensureProductsTable();

  const cutoffIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [
    searchVisitors,
    guideViews,
    guideProductClicks,
    landingVisitors,
    consultingStart,
    consultingComplete,
    igFunnel,
    productCount,
  ] = await Promise.all([
    countSearchVisitors(cutoffIso),
    countEvents("guide_view", cutoffIso),
    countProductClicksByLocation("guide_detail", cutoffIso),
    countLandingVisitors(cutoffIso),
    countEvents("consulting_start", cutoffIso),
    countEvents("consulting_complete", cutoffIso),
    getInstagramFunnel(cutoffIso),
    sql`SELECT count(*) AS c FROM products`.then((r) => Number(r[0].c)),
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
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeKey } = await searchParams;
  const range = resolveRange(rangeKey);
  const stats = await getConversionStats(range.days);

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
                opt.key === range.key
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:bg-mist"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

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
      </div>
    </main>
  );
}

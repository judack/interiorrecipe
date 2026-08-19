export const EVENT_NAMES = [
  "instagram_landing_view",
  "guide_view",
  "scroll_50",
  "scroll_90",
  "related_guide_click",
  "product_click",
  "consulting_cta_click",
  "consulting_start",
  "consulting_complete",
] as const;

export type AnalyticsEventName = (typeof EVENT_NAMES)[number];

export const PROPERTY_KEYS = [
  "page_slug",
  "guide_topic",
  "room_size",
  "traffic_source",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "content_id",
  "cta_location",
  "product_id",
] as const;

export type AnalyticsProperties = Partial<
  Record<(typeof PROPERTY_KEYS)[number], string>
>;

const VISITOR_COOKIE = "rv_id";
const UTM_STORAGE_KEY = "ir_utm";

function getOrCreateVisitorId(): string {
  const match = document.cookie.match(new RegExp(`${VISITOR_COOKIE}=([^;]+)`));
  if (match) return match[1];
  const id = crypto.randomUUID();
  const maxAge = 60 * 60 * 24 * 400;
  document.cookie = `${VISITOR_COOKIE}=${id};path=/;max-age=${maxAge}`;
  return id;
}

export function captureUtmParams() {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(UTM_STORAGE_KEY)) return;

  const params = new URLSearchParams(window.location.search);
  const utm: AnalyticsProperties = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  }
  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  }
}

export function getStoredUtm(): AnalyticsProperties {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getTrafficSource(): string {
  const utm = getStoredUtm();
  if (utm.utm_source) return utm.utm_source;
  const referrer = document.referrer;
  if (!referrer) return "direct";
  if (/instagram/i.test(referrer)) return "instagram";
  if (/youtube|youtu\.be/i.test(referrer)) return "youtube";
  if (/naver/i.test(referrer)) return "naver";
  if (/google/i.test(referrer)) return "google";
  if (/kakao/i.test(referrer)) return "kakao";
  return "referral";
}

export function trackEvent(
  eventName: AnalyticsEventName,
  properties?: AnalyticsProperties
) {
  if (typeof window === "undefined") return;
  try {
    const visitorId = getOrCreateVisitorId();
    const body = JSON.stringify({
      eventName,
      visitorId,
      path: window.location.pathname,
      properties: { ...getStoredUtm(), ...properties },
    });
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // 분석 이벤트 실패가 실제 동작(구매/상담 신청 등)을 막지 않도록 무시합니다.
  }
}

import { SITE } from "@/lib/site-config";
import { GUIDES } from "@/lib/guides";
import { BRAND_DESCRIPTION } from "@/app/layout";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE.name} (${SITE.alternateName})`,
    "",
    BRAND_DESCRIPTION,
    "",
    "## 주요 페이지",
    "",
    `- [홈](${SITE.baseUrl}/): 서비스 소개, 상담 신청, 이번달 추천 아이템`,
    `- [상담 신청](${SITE.baseUrl}/reservation): 공간 컨설팅 신청 폼`,
    `- [가이드 모음](${SITE.baseUrl}/guides): 평형별·주제별 가구배치 가이드 목록`,
    "",
    "## 가이드",
    "",
    ...GUIDES.map(
      (guide) => `- [${guide.h1}](${SITE.baseUrl}/guides/${guide.slug}): ${guide.metaDescription}`
    ),
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

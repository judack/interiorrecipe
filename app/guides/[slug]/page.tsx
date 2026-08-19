import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SocialQuickMenu } from "@/components/social-quick-menu";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { FeaturedProductsTabs } from "@/components/featured-products-tabs";
import { RelatedGuideLink } from "@/components/related-guide-link";
import { ConsultingCtaLink } from "@/components/consulting-cta-link";
import { GUIDES, getGuideBySlug } from "@/lib/guides";
import { getGuideProducts } from "@/lib/guide-products";
import { SITE } from "@/lib/site-config";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.metaDescription,
      url: `${SITE.baseUrl}/guides/${guide.slug}`,
      images: [{ url: "/images/problem-bg.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.metaDescription,
      images: ["/images/problem-bg.png"],
    },
  };
}

function List({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <Tag className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-baseline gap-2 text-base leading-relaxed">
            <span className="text-mute">·</span>
            {item}
          </li>
        ))}
      </Tag>
    </div>
  );
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const products = await getGuideProducts(guide.productTypes);
  const relatedGuides = guide.relatedSlugs
    .map((s) => getGuideBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.metaDescription,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate,
    mainEntityOfPage: `${SITE.baseUrl}/guides/${guide.slug}`,
  };

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "가이드", href: "/guides" },
    { label: guide.h1 },
  ];
  const webPageJsonLd = buildWebPageJsonLd({
    path: `/guides/${guide.slug}`,
    name: guide.title,
    description: guide.metaDescription,
    dateModified: guide.updatedDate,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <SiteHeader />
      <SocialQuickMenu />
      <main className="px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb items={breadcrumbItems} />

          <p className="mt-6 text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Guide
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {guide.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-mute">
            {guide.directAnswer}
          </p>

          <List title="핵심 배치 원칙" items={guide.corePrinciples} />
          <List title="추천 배치" items={guide.recommended} />
          <List title="피해야 할 배치" items={guide.avoid} />
          <List title="공간별 체크리스트" items={guide.checklist} />

          <p className="mt-10 text-sm leading-relaxed text-mute">
            구조, 창문·현관 위치, 생활 습관에 따라 실제로 맞는 배치는 달라질
            수 있어요. 정확한 진단은 상담을 통해 확인하는 게 가장 정확해요.
          </p>

          {products.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <h2 className="text-xl font-semibold tracking-tight">
                관련 상품
              </h2>
              <div className="mt-6">
                <FeaturedProductsTabs products={products} source="guide_detail" />
              </div>
              <p className="mt-6 text-xs leading-relaxed text-mute">
                *이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
                수수료를 제공받습니다.
              </p>
            </div>
          )}

          {relatedGuides.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <h2 className="text-xl font-semibold tracking-tight">
                관련 가이드
              </h2>
              <div className="mt-4 flex flex-col gap-2">
                {relatedGuides.map((g) => (
                  <RelatedGuideLink key={g.slug} slug={g.slug} fromSlug={guide.slug}>
                    {g.h1}
                  </RelatedGuideLink>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 rounded-2xl bg-mist p-8">
            <p className="text-lg font-semibold tracking-tight">
              내 공간에 맞는 배치, 상담에서 확인해보세요
            </p>
            <ConsultingCtaLink
              location="guide_detail"
              className="mt-5 inline-flex items-center rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-paper transition-opacity hover:opacity-80"
            >
              내 공간 컨설팅 신청하기
            </ConsultingCtaLink>
          </div>

          <p className="mt-10 text-xs text-mute">
            작성 {SITE.name} · 작성일 {guide.publishedDate} · 수정일{" "}
            {guide.updatedDate}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

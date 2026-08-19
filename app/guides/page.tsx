import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SocialQuickMenu } from "@/components/social-quick-menu";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/structured-data";
import { GUIDES } from "@/lib/guides";

const TITLE = "공간 배치 가이드 | 인테리어레시피";
const DESCRIPTION =
  "원룸과 소형 주거공간의 가구배치를 평수별, 주제별로 정리한 가이드 모음이에요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/guides" },
};

const breadcrumbItems = [{ label: "홈", href: "/" }, { label: "가이드" }];
const webPageJsonLd = buildWebPageJsonLd({
  path: "/guides",
  name: TITLE,
  description: DESCRIPTION,
});
const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function GuidesIndexPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader />
      <SocialQuickMenu />
      <main className="px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb items={breadcrumbItems} />

          <p className="mt-6 text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Guide
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            공간 배치 가이드
          </h1>
          <p className="mt-4 text-lg text-mute">
            원룸과 소형 주거공간의 가구배치를 주제별로 정리했어요.
          </p>

          <div className="mt-12 flex flex-col gap-4">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="rounded-2xl border border-line p-6 transition-colors hover:bg-mist"
              >
                <p className="text-lg font-medium">{guide.h1}</p>
                <p className="mt-2 text-sm text-mute">
                  {guide.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

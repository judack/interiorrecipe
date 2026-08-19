import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SocialQuickMenu } from "@/components/social-quick-menu";
import { HeroSection } from "@/components/hero-section";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { ProcessSection } from "@/components/process-section";
import { FeaturedProductsSection } from "@/components/featured-products-section";
import { BrandSection } from "@/components/brand-section";
import { FaqSection, FAQ_ITEMS } from "@/components/faq-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "인테리어 컨설팅",
  provider: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl },
  areaServed: "KR",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "인테리어레시피 컨설팅 플랜",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Edit Consulting (공간 방향 상담)",
          description:
            "현재 공간의 문제를 진단하고 가구 배치와 공간 개선 방향을 제안합니다.",
        },
        price: "0",
        priceCurrency: "KRW",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Edit Curation (공간·가구 큐레이션)",
          description:
            "평면 구성과 가구, 소재, 조명 및 스타일링 요소를 하나의 방향으로 제안합니다.",
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "500000",
          priceCurrency: "KRW",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Edit Interior (인테리어 디자인·시공)",
          description:
            "구조 변경이나 마감 공사가 필요한 공간을 설계하고 구현합니다.",
        },
      },
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <SiteHeader />
      <SocialQuickMenu />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ProcessSection />
        <FeaturedProductsSection />
        <BrandSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}

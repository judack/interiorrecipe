import type { Metadata } from "next";
import "./globals.css";
import { VisitTracker } from "@/components/visit-tracker";
import { JsonLd } from "@/components/json-ld";
import { SITE, SOCIAL_LINKS } from "@/lib/site-config";

const TITLE = "인테리어레시피 | 내 방에 맞는 인테리어 솔루션";
const DESCRIPTION =
  "사진 한 장으로 시작하는 맞춤 공간 솔루션. 1인 가구와 2030세대를 위한 현실적인 가구배치 및 인테리어 컨설팅, 인테리어레시피.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE.baseUrl,
    images: [{ url: "/images/problem-bg.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/problem-bg.png"],
  },
  verification: {
    google: "yrkZDyQOlPwDrGMXE9opML0C7FJA-T4bX6U9jpDpdXI",
    other: {
      "naver-site-verification": "60b2fe0ec370ff67440d4924ae7809633a8bf5f9",
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.baseUrl,
  logo: `${SITE.baseUrl}${SITE.logoSrc}`,
  description: DESCRIPTION,
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.youtube, SOCIAL_LINKS.kakao],
  areaServed: "KR",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-paper text-ink">
        <JsonLd data={organizationJsonLd} />
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}

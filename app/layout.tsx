import type { Metadata } from "next";
import "./globals.css";
import { VisitTracker } from "@/components/visit-tracker";
import { JsonLd } from "@/components/json-ld";
import { SITE, SOCIAL_LINKS } from "@/lib/site-config";

const TITLE = "인테리어레시피 | 원룸 가구배치·수납 인테리어 컨설팅";
const DESCRIPTION =
  "원룸과 소형 주거공간의 가구배치, 수납 방법과 맞춤 인테리어 컨설팅을 만나보세요. 사진 한 장이면 시작할 수 있어요.";

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
      "naver-site-verification": [
        "60b2fe0ec370ff67440d4924ae7809633a8bf5f9",
        "1420041a1fc5a40d2bafadae1386206479fde552",
      ],
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

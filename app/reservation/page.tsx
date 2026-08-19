import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SocialQuickMenu } from "@/components/social-quick-menu";
import { ReservationForm } from "@/components/reservation-form";
import { JsonLd } from "@/components/json-ld";
import { buildWebPageJsonLd } from "@/lib/structured-data";

const TITLE = "상담 신청 | 인테리어레시피";
const DESCRIPTION = "몇 가지 정보를 알려주시면 공간에 맞는 솔루션을 준비해드립니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/reservation" },
};

const webPageJsonLd = buildWebPageJsonLd({
  path: "/reservation",
  name: TITLE,
  description: DESCRIPTION,
});

export default function ReservationPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd} />
      <SiteHeader />
      <SocialQuickMenu />
      <main className="px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Reservation
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            내 방 컨설팅 신청하기
          </h1>
          <p className="mt-3 text-lg text-mute">
            몇 가지만 알려주시면, 공간에 맞는 솔루션을 준비해드려요.
          </p>

          <ReservationForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

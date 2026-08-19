import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요 | 인테리어레시피",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen flex-col items-start justify-center px-6 pt-24 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            404
          </p>
          <h1 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            페이지를 찾을 수 없어요
          </h1>
          <p className="mt-4 max-w-md text-lg text-mute">
            주소가 바뀌었거나 잘못 입력되었을 수 있어요.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center rounded-full bg-ink px-8 py-4 text-base font-medium text-paper transition-opacity hover:opacity-80"
          >
            {SITE.name} 홈으로 가기
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

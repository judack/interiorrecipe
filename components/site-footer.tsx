import { NAV_LINKS, SITE } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 border-t border-line pt-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight">{SITE.name}</p>
          <p className="mt-2 max-w-xs text-sm text-mute">
            사진 한 장으로 시작하는 맞춤 공간 솔루션.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-mute transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href={SITE.contactHref}
            className="text-sm text-mute transition-colors hover:text-ink"
          >
            문의하기
          </a>
          <a
            href={SITE.shopHref}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="text-sm text-mute transition-colors hover:text-ink"
          >
            쇼핑 스토어
          </a>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl">
        <p className="text-xs text-mute">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-mute">
          이 사이트의 쇼핑 스토어 및 상품 링크는 쿠팡 파트너스 활동의
          일환으로 제공되며, 이에 따른 일정액의 수수료를 제공받을 수
          있습니다.
        </p>
      </div>
    </footer>
  );
}

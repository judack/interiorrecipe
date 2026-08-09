"use client";

import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site-config";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <a href="/#top" className="flex items-center gap-2">
          <img
            src={SITE.logoSrc}
            alt=""
            className="h-7 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="text-[15px] font-semibold tracking-tight">
            {SITE.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-mute transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={SITE.shopHref}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-full border border-line px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-mist"
          >
            쇼핑 스토어
          </a>
          <a
            href={SITE.reservationHref}
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-80"
          >
            상담 신청
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="메뉴 열기"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-5 bg-ink transition-transform ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-ink transition-transform ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg"
              >
                {link.label}
              </a>
            ))}
            <a
              href={SITE.shopHref}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-line px-5 py-3 text-center text-sm font-medium text-ink"
            >
              쇼핑 스토어
            </a>
            <a
              href={SITE.reservationHref}
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-paper"
            >
              상담 신청
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

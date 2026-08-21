"use client";

import { trackEvent } from "@/lib/analytics";

const PARTNERS = [
  { name: "OFRAME", href: "https://oframe.kr/r/recipe", logo: "/images/oframe-logo.png" },
];

export function PartnersSection() {
  return (
    <section className="border-t border-line px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
          Partners
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-10">
          {PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("partner_click", {
                  content_id: partner.name.toLowerCase(),
                })
              }
              className="transition-opacity hover:opacity-60"
            >
              <img src={partner.logo} alt={partner.name} className="h-6 w-auto" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

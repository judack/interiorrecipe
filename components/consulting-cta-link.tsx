"use client";

import { SITE } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

export function ConsultingCtaLink({
  location,
  className,
  onClick,
  children,
}: {
  location: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={SITE.reservationHref}
      className={className}
      onClick={() => {
        trackEvent("consulting_cta_click", { cta_location: location });
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

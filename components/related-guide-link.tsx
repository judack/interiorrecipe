"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function RelatedGuideLink({
  slug,
  fromSlug,
  children,
}: {
  slug: string;
  fromSlug: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/guides/${slug}`}
      className="text-base text-ink underline underline-offset-4 hover:no-underline"
      onClick={() =>
        trackEvent("related_guide_click", {
          content_id: slug,
          cta_location: fromSlug,
        })
      }
    >
      {children}
    </Link>
  );
}

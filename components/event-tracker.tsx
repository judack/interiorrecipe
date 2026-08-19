"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { GUIDES } from "@/lib/guides";
import { captureUtmParams, getTrafficSource, trackEvent } from "@/lib/analytics";

const LANDING_TRACKED_KEY = "ir_landing_tracked";

function extractRoomSize(slug: string): string | undefined {
  const match = slug.match(/^(\d+)-pyeong/);
  return match ? `${match[1]}평` : undefined;
}

export function EventTracker() {
  const pathname = usePathname();
  const scrollState = useRef({ path: "", firedHalf: false, firedFull: false });

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    captureUtmParams();

    if (!sessionStorage.getItem(LANDING_TRACKED_KEY)) {
      sessionStorage.setItem(LANDING_TRACKED_KEY, "1");
      if (getTrafficSource() === "instagram") {
        trackEvent("instagram_landing_view", { page_slug: pathname });
      }
    }

    const guideMatch = pathname.match(/^\/guides\/([a-z0-9-]+)$/);
    if (guideMatch) {
      const guide = GUIDES.find((g) => g.slug === guideMatch[1]);
      if (guide) {
        trackEvent("guide_view", {
          page_slug: pathname,
          content_id: guide.slug,
          room_size: extractRoomSize(guide.slug),
        });
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    scrollState.current = { path: pathname, firedHalf: false, firedFull: false };

    function onScroll() {
      const state = scrollState.current;
      if (state.path !== pathname) return;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = window.scrollY / scrollable;

      if (depth >= 0.5 && !state.firedHalf) {
        state.firedHalf = true;
        trackEvent("scroll_50", { page_slug: pathname });
      }
      if (depth >= 0.9 && !state.firedFull) {
        state.firedFull = true;
        trackEvent("scroll_90", { page_slug: pathname });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}

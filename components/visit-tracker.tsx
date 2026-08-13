"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getOrCreateVisitorId() {
  const match = document.cookie.match(/(?:^|; )rv_id=([^;]+)/);
  if (match) return match[1];

  const id = crypto.randomUUID();
  const expires = new Date(Date.now() + 400 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `rv_id=${id}; expires=${expires}; path=/`;
  return id;
}

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const visitorId = getOrCreateVisitorId();
    const utmSource = new URLSearchParams(window.location.search).get(
      "utm_source"
    );
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        visitorId,
        referrer: utmSource || document.referrer,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "상담 신청" },
  { href: "/admin/calendar", label: "캘린더" },
  { href: "/admin/products", label: "추천 아이템" },
  { href: "/admin/stats", label: "방문자 통계" },
];

export function AdminNav() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <nav className="flex items-center justify-between gap-2 border-b border-line pb-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active ? "bg-ink text-paper" : "text-mute hover:bg-mist"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full border border-line px-4 py-2 text-sm font-medium text-mute hover:bg-mist"
      >
        로그아웃
      </button>
    </nav>
  );
}

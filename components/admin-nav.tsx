"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "상담 신청" },
  { href: "/admin/products", label: "추천 가구" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 border-b border-line pb-4">
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
    </nav>
  );
}

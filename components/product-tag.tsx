"use client";

import { useState } from "react";

export type ProductTagData = {
  x: number;
  y: number;
  name: string;
  price?: string;
  href: string;
};

export function ProductTag({ x, y, name, price, href }: ProductTagData) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${name} 상품 정보 보기`}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md ring-1 ring-ink/10 backdrop-blur transition-transform hover:scale-105"
      >
        <span className="text-sm leading-none">+</span>
      </button>

      {open && (
        <div
          className={`absolute top-9 w-48 rounded-xl bg-paper p-3 text-left shadow-lg ring-1 ring-line ${
            x > 60 ? "right-0" : "left-0"
          }`}
        >
          <p className="text-sm font-medium text-ink">{name}</p>
          {price && <p className="mt-1 text-sm text-mute">{price}</p>}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-2 inline-block text-sm font-medium text-ink underline underline-offset-2"
          >
            쿠팡에서 보기 →
          </a>
        </div>
      )}
    </div>
  );
}

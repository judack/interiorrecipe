"use client";

import { useState } from "react";
import { CATEGORIES, type Product } from "@/lib/product";
import { Reveal } from "@/components/reveal";

export function FeaturedProductsTabs({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const filtered = products.filter((p) => p.category === activeCategory);

  return (
    <div>
      <div className="mt-10 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink hover:bg-mist"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-base text-mute">
          상품을 준비하고 있어요. 곧 만나보실 수 있어요.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <a
                href={product.coupang_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group block"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-mist">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-sm font-medium">{product.name}</p>
                <p className="mt-1 text-sm text-mute">{product.price}</p>
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

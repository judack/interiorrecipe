"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCT_TYPES, type FeaturedProduct } from "@/lib/product";
import { Reveal } from "@/components/reveal";

export function FeaturedProductsTabs({
  products,
}: {
  products: FeaturedProduct[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [activeType, setActiveType] = useState<string>("all");

  const byCategory = products.filter((p) => p.category === activeCategory);

  const availableTypes = useMemo(
    () =>
      PRODUCT_TYPES.filter((t) =>
        byCategory.some((p) => p.product_type === t)
      ),
    [byCategory]
  );

  const filtered =
    activeType === "all"
      ? byCategory
      : byCategory.filter((p) => p.product_type === activeType);

  function selectCategory(category: string) {
    setActiveCategory(category);
    setActiveType("all");
  }

  return (
    <div>
      <div className="mt-10 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => selectCategory(category)}
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

      {availableTypes.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveType("all")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              activeType === "all"
                ? "border-ink bg-mist text-ink"
                : "border-line text-mute hover:bg-mist"
            }`}
          >
            전체
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeType === type
                  ? "border-ink bg-mist text-ink"
                  : "border-line text-mute hover:bg-mist"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

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
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-medium text-paper backdrop-blur-sm">
                    #{product.reg_number}
                  </span>
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

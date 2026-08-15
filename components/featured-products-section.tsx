import { ensureProductsTable, sql } from "@/lib/db";
import type { FeaturedProduct } from "@/lib/product";
import { Reveal } from "@/components/reveal";
import { FeaturedProductsTabs } from "@/components/featured-products-tabs";

async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  await ensureProductsTable();
  const rows = await sql`
    SELECT * FROM (
      SELECT *, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS reg_number
      FROM products
    ) numbered
    WHERE active = true
    ORDER BY sort_order ASC, created_at DESC
  `;
  return rows.map((r) => ({ ...r, reg_number: Number(r.reg_number) })) as FeaturedProduct[];
}

export async function FeaturedProductsSection() {
  const products = await getFeaturedProducts();

  return (
    <section id="featured" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Featured
          </p>
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            이번달 추천 아이템
          </h2>
          <p className="mt-4 text-xs leading-relaxed text-mute">
            *이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.
          </p>
        </Reveal>

        <FeaturedProductsTabs products={products} />
      </div>
    </section>
  );
}

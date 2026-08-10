import { ensureProductsTable, sql } from "@/lib/db";
import { getCurrentSeason, type Product } from "@/lib/product";
import { Reveal } from "@/components/reveal";

async function getFeaturedProducts(): Promise<Product[]> {
  await ensureProductsTable();
  const season = getCurrentSeason();
  const rows = await sql`
    SELECT * FROM products
    WHERE active = true AND (season = ${season} OR season = '전체')
    ORDER BY sort_order ASC, created_at DESC
    LIMIT 8
  `;
  return rows as Product[];
}

export async function FeaturedProductsSection() {
  const products = await getFeaturedProducts();
  const season = getCurrentSeason();

  return (
    <section id="featured" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-mute uppercase">
            Featured · {season}
          </p>
          <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            이번달 추천 가구
          </h2>
        </Reveal>

        {products.length === 0 ? (
          <p className="mt-16 text-base text-mute">
            상품을 준비하고 있어요. 곧 만나보실 수 있어요.
          </p>
        ) : (
          <>
            <div className="mt-16 grid grid-cols-2 gap-6 md:mt-20 md:grid-cols-4">
              {products.map((product, i) => (
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

            <p className="mt-12 max-w-xl text-xs leading-relaxed text-mute">
              이 페이지의 상품 링크는 쿠팡 파트너스 활동의 일환으로
              제공되며, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

import { ensureProductsTable, sql } from "@/lib/db";
import type { Product } from "@/lib/product";
import { SITE } from "@/lib/site-config";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductsTable } from "@/components/admin-products-table";

export const dynamic = "force-dynamic";

async function getProducts(): Promise<Product[]> {
  await ensureProductsTable();
  const rows = await sql`
    SELECT * FROM products ORDER BY sort_order ASC, created_at DESC
  `;
  return rows as Product[];
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-paper px-6 py-16 text-ink md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-2">
          <img src={SITE.logoSrc} alt="" className="h-7 w-auto" />
          <span className="text-sm font-semibold tracking-tight">
            {SITE.name}
          </span>
        </div>

        <div className="mt-8">
          <AdminNav />
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          이번달 추천 가구
        </h1>
        <p className="mt-2 text-sm text-mute">
          여기서 추가·수정한 상품이 랜딩페이지의 "이번달 추천 가구" 섹션에
          계절에 맞게 노출됩니다.
        </p>

        <div className="mt-10">
          <AdminProductsTable initialProducts={products} />
        </div>
      </div>
    </main>
  );
}

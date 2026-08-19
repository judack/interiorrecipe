import { ensureProductsTable, sql } from "@/lib/db";
import type { FeaturedProduct } from "@/lib/product";

export async function getGuideProducts(
  productTypes: string[]
): Promise<FeaturedProduct[]> {
  if (productTypes.length === 0) return [];

  await ensureProductsTable();
  const rows = await sql`
    SELECT * FROM (
      SELECT *, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS reg_number
      FROM products
    ) numbered
    WHERE active = true AND product_type = ANY(${productTypes})
    ORDER BY sort_order ASC, created_at DESC
    LIMIT 8
  `;
  return rows.map((r) => ({ ...r, reg_number: Number(r.reg_number) })) as FeaturedProduct[];
}

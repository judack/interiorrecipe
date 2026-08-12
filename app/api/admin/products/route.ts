import { NextResponse } from "next/server";
import { ensureProductsTable, sql } from "@/lib/db";

export async function GET() {
  await ensureProductsTable();
  const rows = await sql`
    SELECT * FROM products ORDER BY sort_order ASC, created_at DESC
  `;
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, imageUrl, category, productType, coupangUrl, sortOrder } =
    body;

  if (!name || !price || !imageUrl || !coupangUrl) {
    return NextResponse.json(
      { error: "필수 항목이 비어 있습니다." },
      { status: 400 }
    );
  }

  await ensureProductsTable();

  await sql`
    INSERT INTO products (name, price, image_url, category, product_type, coupang_url, sort_order)
    VALUES (
      ${name},
      ${price},
      ${imageUrl},
      ${category || ""},
      ${productType || ""},
      ${coupangUrl},
      ${Number(sortOrder) || 0}
    )
  `;

  return NextResponse.json({ ok: true });
}

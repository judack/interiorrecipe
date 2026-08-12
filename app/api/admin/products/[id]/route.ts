import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const {
    name,
    price,
    imageUrl,
    category,
    productType,
    coupangUrl,
    sortOrder,
    active,
  } = body;

  await sql`
    UPDATE products SET
      name = ${name},
      price = ${price},
      image_url = ${imageUrl},
      category = ${category || ""},
      product_type = ${productType || ""},
      coupang_url = ${coupangUrl},
      sort_order = ${Number(sortOrder) || 0},
      active = ${active}
    WHERE id = ${Number(id)}
  `;

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await sql`DELETE FROM products WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}

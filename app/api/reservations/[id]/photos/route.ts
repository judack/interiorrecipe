import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "url이 필요합니다." }, { status: 400 });
  }

  await sql`
    UPDATE reservations
    SET photo_urls = CASE
      WHEN photo_urls IS NULL OR photo_urls = '' THEN ${url}
      ELSE photo_urls || ',' || ${url}
    END
    WHERE id = ${Number(id)}
  `;

  return NextResponse.json({ ok: true });
}

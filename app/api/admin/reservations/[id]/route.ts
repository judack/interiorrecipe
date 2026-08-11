import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { sql } from "@/lib/db";
import { STATUSES } from "@/lib/reservation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "잘못된 상태값입니다." }, { status: 400 });
  }

  await sql`
    UPDATE reservations SET status = ${status} WHERE id = ${Number(id)}
  `;

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const rows = await sql`
    SELECT photo_urls FROM reservations WHERE id = ${Number(id)}
  `;
  const photoUrls = rows[0]?.photo_urls as string | null;

  if (photoUrls) {
    for (const url of photoUrls.split(",")) {
      try {
        await del(url);
      } catch {
        // 파일이 이미 없어도 신청 삭제는 계속 진행합니다.
      }
    }
  }

  await sql`DELETE FROM reservations WHERE id = ${Number(id)}`;

  return NextResponse.json({ ok: true });
}

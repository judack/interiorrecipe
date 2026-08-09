import { NextResponse } from "next/server";
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

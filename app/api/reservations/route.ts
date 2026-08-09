import { NextResponse } from "next/server";
import { ensureReservationsTable, sql } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { spaceType, size, budget, styles, pains, name, contact, message } =
    body;

  if (!spaceType || !size || !budget || !name || !contact) {
    return NextResponse.json(
      { error: "필수 항목이 비어 있습니다." },
      { status: 400 }
    );
  }

  await ensureReservationsTable();

  await sql`
    INSERT INTO reservations (space_type, size, budget, styles, pains, name, contact, message)
    VALUES (
      ${spaceType},
      ${size},
      ${budget},
      ${Array.isArray(styles) ? styles.join(", ") : ""},
      ${Array.isArray(pains) ? pains.join(", ") : ""},
      ${name},
      ${contact},
      ${message || null}
    )
  `;

  return NextResponse.json({ ok: true });
}

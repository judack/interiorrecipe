import { NextResponse } from "next/server";
import { ensureReservationsTable, sql } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    serviceType,
    spaceType,
    size,
    budget,
    furnitureBudget,
    styles,
    pains,
    name,
    contact,
    message,
    visitDate,
  } = body;

  if (
    !serviceType ||
    !spaceType ||
    !size ||
    !budget ||
    !furnitureBudget ||
    !name ||
    !contact
  ) {
    return NextResponse.json(
      { error: "필수 항목이 비어 있습니다." },
      { status: 400 }
    );
  }

  await ensureReservationsTable();

  await sql`
    INSERT INTO reservations (service_type, space_type, size, budget, furniture_budget, styles, pains, name, contact, message, visit_date)
    VALUES (
      ${serviceType},
      ${spaceType},
      ${size},
      ${budget},
      ${furnitureBudget},
      ${Array.isArray(styles) ? styles.join(", ") : ""},
      ${Array.isArray(pains) ? pains.join(", ") : ""},
      ${name},
      ${contact},
      ${message || null},
      ${visitDate || null}
    )
  `;

  return NextResponse.json({ ok: true });
}

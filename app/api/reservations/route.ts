import { NextResponse } from "next/server";
import { ensureReservationsTable, sql } from "@/lib/db";
import { sendKakaoMemo } from "@/lib/kakao";

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
    region,
    addressDetail,
    message,
    visitDate,
    mbtiResult,
  } = body;

  if (
    !serviceType ||
    !spaceType ||
    !size ||
    !budget ||
    !furnitureBudget ||
    !name ||
    !contact ||
    !region
  ) {
    return NextResponse.json(
      { error: "필수 항목이 비어 있습니다." },
      { status: 400 }
    );
  }

  await ensureReservationsTable();

  const rows = await sql`
    INSERT INTO reservations (service_type, space_type, size, budget, furniture_budget, styles, pains, name, contact, region, address_detail, message, visit_date, mbti_result)
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
      ${region},
      ${addressDetail || null},
      ${message || null},
      ${visitDate || null},
      ${mbtiResult || null}
    )
    RETURNING id
  `;

  try {
    await sendKakaoMemo(
      `[상담 신청] ${name}님\n서비스: ${serviceType} · ${spaceType} · ${size}\n연락처: ${contact}\n지역: ${region}`
    );
  } catch {
    // 카카오 알림 실패는 신청 접수 자체를 막지 않음
  }

  return NextResponse.json({ ok: true, id: rows[0].id });
}

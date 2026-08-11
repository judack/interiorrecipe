import { NextResponse } from "next/server";
import { ensurePageViewsTable, sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { path, visitorId } = await request.json();
    if (!visitorId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await ensurePageViewsTable();
    await sql`
      INSERT INTO page_views (path, visitor_id) VALUES (${path || ""}, ${visitorId})
    `;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

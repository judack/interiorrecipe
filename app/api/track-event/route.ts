import { NextResponse } from "next/server";
import { ensureAnalyticsEventsTable, sql } from "@/lib/db";
import { EVENT_NAMES, PROPERTY_KEYS } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const { eventName, visitorId, path, properties } = await request.json();

    if (!visitorId || !EVENT_NAMES.includes(eventName)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const safeProperties: Record<string, string> = {};
    if (properties && typeof properties === "object") {
      for (const key of PROPERTY_KEYS) {
        const value = properties[key];
        if (typeof value === "string" && value.length <= 200) {
          safeProperties[key] = value;
        }
      }
    }

    await ensureAnalyticsEventsTable();
    await sql`
      INSERT INTO analytics_events (event_name, visitor_id, path, properties)
      VALUES (${eventName}, ${visitorId}, ${path || ""}, ${JSON.stringify(safeProperties)}::jsonb)
    `;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

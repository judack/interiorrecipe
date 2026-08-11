import { sql } from "@/lib/db";

export const KAKAO_REDIRECT_URI =
  "https://interiorrecipe.vercel.app/api/admin/kakao/callback";

export async function ensureKakaoTokensTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS kakao_tokens (
      id INTEGER PRIMARY KEY DEFAULT 1,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;
}

export async function saveKakaoTokens(
  accessToken: string,
  refreshToken: string,
  expiresInSeconds: number
) {
  await ensureKakaoTokensTable();
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
  await sql`
    INSERT INTO kakao_tokens (id, access_token, refresh_token, expires_at)
    VALUES (1, ${accessToken}, ${refreshToken}, ${expiresAt})
    ON CONFLICT (id) DO UPDATE SET
      access_token = EXCLUDED.access_token,
      refresh_token = EXCLUDED.refresh_token,
      expires_at = EXCLUDED.expires_at
  `;
}

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.KAKAO_REST_API_KEY!,
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error("kakao token refresh failed");
  return res.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  }>;
}

export async function getValidAccessToken(): Promise<string | null> {
  await ensureKakaoTokensTable();
  const rows = await sql`
    SELECT access_token, refresh_token, expires_at FROM kakao_tokens WHERE id = 1
  `;
  if (rows.length === 0) return null;

  const row = rows[0];
  if (new Date(row.expires_at as string).getTime() > Date.now() + 60_000) {
    return row.access_token as string;
  }

  const data = await refreshAccessToken(row.refresh_token as string);
  await saveKakaoTokens(
    data.access_token,
    data.refresh_token || (row.refresh_token as string),
    data.expires_in
  );
  return data.access_token;
}

export async function sendKakaoMemo(text: string) {
  const token = await getValidAccessToken();
  if (!token) return;

  const templateObject = {
    object_type: "text",
    text,
    link: {
      web_url: "https://interiorrecipe.vercel.app/admin",
      mobile_web_url: "https://interiorrecipe.vercel.app/admin",
    },
  };

  await fetch("https://kapi.kakao.com/v2/api/talk/memo/default/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      template_object: JSON.stringify(templateObject),
    }),
  });
}

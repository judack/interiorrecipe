import { NextResponse } from "next/server";
import { KAKAO_REDIRECT_URI, saveKakaoTokens } from "@/lib/kakao";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return new NextResponse(
      `카카오 인증에 실패했어요: ${error || "코드가 없습니다."}`,
      { status: 400 }
    );
  }

  const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_REST_API_KEY!,
      client_secret: process.env.KAKAO_CLIENT_SECRET!,
      redirect_uri: KAKAO_REDIRECT_URI,
      code,
    }),
  });

  if (!tokenRes.ok) {
    const detail = await tokenRes.text();
    return new NextResponse(`토큰 발급에 실패했어요: ${detail}`, {
      status: 400,
    });
  }

  const data = await tokenRes.json();
  await saveKakaoTokens(data.access_token, data.refresh_token, data.expires_in);

  return new NextResponse(
    "카카오톡 알림 연결이 완료됐어요. 이제 이 창은 닫으셔도 됩니다.",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}

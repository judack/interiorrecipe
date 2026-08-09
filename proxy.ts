import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const auth = request.headers.get("authorization");

  if (auth) {
    const [, encoded] = auth.split(" ");
    const decoded = Buffer.from(encoded, "base64").toString();
    const [user, password] = decoded.split(":");

    if (
      user === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

  return new NextResponse("인증이 필요합니다.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "인테리어레시피 | 내 방에 맞는 인테리어 솔루션",
  description:
    "사진 한 장으로 시작하는 맞춤 공간 솔루션. 1인 가구와 2030세대를 위한 현실적인 가구배치 및 인테리어 컨설팅, 인테리어레시피.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}

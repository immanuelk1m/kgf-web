import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "코스피 공포 & 탐욕 지수",
  description: "코스피 시장 심리를 한눈에 살펴보는 Fear & Greed 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "코스피 공포 탐욕 지수 - 코스피 공포 탐욕 지수",
  description: "코스피 공포 탐욕 지수",
  robots: "max-image-preview:large",
  generator: "All in One SEO (AIOSEO) 4.6.7.1",
  openGraph: {
    locale: "ko_KR",
    siteName: "코스피 공포 탐욕 지수 - 코스피 공포 탐욕 지수",
    type: "website",
    title: "코스피 공포 탐욕 지수 - 코스피 공포 탐욕 지수",
    description: "코스피 공포 탐욕 지수",
    url: "https://kospi-fear-greed-index.co.kr/",
    images: [
      {
        url: "https://github.com/immanuelk1m/kgf-web/blob/main/public/og-image.jpg?raw=true", // 로컬에 저장된 이미지 사용
        width: 1200,
        height: 630,
        alt: "코스피 공포 탐욕 지수 미리보기 이미지",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "코스피 공포 탐욕 지수 - 코스피 공포 탐욕 지수",
    description: "코스피 공포 탐욕 지수",
    images: ["https://github.com/immanuelk1m/kgf-web/blob/main/public/og-image.jpg?raw=true"], // Twitter 카드 이미지
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7656508177587264"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WY310Z2L55"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WY310Z2L55');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
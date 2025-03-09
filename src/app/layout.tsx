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
        url: "https://raw.githubusercontent.com/immanuelk1m/kgf-web/master/public/ogimage.jpg", 
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "코스피 공포 탐욕 지수 - 코스피 공포 탐욕 지수",
    description: "코스피 공포 탐욕 지수",
    images: ["https://raw.githubusercontent.com/immanuelk1m/kgf-web/master/public/ogimage.jpg"], 
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
      <meta property="og:image" content="https://raw.githubusercontent.com/immanuelk1m/kgf-web/master/public/ogimage.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

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
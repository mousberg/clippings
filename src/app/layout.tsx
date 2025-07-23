import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clippings - AI-Powered Media Coverage Reports",
  description: "Real-time PR coverage analysis using Google News RSS feeds and Google Gemini AI. Generate professional media coverage reports in 8-12 seconds.",
  keywords: ["PR", "media coverage", "press coverage", "news analysis", "AI", "reporting", "Google News"],
  authors: [{ name: "Clippings Team" }],
  creator: "Clippings",
  publisher: "Clippings",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://getclippings.co'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Clippings - AI-Powered Media Coverage Reports",
    description: "Real-time PR coverage analysis using Google News RSS feeds and Google Gemini AI",
    url: 'https://getclippings.co',
    siteName: 'Clippings',
    images: [
      {
        url: '/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Clippings Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Clippings - AI-Powered Media Coverage Reports",
    description: "Real-time PR coverage analysis using Google News RSS feeds and Google Gemini AI",
    images: ['/web-app-manifest-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon1.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon0.svg',
      },
    ],
  },
  manifest: '/manifest.json',
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#ffffff',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

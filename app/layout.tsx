import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { getSiteSettings } from "@/lib/content";
import { getLocalBusinessSchema } from "@/lib/structured-data";
import Analytics from "@/components/Analytics";
import AnalyticsRouteTracker from "@/components/AnalyticsRouteTracker";
import WebVitals from "@/components/WebVitals";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Toaster from "@/components/ui/Toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const settings = getSiteSettings();

export const metadata: Metadata = {
  metadataBase: new URL('https://mavisigorta.net'),
  title: {
    default: settings.seo.title,
    template: '%s | Mavi Sigorta',
  },
  description: settings.seo.description,
  keywords: settings.seo.keywords,
  authors: [{ name: 'Mavi Sigorta' }],
  creator: 'Mavi Sigorta',
  publisher: 'Mavi Sigorta',
  openGraph: {
    title: settings.seo.title,
    description: settings.seo.description,
    type: "website",
    locale: "tr_TR",
    url: 'https://mavisigorta.net',
    siteName: settings.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: settings.seo.title,
    description: settings.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = getLocalBusinessSchema();

  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#0066CC" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mavi Sigorta" />
      </head>
      <body className={`${jakarta.variable} ${inter.variable} font-sans antialiased bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-6 py-3 rounded-lg z-50 font-semibold"
        >
          Ana içeriğe atla
        </a>

        <Analytics />
        <Suspense fallback={null}>
          <AnalyticsRouteTracker />
        </Suspense>
        <WebVitals />
        <Toaster />
        
        <main id="main-content">
          {children}
        </main>
        
        <ScrollToTop />
      </body>
    </html>
  );
}

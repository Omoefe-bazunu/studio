import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import FirebaseAnalyticsProvider from "@/components/analytics/FirebaseAnalyticsProvider";
import TopHeaderBanner from "@/components/landing/TopHeaderBanner";
import TawkToWidget from "@/components/TawkToWidget";

export const metadata: Metadata = {
  title: "HIGH-ER Hub",
  description: "Quality & Affordability by HIGH-ER ENTERPRISES",
  // Google Search Console Verification
  verification: {
    google: "562941b20bc6c9a2",
  },
  // Recommended: Add icons for a more professional browser tab
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <FirebaseAnalyticsProvider />
          <TopHeaderBanner />
          {children}
          <Toaster />
          <TawkToWidget />
        </AuthProvider>
      </body>
    </html>
  );
}

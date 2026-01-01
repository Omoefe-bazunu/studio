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
  title: "HIGH-ER Enterprises | Digital Solutions & Intelligence",
  description:
    "Quality & Affordability by HIGH-ER ENTERPRISES. Web, Mobile, and SaaS development engineered for growth.",
  metadataBase: new URL("https://higher.com.ng"),
  openGraph: {
    title: "HIGH-ER Enterprises",
    description:
      "Expert Web and Mobile solutions for local and international businesses.",
    url: "https://higher.com.ng",
    siteName: "HIGH-ER Enterprises",
    images: [
      {
        url: "/og-image.png", // Place a 1200x630 image in your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

// export const metadata: Metadata = {
//   title: "HIGH-ER Hub",
//   description: "Quality & Affordability by HIGH-ER ENTERPRISES",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Next.js automatically handles essential head elements. */}
      </head>
      <body className="antialiased font-sans">
        <AuthProvider>
          <FirebaseAnalyticsProvider />
          <TopHeaderBanner />
          {children}
          <Toaster />
          <TawkToWidget /> {/* Add the TawkToWidget component */}
        </AuthProvider>
      </body>
    </html>
  );
}

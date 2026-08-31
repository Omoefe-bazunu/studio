import {
  Space_Grotesk,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import FirebaseAnalyticsProvider from "@/components/analytics/FirebaseAnalyticsProvider";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "HIGH-ER Enterprises | Digital Solutions",
  description:
    "Quality & Affordability by HIGH-ER ENTERPRISES. Web, Mobile, and SaaS development built for growth.",
  metadataBase: new URL("https://higherenterprises.co.uk"),
  verification: {
    google: "ca-pub-3366410135385089",
  },
  other: {
    "google-adsense-account": "ca-pub-3366410135385089",
    "impact-site-verification": "fea1c8bd-2d85-4390-85f0-91bbce9f835a",
  },
  openGraph: {
    title: "HIGH-ER Enterprises",
    description:
      "Expert Web and Mobile solutions for local and international businesses.",
    url: "https://higherenterprises.co.uk",
    siteName: "HIGH-ER Enterprises",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <FirebaseAnalyticsProvider />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
          <Toaster />
          <WhatsAppWidget />
        </AuthProvider>
        {/* Meta Pixel */}

        <Script id="fb-pixel" strategy="afterInteractive">
          {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '27809282782059598');
    fbq('track', 'PageView');
  `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=27809282782059598&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}

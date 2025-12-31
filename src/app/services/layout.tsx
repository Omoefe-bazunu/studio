import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import ServicesSubNav from "@/components/services/ServicesSubNav";

export const metadata: Metadata = {
  title: "Our Services - HIGH-ER Hub",
  description: "Explore the range of services offered by HIGH-ER ENTERPRISES.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <ServicesSubNav />
      <main className="flex-1">
        {/* Container will be added in individual page components or sections for more control */}
        {children}
      </main>
      <Footer />
    </div>
  );
}

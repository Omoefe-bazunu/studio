import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | HIGH-ER ENTERPRISES",
  description:
    "Comprehensive digital solutions built for growth. Explore our expertise in SaaS development, mobile applications, paid ads, and business automation.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <main className="flex-1">{children}</main>
    </div>
  );
}

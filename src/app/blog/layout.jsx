import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import BlogSubNav from "@/components/blog/BlogSubNav";

export const metadata = {
  title: "Our Blog - High-ER Hub",
  description: "Insights, tips, and trends from High-ER Enterprises.",
};

export default function BlogLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <BlogSubNav />
      <main className="flex-1 py-12 lg:py-16">
        <div className="container mx-auto px-6 max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

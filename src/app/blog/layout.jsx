import BlogSubNav from "@/components/blog/BlogSubNav";
import { NewLineKind } from "typescript";
import Newsletter from "@/components/landing/Newsletter";

export const metadata = {
  title: "Our Blog - High-ER",
  description: "Insights, tips, and trends from High-ER Enterprises.",
};

export default function BlogLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0F0A1F]">
      <BlogSubNav />
      <main className="flex-1 py-4">
        <div className="container mx-auto px-6 max-w-7xl">{children}</div>
      </main>
      <Newsletter />
    </div>
  );
}

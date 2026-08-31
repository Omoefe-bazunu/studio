import type { Metadata } from "next";
import BusinessBlogFeed from "@/components/blog/BusinessBlogFeed";
import { blogCategoriesData } from "@/data/blogCategories";
import AdsBannerSection from "@/components/landing/AdsBannerSection";

export const metadata: Metadata = {
  title: "Business Blog - HIGH-ER Enterprises",
  description:
    blogCategoriesData.find((cat) => cat.id === "Business")?.description ||
    "Business strategies, tips, and news from HIGH-ER Enterprises.",
};

export default function BusinessBlogPage() {
  return (
    <section>
      <div className="my-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Business Strategies & <br />
          <span className="font-accent lowercase font-normal italic text-[#FF8C38]">
            Growth
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {blogCategoriesData.find((cat) => cat.id === "Business")?.description}
        </p>
      </div>
      <AdsBannerSection />
      <BusinessBlogFeed />
    </section>
  );
}

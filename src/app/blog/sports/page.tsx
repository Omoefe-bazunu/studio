import type { Metadata } from "next";
import SportsBlogFeed from "@/components/blog/SportsBlogFeed";
import { blogCategoriesData } from "@/data/blogCategories";
import AdsBannerSection from "@/components/landing/AdsBannerSection";

export const metadata: Metadata = {
  title: "Sports Blog - HIGH-ER Enterprises",
  description:
    blogCategoriesData.find((cat) => cat.id === "Sports")?.description ||
    "Latest in Sports from HIGH-ER Enterprises.",
};

export default function SportsBlogPage() {
  return (
    <section>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Sports Insights & Highlights
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {blogCategoriesData.find((cat) => cat.id === "Sports")?.description}
        </p>
      </div>
      <AdsBannerSection />
      <SportsBlogFeed />
    </section>
  );
}

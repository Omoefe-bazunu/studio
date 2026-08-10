import type { Metadata } from "next";
import PoliticsBlogFeed from "@/components/blog/PoliticsBlogFeed";
import { blogCategoriesData } from "@/data/blogCategories";
import AdsBannerSection from "@/components/landing/AdsBannerSection";

export const metadata: Metadata = {
  title: "Politics Blog - HIGH-ER Enterprises",
  description:
    blogCategoriesData.find((cat) => cat.id === "Politics")?.description ||
    "Latest in Politics from HIGH-ER Enterprises.",
};

export default function PoliticsBlogPage() {
  return (
    <section>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Political Insights & Updates
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {blogCategoriesData.find((cat) => cat.id === "Politics")?.description}
        </p>
      </div>
      <AdsBannerSection />
      <PoliticsBlogFeed />
    </section>
  );
}

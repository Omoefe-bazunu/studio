import type { Metadata } from "next";
import CareerBlogFeed from "@/components/blog/CareerBlogFeed";
import { blogCategoriesData } from "@/data/blogCategories";
import AdsBannerSection from "@/components/landing/AdsBannerSection";

export const metadata: Metadata = {
  title: "Career Advice Blog - HIGH-ER Enterprises",
  description:
    blogCategoriesData.find((cat) => cat.id === "Career")?.description ||
    "Guidance for your professional journey from HIGH-ER Enterprises.",
};

export default function CareerBlogPage() {
  return (
    <section>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Career Development & Insights
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {blogCategoriesData.find((cat) => cat.id === "Career")?.description}
        </p>
      </div>
      <AdsBannerSection />
      <CareerBlogFeed />
    </section>
  );
}

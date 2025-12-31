
import type { Metadata } from 'next';
import TechBlogFeed from '@/components/blog/TechBlogFeed';
import { blogCategoriesData } from '@/data/blogCategories';

export const metadata: Metadata = {
  title: 'Tech Blog - HIGH-ER Hub',
  description: blogCategoriesData.find(cat => cat.id === 'Tech')?.description || 'Latest in Tech from HIGH-ER Hub.',
};

export default function TechBlogPage() {
  return (
    <section>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Tech Insights & Innovations
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {blogCategoriesData.find(cat => cat.id === 'Tech')?.description}
        </p>
      </div>
      <TechBlogFeed />
    </section>
  );
}

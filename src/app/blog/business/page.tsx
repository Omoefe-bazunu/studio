
import type { Metadata } from 'next';
import BusinessBlogFeed from '@/components/blog/BusinessBlogFeed';
import { blogCategoriesData } from '@/data/blogCategories';

export const metadata: Metadata = {
  title: 'Business Blog - HIGH-ER Hub',
  description: blogCategoriesData.find(cat => cat.id === 'Business')?.description || 'Business strategies, tips, and news from HIGH-ER Hub.',
};

export default function BusinessBlogPage() {
  return (
    <section>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Business Strategies & Growth
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {blogCategoriesData.find(cat => cat.id === 'Business')?.description}
        </p>
      </div>
      <BusinessBlogFeed />
    </section>
  );
}


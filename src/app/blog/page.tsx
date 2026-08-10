
import { redirect } from 'next/navigation';
import { blogCategoriesData } from '@/data/blogCategories';

export default function BlogRedirectPage() {
  // Redirect to the first category, or a default one like 'tech'
  const defaultCategoryHref = blogCategoriesData.find(cat => cat.id === 'Tech')?.href || blogCategoriesData[0]?.href || '/';
  redirect(defaultCategoryHref);
  return null;
}

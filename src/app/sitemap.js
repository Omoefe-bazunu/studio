import {
  getBlogPosts,
  getWebProjects,
  getMobileProjects,
  getSaasProjects,
} from "@/lib/firebase/firestoreService";

export default async function sitemap() {
  const baseUrl = "https://higher.com.ng";

  // 1. Fetch Dynamic Content from Firebase
  const [blogs, webItems, mobileItems, saasItems] = await Promise.all([
    getBlogPosts(),
    getWebProjects(),
    getMobileProjects(),
    getSaasProjects(),
  ]);

  // 2. Map Blogs to Sitemap Format
  const blogUrls = blogs.map((post) => ({
    url: `${baseUrl}/blog/${post.category.toLowerCase()}/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 3. Define Static Core Pages
  const staticPages = [
    "",
    "/services/web-development",
    "/services/mobile-app-development",
    "/services/saas-development",
    "/services/marketing-ads-design",
    "/blog/business",
    "/blog/career",
    "/blog/tech",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...staticPages, ...blogUrls];
}

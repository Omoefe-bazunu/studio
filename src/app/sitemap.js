import {
  getBlogPosts,
  getWebProjects,
  getMobileProjects,
  getSaasProjects,
} from "@/lib/firebase/firestoreService";

export default async function sitemap() {
  const baseUrl = "https://higher.com.ng";

  try {
    // 1. Fetch Dynamic Content with a fallback to empty arrays
    const [blogs, webItems, mobileItems, saasItems] = await Promise.all([
      getBlogPosts().catch(() => []),
      getWebProjects().catch(() => []),
      getMobileProjects().catch(() => []),
      getSaasProjects().catch(() => []),
    ]);

    // 2. Map Blogs with Optional Chaining (?.) to prevent crashes on missing data
    const blogUrls = (blogs || []).map((post) => ({
      url: `${baseUrl}/blog/${post.category?.toLowerCase() || "general"}/${
        post.slug
      }`,
      lastModified: new Date(post.updatedAt || post.date || new Date()),
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
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    // Return a minimal sitemap so Google doesn't get a 404
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}

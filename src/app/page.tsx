import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import ServicesGrid from "@/components/landing/ServicesGrid";
// import AboutUs from '@/components/landing/AboutUs'; // Removed AboutUs section from homepage
import TestimonialsCarousel from "@/components/landing/TestimonialsCarousel";
import AdsBannerSection from "@/components/landing/AdsBannerSection";
import BlogArticles from "@/components/landing/BlogArticles";
// import ProjectsSection from '@/components/landing/ProjectsSection';
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesGrid />
        {/* <AboutUs /> */} {/* Removed AboutUs section from homepage */}
        <TestimonialsCarousel />
        <AdsBannerSection />
        <BlogArticles />
        {/* <ProjectsSection /> */}
        {/* 
          Future sections to be added if requested:
          <NewsletterSubscribeSection />
        */}
      </main>
      <Footer />
    </div>
  );
}

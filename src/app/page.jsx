import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import Testimonials from "@/components/landing/Testimonials";
import AdsBannerSection from "@/components/landing/AdsBannerSection";
import TechStackTicker from "@/components/landing/TechStackTicker";
import Newsletter from "@/components/landing/Newsletter";
import Groweasy from "@/components/landing/GrowEasy";
// import BlogArticles from "@/components/landing/BlogArticles";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <Hero />
        <TechStackTicker />
        <Services />
        <Testimonials />
        <Groweasy />
        <AdsBannerSection />
        <Newsletter />
        {/* <BlogArticles /> */}
      </main>
    </div>
  );
}

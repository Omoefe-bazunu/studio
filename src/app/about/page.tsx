
import Header from '@/components/landing/Header';
import AboutUsContent from '@/components/landing/AboutUs'; // Renamed import for clarity
import Footer from '@/components/landing/Footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <AboutUsContent />
      </main>
      <Footer />
    </div>
  );
}

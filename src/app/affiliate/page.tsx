
import Header from '@/components/landing/Header';
import AffiliatePageContent from '@/components/affiliate/AffiliatePageContent';
import Footer from '@/components/landing/Footer';

export default function AffiliatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <AffiliatePageContent />
      </main>
      <Footer />
    </div>
  );
}

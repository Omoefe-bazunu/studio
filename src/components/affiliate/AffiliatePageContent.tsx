
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Award, Gift, MessageSquare, TrendingUp, Users, FileText, ExternalLink, LogIn } from 'lucide-react';
import ResourcesModal from './ResourcesModal';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const steps = [
  {
    icon: Users,
    title: "Sign Up & Get Approved",
    description: "Join our affiliate program by signing up through our portal. Once approved, you'll get access to your unique affiliate dashboard and resources.",
  },
  {
    icon: FileText,
    title: "Access Marketing Resources",
    description: "We provide you with a range of marketing materials, including banners, text links, and promotional content to help you effectively promote our services.",
  },
  {
    icon: TrendingUp,
    title: "Refer Clients to Us",
    description: "Share your unique affiliate links or codes with your audience, network, or clients who could benefit from our Web Development, Digital Marketing, Ads Design, or CV/Resume Writing services.",
  },
  {
    icon: MessageSquare,
    title: "Notify Us of Referrals",
    description: "When you refer a client who signs up for a service, please send us a quick message via WhatsApp or Email with the client's details so we can track your referral accurately.",
  },
  {
    icon: Award,
    title: "Earn Your Commission",
    description: "You earn a generous 20% commission on the profits from every successful deal closed through your referral. Payments are made on a regular schedule.",
  },
];

export default function AffiliatePageContent() {
  const { currentUser, loadingAuth } = useAuth(); // Use actual auth state
  const [isResourcesModalOpen, setIsResourcesModalOpen] = React.useState(false);

  const whatsappNumber = "+12345678900"; // Replace with your actual WhatsApp number
  const whatsappMessage = "Hello HIGH-ER ENTERPRISES, I've referred a new client via the affiliate program.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const emailAddress = "affiliates@higher-enterprises.com"; // Replace with your affiliate email

  if (loadingAuth) {
    // Optional: Add a loading skeleton or spinner while auth state is loading
    return (
        <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
                <p>Loading affiliate information...</p>
            </div>
        </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <Gift className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Join Our Affiliate Program
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Partner with HIGH-ER ENTERPRISES and earn by referring clients to our high-quality, affordable services.
          </p>
        </div>

        <div className="bg-card p-8 md:p-12 rounded-xl shadow-xl mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">How It Works</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <step.icon className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
           <div className="mt-8 pt-6 border-t border-border">
             <h3 className="text-xl font-semibold text-primary mb-3">Communication is Key</h3>
             <p className="text-muted-foreground mb-4">
               To ensure you get credited for your referrals, please notify us via WhatsApp or Email once a client you referred engages our services.
             </p>
             <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
                  <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" /> Notify on WhatsApp
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`mailto:${emailAddress}?subject=Affiliate%20Referral`}>
                     Email Us About Referral
                  </Link>
                </Button>
             </div>
           </div>
        </div>
        
        {!currentUser && (
            <div className="text-center mb-12 p-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-3">Sign in to access affiliate resources or sign up for the program.</p>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 mr-2">
                    <Link href="/login?redirect=/affiliate">
                        <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </Link>
                </Button>
                 <Button variant="outline" asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
        )}


        {currentUser && (
          <div className="text-center mb-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 mb-3">Welcome, Affiliate Partner!</h2>
            <p className="text-muted-foreground mb-4">
              You're signed in. Access your marketing resources below or manage your account.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setIsResourcesModalOpen(true)}
                >
                  <FileText className="mr-2 h-5 w-5" /> Get Marketing Resources
                </Button>
                {/* <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">Affiliate Dashboard</Link>
                </Button> */}
            </div>
          </div>
        )}

        <div className="text-center">
            <p className="text-muted-foreground">
            Questions? <a href="https://wa.me/${+2349043970401}?text=${encodeURIComponent(whatsappMessage)}" className="text-primary hover:underline">Contact our affiliate support team</a>.
            </p>
        </div>

        <ResourcesModal isOpen={isResourcesModalOpen} onOpenChange={setIsResourcesModalOpen} />
      </div>
    </section>
  );
}

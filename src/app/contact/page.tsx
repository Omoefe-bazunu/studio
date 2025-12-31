"use client";

import * as React from "react"; // Import React
import Header from "@/components/landing/Header";
import ContactPageContent from "@/components/contact/ContactPageContent";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
  const { isAdmin, loadingAuth } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <React.Suspense
          fallback={
            <div className="py-16 lg:py-24 flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          }
        >
          <ContactPageContent />
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}

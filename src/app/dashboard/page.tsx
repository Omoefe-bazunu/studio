
"use client"; // Required for useAuth and router

import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/lib/firebase/auth';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, loadingAuth, isAdmin } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loadingAuth && !currentUser) {
      router.push('/login?redirect=/dashboard');
    }
  }, [currentUser, loadingAuth, router]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/'); // Redirect to homepage after sign out
  };

  if (loadingAuth || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-primary mb-6">
            Welcome to your Dashboard, {currentUser.displayName || currentUser.email}!
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Your email is: {currentUser.email}
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            Email Verified: {currentUser.emailVerified ? 'Yes' : 'No - Please check your inbox to verify.'}
          </p>
          {isAdmin && (
            <p className="text-lg text-green-600 dark:text-green-400 font-semibold mb-4">
              You have admin privileges.
            </p>
          )}
          <p className="text-muted-foreground mb-8">
            This is a placeholder for your dashboard content. More features coming soon!
          </p>
          <Button onClick={handleSignOut} variant="destructive" size="lg">
            Sign Out
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

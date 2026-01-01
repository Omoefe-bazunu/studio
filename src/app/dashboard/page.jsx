"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/firebase/auth";
import {
  Loader2,
  Mail,
  LogOut,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser, loadingAuth, isAdmin } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loadingAuth && !currentUser) {
      router.push("/login?redirect=/dashboard");
    }
  }, [currentUser, loadingAuth, router]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  const handleAdmin = () => {
    router.push("/admin");
  };

  const handleContactSupport = () => {
    window.location.href =
      "mailto:support@higher.com.ng?subject=Support Request - " +
      (currentUser?.displayName || currentUser?.email);
  };

  if (loadingAuth || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#0F0A1F]">
        <Loader2 className="h-10 w-10 animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-lg overflow-hidden">
          {/* User Info Header */}
          <div className="bg-[#0F0A1F] p-8 text-white border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-[#6B46C1] flex items-center justify-center text-xl font-bold rounded-none">
                {currentUser.displayName?.charAt(0) ||
                  currentUser.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <h1 className="text-xl font-bold truncate">
                  {currentUser.displayName || "User"}
                </h1>
                <p className="text-slate-400 text-sm flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5" /> {currentUser.email}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-4 inline-flex flex-col items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                <p> Admin Access</p>
                <Button
                  onClick={handleAdmin}
                  className="w-full h-12 bg-[#6B46C1] hover:bg-[#5a3aaa] text-white font-bold rounded-full flex items-center justify-center gap-2"
                >
                  Admin Dashboard
                </Button>
              </div>
            )}
          </div>

          {/* Functional Actions */}
          <div className="p-8 space-y-4">
            <Button
              onClick={handleContactSupport}
              className="w-full h-12 bg-[#6B46C1] hover:bg-[#5a3aaa] text-white font-bold rounded-full flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Contact Support
            </Button>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full h-12 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 font-bold rounded-full flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </Button>
          </div>

          <div className="px-8 pb-8 text-center">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
              Secure Session Active
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

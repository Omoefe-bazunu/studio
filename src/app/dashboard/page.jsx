"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/firebase/auth";
import {
  Loader2,
  Mail,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Settings,
  ChevronRight,
  Sparkles,
  User,
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

  const handleAdmin = () => router.push("/admin");

  const handleContactSupport = () => {
    window.location.href =
      "mailto:support@higher.com.ng?subject=Support Request - " +
      (currentUser?.displayName || currentUser?.email);
  };

  // Loading state
  if (loadingAuth || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden pt-28 pb-20 md:pt-36">
      {/* Background Ambient Glow & Dot Matrix Pattern */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[140px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_20%,transparent_75%)] pointer-events-none"
        aria-hidden="true"
      />

      <main className="w-full max-w-md relative z-10">
        <div className="bg-card/90 backdrop-blur-md border border-border/80 shadow-xl rounded-2xl overflow-hidden">
          {/* 1. PROFILE HEADER */}
          <div className="p-8 pb-6 text-center border-b border-border/60">
            <div className="relative inline-block mb-4">
              <div className="h-20 w-20 bg-gradient-to-tr from-primary to-[#FF8C38] flex items-center justify-center text-2xl font-black text-white rounded-2xl shadow-md shadow-primary/20">
                <span>
                  {currentUser.displayName?.charAt(0) ||
                    currentUser.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              {isAdmin && (
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-lg border-2 border-card shadow-md"
                  title="Administrator Access Enabled"
                >
                  <ShieldCheck size={14} />
                </div>
              )}
            </div>

            <h1 className="font-sans text-xl md:text-2xl font-bold tracking-tight text-foreground">
              {currentUser.displayName || "Account Profile"}
            </h1>

            <div className="inline-flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-medium mt-1.5 max-w-full truncate px-3 py-1 bg-muted/40 rounded-full border border-border/40">
              <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
          </div>

          {/* 2. ACTION LIST */}
          <div className="p-6 md:p-8 space-y-3">
            {isAdmin && (
              <Button
                onClick={handleAdmin}
                className="w-full h-12 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-between px-5 transition-all group font-medium"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Admin Control Panel
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Button>
            )}

            <Button
              onClick={handleContactSupport}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-between px-5 transition-all group font-medium shadow-md shadow-primary/10"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Help Center & Support
                </span>
              </div>
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full h-12 border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 rounded-xl flex items-center justify-between px-5 transition-all font-medium"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Log Out
                </span>
              </div>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

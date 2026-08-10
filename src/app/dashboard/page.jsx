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
  User,
  Settings,
  ChevronRight,
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

  if (loadingAuth || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#0F0A1F]">
        <Loader2 className="h-10 w-10 animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f7] text-white">
      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6B46C1]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-[#1A142D] border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden relative z-10">
          {/* 1. PROFILE HEADER */}
          <div className="p-10 pb-6 text-center border-b border-white/5">
            <div className="relative inline-block mb-6">
              <div className="h-24 w-24 bg-gradient-to-tr from-[#6B46C1] to-[#FF8C38] flex items-center justify-center text-3xl font-black rounded-3xl rotate-3">
                <span className="-rotate-3">
                  {currentUser.displayName?.charAt(0) ||
                    currentUser.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              {isAdmin && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl border-4 border-[#1A142D] shadow-lg">
                  <ShieldCheck size={16} />
                </div>
              )}
            </div>

            <h1 className="text-2xl font-black uppercase italic tracking-tighter">
              {currentUser.displayName || "Account Profile"}
            </h1>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold mt-2 truncate">
              <Mail className="w-3.5 h-3.5 text-[#6B46C1]" />{" "}
              {currentUser.email}
            </div>
          </div>

          {/* 2. ACTION LIST */}
          <div className="p-8 space-y-3">
            {isAdmin && (
              <Button
                onClick={handleAdmin}
                className="w-full h-14 bg-white/5 hover:bg-white/10 text-green-400 border border-green-500/20 rounded-2xl flex items-center justify-between px-6 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <span className="font-black uppercase italic text-xs tracking-widest">
                    Admin Control
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
              className="w-full h-14 bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-2xl flex items-center justify-between px-6 group"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5" />
                <span className="font-black uppercase italic text-xs tracking-widest">
                  Help Center
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
              className="w-full h-14 border-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 rounded-2xl flex items-center justify-between px-6 transition-all"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-black uppercase italic text-xs tracking-widest">
                  LOGOUT
                </span>
              </div>
            </Button>
          </div>

          {/* 3. FOOTER INFO */}
          <div className="px-8 pb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                Secure Cloud Connection
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

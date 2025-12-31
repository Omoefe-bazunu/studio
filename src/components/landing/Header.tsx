"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  const { currentUser, loadingAuth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Handle Mount and Scroll logic
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    setOpenSheet(false);
    const { error } = await signOutUser();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      router.push("/");
    }
  };

  if (!mounted) return <div className="h-16 w-full border-b bg-background" />;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 border-b",
        isScrolled
          ? "bg-white shadow-sm border-border" // Solid white on scroll
          : "bg-white/50 backdrop-blur-md border-transparent" // Subtle transparency only at top
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-primary">
            HIGH-ER{" "}
            <span className="font-normal text-primary">ENTERPRISES</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex h-full items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative flex h-full items-center px-4 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-slate-600"
                )}
              >
                {link.label}
                {/* Active Indicator - Placed exactly on the bottom border */}
                {isActive && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary z-10" />
                )}
              </Link>
            );
          })}

          <div className="ml-4 flex items-center border-l pl-4 gap-3">
            {!loadingAuth &&
              (currentUser ? (
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="rounded-full shadow-none bg-slate-900 hover:bg-slate-800"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full border-slate-200 hover:bg-primary"
                >
                  <Link href="/login">Login</Link>
                </Button>
              ))}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-0">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle className="text-lg font-bold text-primary">
                  HIGH-ER ENTERPRISES
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 space-y-1 py-4 px-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpenSheet(false)}
                    className={cn(
                      "flex items-center justify-between rounded-md px-4 py-3 text-base font-medium",
                      pathname === link.href
                        ? "bg-slate-100 text-primary"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 opacity-30" />
                  </Link>
                ))}
              </div>

              <div className="p-4 border-t bg-slate-50/50">
                {currentUser ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start gap-3 rounded-lg bg-white"
                      onClick={() => setOpenSheet(false)}
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="w-full rounded-lg bg-slate-900"
                    onClick={() => setOpenSheet(false)}
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

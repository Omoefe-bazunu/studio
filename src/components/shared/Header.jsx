"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Menu, X, User, LayoutDashboard } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Solutions", href: "/services" },
    { name: "Shop", href: "/shop" },
    // { name: "Amazon", href: "/amazon-products" },
    { name: "Blog", href: "/blog" },
    // { name: "Amazon", href: "/amazon-products" },
    { name: "Pricing", href: "/pricingpackages" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-background/95 backdrop-blur-md border-b ${
        scrolled ? "border-border/50 py-3 shadow-sm" : "border-transparent py-3"
      }`}
    >
      <div className="container mx-auto px-6 md:px-10 max-w-7xl">
        <div className="flex items-center justify-between h-12">
          {/* Visible Text Brand Name */}
          <Link href="/" className="flex items-center shrink-0 gap-1.5 group">
            <span className="font-heading text-xl md:text-2xl font-extrabold tracking-tighter text-foreground transition-transform group-hover:scale-[1.02]">
              HIGH-ER
            </span>
            <span className="font-heading text-xl md:text-2xl tracking-tighter text-primary">
              Enterprises
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[13px] font-sans font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-primary text-primary-foreground text-[13px] font-black uppercase tracking-[0.15em] px-8 py-3.5 rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-primary-foreground text-[13px] font-black uppercase tracking-[0.15em] px-8 py-3.5 rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <User size={14} /> Log In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-background border-b border-border shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6 p-8 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-heading font-bold text-foreground hover:text-primary transition-colors uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-border" />

            {user ? (
              <>
                <button
                  onClick={() => {
                    auth.signOut();
                    setIsOpen(false);
                  }}
                  className="text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest transition-colors"
                >
                  Logout
                </button>
                <Link
                  href="/dashboard"
                  className="bg-primary text-primary-foreground font-black py-5 rounded-full uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-primary-foreground font-black py-5 rounded-full uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} /> Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

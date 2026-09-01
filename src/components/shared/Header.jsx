"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Menu, X, LayoutDashboard } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser),
    );
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
    { name: "Blog", href: "/blog" },
    { name: "Pricing", href: "/pricingpackages" },
  ];

  const ctaBase =
    "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md text-[14px] font-medium transition-colors";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-[#120A28]/90 backdrop-blur-md border-b transition-colors duration-200 ${
        scrolled ? "border-white/10" : "border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-10 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-[14px] font-semibold tracking-wide uppercase text-white">
              High-Er{" "}
              <span className="text-[#7B68F0] font-light">ENTERPRISES</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[14px] font-normal text-[#A79FC4] hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className={`${ctaBase} bg-[#7B68F0] text-white hover:bg-[#6C5AE0]`}
              >
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`${ctaBase} bg-[#7B68F0] text-white hover:bg-[#6C5AE0]`}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#120A28] border-b border-white/10">
          <div className="flex flex-col gap-5 p-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[15px] font-normal text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-white/10" />
            {user ? (
              <>
                {/* <button
                  onClick={() => {
                    auth.signOut();
                    setIsOpen(false);
                  }}
                  className="text-left text-[#A79FC4] text-[15px]"
                >
                  Logout
                </button> */}
                <Link
                  href="/dashboard"
                  className={`${ctaBase} bg-[#7B68F0] text-white justify-center py-3 h-auto`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`${ctaBase} bg-[#7B68F0] text-white justify-center py-3 h-auto`}
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

"use client";

import React from "react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerNavLinksData = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/privacy-policy", label: "Privacy Policy" }, // Added for AdSense
  { href: "/contact", label: "Contact Us" },
];

const socialLinks = [
  {
    href: "https://web.facebook.com/higherenterprises/",
    icon: FaFacebookF,
    label: "Facebook",
  },
  { href: "https://x.com/raniem57", icon: FaXTwitter, label: "Twitter" },
  {
    href: "https://www.linkedin.com/in/omoefe-bazunu-651b72203/",
    icon: FaLinkedinIn,
    label: "LinkedIn",
  },
];

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const getHref = (link) => {
    if (
      isHomePage &&
      (link.href.startsWith("/#") || link.href.startsWith("#"))
    ) {
      return link.href.startsWith("/#") ? link.href.substring(1) : link.href;
    }
    if (link.href === "/#home") return "/";
    return link.href;
  };

  return (
    <footer
      id="contact"
      className="bg-[#0F0A1F] text-white py-16 border-t border-white/5"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <span className="text-2xl font-bold tracking-tighter">
                HIGH-ER{" "}
                <span className="text-[#6B46C1] font-light">Enterprises</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Providing premium digital solutions in software engineering,
              strategic marketing, and high-conversion design.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">
              Explore
            </h3>
            <ul className="grid grid-cols-1 gap-4">
              {footerNavLinksData.map((link) => (
                <li key={link.label}>
                  <Link
                    href={getHref(link)}
                    className="text-slate-300 hover:text-[#6B46C1] transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Connect
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              <p>Olughor Avenue, Ugbomro, Delta State, Nigeria</p>
              <p className="hover:text-[#6B46C1] transition-colors">
                <a href="mailto:info@higher.com.ng">info@higher.com.ng</a>
              </p>
              <p>+234-9043970401</p>
            </div>

            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#6B46C1] hover:border-[#6B46C1] transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 text-center">
          <p className="text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} HIGH-ER ENTERPRISES. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

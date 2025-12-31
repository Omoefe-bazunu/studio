"use client";

import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import type { NavLink } from "@/types";
import { usePathname } from "next/navigation"; // Import usePathname

const footerNavLinksData: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
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
  const pathname = usePathname(); // Get current pathname
  const isHomePage = pathname === "/"; // Determine if it's the homepage

  const getHref = (link: NavLink) => {
    if (
      isHomePage &&
      (link.href.startsWith("/#") || link.href.startsWith("#"))
    ) {
      return link.href.startsWith("/#") ? link.href.substring(1) : link.href;
    }
    if (link.href === "/#home") return "/";
    if (link.href.startsWith("#") && !isHomePage) {
      return `/${link.href}`;
    }
    return link.href;
  };

  return (
    <footer
      id="contact"
      className="bg-purple-800 text-white py-12 lg:py-16 border-t"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-bold text-2xl text-white">
                HIGH-ER ENTERPRISES
              </span>
            </Link>
            <p className="text-sm">
              Providing quality and affordable solutions in web development,
              marketing, and professional writing to elevate your success.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerNavLinksData.map((link) => (
                <li key={link.label}>
                  <Link
                    href={getHref(link)}
                    className="text-sm hover:text-purple-200 hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <p className="text-sm mb-2">
              Address: Olughor Avenue, Ugbomro, Delta State, Nigeria
            </p>
            <p className="text-sm mb-2">
              Email:{" "}
              <a
                href="mailto:info@higher.com.ng"
                className="hover:text-primary hover:underline"
              >
                info@higher.com.ng
              </a>
            </p>
            <p className="text-sm mb-4">
              Phone:{" "}
              <a
                href="tel:+2349043970401"
                className="hover:text-primary hover:underline"
              >
                +234-9043970401
              </a>
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-gray-500 bg-white p-4 rounded-full hover:text-primary transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} HIGH-ER ENTERPRISES. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Wallet, MailCheck } from "lucide-react";

const products = [
  {
    id: "groweasy",
    name: "GrowEasy",
    tagline: "Invoicing and finances for small businesses.",
    description:
      "Create branded invoices and quotes, track payments, and run payroll — without spreadsheets.",
    url: "https://groweasy.higherenterprises.co.uk",
    icon: Wallet,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: "trackyourmail",
    name: "Trackyourmail",
    tagline: "Know the moment your email gets opened.",
    description:
      "Send job applications and outreach from your existing Gmail & Zoho mail , and get notified the instant someone opens it.",
    url: "https://trackyourmail.higherenterprises.co.uk",
    icon: MailCheck,
    iconColor: "text-[#FF8C38]",
    iconBg: "bg-[#FF8C38]/10",
  },
];

export default function OurProducts() {
  return (
    <section className="relative py-16 md:py-20 bg-background border-t border-border overflow-hidden">
      {/* Subtle dot pattern + faint glow so the section doesn't read as flat white */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(107,70,193,0.14)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_0%,black,transparent_75%)] dark:bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)]"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/[0.05] rounded-full blur-[110px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-6 md:px-10 max-w-6xl">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-primary mb-2">
            Our Products
          </h2>
          <h3 className="font-sans text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Software We've Built & <br />
            <span className="font-accent italic text-[#FF8C38]">
              Used by Businesses Globally
            </span>
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border p-6 rounded-2xl hover:border-primary/40 transition-colors duration-300"
            >
              <div
                className={`w-11 h-11 rounded-xl ${product.iconBg} flex items-center justify-center mb-5`}
              >
                <product.icon className={`w-5 h-5 ${product.iconColor}`} />
              </div>

              <h4 className="font-sans text-lg font-bold text-foreground mb-1">
                {product.name}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {product.tagline}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {product.description}
              </p>

              <span className="inline-flex items-center text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                Visit site
                <ArrowUpRight className="ml-1.5 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

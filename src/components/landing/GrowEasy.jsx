"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Receipt,
  Calculator,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  { text: "Branded Invoices & Receipts", icon: FileText },
  { text: "Professional Quotations", icon: FileText },
  { text: "Financial Record Keeping", icon: Calculator },
  { text: "Automated Payroll Systems", icon: Users },
  { text: "Smart Budget Tracking", icon: Receipt },
];

export default function GrowEasyPromo() {
  const GROWEASY_URL = "https://groweasy.higherenterprises.co.uk";

  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden border-t border-border">
      {/* Decorative Brand Gradients */}
      <div className="absolute top-1/4 -right-40 w-[400px] h-[400px] bg-[#6B46C1]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] bg-[#FF8C38]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Side: Value Prop & Text Content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary border border-primary/20 text-white text-xs font-bold uppercase tracking-widest">
                All-In-One Business Automation
              </div>
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase italic tracking-tight text-foreground leading-[0.95]">
                Run Your Business <br />
                <span className="text-[#FF8C38]">The Smart Way.</span>
              </h2>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-2xl font-medium">
                Stop juggling multiple spreadsheets. <strong>GrowEasy</strong>{" "}
                provides small businesses and creators with simple and powerful
                tools to handle finances, build client trust, and manage cash
                flow effortlessly.
              </p>
            </motion.div>

            {/* Features Dynamic Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {FEATURES.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-primary/30 transition-all"
                >
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-sans text-sm font-bold text-foreground">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Action Block */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="pt-2"
            >
              <Button
                asChild
                size="lg"
                className="font-sans bg-[#FF8C38] text-white hover:bg-[#e67e32] rounded-full h-14 px-10 font-black uppercase italic tracking-widest transition-all active:scale-95 shadow-xl shadow-orange-500/10"
              >
                <Link
                  href={GROWEASY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Started <ArrowUpRight size={18} className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Side: Smart Interactive Visual Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="relative bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent">
              <div className="relative z-10 space-y-6">
                {/* Visual Widget 1: Invoicing Status */}
                <div className="p-4 bg-background/60 backdrop-blur-md border border-border rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Branded Invoice
                    </span>
                  </div>
                  <span className="text-xs font-black text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    Paid
                  </span>
                </div>

                {/* Visual Widget 2: Large Graphic Asset */}
                <div className="p-6 bg-[#0F0A1F] text-white rounded-2xl space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-sm font-bold uppercase tracking-widest text-[#FF8C38]">
                      GrowEasy Dashboard
                    </span>
                    <div className="h-2 w-12 bg-white/20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-white/10 rounded-lg" />
                    <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                  </div>
                  <div className="pt-2 flex gap-2">
                    <div className="h-8 w-20 bg-[#6B46C1] rounded-lg" />
                    <div className="h-8 w-24 bg-white/5 rounded-lg" />
                  </div>
                </div>

                {/* Visual Widget 3: Mini Financial Analytics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background/60 backdrop-blur-md border border-border rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-1">
                      Payroll
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      Automated
                    </span>
                  </div>
                  <div className="p-4 bg-background/60 backdrop-blur-md border border-border rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-1">
                      Quotations
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      Instant Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

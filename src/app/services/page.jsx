"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Target,
  Bot,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import DiscussProjectCTA from "@/components/DiscussProjectCTA";

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const services = [
  {
    id: "web-saas",
    category: "Software",
    title: "Websites & SaaS Platforms",
    icon: Code2,
    href: "/services/web-development",
    iconColor: "text-[#7B68F0]",
    iconBg: "bg-[#7B68F0]/15",
    description:
      "Custom web applications and SaaS platforms designed to convert visitors into paying clients and automate core business operations.",
  },
  {
    id: "mobile",
    category: "Mobile",
    title: "Native Mobile Apps",
    icon: Smartphone,
    href: "/services/mobile-app-development",
    iconColor: "text-[#FF8C38]",
    iconBg: "bg-[#FF8C38]/15",
    description:
      "Fast, intuitive iOS and Android apps designed for smooth user experiences, high retention, and long-term engagement.",
  },
  {
    id: "paid-ads",
    category: "Acquisition",
    title: "Paid Ads That Sell",
    icon: Target,
    href: "/services/paid-ads",
    iconColor: "text-[#7B68F0]",
    iconBg: "bg-[#7B68F0]/15",
    description:
      "Targeted Meta and Google campaigns set up to reach active buyers, generate qualified leads, and optimize ROI.",
  },
  {
    id: "ai-automation",
    category: "Automation",
    title: "AI Workflow Automation",
    icon: Bot,
    href: "/services/ai-automation",
    iconColor: "text-[#FF8C38]",
    iconBg: "bg-[#FF8C38]/15",
    description:
      "Intelligent workflows that automate repetitive tasks—replies, invoicing, follow-ups—saving your business time and operating cost.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* 1. HERO SECTION (Light / White Background) */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 bg-background overflow-hidden border-b border-border/50">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/[0.05] rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,black_20%,transparent_75%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 md:px-10 max-w-4xl text-center relative z-10">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <span className="font-sans text-xs font-bold tracking-widest uppercase text-primary">
              Solutions & Capabilities
            </span>

            <h1 className="font-sans text-3xl mt-4 md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-4 max-w-2xl mx-auto">
              Everything your business needs to{" "}
              <span className="font-accent italic font-normal text-[#FF8C38]">
                scale online.
              </span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
              We build high-converting software, automate manual operations, and
              drive targeted customer acquisition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES GRID SECTION (Deep Purple Background for High Contrast) */}
      <section className="py-16 md:py-24 bg-[#120A28] relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent_75%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 md:px-10 max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                {...fadeUp}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Link
                  href={service.href}
                  className="group relative flex flex-col justify-between h-full bg-[#140f25] border border-white/10 p-6 md:p-7 rounded-xl hover:border-[#7B68F0]/50 hover:bg-[#19132e] transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    {/* Header Row: Icon + Category + Arrow */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${service.iconBg}`}
                        >
                          <service.icon
                            className={`w-5 h-5 ${service.iconColor}`}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#A79FC4]">
                          {service.category}
                        </span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white/5 text-slate-300 group-hover:bg-[#7B68F0] group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-200">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="font-sans text-xl font-bold text-white mb-2 group-hover:text-[#FF8C38] transition-colors">
                      {service.title}
                    </h2>

                    <p className="text-xs md:text-sm text-[#A79FC4] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BOTTOM CTA SECTION (Light / White Background to Contrast with Dark Footer) */}
      <section className="relative py-16 md:py-24 bg-background border-t border-border overflow-hidden">
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-[#FF8C38]/[0.05] rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent_75%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 max-w-2xl text-center relative z-10">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="font-sans text-2xl md:text-4xl font-bold tracking-tight text-foreground leading-[1.15] mb-3"
          >
            Not sure which solution fits your{" "}
            <span className="font-accent italic font-normal text-[#FF8C38]">
              business?
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-muted-foreground text-sm md:text-base mb-6 max-w-md mx-auto"
          >
            Tell us about your project or current operational bottlenecks. We'll
            help you figure out the exact right strategy.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <DiscussProjectCTA
              colorClassName="bg-primary hover:bg-primary/90 text-white font-medium"
              className="rounded-md h-11 px-7 shadow-md shadow-primary/20"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}

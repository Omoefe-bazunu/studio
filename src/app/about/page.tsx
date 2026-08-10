"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShieldCheck,
  Globe,
  ArrowUpRight,
  CheckCircleIcon,
} from "lucide-react";
import DiscussProjectCTA from "@/components/DiscussProjectCTA";

const STATS = [
  {
    label: "Quality Results",
    icon: CheckCircleIcon,
    color: "text-[#6B46C1]",
  },
  {
    label: "On-Time Delivery",
    icon: Globe,
    color: "text-blue-500",
  },
  {
    label: "Client Focused",
    icon: ShieldCheck,
    color: "text-[#FF8C38]",
  },
];
export default function AboutUs() {
  return (
    <section className="relative py-20 bg-[#0F0A1F] overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#6B46C1]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* 1. IMAGE COMPOSITION */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative group"
          >
            <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/ABOUT.jpeg"
                alt="High-ER Innovation Lab"
                fill
                className="object-cover transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F] via-transparent to-transparent opacity-80" />
            </div>

            {/* Floating Achievement Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#1A142D] border border-white/10 p-6 rounded-2xl shadow-2xl hidden md:block">
              <p className="font-sans text-[10px] font-black uppercase tracking-widest text-[#FF8C38] mb-1">
                Our Core
              </p>
              <p className="font-heading text-xl font-black italic text-white leading-none">
                INDUSTRY <br /> STANDARD
              </p>
            </div>
          </motion.div>

          {/* 2. TEXT CONTENT */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase italic tracking-tight text-white leading-[0.9]">
                Beyond Code. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B46C1] to-[#FF8C38]">
                  Growth-focused Solutions.
                </span>
              </h2>

              <p className="font-sans text-lg text-slate-400 leading-relaxed max-w-2xl font-medium">
                High-ER Enterprises is a digital solutions startup that helps
                high-ticket businesses like yours build a solid digital presence
                that puts your offer in front of customers who are ready to pay.
              </p>
            </motion.div>

            {/* 3. FEATURE METRICS */}
            <div className="grid md:grid-cols-3 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-colors"
                >
                  <stat.icon className={`h-6 w-6 ${stat.color} mb-3`} />
                  <p className="font-sans text-[11px] font-black uppercase tracking-widest text-slate-300 leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* 4. CALL TO ACTION */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="pt-4 flex flex-wrap gap-4"
            >
              <Button
                asChild
                size="lg"
                className="font-sans bg-white text-black hover:bg-white/90 rounded-none h-14 px-10 font-black uppercase italic tracking-tighter transition-all active:scale-95"
              >
                <Link href="/services">
                  Explore Our Services
                  <ArrowUpRight size={18} className="ml-2" />
                </Link>
              </Button>

              <DiscussProjectCTA
                label="Get in Touch"
                colorClassName="font-sans border-white/10 bg-[#6B46C1] text-white hover:bg-[#6B46C1]/90 font-black uppercase italic tracking-tighter"
                className="rounded-none h-14 px-10"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

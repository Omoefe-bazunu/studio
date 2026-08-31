"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Target,
  Zap,
  Activity,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DiscussProjectCTA from "@/components/DiscussProjectCTA";

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const PRINCIPLES = [
  {
    icon: Target,
    title: "Outcomes over output",
    desc: "We don't just ship features. We build digital solutions designed to directly increase your revenue and reduce operational friction.",
  },
  {
    icon: ArrowUpRight,
    title: "Move fast, iterate openly",
    desc: "No black boxes or long waiting periods. You get transparent weekly progress and working software early in the process.",
  },
  {
    icon: Activity,
    title: "Launch is just the start",
    desc: "Most agencies hand off code or a active campaign, and leave. We stick around to optimize performance and tweak campaigns to make sure you get value for money spent.",
  },
];

export default function AboutUs() {
  return (
    <>
      {/* 1. HERO (Light / White Background with Subtle Radial Grid & Glow) */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 bg-background overflow-hidden">
        {/* Ambient indigo glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-primary/[0.05] rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle dot pattern with radial mask */}
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,black_20%,transparent_75%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 md:px-10 max-w-4xl text-center relative z-10">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <p className="font-sans text-xs font-bold tracking-widest uppercase text-primary mb-4">
              About HIGH-ER Enterprises
            </p>
            <h1 className="font-sans text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6 max-w-3xl mx-auto">
              We build software & campaigns that{" "}
              <span className="font-accent italic font-normal text-[#FF8C38]">
                grow your business.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              High-ER Enterprises is a digital solutions startup that builds
              custom software, automate tedious workflows with AI, and run
              high-converting ad campaigns to help your business grow and scale.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-6 h-11 rounded-md font-medium w-full md:w-fit"
              >
                <Link href="/services">
                  Our solutions <ChevronRight className="ml-1.5 h-4 w-4 " />
                </Link>
              </Button>
              <DiscussProjectCTA
                colorClassName="border border-border text-foreground hover:bg-muted font-medium w-full md:w-fit"
                className="rounded-md h-12 px-8"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. OPERATING PRINCIPLES (Dark Purple Section for Contrast) */}
      <section className="py-20 md:py-28 bg-[#120A28] relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent_75%)]"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 md:px-10 max-w-6xl relative z-10">
          <div className="max-w-2xl mb-14 text-center md:text-left">
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-[#7B68F0] mb-3">
              How We Work
            </h2>
            <h3 className="font-sans text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Built with a{" "}
              <span className="font-accent italic font-normal text-[#FF8C38]">
                founder's mindset
              </span>
            </h3>
            <p className="text-[#A79FC4] text-base md:text-lg">
              We treat your product like our own. If a feature or campaign
              doesn't move the needle, we don't spend time on it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {PRINCIPLES.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-[#140f25] border border-white/10 p-8 rounded-2xl hover:border-[#7B68F0]/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#7B68F0]/15 flex items-center justify-center mb-6">
                  <item.icon className="w-5 h-5 text-[#7B68F0]" />
                </div>
                <h4 className="font-sans text-xl font-bold text-white mb-3">
                  {item.title}
                </h4>
                <p className="text-sm text-[#A79FC4] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CLOSING CTA (Light / White Section with Warm Accent Pattern) */}
      <section className="relative py-16 md:py-24 bg-background border-t border-border overflow-hidden">
        {/* Subtle orange accent glow behind CTA */}
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[450px] h-[300px] bg-[#FF8C38]/[0.04] rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Faint dot pattern */}
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent_75%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="font-sans text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15] mb-6"
          >
            Have something <br />
            worth{" "}
            <span className="font-accent italic font-normal text-[#FF8C38]">
              building?
            </span>
          </motion.h2>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto"
          >
            Stop wasting time on manual work and underperforming tools. Let's
            discuss your goals and put together a plan.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-md font-medium"
            >
              <Link href="/services">
                Our solutions
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>

            <DiscussProjectCTA
              colorClassName="border border-border text-foreground hover:bg-muted font-medium"
              className="rounded-md h-12 px-8"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}

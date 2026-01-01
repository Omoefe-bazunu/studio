"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Welcome section" // FIX: Provides a landmark name for the section
      className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0F0A1F]"
    >
      {/* Background and Grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, #6B46C1 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"
        aria-hidden="true"
      />{" "}
      {/* FIX: Hide decorative patterns from screen readers */}
      <div className="relative z-10 px-6 max-w-5xl mx-auto text-center">
        {/* FIX: Sequential Heading (H1 for main page title) */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          High-End Quality. <br />
          <span className="text-[#FF8C38]">Accessible Pricing.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We bridge the gap between excellence and affordability. Scale your
          brand with services designed for maximum impact and precision.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            size="lg"
            asChild
            className="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white px-8 h-14 rounded-full transition-all shadow-lg shadow-purple-500/20"
          >
            {/* FIX: Discernible link name for better context */}
            <Link
              href="/services"
              aria-label="Explore our full range of digital services"
            >
              Explore Services{" "}
              <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="ghost"
            asChild
            className="text-white bg-white/5 px-8 h-14 rounded-full"
          >
            {/* FIX: Clear purpose for the link */}
            <Link
              href="/blog"
              aria-label="Visit our blog for the latest business insights"
            >
              Our Blog
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

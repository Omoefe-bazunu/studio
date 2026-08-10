"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import DiscussProjectCTA from "@/components/DiscussProjectCTA";

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Welcome section"
      className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0F0A1F]"
    >
      {/* Background layer that fades in smoothly on load */}
      <div className="absolute inset-0 animate-in fade-in duration-[2000ms] ease-in-out">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 50%, #6B46C1 0%, transparent 80%)`,
          }}
        />
        <div
          className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none mix-blend-screen"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 px-6 max-w-5xl mx-auto text-center pt-2 animate-in slide-in-from-bottom-4 fade-in duration-1000 ease-out">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Quality Solutions. <br />
          <span className="text-[#FF8C38]">Accessible Pricing.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We partner with you to put your business in front of the right
          audience and get them to take action immediately.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            size="lg"
            asChild
            className="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white px-8 h-14 rounded-full transition-all shadow-[0_0_20px_rgba(107,70,193,0.3)] hover:shadow-[0_0_30px_rgba(107,70,193,0.5)]"
          >
            <Link
              href="/services"
              aria-label="Explore our full range of digital solutions"
            >
              Our Solutions{" "}
              <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>

          <DiscussProjectCTA />
        </div>
      </div>
    </section>
  );
}

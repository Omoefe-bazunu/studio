"use client";

import React from "react";
import {
  Globe,
  ShieldCheck,
  Code2,
  Smartphone,
  Layers,
  Zap,
  ShoppingCart,
} from "lucide-react";

export default function TechStackTicker() {
  const capabilities = [
    { icon: Code2, text: "Modern Web Apps" },
    { icon: Smartphone, text: "Custom Mobile Apps" },
    { icon: Layers, text: "Scalable SaaS Solutions" },
    { icon: ShoppingCart, text: "Tailored Ad Campaigns" },
    { icon: Zap, text: "Lightning Fast Speeds" },
    { icon: Globe, text: "Reliable Cloud Hosting" },
  ];

  return (
    <section className="bg-[#0B0716] py-6 border-y border-white/5 overflow-hidden relative group">
      {/* Edge Fades for smooth entry/exit */}
      <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-[#0B0716] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-[#0B0716] to-transparent z-10 pointer-events-none" />

      <div className="relative flex items-center overflow-hidden">
        {/* Seamless Marquee Wrapper - Added flex-nowrap */}
        <div className="flex flex-nowrap w-max ticker-animation hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, setIdx) => (
            // Added flex-nowrap and shrink-0 to prevent the repeating blocks from squishing
            <div
              key={`set-${setIdx}`}
              className="flex items-center flex-nowrap shrink-0"
            >
              {capabilities.map((item, idx) => (
                <div
                  key={`${setIdx}-${idx}`}
                  // Added flex-nowrap to keep icon, text, and separator on one line
                  className="flex items-center flex-nowrap gap-4 px-12 md:px-16 shrink-0"
                >
                  {/* Added shrink-0 to the icon so it never distorts */}
                  <item.icon className="text-[#6B46C1] w-5 h-5 shrink-0 group-hover:text-[#FF8C38] transition-colors duration-500" />

                  {/* Added whitespace-nowrap to strictly prevent text from breaking into two lines */}
                  <span className="whitespace-nowrap text-xs md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-400">
                    {item.text}
                  </span>

                  {/* Diamond Brand Separators - Added shrink-0 */}
                  <div className="flex gap-1 ml-8 md:ml-12 shrink-0">
                    <div className="w-1 h-1 bg-[#6B46C1]/40 rotate-45 shrink-0" />
                    <div className="w-1 h-1 bg-[#FF8C38]/40 rotate-45 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Inline styles for the zero-config infinite marquee */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-animation {
          animation: ticker 35s linear infinite;
        }
      `,
        }}
      />
    </section>
  );
}

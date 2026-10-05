"use client";

import React from "react";
import {
  Globe,
  Code2,
  Smartphone,
  Layers,
  Zap,
  ShoppingCart,
} from "lucide-react";

export default function TechStackTicker() {
  const capabilities = [
    { icon: Code2, text: "SOFTWARE THAT WORKS" },
    // { icon: Smartphone, text: "APPS PEOPLE" },
    { icon: Layers, text: "APPS BUILT TO SCALE" },
    { icon: ShoppingCart, text: "ADS THAT CONVERT" },
    { icon: Zap, text: "HIGH PERFROMANCE" },
    { icon: Globe, text: "GLOBAL AUDIENCE" },
  ];

  return (
    <section className="bg-[#0B0716] py-6 border-y border-white/5 overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-[#0B0716] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-[#0B0716] to-transparent z-10 pointer-events-none" />

      <div className="relative flex items-center overflow-hidden">
        <div className="flex flex-nowrap w-max ticker-animation hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, setIdx) => (
            <div
              key={`set-${setIdx}`}
              className="flex items-center flex-nowrap shrink-0"
            >
              {capabilities.map((item, idx) => (
                <div
                  key={`${setIdx}-${idx}`}
                  className="flex items-center flex-nowrap gap-3 px-12 md:px-16 shrink-0"
                >
                  <item.icon className="text-[#6B46C1] w-4 h-4 shrink-0 group-hover:text-[#FF8C38] transition-colors duration-500" />
                  <span className="whitespace-nowrap text-sm font-medium text-slate-400">
                    {item.text}
                  </span>
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

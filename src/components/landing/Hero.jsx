"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import DiscussProjectCTA from "@/components/DiscussProjectCTA";

const services = [
  {
    name: "Software",
    desc: "Web and mobile apps built and shipped end to end.",
  },
  {
    name: "AI Automation",
    desc: "Workflows that remove manual work from your team.",
  },
  { name: "Ads", desc: "Campaigns that put your business in front of buyers." },
];

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Welcome section"
      className="relative w-full py-36 md:pt-32 md:pb-24 bg-[#120A28] overflow-hidden"
    >
      <style jsx>{`
        @keyframes hero-pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.75);
          }
        }
        @keyframes hero-ripple {
          0% {
            transform: scale(1);
            opacity: 0.45;
          }
          100% {
            transform: scale(3.2);
            opacity: 0;
          }
        }
        @keyframes orbit-spin {
          to {
            transform: rotate(360deg);
          }
        }
        .hero-node {
          animation: hero-pulse 2.6s ease-in-out infinite;
          transform-origin: center;
        }
        .hero-node-ripple {
          animation: hero-ripple 3s ease-out infinite;
          transform-origin: center;
        }
        .orbit-a {
          animation: orbit-spin 16s linear infinite;
          transform-origin: 200px 200px;
        }
        .orbit-b {
          animation: orbit-spin 22s linear infinite reverse;
          transform-origin: 200px 200px;
        }
        .orbit-c {
          animation: orbit-spin 28s linear infinite;
          transform-origin: 200px 200px;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-node,
          .hero-node-ripple,
          .orbit-a,
          .orbit-b,
          .orbit-c {
            animation: none !important;
          }
        }
      `}</style>

      {/* Dot pattern, faint, only fills in past the copy */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_right,transparent_0%,transparent_45%,black_85%)]"
        aria-hidden="true"
      />

      {/* Orbit graphic, fills the empty right side on desktop */}
      <div
        className="hidden lg:block absolute right-[-20px] top-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
          <circle
            cx="200"
            cy="200"
            r="80"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="200"
            r="150"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          <circle
            cx="200"
            cy="200"
            r="18"
            fill="#7B68F0"
            fillOpacity="0.15"
            className="hero-node-ripple"
          />
          <circle
            cx="200"
            cy="200"
            r="6"
            fill="#7B68F0"
            className="hero-node"
          />

          <g className="orbit-a">
            <circle
              cx="200"
              cy="120"
              r="5"
              fill="#FF8C38"
              className="hero-node"
              style={{ animationDelay: "0.4s" }}
            />
          </g>
          <g className="orbit-b">
            <circle
              cx="320"
              cy="200"
              r="5"
              fill="#A79FC4"
              className="hero-node"
              style={{ animationDelay: "0.8s" }}
            />
          </g>
          <g className="orbit-c">
            <circle
              cx="200"
              cy="350"
              r="4"
              fill="#7B68F0"
              className="hero-node"
              style={{ animationDelay: "1.2s" }}
            />
          </g>
        </svg>
      </div>

      <div className="relative container mx-auto px-6 md:px-10 max-w-6xl">
        <h1 className="font-sans font-medium uppercase text-[2.5rem] leading-[1.15] md:text-6xl md:leading-[1.1] tracking-tight text-white max-w-2xl">
          Software, AI automation,{" "}
          <span className="font-accent lowercase italic font-normal">and </span>
          <span className="font-sans uppercase font-normal text-[#FF8C38]">
            ads
          </span>{" "}
          <span className="font-accent lowercase italic font-normal">to </span>{" "}
          <br />
          <span className="font-accent lowercase italic font-normal text-[#FF8C38]">
            grow your business.
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-[#A79FC4] max-w-lg leading-relaxed">
          We partner with you to put your business in front of the right
          audience and get them to take action.
        </p>

        <div className="mt-8 flex md:items-center gap-4 flex-col md:flex-row">
          <Button
            size="lg"
            asChild
            className="bg-[#7B68F0] hover:bg-[#6C5AE0] text-white px-6 h-11 rounded-md font-medium"
          >
            <Link
              href="/services"
              aria-label="Explore our full range of digital solutions"
            >
              Our solutions{" "}
              <ChevronRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <DiscussProjectCTA />
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Megaphone,
  PenTool,
  Settings2,
} from "lucide-react";
import DiscussProjectCTA from "@/components/DiscussProjectCTA";

const servicesData = [
  {
    id: "web-development",
    title: "Web & SaaS Development",
    description:
      "High-performance websites and scalable software platforms engineered to establish a powerful online presence and drive operational growth.",
    icon: Code2,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    hoverBorder: "hover:border-primary/50",
    hoverShadow: "hover:shadow-[0_0_40px_-10px_rgba(107,70,193,0.2)]",
    accentBar: "bg-primary",
    cta: "See Web Projects",
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description:
      "Custom native and cross-platform mobile applications that deliver seamless, engaging experiences right to your customers' fingertips.",
    icon: Smartphone,
    iconColor: "text-[#FF8C38]",
    iconBg: "bg-[#FF8C38]/10",
    hoverBorder: "hover:border-[#FF8C38]/50",
    hoverShadow: "hover:shadow-[0_0_40px_-10px_rgba(255,140,56,0.2)]",
    accentBar: "bg-[#FF8C38]",
    cta: "See Mobile Projects",
  },
  {
    id: "paid-ads",
    title: "Paid Ads Management",
    description:
      "Strategic ad campaigns across major platforms designed to put your business directly in front of your target customers and drive immediate action.",
    icon: Megaphone,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    hoverBorder: "hover:border-primary/50",
    hoverShadow: "hover:shadow-[0_0_40px_-10px_rgba(107,70,193,0.2)]",
    accentBar: "bg-primary",
    cta: "See Ad Results",
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    description:
      "Intelligent AI-powered workflows and tools that automate your invoicing, customer support, and repetitive tasks so you can focus on scaling your enterprise.",
    icon: Settings2,
    iconColor: "text-[#FF8C38]",
    iconBg: "bg-[#FF8C38]/10",
    hoverBorder: "hover:border-[#FF8C38]/50",
    hoverShadow: "hover:shadow-[0_0_40px_-10px_rgba(255,140,56,0.2)]",
    accentBar: "bg-[#FF8C38]",
    cta: "See Automation Projects",
  },
  // {
  //   id: "marketing-ads-design",
  //   title: "Marketing & Ads Design",
  //   description:
  //     "Scroll-stopping creatives, banners, and campaign visuals crafted to strengthen your brand identity and maximize the impact of every ad you run.",
  //   icon: PenTool,
  //   iconColor: "text-primary",
  //   iconBg: "bg-primary/10",
  //   hoverBorder: "hover:border-primary/50",
  //   hoverShadow: "hover:shadow-[0_0_40px_-10px_rgba(107,70,193,0.2)]",
  //   accentBar: "bg-primary",
  // },
];

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide logic
  useEffect(() => {
    if (isHovered) return;

    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % servicesData.length);
    }, 4000);

    return () => clearInterval(slideInterval);
  }, [isHovered]);

  return (
    <section className="py-16 md:py-20 bg-background relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236B46C1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
        {/* Centered Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-heading text-xs md:text-sm font-bold tracking-widest uppercase text-primary mb-2">
            What We Do
          </h2>
          <h3 className="font-heading text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Comprehensive Digital <br />
            <span className="text-[#FF8C38]">Solutions Built for Growth</span>
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            From crafting the perfect digital storefront to managing the
            campaigns that bring customers through the door, we handle your
            entire online ecosystem.
          </p>
        </div>

        {/* Centered Auto-Slider */}
        <div
          className="max-w-2xl mx-auto overflow-hidden rounded-[2rem] cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {servicesData.map((service) => (
              <div key={service.id} className="w-full shrink-0 px-2 pb-6 pt-2">
                <div
                  className={`group relative h-full bg-card border border-border p-8 md:p-12 rounded-[2rem] transition-all duration-500 overflow-hidden ${service.hoverBorder} ${service.hoverShadow}`}
                >
                  {/* Animated Top Accent Bar */}
                  <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-0 h-1.5 ${service.accentBar} transition-all duration-500 group-hover:w-full`}
                  />

                  {/* Icon Container */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h4 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <Link
                    href={`/services/${service.id}`}
                    className={`inline-flex items-center text-xs font-bold uppercase tracking-widest text-foreground transition-colors ${service.iconColor.replace(
                      "text-",
                      "hover:text-",
                    )}`}
                  >
                    {service.cta}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centered Circular Progress Indicators */}
        <div className="flex items-center justify-center gap-3 mt-2">
          {servicesData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-500 rounded-full ${
                currentIndex === idx
                  ? "w-8 h-2.5 bg-[#FF8C38]"
                  : "w-2.5 h-2.5 bg-muted hover:bg-primary/50"
              }`}
              aria-label={`Go to service slide ${idx + 1}`}
            />
          ))}
        </div>
        {/* Section-closing CTA */}
        <div className="mt-12 flex flex-col items-center text-center gap-4">
          <p className="text-sm text-muted-foreground">
            Not sure which solution fits your business?
          </p>
          <DiscussProjectCTA colorClassName="text-white bg-primary hover:bg-primary/90 border border-primary" />
        </div>
      </div>
    </section>
  );
}

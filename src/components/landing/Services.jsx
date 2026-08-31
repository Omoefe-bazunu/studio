"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Megaphone,
  Settings2,
} from "lucide-react";
import DiscussProjectCTA from "@/components/DiscussProjectCTA";

const servicesData = [
  {
    id: "web-development",
    title: "Websites & SaaS",
    description:
      "We help you build the website that markets your business 24/7 and convert visitors to customers",
    icon: Code2,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    hoverBorder: "hover:border-primary/40",
    cta: "See the work",
  },
  {
    id: "mobile-app-development",
    title: "Mobile Apps",
    description:
      "We help you build the app that your customers would enjoy using, both on Android and iOS.",
    icon: Smartphone,
    iconColor: "text-[#FF8C38]",
    iconBg: "bg-[#FF8C38]/10",
    hoverBorder: "hover:border-[#FF8C38]/40",
    cta: "See the work",
  },
  {
    id: "paid-ads",
    title: "Ads That Sell",
    description:
      "We help you set up and manage ads that bring paying customers, and not just clicks.",
    icon: Megaphone,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    hoverBorder: "hover:border-primary/40",
    cta: "See results",
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    description:
      "We automate the repetitive stuff — replies, invoices, follow-ups, etc to save you cost and make you deliver faster and better.",
    icon: Settings2,
    iconColor: "text-[#FF8C38]",
    iconBg: "bg-[#FF8C38]/10",
    hoverBorder: "hover:border-[#FF8C38]/40",
    cta: "See the work",
  },
];

export default function Services() {
  const [itemsPerView, setItemsPerView] = useState(2);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () =>
      setItemsPerView(window.innerWidth < 1024 ? 1 : 2);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageCount = Math.ceil(servicesData.length / itemsPerView);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    if (isHovered || pageCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % pageCount);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, pageCount]);

  return (
    <section className="py-16 md:py-20 bg-background relative overflow-hidden">
      <div
        className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-primary/[0.06] rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(107,70,193,0.14)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_20%,black,transparent_75%)] dark:bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)]"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 md:px-10 max-w-6xl relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left: text + CTA */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <h2 className="font-sans text-xs md:text-sm font-bold tracking-widest uppercase text-primary mb-2">
              Work With Us.
            </h2>
            <h3 className="font-sans text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
              Everything Your Business Needs{" "}
              <span className="font-accent italic text-[#FF8C38]">to Grow</span>
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Your business should be milking digital tools to fetch you money
              and build your brand. We help make sure of that with the right
              solutions.
            </p>

            <div className="mt-8 flex flex-col items-center lg:items-start gap-4">
              <DiscussProjectCTA colorClassName="text-white bg-primary hover:bg-primary/90 hover:text-white/90 border border-primary" />
              <p className="text-sm text-muted-foreground">
                Not sure which solution fits your business?
              </p>
            </div>
          </div>

          {/* Right: sliding, 2-up on desktop, 1-up on mobile */}
          <div className="mt-12 lg:mt-0">
            <div
              className="overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: pageCount }).map((_, pageIdx) => (
                  <div
                    key={pageIdx}
                    className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-5"
                  >
                    {servicesData
                      .slice(
                        pageIdx * itemsPerView,
                        pageIdx * itemsPerView + itemsPerView,
                      )
                      .map((service) => (
                        <div
                          key={service.id}
                          className={`group bg-card border border-border p-6 rounded-2xl transition-colors duration-300 ${service.hoverBorder}`}
                        >
                          <div
                            className={`w-11 h-11 rounded-xl ${service.iconBg} flex items-center justify-center mb-5`}
                          >
                            <service.icon
                              className={`w-5 h-5 ${service.iconColor}`}
                            />
                          </div>

                          <h4 className="font-sans text-lg font-bold text-foreground mb-2">
                            {service.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                            {service.description}
                          </p>

                          <Link
                            href={`/services/${service.id}`}
                            className={`inline-flex items-center text-sm font-medium text-foreground transition-colors ${service.iconColor.replace(
                              "text-",
                              "hover:text-",
                            )}`}
                          >
                            {service.cta}
                            <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            {pageCount > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                {Array.from({ length: pageCount }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-500 rounded-full ${
                      currentIndex === idx
                        ? "w-8 h-2.5 bg-[#FF8C38]"
                        : "w-2.5 h-2.5 bg-muted hover:bg-primary/50"
                    }`}
                    aria-label={`Go to services page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

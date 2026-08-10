"use client";

import React from "react";
import Link from "next/link";
import { Code2, Smartphone, Megaphone, Bot, Target } from "lucide-react";

const services = [
  {
    id: "web-saas",
    title: "Web & SaaS Development",
    icon: Code2,
    href: "/services/web-development",
    description:
      "High-performance websites and scalable SaaS platforms engineered for growth and complex business logic.",
    features: [
      "Custom Web Apps",
      "SaaS Architecture",
      "E-commerce Solutions",
      "Cloud Infrastructure",
    ],
  },
  {
    id: "paid-ads",
    title: "Paid Ads",
    icon: Target,
    href: "/services/paid-ads",
    description:
      "Data-driven ad campaigns that put your brand in front of the right audience and drive measurable ROI.",
    features: ["Google Ads", "Meta Ads", "Campaign Strategy", "ROI Tracking"],
  },
  {
    id: "mobile",
    title: "Mobile Apps",
    icon: Smartphone,
    href: "/services/mobile-app-development",
    description:
      "Native and cross-platform apps that deliver seamless, engaging mobile experiences.",
    features: [
      "iOS & Android Apps",
      "UI/UX Design",
      "Performance Tuning",
      "App Store Launch",
    ],
  },
  // {
  //   id: "marketing-design",
  //   title: "Marketing & Design",
  //   icon: Megaphone,
  //   href: "/services/marketing-ads-design",
  //   description:
  //     "Eye-catching visuals and creative strategy that strengthen your brand across every channel.",
  //   features: [
  //     "Social Media Ads",
  //     "Creative Design",
  //     "Brand Strategy",
  //     "Content Marketing",
  //   ],
  // },
  {
    id: "ai-automation",
    title: "AI Automation",
    icon: Bot,
    href: "/services/ai-automation",
    description:
      "Intelligent AI-powered workflows that automate repetitive tasks and streamline your business operations.",
    features: [
      "Workflow Automation",
      "AI Chatbots",
      "Process Optimization",
      "Custom Integrations",
    ],
  },
];

export default function ServicesPage() {
  return (
    <section className="py-12 bg-[#0F0A1F] min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-6">
            Our Solutions
          </h1>
          <div className="w-20 h-1 bg-[#FF8C38] mx-auto" />
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Link key={service.id} href={service.href} className="group">
              <div className="h-full bg-[#1A142D] border border-white/5 hover:border-[#6B46C1]/50 p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#6B46C1]/20 rounded-xl text-[#FF8C38] group-hover:bg-[#6B46C1]/40 transition-colors">
                    <service.icon size={28} />
                  </div>
                  <h2 className="font-heading text-2xl font-black italic text-white uppercase tracking-tighter">
                    {service.title}
                  </h2>
                </div>

                <p className="font-sans text-slate-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-slate-500 text-sm font-sans"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C38] shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <span className="text-white group-hover:text-[#FF8C38] text-xs font-black uppercase tracking-widest transition-colors">
                    View Projects →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

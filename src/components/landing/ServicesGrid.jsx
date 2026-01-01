"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  CheckCircle,
  Monitor,
  Smartphone,
  Layers,
  Megaphone,
  ArrowRight,
} from "lucide-react";

const servicesData = [
  {
    id: "web-development",
    title: "Website Development",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/high-481fd.firebasestorage.app/o/web.jpeg?alt=media&token=39f65ff8-5599-4b65-bfd3-af93e9e6c5c8",
    features: [
      "Custom Web Applications",
      "E-commerce Solutions",
      "Performance Optimization",
      "SEO-Ready Architecture",
    ],
    icon: Monitor,
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/high-481fd.firebasestorage.app/o/result_0.png?alt=media&token=7a2887be-b90b-4bed-87aa-c3f0556f8fc7",
    features: [
      "iOS & Android Apps",
      "React Native / Flutter",
      "Seamless UI/UX Design",
      "App Store Deployment",
    ],
    icon: Smartphone,
  },
  {
    id: "saas-development",
    title: "SaaS Development",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/high-481fd.firebasestorage.app/o/result_0%20(1).png?alt=media&token=2b9dad87-5998-476e-b19a-726c43d13003",
    features: [
      "Scalable Cloud Infrastructure",
      "Multi-tenant Architecture",
      "API & Third-party Integration",
      "Subscription Systems",
    ],
    icon: Layers,
  },
  {
    id: "marketing-ads-design",
    title: "Marketing & Ads Design",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/high-481fd.firebasestorage.app/o/design.jpeg?alt=media&token=221c0f32-421c-4f14-85bb-4dc5d4243221",
    features: [
      "Targeted Ad Campaigns",
      "Compelling Visual Assets",
      "Conversion Copywriting",
      "Analytics & Tracking",
    ],
    icon: Megaphone,
  },
];

export default function ServicesGrid() {
  return (
    <section
      id="services"
      className="py-20 bg-slate-50"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 px-3 py-1 text-[#6B46C1] text-xs font-bold uppercase tracking-wider mb-4">
            Our Expertise
          </p>
          {/* FIX: Explicit ID for section labeling */}
          <h2
            id="services-heading"
            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
          >
            Tailored Tech Solutions
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            We build high-performance digital products designed to scale your
            brand and dominate your market.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {servicesData.map((service, index) => (
            <Card
              key={service.id}
              className="group border-none shadow-xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden flex flex-col bg-white hover:translate-y-[-5px] transition-all duration-300"
            >
              <CardHeader className="p-0 relative h-72 w-full overflow-hidden">
                <Image
                  src={service.imageSrc}
                  alt={`Illustration of ${service.title} services`} // FIX: More descriptive alt text
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  {...(index < 2 ? { priority: true } : {})} // FIX: Priority for first row to improve LCP
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // FIX: Performance (responsive sizing)
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F]/80 via-transparent to-transparent" />

                {/* Floating Icon */}
                <div
                  className="absolute bottom-6 left-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl"
                  aria-hidden="true"
                >
                  <service.icon className="h-8 w-8 text-white" />
                </div>
              </CardHeader>

              <CardContent className="p-8 md:p-10 flex-grow">
                {/* FIX: Ensure CardTitle is an H3 for heading hierarchy */}
                <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  <h3 className="inline">{service.title}</h3>
                </CardTitle>

                <ul className="space-y-4 mt-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle
                        className="h-5 w-5 text-[#FF8C38] mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-slate-600 font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="px-8 pb-10 pt-0 flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 rounded-full border-slate-200 h-14 font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5a3aaa]"
                >
                  {/* FIX: Accessible name for links */}
                  <Link
                    href={`/services/${service.id}`}
                    aria-label={`View portfolio for ${service.title}`}
                  >
                    View Portfolio
                  </Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 rounded-full bg-[#6B46C1] hover:bg-[#5a3aaa] h-14 font-bold text-white shadow-lg shadow-purple-500/20"
                >
                  <Link
                    href={`/contact?service=${service.id}`}
                    className="flex items-center gap-2"
                    aria-label={`Start project for ${service.title}`}
                  >
                    Start Project{" "}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

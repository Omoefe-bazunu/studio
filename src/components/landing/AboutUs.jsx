"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Zap, Award } from "lucide-react";
// import { motion } from "framer-motion"; // Optional: For that premium feel

const COMMITMENTS = [
  {
    title: "Quality & Excellence",
    description:
      "Delivering top-tier services that meet the highest standards of quality and performance.",
    icon: Award,
  },
  {
    title: "Innovation & Affordability",
    description:
      "Combining innovative solutions with cost-effective strategies to maximize your ROI.",
    icon: Zap,
  },
  {
    title: "Client-Centric Approach",
    description:
      "Collaborating closely with you to understand your vision and achieve your objectives.",
    icon: Users,
  },
];

export default function AboutUs() {
  return (
    <section
      className="py-12 lg:py-24 bg-background"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2
                id="about-heading"
                className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl"
              >
                About Us
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At{" "}
                <span className="font-bold text-primary">
                  High-ER Enterprises
                </span>
                , we bridge the gap between high-end innovation and
                accessibility. We believe top-tier digital solutions shouldn't
                be out of reach for growing brands.
              </p>
              <p className="text-muted-foreground/90 leading-relaxed">
                Our mission is simple: to deliver precision-engineered
                <span className="text-[#FF8C38] font-semibold">
                  {" "}
                  Web, Mobile, and SaaS products{" "}
                </span>
                paired with high-conversion marketing design. We don't just
                build software; we build the digital foundation for your
                success.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary">
                Our Commitment
              </h3>

              <div className="grid gap-6">
                {COMMITMENTS.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 p-2.5 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                      <item.icon
                        className="h-6 w-6 text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                <Link
                  href="/services"
                  aria-label="Explore our full range of digital services"
                >
                  Explore Our Services
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Composition */}
          <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/high-481fd.firebasestorage.app/o/1764192977932-01.jpeg?alt=media&token=82df12f0-e3c0-40ef-ac58-ee43a4e4ca13"
              alt="High-ER Enterprises team collaborating on high-end digital innovation in a modern office"
              fill
              priority // Since this is a major section, priority loading helps LCP
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Elegant overlay for text readability if you add any text over image later */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-60"
              aria-hidden="true"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

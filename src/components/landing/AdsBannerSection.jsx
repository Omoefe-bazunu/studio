"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdsBannerSection() {
  return (
    <div>
      {/* Container with Orange Background */}
      <div className="relative w-full hidden overflow-hidden bg-[#FF8C38] p-8 shadow-xl">
        {/* Decorative background glows - using dark purple to create depth on orange */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0F0A1F]/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />

        <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row max-w-7xl mx-auto">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#0F0A1F] md:text-3xl leading-none">
                Shop <span className="text-white">Amazing</span> Products.
              </h2>
              <p className="mt-2 text-sm font-medium text-[#0F0A1F]/80 max-w-xl">
                Explore our shop for products that matches your needs. From
                digital to physical products, we have carefully selected every
                item on the list to give you premium value for your money.
              </p>
            </div>
          </div>

          <Button
            asChild
            className="h-14 rounded-full bg-[#0F0A1F] px-10 text-xs font-black uppercase italic tracking-widest text-white hover:bg-[#1a142e] transition-all active:scale-95 shadow-xl"
          >
            <Link href="/shop">
              Explore Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

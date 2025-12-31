"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { servicesNavData } from "@/data/servicesNavData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ServicesSubNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[64px] z-40 w-full border-y border-slate-200 bg-white/90 backdrop-blur-md transition-all">
      <div className="container mx-auto max-w-7xl px-4 py-4 md:py-0 md:h-20 flex items-center justify-center">
        {/* Changed from overflow-x-auto to flex-wrap for "at a glance" visibility */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full">
          {servicesNavData.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.id}
                asChild
                variant="ghost"
                className={cn(
                  "text-xs md:text-sm font-bold px-4 md:px-8 h-10 md:h-12 rounded-full transition-all border",
                  isActive
                    ? "bg-[#6B46C1] text-white border-[#6B46C1] shadow-lg shadow-purple-500/20 hover:bg-[#5a3aaa] hover:text-white"
                    : "text-slate-500 border-transparent hover:border-slate-200 hover:bg-slate-50 hover:text-[#6B46C1]"
                )}
              >
                <Link href={item.href}>{item.title}</Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

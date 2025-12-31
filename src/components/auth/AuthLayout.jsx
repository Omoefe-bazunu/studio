"use client";

import React from "react";
import Link from "next/link";

export default function AuthLayout({ children, title, description }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Subtle brand glow in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#6B46C1]/20 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-3 text-slate-500 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Auth Card Container */}
        <div className="bg-white p-10 shadow-2xl shadow-purple-900/5 rounded-[2.5rem] border border-slate-100">
          {children}
        </div>

        {/* Minimalist Footer Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#6B46C1] transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

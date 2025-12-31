"use client";

import React from "react";
import ContactForm from "./ContactForm";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, Send } from "lucide-react";
import Link from "next/link";

export default function ContactPageContent() {
  const whatsappNumber = "+2349043970401";
  const whatsappMessage =
    "Hello HIGH-ER ENTERPRISES, I'm interested in your services.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section className="py-8 lg:py-16 bg-slate-50 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2  text-[#6B46C1] text-xs font-bold uppercase tracking-wider mb-4">
            Let's Connect
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Ready to <span className="text-[#6B46C1]">Elevate</span> Your Brand?
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Whether you need a custom SaaS solution or high-converting ad
            designs, we're ready to build your vision. Reach out today.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Contact Form Card */}
          <div className="md:col-span-3 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-purple-500/5 border border-slate-100">
            <ContactForm />
          </div>

          {/* Quick Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-[#0F0A1F] text-white p-8 rounded-[2.5rem] shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#FF8C38]" />
                Direct Support
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Prefer a faster conversation? Our team is active on WhatsApp for
                instant consultations and project quotes.
              </p>

              <Button
                asChild
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full h-14 font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-105"
              >
                <Link
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </Link>
              </Button>
            </div>

            <div className="p-8 border border-slate-200 rounded-[2.5rem] bg-white/50 backdrop-blur-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Average Response Time
              </p>
              <p className="text-2xl font-bold text-slate-900">
                Under 30 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

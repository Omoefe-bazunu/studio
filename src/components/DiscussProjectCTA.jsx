"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, X, ArrowUpRight } from "lucide-react";

const contactOptions = [
  {
    id: "email",
    label: "Email",
    description: "projects@higherenterprises.co.uk",
    icon: Mail,
    href: "mailto:projects@higherenterprises.co.uk?subject=Project%20Inquiry",
  },
  {
    id: "call",
    label: "Call",
    description: "+234 904 397 0401",
    icon: Phone,
    href: "tel:+2349043970401",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Chat with us instantly",
    icon: MessageCircle,
    href: "https://wa.me/2349043970401?text=Hello%20HIGH-ER%20ENTERPRISES%2C%20I%27d%20like%20to%20discuss%20a%20project.",
  },
];

function ContactModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Contact options"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-[#150F26] border border-white/10 rounded-3xl p-8 animate-in zoom-in-95 fade-in duration-200 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-2">
          Let's discuss your project
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Choose how you'd like to reach us — we respond fast.
        </p>

        <div className="flex flex-col gap-3">
          {contactOptions.map((option) => (
            <a
              key={option.id}
              href={option.href}
              target={option.id === "whatsapp" ? "_blank" : undefined}
              rel={option.id === "whatsapp" ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#6B46C1]/50 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-[#6B46C1]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <option.icon className="w-5 h-5 text-[#FF8C38]" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">
                  {option.label}
                </p>
                <p className="text-slate-400 text-xs">{option.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Reusable "Discuss Project" CTA button + contact modal.
 *
 * @param {Object} props
 * @param {string} [props.colorClassName] - Tailwind classes controlling the
 *   button's color/background/border, so it can be adapted per-section
 *   background. Defaults to the dark-hero ghost style.
 * @param {string} [props.label] - Button text. Defaults to "Discuss Project".
 * @param {string} [props.className] - Extra classes merged onto the button
 *   (layout, spacing overrides) without touching color.
 */
export default function DiscussProjectCTA({
  colorClassName = "text-white bg-white/5 hover:bg-white/10 border hover:text-white border-white/10",
  label = "Discuss Project",
  className = "",
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        variant="ghost"
        onClick={() => setModalOpen(true)}
        aria-label="Discuss your project with us"
        className={`px-8 h-14 transition-all backdrop-blur-sm ${colorClassName} rounded-full ${className}`}
      >
        {label}
        <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Button>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

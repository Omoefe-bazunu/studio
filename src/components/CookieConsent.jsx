"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          // Reduced max-width from md to sm (approx 384px)
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[100]"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-100 p-4 md:p-5 relative overflow-hidden">
            {/* Thinner accent bar */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />

            <div className="flex items-start gap-3">
              <div className="bg-accent/10 p-1.5 rounded-lg shrink-0">
                <Cookie className="h-5 w-5 text-accent" />
              </div>

              <div className="space-y-2.5">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Cookie Settings
                  </h4>
                  <p className="text-xs text-slate-500 leading-normal">
                    We use cookies to improve your experience. By clicking
                    "Accept", you agree to our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-primary font-medium underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleAccept}
                    size="sm"
                    className="bg-primary hover:bg-orange-500 text-white flex-1 text-xs h-8"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    size="sm"
                    className="border-slate-200 text-slate-600 hover:bg-purple-600 hover:text-white flex-1 text-xs h-8"
                  >
                    Decline
                  </Button>
                </div>
              </div>

              <button
                onClick={() => setIsVisible(false)}
                className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

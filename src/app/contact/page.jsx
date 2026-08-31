"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Loader2,
  ArrowRight,
  MessageCircle,
  Clock,
  CheckCircle2,
  Zap,
  ArrowBigRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_LINK =
  "https://wa.me/2349043970401?text=Hello%20HIGH-ER%20ENTERPRISES,%20I%27m%20interested%20in%20building%20a%20project%20with%20you.";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message received",
        description: "We will review your inquiry and respond shortly.",
      });
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <section className="py-28 bg-background text-foreground min-h-[90vh] flex items-center">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header Section */}
        <div className=" mb-12 items-center justify-center flex flex-col">
          <div className="inline-flex items-center gap-2 py-1 rounded-full text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Get in Touch with Us
          </div>
          <h1 className="font-sans text-center text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Let's Discuss <br />
            <span className="font-accent italic font-normal text-[#FF8C38]">
              Your Project
            </span>
          </h1>
          <p className="mt-3 max-w-lg text-center  text-muted-foreground text-base md:text-lg leading-relaxed">
            Do you have questions to help you decide to work with us? We are
            waiting to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Main Contact Form */}
          <div className="md:col-span-7 bg-card border border-border/80 shadow-sm p-6 sm:p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
                >
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-xl h-11 border-border/80 focus:border-primary bg-background"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
                >
                  Work Email
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-xl h-11 border-border/80 focus:border-primary bg-background"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
                >
                  Project Details / What are you building?
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your product, timeline, or scope..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="rounded-xl border-border/80 focus:border-primary bg-background resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Submit Inquiry <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Direct Support & Expectations Side Panel */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Direct Instant Messaging Card */}
            <div className="bg-card border border-border/80 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5 fill-current" />{" "}
                    Instant Response
                  </div>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                  Need a faster answer?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Skip the inbox queue and chat directly with our team on
                  WhatsApp for quick technical evaluations.
                </p>
              </div>

              <Button
                asChild
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl h-12 font-bold text-sm shadow-md transition-all active:scale-[0.99]"
              >
                <Link
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" /> Start
                  Instant Chat
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

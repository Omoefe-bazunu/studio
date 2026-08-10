"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_LINK =
  "https://wa.me/2349043970401?text=Hello%20HIGH-ER%20ENTERPRISES,%20I%27m%20interested%20in%20your%20services.";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending without any actual service/database calls
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you shortly.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 mb-6">
            Let's <span className="text-[#6B46C1]">Grow</span> Together
          </h1>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="md:col-span-3 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="rounded-xl"
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded-xl"
              />
              <Input
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="rounded-xl"
              />
              <Textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="rounded-xl resize-none"
                rows={4}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6B46C1] hover:bg-[#5a3aaa] rounded-full h-12 font-bold"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* WhatsApp Redirect */}
          <div className="md:col-span-2">
            <div className="bg-[#0F0A1F] text-white p-8 rounded-[2rem] shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#FF8C38]" /> Direct Support
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Need a faster response? Reach us on WhatsApp.
              </p>
              <Button
                asChild
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] rounded-full h-12 font-bold"
              >
                <Link
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" /> Chat Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

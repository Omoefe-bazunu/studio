"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Send, Loader2, Mail, CheckCircle2, XCircle, X } from "lucide-react";

export default function Newsletter() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Smart Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    status: "success", // "success" | "error"
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct Firebase Call
      await addDoc(collection(db, "newsletterSubscribers"), {
        name: formData.name,
        email: formData.email,
        subscribedAt: serverTimestamp(),
      });

      setModal({
        isOpen: true,
        status: "success",
        title: "Subscribed Successfully!",
        description:
          "Welcome to the HIGH-ER community. Keep an eye on your inbox for our latest updates.",
      });
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error("Subscription error:", error);
      setModal({
        isOpen: true,
        status: "error",
        title: "Subscription Failed",
        description: "Something went wrong on our end. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Smart Success/Failure Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Blurred Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative z-10 bg-card border border-border rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl transform transition-all">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-6">
              {modal.status === "success" ? (
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
              )}
            </div>

            <h2 className="text-2xl font-black italic tracking-tight text-foreground mb-2">
              {modal.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {modal.description}
            </p>

            <button
              onClick={closeModal}
              className={`w-full h-14 rounded-xl font-black uppercase italic tracking-widest text-white transition-all active:scale-[0.98] ${
                modal.status === "success"
                  ? "bg-[#6B46C1] hover:bg-[#5a3aaa]"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {modal.status === "success" ? "Awesome!" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* Main Newsletter Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#0F0A1F] dark:border-t-2 dark:border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="bg-[#0F0A1F] rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl border border-white/5">
            {/* Decorative Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6B46C1]/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF8C38]/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              {/* Text Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FF8C38] text-xs font-bold uppercase tracking-widest mb-6">
                  <Mail className="w-4 h-4" /> Stay Updated
                </div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-4">
                  JOIN OUR <span className="text-[#6B46C1]">NEWSLETTER</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  Get exclusive insights on business growth, digital solutions,
                  and practical marketing strategies delivered straight to your
                  inbox.
                </p>
              </div>

              {/* Form */}
              <div className="bg-[#1A142D] p-8 rounded-3xl border border-white/5 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your First Name"
                      required
                      className="w-full bg-[#0F0A1F] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6B46C1] transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                      className="w-full bg-[#0F0A1F] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6B46C1] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF8C38] hover:bg-[#e67e32] text-[#0F0A1F] h-14 rounded-xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Subscribe Now <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
                <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                  No spam. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

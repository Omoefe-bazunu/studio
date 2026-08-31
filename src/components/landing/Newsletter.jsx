"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Send, Loader2, CheckCircle2, XCircle, X } from "lucide-react";

export default function Newsletter() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const [modal, setModal] = useState({
    isOpen: false,
    status: "success",
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
      await addDoc(collection(db, "newsletterSubscribers"), {
        name: formData.name,
        email: formData.email,
        subscribedAt: serverTimestamp(),
      });

      setModal({
        isOpen: true,
        status: "success",
        title: "You're subscribed",
        description:
          "We'll send updates on new features and things we've shipped.",
      });
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error("Subscription error:", error);
      setModal({
        isOpen: true,
        status: "error",
        title: "Something went wrong",
        description: "We couldn't subscribe you right now — please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative z-10 bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-5">
              {modal.status === "success" ? (
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-red-500" />
                </div>
              )}
            </div>

            <h2 className="font-sans text-xl font-bold text-foreground mb-2">
              {modal.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {modal.description}
            </p>

            <button
              onClick={closeModal}
              className="w-full h-11 rounded-md font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              {modal.status === "success" ? "Done" : "Close"}
            </button>
          </div>
        </div>
      )}

      <section className="py-16 md:py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 md:px-10 max-w-5xl">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-sans text-2xl md:text-3xl font-bold text-primary mb-3 tracking-tight">
                  Subscribe to our{" "}
                  <span className="font-accent text-3xl md:text-4xl italic font-normal text-[#FF8C38]">
                    Newsletter
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  Occasional updates on new features, projects we've shipped,
                  and practical tips for growing your business online.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Subscribe <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

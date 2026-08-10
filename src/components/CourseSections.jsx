"use client";

import { useState, useEffect } from "react";
import { COLORS, PRICING, COURSE_DETAILS } from "../config/settings";

/* ───────── HERO ───────── */
export function Hero({ onCheckoutClick }) {
  return (
    <section className="relative pt-12 pb-24 px-5 overflow-hidden bg-[#F8FAF7] dark:bg-slate-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 text-emerald-800 text-sm font-medium px-4 py-1.5 rounded-full mb-8 shadow-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Smartphone-friendly • Lifetime access
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] uppercase font-extrabold leading-[1.12] tracking-tight mb-6 text-slate-900">
          Stop sending CVs
          <br />
          <span className="text-emerald-700">that get ignored</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
          A practical system that shows you how to find real jobs, create
          tailored applications with AI, and actually get interviews — entirely
          from your phone.
        </p>

        <button
          onClick={onCheckoutClick}
          className="w-full sm:w-auto px-9 py-4 rounded-full font-bold text-lg text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          style={{ backgroundColor: COLORS.accent }}
        >
          Get Instant Access — ₦{PRICING.current.toLocaleString()}
        </button>

        <p className="text-sm text-slate-500 mt-6">
          One-time payment · Lifetime access · 7-day money-back guarantee
        </p>
      </div>
    </section>
  );
}

/* ───────── PROBLEM ───────── */
export function Problem() {
  const pains = [
    { icon: "😩", text: "You send out CV after CV and almost never hear back" },
    {
      icon: "🕵️",
      text: "You waste time on job sites that are full of dead or fake listings",
    },
    {
      icon: "🤖",
      text: "Your CV gets rejected by robots before any human sees it",
    },
    {
      icon: "💸",
      text: "You’ve paid someone to write your CV and still got no results",
    },
  ];

  return (
    <section className="py-16 px-5 bg-white dark:bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-sm font-bold tracking-[3px] uppercase text-center mb-4 text-slate-500">
          Does This Sound Like You?
        </h2>
        <p className="text-center text-emerald-700 uppercase sm:text-4xl font-extrabold mb-12 leading-tight">
          You’re not the problem. The way most people apply is.
        </p>

        <div className="space-y-3">
          {pains.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100"
            >
              <span className="text-xl mt-0.5">{item.icon}</span>
              <p className="text-slate-700 leading-relaxed text-[15px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SOLUTION ───────── */
export function Solution({ onCheckoutClick }) {
  return (
    <section
      className="py-20 px-5 dark:bg-slate-950"
      style={{ backgroundColor: COLORS.primary }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-sm font-bold tracking-[3px] uppercase text-emerald-200 mb-5">
          The Solution
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold mb-6 text-white leading-tight">
          A CLEAR SYSTEM THAT ACTUALLY WORKS
        </h3>
        <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          This course gives you a simple, repeatable process to create strong
          applications and apply the right way — even if all you have is a
          smartphone.
        </p>
        <button
          onClick={onCheckoutClick}
          className="px-9 py-4 rounded-full font-bold text-white shadow-md hover:scale-[1.02] transition"
          style={{ backgroundColor: COLORS.accent }}
        >
          I want this system
        </button>
      </div>
    </section>
  );
}

/* ───────── CURRICULUM (One card per row + alternating colors) ───────── */
export function Curriculum({ onCheckoutClick }) {
  const modules = [
    {
      num: "01",
      title: "Find Legitimate Jobs",
      desc: "Discover trusted sources and learn how to instantly spot scams and dead listings.",
      image:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=700&q=80",
      bg: "white",
    },
    {
      num: "02",
      title: "Features of a Pro CV",
      desc: "Understand exactly what makes a CV pass both ATS systems and human recruiters.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=80", // Better CV/office image
      bg: "green",
    },
    {
      num: "03",
      title: "Create with Gemini AI",
      desc: "Generate perfectly tailored CVs and cover letters for any role in minutes.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=700&q=80",
      bg: "white",
    },
    {
      num: "04",
      title: "Edit & Convert on Your Phone",
      desc: "Use the MS Word app to polish and export a clean professional PDF.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&q=80",
      bg: "green",
    },
    {
      num: "05",
      title: "Apply the Right Way",
      desc: "The exact process to submit applications that get replies — and do it at scale.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&q=80", // Better application/handshake image
      bg: "white",
    },
  ];

  return (
    <section className="py-16 px-5 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold tracking-[3px] uppercase text-slate-500 mb-4">
            What’s Inside the Course
          </h2>
          <p className="text-emerald-700 text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
            FIVE PRACTICAL LESSONS. ZERO FLUFF.
          </p>
        </div>

        <div className="space-y-5">
          {modules.map((mod, i) => (
            <div
              key={i}
              className={`flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border ${
                mod.bg === "green"
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="w-full sm:w-40 h-36 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                <img
                  src={mod.image}
                  alt={mod.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="text-xs font-bold tracking-wider text-emerald-700 mb-1">
                  MODULE {mod.num}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">
                  {mod.title}
                </h3>
                <p className="text-slate-600 text-[15px] leading-relaxed">
                  {mod.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={onCheckoutClick}
            className="px-10 py-4 rounded-full font-bold text-lg text-white shadow-lg hover:scale-[1.02] transition"
            style={{ backgroundColor: COLORS.accent }}
          >
            Unlock All 5 Lessons — ₦{PRICING.current.toLocaleString()}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ───────── BONUSES (Green background) ───────── */
export function Bonuses() {
  const items = [
    {
      title: "Private WhatsApp Community",
      desc: "Get real feedback and support from the team and other learners as you apply.",
    },
    {
      title: "Lifetime Access",
      desc: "Pay once and keep everything forever, including future updates to the course.",
    },
  ];

  return (
    <section
      className="py-16 px-5 dark:bg-slate-950"
      style={{ backgroundColor: COLORS.primary }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-sm font-bold tracking-[3px] uppercase text-center text-emerald-200 mb-10">
          What’s Also Included
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center"
            >
              <div className="w-11 h-11 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-lg font-bold mx-auto mb-4">
                ✓
              </div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-emerald-100 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── TESTIMONIALS (Auto Sliding - One per view) ───────── */
export function Testimonials({ reviews, isAdmin, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", comment: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      return alert("Please fill in name and comment");
    }

    setSubmitting(true);
    try {
      const { collection, addDoc, serverTimestamp } =
        await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/firebase");

      await addDoc(collection(db, "jobappreviews"), {
        name: form.name.trim(),
        comment: form.comment.trim(),
        rating: Number(form.rating),
        createdAt: serverTimestamp(),
      });

      setForm({ name: "", comment: "", rating: 5 });
      setShowForm(false);
      if (onRefresh) onRefresh();
      alert("Testimonial added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add testimonial");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-16 px-5 bg-white dark:bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-center text-emerald-700 uppercase sm:text-4xl font-extrabold mb-12 leading-tight">
          What Learners Are Saying
        </h2>

        {reviews.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
            Be the first to share your results.
          </p>
        ) : (
          <div className="relative">
            {/* Slider */}
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {reviews.map((r) => (
                  <div key={r.id} className="w-full flex-shrink-0 px-2">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center min-h-[180px] flex flex-col justify-center">
                      <p className="text-slate-700 dark:text-slate-200 text-[15px] sm:text-base leading-relaxed mb-5">
                        “{r.comment}”
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        — {r.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            {reviews.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentIndex
                        ? "bg-[#F97316] w-6"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Add Testimonial */}
        {isAdmin && (
          <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-8">
            {!showForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 rounded-full font-semibold text-white"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  + Add Testimonial
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto space-y-4 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl"
              >
                <h3 className="font-bold text-center mb-2 dark:text-white">
                  Add New Testimonial
                </h3>

                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none bg-white dark:bg-slate-800 dark:text-white"
                  required
                />

                <textarea
                  placeholder="Comment / Review"
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none min-h-[100px] bg-white dark:bg-slate-800 dark:text-white"
                  required
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-600 font-medium dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl font-bold text-white"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    {submitting ? "Saving..." : "Save Testimonial"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────── FAQ (Green background) ───────── */
export function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "Do I need a laptop?",
      a: "No. The entire course is designed to work fully on your smartphone.",
    },
    {
      q: "Is this a subscription?",
      a: "No. One payment gives you lifetime access, including future updates.",
    },
    {
      q: "I have little experience. Will it still work?",
      a: "Yes. You’ll learn how to present whatever experience you have in the strongest possible way.",
    },
    {
      q: "What if I’m not satisfied?",
      a: "You have 7 days to request a full refund. No questions asked.",
    },
  ];

  return (
    <section
      className="py-16 px-5 dark:bg-slate-950"
      style={{ backgroundColor: COLORS.primary }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xs sm:text-sm font-bold tracking-[3px] uppercase text-center text-emerald-200 mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-white"
              >
                <span className="text-[15px]">{faq.q}</span>
                <span className="text-emerald-300 text-lg font-bold">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-emerald-100 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── CHECKOUT ───────── */
export function Checkout({ form, onChange, onPay, loading, h, m, s }) {
  return (
    <section className="py-20 px-5 bg-emerald-950 dark:bg-emerald-950">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xs sm:text-sm font-bold tracking-[3px] uppercase text-emerald-300 mb-4">
            Get Instant Access
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mb-5">
            READY TO START GETTING REPLIES?
          </p>

          <div className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full">
            <span>⏰ Price resets in</span>
            <span className="bg-white text-red-700 font-bold px-2.5 py-0.5 rounded font-mono">
              {h}:{m}:{s}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-900/30 dark:border-slate-700 shadow-xl">
          {/* 2-column grid on desktop, 1 column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="fw-name"
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                placeholder="e.g. Amaka Johnson"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="e.g. amaka@gmail.com"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                placeholder="e.g. 08012345678"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={onPay}
            disabled={loading}
            className="w-full py-4 rounded-full font-bold text-lg text-white transition disabled:opacity-50 hover:opacity-90"
            style={{ backgroundColor: COLORS.accent }}
          >
            {loading
              ? "Processing..."
              : `Pay ₦${PRICING.current.toLocaleString()} – Get Access`}
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-5">
            🔒 Secured by Flutterwave · Bank Transfer · Card · USSD
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */
export function Footer() {
  return (
    <footer className="py-10 px-5 text-center bg-white border-t border-slate-100">
      <p className="text-sm text-slate-500">
        © {new Date().getFullYear()} High-Er Enterprises
      </p>
      <p className="text-sm text-slate-500 mt-1">
        Questions?{" "}
        <a
          href={COURSE_DETAILS.whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-700 font-medium underline"
        >
          Chat on WhatsApp
        </a>
      </p>
    </footer>
  );
}

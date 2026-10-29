"use client";

import { useState, useEffect } from "react";
import { COLORS, PRICING, COURSE_DETAILS } from "../config/settings";
import Image from "next/image";

/* ───────── HERO ───────── */
export function Hero({ onCheckoutClick }) {
  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] px-5 pt-28 sm:pt-20 lg:pt-0">
      {/* subtle dot grid */}
      <div className="pointer-events-none absolute inset-0 -z-0 opacity-60" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:min-h-[640px] lg:grid-cols-2 lg:gap-8">
        {/* TEXT */}
        <div className="text-left lg:py-24">
          <h1 className="mb-5 text-[2.5rem] font-extrabold sm:text-start text-center leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
            Create tailored CVs
            <br />
            that get you{" "}
            <span className="relative whitespace-nowrap text-emerald-700">
              hired.
              <span className="absolute -bottom-1 left-0 h-[6px] w-full rounded-full bg-emerald-200/80 -z-10" />
            </span>
          </h1>

          <p className="mb-8 max-w-xl text-base sm:text-start text-center leading-relaxed text-slate-600 sm:text-lg">
            Learn what a tailored CV looks like and how to create one with
            ChatGPT and the MS Word app, using just your phone. Find real jobs
            on the right platforms and apply the right way.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <button
              onClick={onCheckoutClick}
              className="w-full rounded-full px-8 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(249,115,22,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(249,115,22,0.7)] sm:w-auto sm:text-lg"
              style={{ backgroundColor: COLORS.accent }}
            >
              Get the course — ₦{PRICING.current.toLocaleString()}
            </button>
            <p className="text-sm text-slate-500 sm:text-start text-center">
              Pay once. Access forever.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-slate-600">
            {[
              "Instant access",
              "Private WhatsApp community",
              "Continuous update",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 ">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* IMAGE */}
        <div className="relative mx-auto aspect-square w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[520px] lg:self-end">
          {/* arch background */}
          <div className="absolute inset-x-6 bottom-0 h-[82%] rounded-t-full bg-emerald-100" />
          <div className="absolute inset-x-6 bottom-0 h-[82%] rounded-t-full border border-emerald-200/70" />

          <Image
            src="/images/hero-woman.png"
            alt="Excited professional who just got hired"
            width={800}
            height={800}
            priority
            sizes="(max-width: 1024px) 90vw, 520px"
            className="absolute bottom-0 left-0 h-full w-full object-contain object-bottom"
          />

          {/* floating chip */}
          <div className="absolute bottom-6 left-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg sm:-left-4">
            <p className="text-xs font-semibold text-slate-900">
              Course link + WhatsApp group
            </p>
            <p className="text-[11px] text-slate-500">
              Sent instantly after payment
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── PROBLEM ───────── */
export function Problem() {
  const pains = [
    {
      title: "No replies",
      text: "You send out CV after CV and almost never hear back.",
    },
    {
      title: "Fake listings",
      text: "You waste time on job sites full of dead or fake listings.",
    },
    {
      title: "Robot rejection",
      text: "Your CV gets rejected by software before any human sees it.",
    },
    {
      title: "Paid, still nothing",
      text: "You've paid someone to write your CV and still got no results.",
    },
  ];

  return (
    <section className="bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
            The problem
          </p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Applying everywhere.
            <br />
            <span className="text-slate-400">Hearing from no one.</span>
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
          {pains.map((item, i) => (
            <div
              key={i}
              className="group bg-white p-6 transition-colors hover:bg-slate-50 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-[11px] font-bold text-red-500">
                  ✕
                </span>
                <span className="font-mono text-xs text-slate-400">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-lg font-semibold text-slate-900">
          The problem isn't you. It's your CV and where you're sending it.
        </p>
      </div>
    </section>
  );
}

/* ───────── SOLUTION ───────── */
export function Solution({ onCheckoutClick }) {
  const faces = [
    { cls: "front", n: "01", t: "Find real jobs" },
    { cls: "right", n: "02", t: "Pro CV features" },
    { cls: "back", n: "03", t: "Create with AI" },
    { cls: "left", n: "04", t: "Edit on phone" },
    { cls: "top", n: "05", t: "Apply right" },
    { cls: "bottom", n: "✓", t: "Get hired" },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 px-5 py-20 sm:py-28">
      <style>{`
        .cube-scene { width: var(--s); height: var(--s); perspective: 900px; }
        .cube-float { animation: cube-float 5s ease-in-out infinite; }
        .cube {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          animation: cube-spin 16s linear infinite;
        }
        .cube-scene:hover .cube { animation-play-state: paused; }
        .cube-face {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 18px; border-radius: 18px;
          border: 1px solid rgba(110, 231, 183, 0.35);
          background: linear-gradient(145deg, rgba(6, 78, 59, 0.92), rgba(2, 44, 34, 0.95));
          box-shadow: inset 0 0 40px rgba(52, 211, 153, 0.12);
          backface-visibility: hidden;
          color: #ecfdf5;
        }
        .cube-face.front  { transform: rotateY(0deg)   translateZ(calc(var(--s) / 2)); }
        .cube-face.back   { transform: rotateY(180deg) translateZ(calc(var(--s) / 2)); }
        .cube-face.right  { transform: rotateY(90deg)  translateZ(calc(var(--s) / 2)); }
        .cube-face.left   { transform: rotateY(-90deg) translateZ(calc(var(--s) / 2)); }
        .cube-face.top    { transform: rotateX(90deg)  translateZ(calc(var(--s) / 2)); }
        .cube-face.bottom { transform: rotateX(-90deg) translateZ(calc(var(--s) / 2)); }
        @keyframes cube-spin {
          0%   { transform: rotateX(-22deg) rotateY(0deg); }
          50%  { transform: rotateX(-38deg) rotateY(180deg); }
          100% { transform: rotateX(-22deg) rotateY(360deg); }
        }
        @keyframes cube-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes cube-shadow {
          0%, 100% { transform: scaleX(1); opacity: .5; }
          50% { transform: scaleX(.85); opacity: .3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cube, .cube-float { animation: none; }
          .cube { transform: rotateX(-22deg) rotateY(-30deg); }
        }
      `}</style>

      {/* dot grid + glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(148,163,184,.35) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* TEXT */}
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-emerald-400">
            The solution
          </p>
          <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            One clear approach that actually works.
          </h2>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
            A simple, repeatable process to build strong applications and apply
            the right way, even if all you have is a smartphone.
          </p>

          <ul className="mb-10 space-y-3 text-[15px] text-slate-300">
            {[
              "Tailor a CV to any job in minutes",
              "Pass ATS filters and reach human recruiters",
              "Apply only to jobs that are real",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-[11px] font-bold text-emerald-300">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>

          <button
            onClick={onCheckoutClick}
            className="w-full rounded-full px-8 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(249,115,22,0.6)] transition hover:-translate-y-0.5 sm:w-auto"
            style={{ backgroundColor: COLORS.accent }}
          >
            I want this course
          </button>
        </div>

        {/* CUBE */}
        <div className="flex flex-col items-center justify-center py-8 [--s:180px] sm:[--s:220px]">
          <div className="cube-float">
            <div className="cube-scene">
              <div className="cube">
                {faces.map((f) => (
                  <div key={f.cls} className={`cube-face ${f.cls}`}>
                    <span className="font-mono text-xs text-emerald-300">
                      {f.n}
                    </span>
                    <span className="text-lg font-bold leading-tight">
                      {f.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="mt-14 h-4 w-40 rounded-[50%] bg-emerald-400/30 blur-xl"
            style={{ animation: "cube-shadow 5s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ───────── CURRICULUM ───────── */
export function Curriculum({ onCheckoutClick }) {
  const modules = [
    {
      num: "01",
      title: "Introduction",
      desc: "What the course covers and how to get the most out of it.",
    },
    {
      num: "02",
      title: "CV and resume: the difference",
      desc: "Know exactly which one employers expect, and when to use each.",
    },
    {
      num: "03",
      title: "Generic CV vs tailored CV",
      desc: "See why generic CVs get ignored and tailored ones get replies.",
    },
    {
      num: "04",
      title: "Features of a tailored CV",
      desc: "What makes a CV pass both ATS systems and human recruiters.",
    },
    {
      num: "05",
      title: "Create a tailored CV with AI and Microsoft Word (Part 1)",
      desc: "Generate a CV built for a specific job, right from your phone.",
    },
    {
      num: "06",
      title: "Create a tailored CV with AI and Microsoft Word (Part 2)",
      desc: "Polish it in the Word app and export a clean, professional PDF.",
    },
    {
      num: "07",
      title: "Turn your existing CV into a tailored one",
      desc: "Already have a CV? Reuse it to create a job-specific version fast.",
    },
    {
      num: "08",
      title: "Where to find legit jobs",
      desc: "Trusted platforms, and how to spot scams and dead listings.",
    },
    {
      num: "09",
      title: "Tips for applying",
      desc: "Practical tips to keep in mind so your applications get replies.",
    },
  ];

  const cta = (
    <button
      onClick={onCheckoutClick}
      className="w-full rounded-full px-8 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(249,115,22,0.6)] transition hover:-translate-y-0.5 sm:w-auto"
      style={{ backgroundColor: COLORS.accent }}
    >
      Unlock all 9 lessons — ₦{PRICING.current.toLocaleString()}
    </button>
  );

  return (
    <section className="bg-[#FAFAF7] px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        {/* LEFT */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
            What's inside
          </p>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Nine practical lessons.
            <br />
            <span className="text-slate-400">Zero fluff.</span>
          </h2>
          <p className="mb-8 max-w-sm text-base leading-relaxed text-slate-600">
            Everything runs on your phone. Watch, apply, repeat.
          </p>
          <div className="hidden lg:block">
            {cta}
            <p className="mt-3 text-sm text-slate-500">
              Instant access after payment.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <ol className="divide-y divide-slate-200 border-y border-slate-200">
            {modules.map((mod) => (
              <li
                key={mod.num}
                className="group flex gap-5 py-6 transition-colors sm:gap-8 sm:py-8"
              >
                <span className="pt-1 font-mono text-sm text-slate-400 transition-colors group-hover:text-emerald-600">
                  {mod.num}
                </span>
                <div className="flex-1">
                  <h3 className="mb-1.5 text-lg font-bold text-slate-900 sm:text-xl">
                    {mod.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-slate-600">
                    {mod.desc}
                  </p>
                </div>
                <span className="hidden pt-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600 sm:block">
                  →
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 lg:hidden">
            {cta}
            <p className="mt-3 text-sm text-slate-500">
              Instant access after payment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── TESTIMONIALS ───────── */
export function Testimonials({ reviews, isAdmin, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", comment: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto slide every 5 seconds, pause on hover/touch
  useEffect(() => {
    if (reviews.length <= 1 || paused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length, paused]);

  // keep index valid if reviews change
  useEffect(() => {
    if (currentIndex >= reviews.length) setCurrentIndex(0);
  }, [reviews.length, currentIndex]);

  const go = (dir) =>
    setCurrentIndex((p) => (p + dir + reviews.length) % reviews.length);

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
    <section className="bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
            Results
          </p>
          <h2
            className="text-3xl font-extrabold leading-tight tracking-tigh sm:text-4xl"
            style={{ color: COLORS.accent }}
          >
            What learners are saying
          </h2>
        </div>

        {reviews.length === 0 ? (
          <p className="mb-8 text-center text-slate-500">
            Be the first to share your results.
          </p>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#FAFAF7]">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {reviews.map((r) => (
                  <div key={r.id} className="w-full flex-shrink-0">
                    <figure className="flex min-h-[240px] flex-col justify-between p-7 sm:p-12">
                      <div>
                        <div
                          className="mb-5 text-sm tracking-widest text-amber-500"
                          aria-label={`${r.rating || 5} out of 5 stars`}
                        >
                          {"★".repeat(Math.min(Number(r.rating) || 5, 5))}
                        </div>
                        <blockquote className="text-lg font-medium leading-relaxed text-slate-800 sm:text-2xl sm:leading-snug">
                          “{r.comment}”
                        </blockquote>
                      </div>
                      <figcaption className="mt-8 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                          {r.name?.trim()?.charAt(0)?.toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {r.name}
                        </span>
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            {reviews.length > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`Go to review ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        i === currentIndex
                          ? "w-6 bg-slate-900"
                          : "w-2 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous review"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next review"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin Add Testimonial */}
        {isAdmin && (
          <div className="mt-10 border-t border-slate-200 pt-8">
            {!showForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="rounded-full px-6 py-3 font-semibold text-white"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  + Add Testimonial
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-md space-y-4 rounded-2xl bg-slate-50 p-6"
              >
                <h3 className="mb-2 text-center font-bold">
                  Add New Testimonial
                </h3>

                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
                  required
                />

                <textarea
                  placeholder="Comment / Review"
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                  className="min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
                  required
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-xl border border-slate-300 py-3 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl py-3 font-bold text-white"
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

/* ───────── FAQ ───────── */
export function FAQ() {
  const [open, setOpen] = useState(0);

  const faqs = [
    {
      q: "Do I need a laptop?",
      a: "No. The entire course is designed to work fully on your smartphone.",
    },
    {
      q: "How do I get the course after paying?",
      a: "Instantly. Right after payment you get the course link and the WhatsApp community link.",
    },
    {
      q: "Is this a subscription?",
      a: "No. One payment gives you lifetime access, including future updates.",
    },
    {
      q: "I have little experience. Will it still work?",
      a: "Yes. You'll learn how to present whatever experience you have in the strongest possible way.",
    },
  ];

  return (
    <section className="bg-[#FAFAF7] px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
            FAQ
          </p>
          <h2
            style={{ color: COLORS.accent }}
            className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl"
          >
            Questions,
            <br />
            <span className="text-slate-400">answered.</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base font-semibold text-slate-900 sm:text-lg">
                    {faq.q}
                  </span>
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-10 text-[15px] leading-relaxed text-slate-600">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────── CHECKOUT ───────── */
export function Checkout({ form, onChange, onPay, loading, h, m, s }) {
  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30";
  const labelCls =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500";

  return (
    <section
      id="checkout"
      className="relative overflow-hidden bg-slate-950 px-5 py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT */}
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-emerald-400">
            Get instant access
          </p>
          <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Ready to start getting replies?
          </h2>
          <p className="mb-8 max-w-md text-base leading-relaxed text-slate-400">
            Pay once. Your course link and WhatsApp community link arrive
            instantly.
          </p>

          <ul className="mb-8 space-y-3 text-[15px] text-slate-300">
            {[
              "9 video lessons, watch on your phone",
              "List of job platforms",
              "Private WhatsApp community",
              "Lifetime access",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-[11px] font-bold text-emerald-300">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>

          <p className="text-4xl font-extrabold text-white">
            ₦{PRICING.current.toLocaleString()}
            <span className="ml-2 text-base font-medium text-slate-500">
              one-time
            </span>
          </p>
        </div>

        {/* FORM */}
        <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Full Name</label>
              <input
                id="fw-name"
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                placeholder="e.g. Amaka Johnson"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="e.g. amaka@gmail.com"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                placeholder="e.g. 08012345678"
                className={inputCls}
              />
            </div>
          </div>

          <button
            onClick={onPay}
            disabled={loading}
            className="w-full rounded-full py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(249,115,22,0.6)] transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 sm:text-lg"
            style={{ backgroundColor: COLORS.accent }}
          >
            {loading
              ? "Processing..."
              : `Pay ₦${PRICING.current.toLocaleString()} – Get Access`}
          </button>

          <p className="mt-5 text-center text-xs text-slate-500">
            🔒 Secured by Flutterwave · Bank Transfer · Card · USSD
          </p>
        </div>
      </div>
    </section>
  );
}

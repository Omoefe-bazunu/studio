"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";

/* ── env vars ── */
const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "";
const COURSE_LINK = process.env.NEXT_PUBLIC_COURSE_LINK || "#";
const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "#";
const ADMIN_EMAIL = "raniem57@gmail.com";

/* ── helpers ── */
function generateTxRef() {
  return `higher-excel-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

async function savePayment(payload) {
  try {
    await addDoc(collection(db, "excel_course_payments"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Firestore save error:", err);
  }
}

function trackPixelPurchase({ amount, currency, tx_ref }) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value: amount,
      currency: currency || "NGN",
      content_name: "Excel Masterclass",
      content_type: "product",
      content_ids: [tx_ref],
    });
    window.fbq("track", "Lead", { content_name: "Excel Masterclass" });
  }
}

function getMidnightSecondsLeft() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
}

function formatCountdown(secs) {
  const h = Math.floor(secs / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((secs % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return { h, m, s };
}

function Stars({ rating }) {
  return (
    <span className="text-yellow-300 tracking-wide">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

/* ══════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════ */
export default function ExcelCoursePage() {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const checkoutRef = useRef(null);

  /* countdown */
  const [secsLeft, setSecsLeft] = useState(null);
  useEffect(() => {
    setSecsLeft(getMidnightSecondsLeft());
    const t = setInterval(() => setSecsLeft(getMidnightSecondsLeft()), 1000);
    return () => clearInterval(t);
  }, []);
  const { h, m, s } =
    secsLeft !== null
      ? formatCountdown(secsLeft)
      : { h: "--", m: "--", s: "--" };
  const timerReady = secsLeft !== null;

  /* testimonials */
  const [reviews, setReviews] = useState([]);
  const fetchReviews = useCallback(async () => {
    try {
      const q = query(
        collection(db, "excelreviews"),
        orderBy("createdAt", "desc"),
      );
      const snap = await getDocs(q);
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Reviews fetch error:", err);
    }
  }, []);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  /* admin */
  const [adminUser, setAdminUser] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAdminUser(user?.email === ADMIN_EMAIL ? user : null);
    });
    return unsub;
  }, []);

  /* flutterwave */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  function scrollToCheckout() {
    checkoutRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("fw-name")?.focus(), 600);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startPayment() {
    const { name, email, phone } = form;
    if (!name.trim()) return alert("Please enter your full name.");
    if (!email.trim() || !email.includes("@"))
      return alert("Please enter a valid email address.");
    if (!phone.trim()) return alert("Please enter your phone number.");
    setLoading(true);
    const txRef = generateTxRef();
    window.FlutterwaveCheckout({
      public_key: FLW_PUBLIC_KEY,
      tx_ref: txRef,
      amount: 10000,
      currency: "NGN",
      payment_options: "banktransfer, card, ussd",
      customer: { email, phone_number: phone, name },
      customizations: {
        title: "Excel Masterclass – High-Er Enterprises",
        description:
          "Microsoft Excel Masterclass (23 Lessons + Lifetime Access)",
      },
      configurations: { session_duration: 10, max_retry_attempt: 3 },
      callback: async function (payment) {
        if (payment.status === "successful" || payment.status === "completed") {
          await savePayment({
            name,
            email,
            phone,
            tx_ref: payment.tx_ref,
            flw_ref: payment.flw_ref,
            transaction_id: payment.transaction_id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
          });
          trackPixelPurchase({
            amount: payment.amount,
            currency: payment.currency,
            tx_ref: payment.tx_ref,
          });
          setPaid(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setLoading(false);
          alert("Payment was not completed. Please try again.");
        }
      },
      onclose: function () {
        setLoading(false);
      },
    });
  }

  /* ── SUCCESS SCREEN ── */
  if (paid) {
    return (
      <>
        <Head>
          <title>You're In! – High-Er Enterprises</title>
        </Head>
        <div className="min-h-screen bg-[#0f3b22] flex items-center justify-center p-5">
          <div className="max-w-lg w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-extrabold text-2xl text-yellow-300 mb-3">
              You're in! Welcome to the class.
            </h2>
            <p className="text-white/75 text-sm mb-7">
              Payment confirmed. Click the links below to access your course and
              community.
              <br />
              <span className="text-white/40 text-xs mt-1 block">
                Bookmark or screenshot this page.
              </span>
            </p>
            <div className="flex flex-col gap-3 mb-6">
              <a
                href={COURSE_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 bg-yellow-300 text-[#0f3b22] font-extrabold text-base rounded-xl px-5 py-4 no-underline"
              >
                <span className="text-2xl">📁</span>Open Course on Google Drive
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 bg-white/10 border border-white/15 text-white font-semibold text-sm rounded-xl px-5 py-4 no-underline"
              >
                <span className="text-2xl">💬</span>Join the WhatsApp Excel
                Community
              </a>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">
              Check your email for a receipt from Flutterwave.
              <br />
              (Check spam if you don't see it.)
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ── MAIN LANDING ── */
  return (
    <>
      <Head>
        <title>Microsoft Excel Masterclass – High-Er Enterprises</title>
        <meta
          name="description"
          content="Learn Microsoft Excel from zero to pro. 23 lessons, lifetime access. ₦10,000 only."
        />
      </Head>

      <main className="bg-[#0f3b22] text-white font-sans leading-relaxed">
        {/* ── URGENCY BANNER ── */}
        <div className="bg-red-900 py-2 px-4 flex flex-wrap items-center justify-center gap-1 text-center">
          <span className="text-white/90 text-xs font-medium">
            ⏰ Special price ends in
          </span>
          {timerReady ? (
            <span className="flex items-center gap-1">
              {[h, m, s].map((unit, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="bg-yellow-300 text-[#0f3b22] font-extrabold text-xs px-1.5 py-0.5 rounded min-w-[26px] text-center">
                    {unit}
                  </span>
                  {i < 2 && (
                    <span className="text-yellow-300 font-bold text-xs">:</span>
                  )}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-yellow-300 font-bold text-xs">--:--:--</span>
          )}
          <span className="text-white/90 text-xs font-medium">
            — grab it before ₦17,000 returns
          </span>
        </div>

        {/* ── HERO ── */}
        <header className="relative text-center px-5 pt-14 pb-12 overflow-hidden">
          <div className="absolute -top-14 -right-14 w-52 h-52 bg-yellow-300 rounded-full opacity-10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-300 rounded-full opacity-10 pointer-events-none" />

          <p className="text-yellow-300 text-[11px] font-semibold tracking-[3px] uppercase mb-5">
            High-Er Enterprises
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3">
            Learn <span className="text-yellow-300">Microsoft Excel</span>
            <br />
            From Zero to Pro
          </h1>
          <p className="text-white/70 text-sm mb-7">
            23 lessons · Beginner friendly · Real business projects
          </p>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[
              "📊 Pivot Tables",
              "⚡ Power Query",
              "📈 Dashboards",
              "🔍 VLOOKUP",
              "🎓 Lifetime Access",
            ].map((b) => (
              <span
                key={b}
                className="bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs text-white/85"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="inline-block bg-yellow-300 text-[#0f3b22] rounded-xl px-8 py-5 mb-5">
            <span className="block text-sm font-medium line-through opacity-60">
              ₦17,000
            </span>
            <span className="block text-5xl font-extrabold leading-none">
              ₦10,000
            </span>
            <span className="inline-block mt-1 bg-[#0f3b22] text-yellow-300 text-xs font-bold px-3 py-0.5 rounded-full">
              You save ₦7,000 🎉
            </span>
          </div>

          <br />
          <button
            onClick={scrollToCheckout}
            className="block w-full max-w-sm mx-auto bg-yellow-300 text-[#0f3b22] font-extrabold text-lg px-6 py-5 rounded-xl border-0 cursor-pointer shadow-[0_4px_24px_rgba(240,224,0,0.35)] mt-2"
          >
            Get the Course Now →
          </button>
          <p className="text-white/50 text-xs mt-2">
            Secure payment · Instant access · No hidden fees
          </p>
        </header>

        {/* ── PAIN ── */}
        <section className="bg-[#1e6b42] py-12 px-5">
          <div className="max-w-xl mx-auto">
            <p className="text-yellow-300 text-[11px] font-bold tracking-[3px] uppercase mb-3">
              Sound familiar?
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-5">
              Still struggling with Excel at work?
            </h2>
            <ul className="flex flex-col gap-3 list-none p-0">
              {[
                "😩 You spend hours on tasks Excel could do in minutes",
                "😓 You've watched random YouTube videos but nothing sticks",
                "😰 Your boss or clients expect more from your reports",
                "🤯 You don't know how to make your data look professional",
                "💰 You want to earn extra income with a tech skill in 2026",
              ].map((p) => (
                <li
                  key={p}
                  className="bg-black/20 border-l-4 border-yellow-300 px-4 py-3 rounded-r-lg text-sm"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── MODULES ── */}
        <section className="bg-[#0f3b22] py-12 px-5">
          <div className="max-w-xl mx-auto">
            <p className="text-yellow-300 text-[11px] font-bold tracking-[3px] uppercase mb-3">
              The course
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-5">
              Everything you need. In one place.
            </h2>
            <div className="flex flex-col gap-2.5">
              {[
                {
                  num: "1–3",
                  title: "Getting Started",
                  desc: "Installing Excel, navigating the interface, cells & basic formatting",
                },
                {
                  num: "4–8",
                  title: "Functions & Formulas",
                  desc: "SUM, IF, VLOOKUP, XLOOKUP, nested formulas — explained simply",
                },
                {
                  num: "9–12",
                  title: "Tables & Data Tools",
                  desc: "Structured tables, sorting, filtering, data validation",
                },
                {
                  num: "13–16",
                  title: "Pivot Tables & Power Query",
                  desc: "Summarise thousands of rows in seconds. Clean messy data fast.",
                },
                {
                  num: "17–20",
                  title: "Interactive Dashboards",
                  desc: "Charts, slicers, and business reports that actually impress",
                },
                {
                  num: "21–22",
                  title: "Business Data Analysis",
                  desc: "Real-world projects — apply what you've learned",
                },
                {
                  num: "23",
                  title: "Marketing Your Excel Skill",
                  desc: "Turn your new skill into income — freelance, jobs, consulting",
                },
              ].map((mod) => (
                <div
                  key={mod.num}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="shrink-0 bg-yellow-300 text-[#0f3b22] font-extrabold text-xs rounded-md flex items-center justify-center px-2 h-7 min-w-[36px]">
                    {mod.num}
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold mb-0.5">
                      {mod.title}
                    </strong>
                    <span className="text-white/55 text-xs">{mod.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BONUSES ── */}
        <section className="bg-[#0a2e1a] py-12 px-5">
          <div className="max-w-xl mx-auto">
            <p className="text-yellow-300 text-[11px] font-bold tracking-[3px] uppercase mb-3">
              Included FREE
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-5">
              You also get these bonuses
            </h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: "📁",
                  title: "Practice Files",
                  desc: "Every lesson comes with real Excel files to practice on. No guessing — just open and follow along.",
                },
                {
                  icon: "💬",
                  title: "WhatsApp Excel Community",
                  desc: "Stuck on something? Post it in the group. Get help from other learners and our team — fast.",
                },
                {
                  icon: "♾️",
                  title: "Lifetime Access",
                  desc: "Pay once, access forever. We add new content — you get it free. No subscription.",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="bg-yellow-300 text-[#0f3b22] rounded-xl p-5 flex gap-4 items-start"
                >
                  <span className="text-3xl shrink-0">{b.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-base mb-1">{b.title}</h3>
                    <p className="text-sm opacity-80">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="bg-[#0f3b22] py-12 px-5">
          <div className="max-w-xl mx-auto">
            <p className="text-yellow-300 text-[11px] font-bold tracking-[3px] uppercase mb-3">
              What students say
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-5">
              See what others are saying about this course.
            </h2>

            {reviews.length === 0 ? (
              <p className="text-white/40 text-sm">
                Be the first to learn and share your experience!
              </p>
            ) : (
              <ReviewCarousel reviews={reviews} />
            )}

            {adminUser && (
              <button
                onClick={() => setShowAdminModal(true)}
                className="mt-5 bg-white/10 border border-white/15 text-white/60 text-xs px-4 py-2 rounded-lg cursor-pointer"
              >
                ⚙️ Manage Reviews
              </button>
            )}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bg-[#1e6b42] py-12 px-5">
          <div className="max-w-xl mx-auto">
            <p className="text-yellow-300 text-[11px] font-bold tracking-[3px] uppercase mb-3">
              How it works
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-5">
              3 simple steps to start learning
            </h2>
            <div className="flex flex-col">
              {[
                {
                  n: "1",
                  title: "Pay securely below",
                  body: "Enter your name and email. Pay ₦10,000 via bank transfer, card, or USSD.",
                },
                {
                  n: "2",
                  title: "Get instant access",
                  body: "Your Google Drive course link appears immediately after payment — no waiting.",
                },
                {
                  n: "3",
                  title: "Join the community",
                  body: "Use your bonus link to join our WhatsApp Excel group for support and updates.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 items-start py-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-yellow-300 text-[#0f3b22] font-extrabold text-base flex items-center justify-center">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">{step.title}</h3>
                    <p className="text-white/65 text-sm">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CHECKOUT ── */}
        <section className="bg-[#0f3b22] py-12 px-5" ref={checkoutRef}>
          <div className="max-w-xl mx-auto">
            <p className="text-yellow-300 text-[11px] font-bold tracking-[3px] uppercase mb-3">
              Ready to start?
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-5">
              Pay once. Learn forever.
            </h2>

            {/* countdown */}
            <div className="bg-yellow-300/10 border border-yellow-300/25 rounded-lg px-4 py-3 mb-5 text-center">
              <span className="text-white/70 text-sm">⏰ Price resets in </span>
              <span className="text-yellow-300 font-extrabold text-base ml-1">
                {timerReady ? `${h}:${m}:${s}` : "--:--:--"}
              </span>
            </div>

            {[
              {
                id: "fw-name",
                label: "Your Full Name",
                name: "name",
                type: "text",
                placeholder: "e.g. Amaka Johnson",
                autoComplete: "name",
              },
              {
                id: "fw-email",
                label: "Your Email Address",
                name: "email",
                type: "email",
                placeholder: "e.g. amaka@gmail.com",
                autoComplete: "email",
              },
              {
                id: "fw-phone",
                label: "Phone Number",
                name: "phone",
                type: "tel",
                placeholder: "e.g. 08012345678",
                autoComplete: "tel",
              },
            ].map((f) => (
              <div key={f.id} className="mb-3.5">
                <label
                  htmlFor={f.id}
                  className="block text-xs font-medium text-white/70 mb-1.5"
                >
                  {f.label}
                </label>
                <input
                  id={f.id}
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  value={form[f.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-yellow-300 transition-colors placeholder:text-white/30"
                />
              </div>
            ))}

            <button
              onClick={startPayment}
              disabled={loading}
              className={`block w-full bg-yellow-300 text-[#0f3b22] font-extrabold text-lg px-6 py-5 rounded-xl border-0 cursor-pointer shadow-[0_4px_24px_rgba(240,224,0,0.35)] ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Processing…" : "Pay ₦10,000 – Get Instant Access"}
            </button>

            <p className="text-white/40 text-xs mt-3 text-center">
              🔒 Secured by Flutterwave · Bank Transfer · Card · USSD
            </p>
          </div>
        </section>

        <footer className="text-center py-8 px-5 text-white/30 text-xs border-t border-white/10">
          © {new Date().getFullYear()} High-Er Enterprises · All rights reserved
          <br />
          Questions? Chat us on WhatsApp (09043970401)
        </footer>
      </main>

      {showAdminModal && (
        <AdminModal
          reviews={reviews}
          onClose={() => setShowAdminModal(false)}
          onRefresh={fetchReviews}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   REVIEW CAROUSEL
══════════════════════════════════════════════ */
function ReviewCarousel({ reviews }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const total = reviews.length;

  function go(dir) {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) =>
        dir === "next" ? (prev + 1) % total : (prev - 1 + total) % total,
      );
      setAnimating(false);
    }, 280);
  }

  // auto-advance every 5s
  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => go("next"), 5000);
    return () => clearInterval(t);
  }, [total, animating]);

  const r = reviews[current];

  const slideStyle = {
    transition: "opacity 0.28s ease, transform 0.28s ease",
    opacity: animating ? 0 : 1,
    transform: animating
      ? `translateX(${direction === "next" ? "-24px" : "24px"})`
      : "translateX(0)",
  };

  return (
    <div>
      {/* card */}
      <div
        style={slideStyle}
        className="bg-white/5 border border-white/10 rounded-xl p-5 min-h-[140px]"
      >
        <Stars rating={r.rating || 5} />
        <p className="text-sm text-white/85 mt-2 mb-4 leading-relaxed italic">
          "{r.statement}"
        </p>
        <div className="flex justify-between items-center flex-wrap gap-1">
          <span className="text-yellow-300 text-xs font-bold">{r.name}</span>
          <span className="text-white/40 text-xs">{r.location}</span>
        </div>
      </div>

      {/* controls */}
      {total > 1 && (
        <div className="flex items-center justify-between mt-3">
          {/* prev / next */}
          <div className="flex gap-2">
            <button
              onClick={() => go("prev")}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white text-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => go("next")}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white text-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
            >
              ›
            </button>
          </div>

          {/* dots */}
          <div className="flex gap-1.5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? "next" : "prev");
                  setCurrent(i);
                }}
                className={`w-1.5 h-1.5 rounded-full border-0 cursor-pointer transition-all ${
                  i === current ? "bg-yellow-300 w-4" : "bg-white/25"
                }`}
              />
            ))}
          </div>

          {/* counter */}
          <span className="text-white/30 text-xs">
            {current + 1} / {total}
          </span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADMIN MODAL
══════════════════════════════════════════════ */
const EMPTY_FORM = { name: "", location: "", rating: 5, statement: "" };

function AdminModal({ reviews, onClose, onRefresh }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  }

  function startEdit(review) {
    setEditingId(review.id);
    setForm({
      name: review.name,
      location: review.location,
      rating: review.rating,
      statement: review.statement,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.statement.trim() || !form.location.trim())
      return alert("Name, location and statement are required.");
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "excelreviews", editingId), {
          name: form.name,
          location: form.location,
          rating: form.rating,
          statement: form.statement,
        });
      } else {
        await addDoc(collection(db, "excelreviews"), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }
      await onRefresh();
      cancelEdit();
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this review?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "excelreviews", id));
      await onRefresh();
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-start justify-center p-5 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0f3b22] border border-white/15 rounded-2xl w-full max-w-xl p-6 my-4">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-yellow-300 font-extrabold text-xl">
            Manage Reviews
          </h2>
          <button
            onClick={onClose}
            className="bg-white/10 border-0 text-white w-8 h-8 rounded-full cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* form */}
        <div className="bg-white/5 rounded-xl p-4 mb-5">
          <h3 className="text-white/70 font-bold text-sm mb-4">
            {editingId ? "Edit Review" : "Add New Review"}
          </h3>
          <div className="flex gap-2.5 flex-wrap mb-2.5">
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-white/60 text-xs">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Chidi Okafor"
                className="px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm outline-none focus:border-yellow-300"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-white/60 text-xs">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Lagos, Nigeria"
                className="px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm outline-none focus:border-yellow-300"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 mb-2.5">
            <label className="text-white/60 text-xs">Rating</label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm outline-none"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n} className="bg-[#0f3b22]">
                  {n} star{n !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-white/60 text-xs">Statement</label>
            <textarea
              name="statement"
              value={form.statement}
              onChange={handleChange}
              rows={3}
              placeholder="What did they say about the course?"
              className="px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm outline-none resize-y focus:border-yellow-300"
            />
          </div>
          <div className="flex gap-2.5 justify-end">
            {editingId && (
              <button
                onClick={cancelEdit}
                className="bg-white/10 border-0 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-yellow-300 text-[#0f3b22] border-0 font-extrabold px-5 py-2 rounded-lg text-sm cursor-pointer"
            >
              {saving ? "Saving…" : editingId ? "Update Review" : "Add Review"}
            </button>
          </div>
        </div>

        {/* list */}
        <h3 className="text-white/70 font-bold text-sm mb-3">
          Existing Reviews ({reviews.length})
        </h3>
        <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto">
          {reviews.length === 0 && (
            <p className="text-white/40 text-xs">No reviews yet.</p>
          )}
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex justify-between items-start gap-3 bg-white/5 rounded-xl p-3.5"
            >
              <div className="flex-1">
                <Stars rating={r.rating || 5} />
                <span className="block text-yellow-300 text-xs font-semibold mt-1">
                  {r.name} · {r.location}
                </span>
                <p className="text-white/65 text-xs mt-1 italic">
                  "{r.statement}"
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => startEdit(r)}
                  className="bg-white/10 border-0 text-white px-3 py-1.5 rounded-md text-xs cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deletingId === r.id}
                  className="bg-red-900/40 border-0 text-red-400 px-3 py-1.5 rounded-md text-xs cursor-pointer"
                >
                  {deletingId === r.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

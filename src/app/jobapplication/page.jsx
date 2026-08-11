"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { COLORS, FONTS, PRICING, COURSE_DETAILS } from "../../config/settings";
import {
  generateTxRef,
  trackPixelPurchase,
  getMidnightSecondsLeft,
  formatCountdown,
} from "../../utils/helpers";
import {
  Hero,
  Problem,
  Solution,
  Curriculum,
  Bonuses,
  Testimonials,
  FAQ,
  Checkout,
} from "../../components/CourseSections";

export default function JobApplicationCoursePage() {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const checkoutRef = useRef(null);

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

  const [reviews, setReviews] = useState([]);
  const fetchReviews = useCallback(async () => {
    try {
      const q = query(
        collection(db, "jobappreviews"),
        orderBy("createdAt", "desc"),
      );
      const snap = await getDocs(q);
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
  }, []);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === COURSE_DETAILS.adminEmail);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  function scrollToCheckout() {
    checkoutRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("fw-name")?.focus(), 500);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startPayment() {
    const { name, email, phone } = form;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return alert("Please fill in all details.");
    }
    setLoading(true);
    const txRef = generateTxRef();

    window.FlutterwaveCheckout({
      public_key: COURSE_DETAILS.flwPublicKey,
      tx_ref: txRef,
      amount: PRICING.current,
      currency: "NGN",
      payment_options: "banktransfer, card, ussd",
      customer: { email, phone_number: phone, name },
      customizations: {
        title: `${COURSE_DETAILS.title}`,
        description: "Strategic Job Application Course",
      },

      callback: async function (payment) {
        if (payment.status === "successful" || payment.status === "completed") {
          try {
            // Save to Firebase
            await addDoc(collection(db, "jobapp_course_payments"), {
              name,
              email,
              phone,
              tx_ref: payment.tx_ref,
              flw_ref: payment.flw_ref,
              amount: payment.amount,
              status: payment.status,
              createdAt: serverTimestamp(),
            });
          } catch (err) {
            console.error(err);
          }

          // ========== META PIXEL PURCHASE EVENT ==========
          if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "Purchase", {
              value: payment.amount, // e.g. 4999
              currency: "NGN",
              content_name: "Apply to Jobs Strategically",
              content_type: "product",
              content_ids: [payment.tx_ref],
            });
          }
          // ===============================================

          setPaid(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setLoading(false);
          alert("Payment incomplete. Please try again.");
        }
      },
      onclose: () => setLoading(false),
    });
  }

  if (paid) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: COLORS.primary }}
      >
        <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-xl">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            You're in!
          </h2>
          <p className="text-gray-600 mb-8">
            Payment confirmed. Access everything below.
          </p>
          <a
            href={COURSE_DETAILS.courseLink}
            target="_blank"
            rel="noreferrer"
            className="block w-full py-4 rounded-full font-bold text-white mb-4"
            style={{ backgroundColor: COLORS.primary }}
          >
            Open Course Material
          </a>
          <a
            href={COURSE_DETAILS.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="block w-full py-4 rounded-full font-bold border-2"
            style={{ borderColor: COLORS.primary, color: COLORS.primary }}
          >
            Join WhatsApp Community
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{COURSE_DETAILS.title}</title>
        <meta name="description" content={COURSE_DETAILS.subtitle} />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main
        style={{ fontFamily: FONTS.body, color: COLORS.textMain }}
        className="bg-slate-50 min-h-screen"
      >
        {/* Urgency Bar */}
        {/* Urgency Bar - Taller & more visible */}
        <div className="bg-red-600 text-white text-center py-3.5 px-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="font-semibold text-sm sm:text-base">
            ⏰ Special price ends in
          </span>
          <span className="bg-white text-red-700 font-bold px-3 py-1 rounded-md font-mono text-base tracking-wider">
            {h}:{m}:{s}
          </span>
          <span className="text-sm sm:text-base opacity-90">
            — then ₦{PRICING.original.toLocaleString()} returns
          </span>
        </div>
        <Hero onCheckoutClick={scrollToCheckout} />
        <Problem />
        <Solution onCheckoutClick={scrollToCheckout} />
        <Curriculum onCheckoutClick={scrollToCheckout} />
        <Bonuses />
        <Testimonials
          reviews={reviews}
          isAdmin={isAdmin}
          onRefresh={fetchReviews}
        />
        <FAQ />

        <div ref={checkoutRef}>
          <Checkout
            form={form}
            onChange={handleChange}
            onPay={startPayment}
            loading={loading}
            h={h}
            m={m}
            s={s}
          />
        </div>
        {/* <button
  onClick={() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", {
        value: 4999,
        currency: "NGN",
        content_name: "Apply to Jobs Strategically",
        content_type: "product",
      });
      alert("Purchase event sent!");
    } else {
      alert("Pixel not loaded");
    }
  }}
  className="fixed bottom-6 right-6 z-50 bg-orange-500 text-white font-bold px-5 py-3 rounded-full shadow-lg"
>
  Test Purchase Event
</button> */}
      </main>
    </>
  );
}

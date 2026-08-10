"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  Zap,
  ArrowLeft,
  Mail,
  User,
  Phone,
  X,
  Play,
} from "lucide-react";
import {
  getProductBySlug,
  saveOrder,
} from "@/lib/firebase/shopFirestoreService";

const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "";

function generateTxRef() {
  return `higher-shop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

/* ── Success Modal ── */
function SuccessModal({ open, onClose, customerEmail }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
          Payment Successful!
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Thank you for your purchase. A confirmation and download link will be
          sent to{" "}
          <span className="font-semibold text-foreground">{customerEmail}</span>{" "}
          shortly.
        </p>
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 text-left mb-6">
          <Mail className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Check your inbox (and spam folder) for your product delivery email.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/* ── Checkout Form ── */
function CheckoutForm({ product, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

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
      amount: product.price,
      currency: product.currency || "NGN",
      payment_options: "card, banktransfer, ussd",
      customer: { email, phone_number: phone, name },
      customizations: {
        title: "High-ER Enterprises",
        description: product.name,
        logo: "/logo.png",
      },
      configurations: { session_duration: 10, max_retry_attempt: 3 },
      callback: async function (payment) {
        if (payment.status === "successful" || payment.status === "completed") {
          await saveOrder({
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            amount: payment.amount,
            currency: payment.currency,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            flutterwaveRef: payment.flw_ref,
            transactionId: String(payment.transaction_id),
            txRef: payment.tx_ref,
            status: "success",
          });
          onSuccess(email);
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

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-sm">Your Details</h3>
      {[
        {
          id: "co-name",
          name: "name",
          label: "Full Name",
          type: "text",
          placeholder: "John Doe",
          icon: User,
        },
        {
          id: "co-email",
          name: "email",
          label: "Email Address",
          type: "email",
          placeholder: "john@example.com",
          icon: Mail,
        },
        {
          id: "co-phone",
          name: "phone",
          label: "Phone Number",
          type: "tel",
          placeholder: "+234 800 000 0000",
          icon: Phone,
        },
      ].map((f) => (
        <div key={f.id} className="space-y-1">
          <label
            htmlFor={f.id}
            className="block text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {f.label}
          </label>
          <div className="relative">
            <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id={f.id}
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.name]}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </div>
      ))}
      <button
        onClick={startPayment}
        disabled={loading}
        className={`w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"}`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Pay {formatPrice(product.price, product.currency)}
          </>
        )}
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        🔒 Secured by Flutterwave · Card · Bank Transfer · USSD
      </p>
    </div>
  );
}

/* ── Main Page ── */
export default function ProductSlugPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug || "";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    if (document.getElementById("flw-script")) return;
    const script = document.createElement("script");
    script.id = "flw-script";
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug)
      .then((p) => setProduct(p))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Product not found.</p>
          <Link
            href="/shop"
            className="text-primary text-sm mt-2 inline-block hover:underline"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SuccessModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
        customerEmail={successEmail}
      />

      {/* Back */}
      <div className="container mx-auto px-6 pt-8 w-full flex justify-center items-center">
        <Link
          href="/shop"
          className="bg-primary text-primary-foreground font-black py-2 px-4 rounded-full uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left: Media + Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Media block — image by default, video on demand */}
            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden border border-border group">
              {product.imageUrl && !isPlayingVideo ? (
                <>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  {/* Video trigger — only shown if videoUrl exists */}
                  {product.videoUrl && (
                    <button
                      onClick={() => setIsPlayingVideo(true)}
                      className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-lg z-10"
                    >
                      <Play className="w-3 h-3 fill-current stroke-none" />
                      Watch Demo
                    </button>
                  )}
                </>
              ) : isPlayingVideo && product.videoUrl ? (
                <div className="w-full h-full relative bg-black">
                  <video
                    src={product.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    controls
                    loop
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <button
                    onClick={() => setIsPlayingVideo(false)}
                    className="absolute top-3 right-3 z-20 bg-background/90 backdrop-blur-md text-foreground border border-border px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors"
                  >
                    Return to Image
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                About this product
              </h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {product.features?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  What&apos;s included
                </h2>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Purchase card */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  {product.category}
                </p>
                <h1 className="text-2xl font-bold text-foreground tracking-tight leading-tight mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    one-time
                  </span>
                </div>
                <div className="h-px bg-border mb-6" />
                {product.type === "digital" ? (
                  <CheckoutForm
                    product={product}
                    onSuccess={(email) => {
                      setSuccessEmail(email);
                      setSuccessModal(true);
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This product is hosted on an external platform. Click
                      below to proceed.
                    </p>
                    <a
                      href={product.externalUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-[#FF8C38] hover:bg-[#e67e32] text-white font-semibold transition-colors shadow-lg"
                    >
                      Get Product <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

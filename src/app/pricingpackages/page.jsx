"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  Loader2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/firebase";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "raniem57@gmail.com";

const PRESET_GRADIENTS = [
  "from-purple-600 to-pink-600",
  "from-blue-600 to-cyan-500",
  "from-emerald-500 to-teal-700",
  "from-orange-500 to-red-600",
  "from-indigo-600 to-purple-800",
  "from-slate-700 to-slate-900",
  "from-rose-500 to-orange-400",
  "from-cyan-500 to-blue-500",
];

const CATEGORIES = ["Website", "Apps", "Ads", "AI Automation"];

export default function PricingPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Website");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "pricingPlans"));
      const plansList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPlans(plansList);
    } catch (err) {
      console.error("Error loading plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (plan) => {
    const message = `Hi! I'm interested in the *${plan.name}* package (${plan.price} / ${plan.priceUSD}).`;
    window.open(
      `https://wa.me/2349043970401?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const savePlan = async (planData) => {
    try {
      const data = { ...planData, updatedAt: serverTimestamp() };
      if (editingPlan?.id) {
        await updateDoc(doc(db, "pricingPlans", editingPlan.id), data);
      } else {
        await addDoc(collection(db, "pricingPlans"), data);
      }
      await loadPlans();
      setEditingPlan(null);
      setShowAddModal(false);
    } catch (err) {
      alert("Error saving plan");
    }
  };

  const deletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this pricing plan?"))
      return;
    try {
      await deleteDoc(doc(db, "pricingPlans", planId));
      await loadPlans();
    } catch (err) {
      alert("Error deleting plan");
    }
  };

  const filteredPlans = plans.filter(
    (plan) => plan.category === activeCategory,
  );

  // 1. WELCOME OVERLAY SCREEN (Minimalist YC Style)
  if (showWelcome) {
    return (
      <div className="min-h-screen  bg-background relative overflow-hidden flex flex-col items-center justify-center text-foreground px-6 py-28">
        {/* Background Ambient FX */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.06] rounded-full blur-[140px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_20%,transparent_75%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-primary">
            our PRCING
          </span>

          <h1 className="font-sans mt-4 text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Invest in Solutions that <br />{" "}
            <span className="font-accent italic text-5xl md:text-7xl  font-normal text-[#FF8C38]">
              drive revenue.
            </span>
          </h1>

          <div className="relative mb-8 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-[#FF8C38] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
            <img
              src="https://firebasestorage.googleapis.com/v0/b/high-481fd.firebasestorage.app/o/general%2FPRICING.jpeg?alt=media&token=5ea37582-cb66-47a5-b104-4c9efd5179aa"
              alt="Pricing Overview"
              className="relative rounded-xl w-64 h-64 md:w-72 md:h-72 object-cover border border-border/80 shadow-2xl"
            />
          </div>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-md">
            Clear, outcome-focused packages tailored for fast-growing startups
            and enterprises.
          </p>

          <Button
            onClick={() => setShowWelcome(false)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white rounded-md px-8 h-12 font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            Explore Pricing <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // 2. LOADING STATE
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );

  // 3. MAIN PRICING PAGE
  return (
    <div className="min-h-screen bg-background pb-24 pt-28 md:pt-36 relative overflow-hidden">
      {/* Subtle Grid & Ambient Backdrops */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/[0.05] rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black_20%,transparent_75%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 md:px-10 max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="font-sans text-xs font-bold tracking-widest uppercase text-primary">
              Flat-Rate & Custom Packages
            </span>

            <h1 className="font-sans mt-4 text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-3">
              Transparent{" "}
              <span className="font-accent italic font-normal text-[#FF8C38]">
                pricing plans.
              </span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Predictable costs, no hidden fees. Select a package below or reach
              out for custom enterprise builds.
            </p>
          </div>

          {isAdmin && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#FF8C38] hover:bg-[#e67e32] text-white rounded-md px-6 h-11 font-medium shrink-0 shadow-md shadow-[#FF8C38]/20"
            >
              <Plus className="mr-2 w-4 h-4" /> Add Package
            </Button>
          )}
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-10 no-scrollbar">
          <div className="inline-flex p-1.5 rounded-xl bg-muted/60 border border-border/80 gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-background text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        {filteredPlans.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/50 text-muted-foreground text-sm">
            No packages available in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {filteredPlans.map((plan) => {
              const planColor = plan.color || "from-purple-600 to-blue-600";

              return (
                <div
                  key={plan.id}
                  className="group relative bg-gradient-to-br from-card via-card to-muted/30 border border-border/80 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                >
                  {/* Top Gradient Accent Line */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${planColor}`}
                  />

                  <div className="p-7 md:p-8 flex-grow">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                          {plan.category || activeCategory}
                        </span>
                        <h3 className="font-sans text-2xl font-bold text-foreground">
                          {plan.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-border/60">
                      <span className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                        {plan.price}
                      </span>
                      {plan.priceUSD && (
                        <span className="text-sm font-medium text-muted-foreground">
                          / ${plan.priceUSD}+ USD
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features?.slice(0, 5).map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs md:text-sm text-muted-foreground"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-primary shrink-0 mt-0.5"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Actions */}
                  <div className="p-7 md:p-8 pt-0 flex flex-col gap-3">
                    <Button
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full bg-primary hover:bg-primary/90 text-white rounded-md h-11 font-medium shadow-md shadow-primary/10 transition-colors"
                    >
                      View Package Details & Order
                    </Button>

                    {isAdmin && (
                      <div className="flex gap-2 pt-3 border-t border-border/60 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-md text-xs font-medium"
                          onClick={() => setEditingPlan(plan)}
                        >
                          <Edit2 size={14} className="mr-1.5" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 rounded-md text-xs font-medium"
                          onClick={() => deletePlan(plan.id)}
                        >
                          <Trash2 size={14} className="mr-1.5" /> Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      {selectedPlan && !editingPlan && (
        <PlanModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onWhatsApp={handleWhatsApp}
        />
      )}

      {(editingPlan || showAddModal) && (
        <EditPlanModal
          plan={editingPlan}
          onClose={() => {
            setEditingPlan(null);
            setShowAddModal(false);
          }}
          onSave={savePlan}
        />
      )}
    </div>
  );
}

// 4. PLAN DETAILS MODAL (USER VIEW)
function PlanModal({ plan, onClose, onWhatsApp }) {
  const planColor = plan.color || "from-purple-600 to-blue-600";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div
          className={`p-6 md:p-8 bg-gradient-to-r ${planColor} text-white relative flex items-start justify-between`}
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-white/80 block mb-1">
              Package Breakdown
            </span>
            <h2 className="font-sans text-2xl md:text-3xl font-bold">
              {plan.name}
            </h2>
            <p className="text-lg md:text-xl font-medium text-white/90 mt-1">
              {plan.price} {plan.priceUSD ? `(/ $${plan.priceUSD}+)` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-grow">
          <div>
            <h3 className="font-sans text-xs font-bold text-primary uppercase tracking-widest mb-4">
              Included Deliverables & Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.features?.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs md:text-sm text-foreground/80 bg-muted/40 border border-border/50 p-2.5 rounded-lg"
                >
                  <CheckCircle2
                    size={16}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={() => onWhatsApp(plan)}
            className={`w-full h-12 text-sm md:text-base font-medium rounded-md bg-gradient-to-r ${planColor} text-white shadow-lg hover:opacity-95 transition-opacity`}
          >
            <MessageSquare className="mr-2 w-4 h-4" /> Order Package via
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

// 5. EDIT PLAN MODAL (ADMIN VIEW)
function EditPlanModal({ plan, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    priceUSD: "",
    category: "Website",
    color: "from-purple-600 to-pink-600",
    features: [""],
    ...plan,
  });

  const handleArrayChange = (field, index, val) => {
    const arr = [...formData[field]];
    arr[index] = val;
    setFormData({ ...formData, [field]: arr });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="font-sans text-xl font-bold text-foreground">
            {plan ? "Edit Pricing Plan" : "Add New Pricing Plan"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
              Category
            </label>
            <select
              value={formData.category || "Website"}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full p-3 border border-input bg-background text-foreground text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Plan Name",
                key: "name",
                placeholder: "e.g., Enterprise Web",
              },
              {
                label: "Price (Naira)",
                key: "price",
                placeholder: "₦3,500,000",
              },
              { label: "Price (USD)", key: "priceUSD", placeholder: "2500" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  {label}
                </label>
                <input
                  value={formData[key]}
                  placeholder={placeholder}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="w-full p-2.5 border border-input bg-background text-foreground text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
              Gradient Accent Theme
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5">
              {PRESET_GRADIENTS.map((grad) => (
                <button
                  key={grad}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: grad })}
                  className={`h-9 w-full rounded-lg bg-gradient-to-r ${grad} border-2 flex items-center justify-center transition-all ${
                    formData.color === grad
                      ? "border-foreground scale-105 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {formData.color === grad && (
                    <Check size={14} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Deliverables / Features
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFormData({
                    ...formData,
                    features: [...formData.features, ""],
                  })
                }
                className="text-xs text-primary hover:text-primary/80"
              >
                + Add Feature
              </Button>
            </div>
            <div className="space-y-2">
              {formData.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={f}
                    placeholder={`Feature ${i + 1}`}
                    onChange={(e) =>
                      handleArrayChange("features", i, e.target.value)
                    }
                    className="flex-1 p-2 border border-input bg-background text-foreground text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        features: formData.features.filter(
                          (_, idx) => idx !== i,
                        ),
                      })
                    }
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-md">
            Cancel
          </Button>
          <Button
            onClick={() => onSave(formData)}
            className="bg-primary hover:bg-primary/90 text-white rounded-md font-medium px-6"
          >
            Save Pricing Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

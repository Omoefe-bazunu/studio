"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  Loader2,
  Maximize2,
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
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ADMIN_EMAIL = "raniem57@gmail.com";

export default function PricingPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Admin Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, []);

  // 2. Load Plans
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
    const message = `Hi! I'm interested in the *${plan.name}* package (${plan.price}).`;
    window.open(
      `https://wa.me/2349043970401?text=${encodeURIComponent(message)}`,
      "_blank"
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

  if (showWelcome) {
    return (
      <>
        <Header />
        <div className="min-h-screen py-16 bg-[#0F0A1F] relative overflow-hidden flex flex-col items-center justify-center text-white px-6">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 50%, #6B46C1 0%, transparent 75%)`,
            }}
          />
          <div className="relative z-10 text-center space-y-8 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              WEBSITE <span className="text-[#FF8C38]">PRICING.</span>
            </h1>
            <div className="relative inline-block">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/high-481fd.firebasestorage.app/o/pricing.jpeg?alt=media&token=115c924d-7688-4f3c-9978-b77572b17ae3"
                alt="Pricing"
                className="relative rounded-lg w-72 h-72 object-cover border border-white/10"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-[#FF8C38]">
                HIGH-ER ENTERPRISES
              </h2>
              <p className="text-xl text-slate-400">
                Tailored engineering packages for your business goals.
              </p>
            </div>
            <Button
              onClick={() => setShowWelcome(false)}
              className="bg-[#6B46C1] hover:bg-[#5a3aaa] rounded-full px-12 h-16 text-lg font-bold transition-transform hover:scale-105"
            >
              View Packages
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F0A1F]">
        <Loader2 className="animate-spin text-white w-12 h-12" />
      </div>
    );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                Pricing Plans
              </h1>
              <p className="text-slate-500">
                Scalable website solutions for every stage of growth.
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-[#FF8C38] hover:bg-[#e67e32] rounded-full px-8 h-12"
              >
                <Plus className="mr-2 w-5 h-5" /> Add Package
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border-none shadow-xl flex flex-col rounded-lg overflow-hidden transition-all hover:translate-y-[-5px]"
              >
                <div
                  className={`h-2 bg-gradient-to-r ${
                    plan.color || "from-purple-600 to-blue-600"
                  }`}
                />
                <div className="p-8 flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-black text-[#6B46C1] mb-6">
                    {plan.price}
                  </div>
                  <ul className="space-y-4">
                    {plan.features?.slice(0, 5).map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-slate-600 text-sm"
                      >
                        <Check
                          size={18}
                          className="text-green-500 flex-shrink-0"
                        />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0 flex flex-col gap-4">
                  <Button
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full bg-gradient-to-r ${plan.color} rounded-full font-bold`}
                  >
                    View Details
                  </Button>
                  {isAdmin && (
                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-full"
                        onClick={() => setEditingPlan(plan)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 rounded-full"
                        onClick={() => deletePlan(plan.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- MODALS --- */}
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
      <Footer />
    </>
  );
}

/**
 * Component: Plan Details Modal
 */
function PlanModal({ plan, onClose, onWhatsApp }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-none shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div
          className={`p-8 bg-gradient-to-r ${plan.color} text-white flex justify-between items-center`}
        >
          <div>
            <h2 className="text-3xl font-bold">{plan.name}</h2>
            <p className="text-xl opacity-90">{plan.price}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        <div className="p-8 space-y-8">
          <div>
            <h3 className="font-bold text-[#6B46C1] uppercase tracking-widest text-sm mb-4">
              Core Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.features?.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-600">
                  <Check size={18} className="text-green-500" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <Button
            onClick={() => onWhatsApp(plan)}
            className={`w-full h-14 text-lg font-bold rounded-full bg-gradient-to-r ${plan.color}`}
          >
            ORDER THIS PACKAGE
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Component: Edit/Add Plan Modal
 */
function EditPlanModal({ plan, onClose, onSave }) {
  const [formData, setFormData] = useState(
    plan || {
      name: "",
      price: "",
      color: "from-purple-600 to-pink-600",
      features: [""],
      perfectFor: [""],
      renewals: [""],
    }
  );

  const handleArrayChange = (field, index, val) => {
    const arr = [...formData[field]];
    arr[index] = val;
    setFormData({ ...formData, [field]: arr });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {plan ? "Edit Plan" : "Add New Plan"}
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                Plan Name
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border rounded-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                Price (e.g. ₦150k)
              </label>
              <input
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-3 border rounded-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">
              Features (one per line)
            </label>
            {formData.features.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={f}
                  onChange={(e) =>
                    handleArrayChange("features", i, e.target.value)
                  }
                  className="flex-1 p-2 border rounded-none"
                />
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      features: formData.features.filter((_, idx) => idx !== i),
                    })
                  }
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFormData({
                  ...formData,
                  features: [...formData.features, ""],
                })
              }
              className="rounded-full"
            >
              Add Feature
            </Button>
          </div>

          <Button
            onClick={() => onSave(formData)}
            className="w-full bg-[#6B46C1] rounded-full h-12 font-bold"
          >
            SAVE PRICING PLAN
          </Button>
        </div>
      </div>
    </div>
  );
}

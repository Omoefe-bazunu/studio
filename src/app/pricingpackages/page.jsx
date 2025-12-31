"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, Check } from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/firebase";

const initialPlans = [
  {
    name: "STARTER WEBSITE",
    price: "₦150,000",
    color: "from-purple-600 to-pink-600",
    perfectFor: [
      "Small businesses",
      "Personal brands",
      "Freelancers",
      "Portfolio showcase",
    ],
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Contact form",
      "Basic SEO",
      "Social media integration",
      "30-day support",
    ],
    renewals: [
      "Domain renewal: ₦15,000/year",
      "Hosting: ₦25,000/year",
      "SSL Certificate: Included",
    ],
  },
  {
    name: "COMPANY WEBSITE",
    price: "₦350,000",
    color: "from-blue-600 to-cyan-600",
    perfectFor: [
      "Growing businesses",
      "Corporate entities",
      "Service providers",
      "Professional firms",
    ],
    features: [
      "Up to 15 pages",
      "Advanced responsive design",
      "CMS integration",
      "Advanced SEO",
      "Blog functionality",
      "Contact forms & chat",
      "90-day support",
      "Google Analytics",
    ],
    renewals: [
      "Domain renewal: ₦15,000/year",
      "Hosting: ₦45,000/year",
      "SSL Certificate: Included",
      "Maintenance: ₦30,000/year",
    ],
  },
  {
    name: "ECOMMERCE WEBSITE",
    price: "₦650,000",
    color: "from-green-600 to-emerald-600",
    perfectFor: [
      "Online retailers",
      "Product sellers",
      "Digital marketplace",
      "Fashion & lifestyle brands",
    ],
    features: [
      "Unlimited products",
      "Shopping cart & checkout",
      "Payment gateway integration",
      "Inventory management",
      "Order tracking",
      "Customer accounts",
      "Advanced SEO",
      "Mobile app ready",
      "6-month support",
    ],
    renewals: [
      "Domain renewal: ₦15,000/year",
      "Hosting: ₦80,000/year",
      "SSL Certificate: Included",
      "Maintenance: ₦60,000/year",
      "Payment gateway fees: 1.5%",
    ],
  },
  {
    name: "CUSTOM",
    price: "Custom Quote",
    color: "from-orange-600 to-red-600",
    perfectFor: [
      "Large corporations",
      "Complex projects",
      "Multi-platform solutions",
      "Custom functionality needs",
    ],
    features: [
      "Unlimited pages",
      "Custom design & development",
      "API integrations",
      "Advanced security",
      "Scalable architecture",
      "Multi-language support",
      "Dedicated account manager",
      "1-year premium support",
      "Training included",
    ],
    renewals: [
      "Custom maintenance plan",
      "Dedicated support package",
      "Priority updates",
      "Flexible hosting solutions",
    ],
  },
];

export default function PricingPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const admin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      setIsAdmin(!!admin);
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

      if (snapshot.empty) {
        await addInitialPlans();
        setPlans(initialPlans.map((p, i) => ({ id: `plan-${i}`, ...p })));
      } else {
        setPlans(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    } catch (err) {
      console.error(err);
      setPlans(initialPlans.map((p, i) => ({ id: `plan-${i}`, ...p })));
    } finally {
      setLoading(false);
    }
  };

  const addInitialPlans = async () => {
    for (const plan of initialPlans) {
      await addDoc(collection(db, "pricingPlans"), plan);
    }
  };

  const handleWhatsApp = (plan) => {
    const message = `Hi! I'm interested in the *${plan.name}* package (${plan.price}).\n\nI'd like to know more about getting started.`;
    window.open(
      `https://wa.me/2349043970401?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const savePlan = async (planData) => {
    try {
      if (editingPlan?.id) {
        await updateDoc(doc(db, "pricingPlans", editingPlan.id), planData);
      } else {
        await addDoc(collection(db, "pricingPlans"), planData);
      }
      await loadPlans();
      setEditingPlan(null);
      setShowAddModal(false);
    } catch (err) {
      alert("Error saving plan");
    }
  };

  const deletePlan = async (planId) => {
    if (!confirm("Delete this plan?")) return;
    try {
      await deleteDoc(doc(db, "pricingPlans", planId));
      await loadPlans();
    } catch (err) {
      alert("Error deleting plan");
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-white">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-2 tracking-tight">
              WEBSITE PRICING PACKAGE
            </h1>
            <div className="w-32 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="mb-12 relative group">
            <div className="absolute -inset-4 bg-white opacity-20 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-2 rounded-3xl border-4 border-white/30 shadow-2xl">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/high-481fd.firebasestorage.app/o/pricing.jpeg?alt=media&token=115c924d-7688-4f3c-9978-b77572b17ae3"
                alt="Professional"
                className="w-80 h-80 object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="text-center mb-12 max-w-2xl">
            <p className="text-2xl font-light mb-3">Welcome To</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              HIGH-ER ENTREPRISES
            </h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              Wea are Pleased to help you
              <br />
              get the best WEBSITE for
              <br />
              your goals.
            </p>
          </div>

          <button
            onClick={() => setShowWelcome(false)}
            className="group relative px-12 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full text-black font-bold text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-3">
              View Pricing Packages
              <svg
                className="w-6 h-6 group-hover:translate-x-2 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white text-xl">
        Loading plans...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-300">
            Tailored solutions for every business need
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} /> Add New Plan
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${plan.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
              ></div>

              <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-500 transition-all hover:transform hover:scale-105 cursor-pointer h-full flex flex-col">
                <div onClick={() => setSelectedPlan(plan)} className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 text-wrap ">
                    {plan.name}
                  </h3>
                  <div
                    className={`text-3xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent mb-6`}
                  >
                    {plan.price}
                  </div>
                  <div className="space-y-3">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-gray-300"
                      >
                        <Check
                          size={20}
                          className="text-green-400 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <p className="text-purple-400 text-sm font-semibold">
                        +{plan.features.length - 4} more features
                      </p>
                    )}
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlan(plan);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlan(plan.id);
                      }}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`mt-4 w-full py-3 bg-gradient-to-r ${plan.color} text-white rounded-lg font-bold hover:shadow-lg transition-all`}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowWelcome(true)}
          className="mt-12 mx-auto block px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all"
        >
          ← Back to Welcome
        </button>
      </div>

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

function PlanModal({ plan, onClose, onWhatsApp }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className={`bg-gradient-to-r ${plan.color} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
          <p className="text-3xl font-black text-white mt-2">{plan.price}</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-3">
              Perfect For
            </h3>
            <ul className="space-y-2">
              {plan.perfectFor.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Features</h3>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <Check
                    size={20}
                    className="text-green-400 flex-shrink-0 mt-0.5"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-400 mb-3">
              Annual Renewals
            </h3>
            <ul className="space-y-2">
              {plan.renewals.map((renewal, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {renewal}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onWhatsApp(plan)}
            className={`w-full py-4 bg-gradient-to-r ${plan.color} text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95`}
          >
            GET THIS PACKAGE
          </button>
        </div>
      </div>
    </div>
  );
}

function EditPlanModal({ plan, onClose, onSave }) {
  const [formData, setFormData] = useState(
    plan || {
      name: "",
      price: "",
      color: "from-purple-600 to-pink-600",
      perfectFor: [""],
      features: [""],
      renewals: [""],
    }
  );

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-bold text-white">
            {plan ? "Edit Plan" : "Add New Plan"}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-white mb-2">Plan Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Price</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Color Gradient</label>
            <select
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
            >
              <option value="from-purple-600 to-pink-600">
                Purple to Pink
              </option>
              <option value="from-blue-600 to-cyan-600">Blue to Cyan</option>
              <option value="from-green-600 to-emerald-600">
                Green to Emerald
              </option>
              <option value="from-orange-600 to-red-600">Orange to Red</option>
            </select>
          </div>

          {["perfectFor", "features", "renewals"].map((field) => (
            <div key={field}>
              <label className="block text-white mb-2 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              {formData[field].map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleArrayChange(field, index, e.target.value)
                    }
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 outline-none"
                  />
                  <button
                    onClick={() => removeArrayItem(field, index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem(field)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={18} /> Add Item
              </button>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              onClick={() => onSave(formData)}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-xl transition-all"
            >
              Save Plan
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

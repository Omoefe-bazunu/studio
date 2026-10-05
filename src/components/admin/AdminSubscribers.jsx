"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import {
  Loader2,
  Mail,
  Calendar,
  User,
  Copy,
  Check,
  Trash2,
} from "lucide-react";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "newsletterSubscribers"),
          orderBy("subscribedAt", "desc"),
        );
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubscribers(data);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const handleCopy = async (email, id) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subscriber?"))
      return;

    try {
      // Optimistic update to UI
      setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
      // Delete document from Firestore
      await deleteDoc(doc(db, "newsletterSubscribers", id));
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("Failed to delete subscriber. Please try again.");
    }
  };

  // Helper to format Firebase timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground uppercase italic tracking-tighter flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Newsletter Subscribers
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Manage and view your active mailing list.
          </p>
        </div>
        <div className="bg-muted px-4 py-2 rounded-xl border border-border">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Total Active
          </span>
          <div className="text-xl font-black text-foreground leading-none mt-1">
            {loading ? "..." : subscribers.length}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Subscriber Name
              </th>
              <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Email Address
              </th>
              <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Date Joined
              </th>
              <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                  <div className="flex justify-center">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                  </div>
                </td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                  <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">
                    No subscribers found.
                  </p>
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        {subscriber.name || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-foreground">
                    {subscriber.email}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-[#FF8C38]" />
                      {formatDate(subscriber.subscribedAt)}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          handleCopy(subscriber.email, subscriber.id)
                        }
                        className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border"
                        title="Copy Email Address"
                      >
                        {copiedId === subscriber.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                        title="Delete Subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

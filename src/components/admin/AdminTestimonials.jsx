"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    role: "",
    content: "",
    rating: 5,
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "testimonials"),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      clientName: testimonial.clientName,
      companyName: testimonial.companyName,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      clientName: "",
      companyName: "",
      role: "",
      content: "",
      rating: 5,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update
        const docRef = doc(db, "testimonials", editingId);
        await updateDoc(docRef, { ...formData });
      } else {
        // Create
        await addDoc(collection(db, "testimonials"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      }
      handleCancelEdit();
      await fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;
    try {
      await deleteDoc(doc(db, "testimonials", id));
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-8">
          Manage Testimonials
        </h1>

        {/* Add/Edit Form */}
        <div className="bg-card border border-border p-6 md:p-8 rounded-2xl mb-10 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            {editingId ? (
              <Pencil className="w-5 h-5 text-primary" />
            ) : (
              <Plus className="w-5 h-5 text-primary" />
            )}
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. TechCorp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. CEO"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Review Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="What did the client say about your services?"
              ></textarea>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                    ? "Update Testimonial"
                    : "Save Testimonial"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Testimonials List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Content snippet</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-8 text-center text-muted-foreground"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : testimonials.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-8 text-center text-muted-foreground"
                    >
                      No testimonials found. Add one above.
                    </td>
                  </tr>
                ) : (
                  testimonials.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-border hover:bg-secondary/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold">{t.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {t.role}
                          {t.companyName && ` @ ${t.companyName}`}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[#FF8C38] font-bold">
                          {t.rating} ★
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate text-muted-foreground">
                        {t.content}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(t)}
                            className="p-2 text-muted-foreground hover:text-primary bg-secondary rounded-md transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 bg-secondary rounded-md transition-colors"
                            aria-label="Delete"
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
      </div>
    </div>
  );
}

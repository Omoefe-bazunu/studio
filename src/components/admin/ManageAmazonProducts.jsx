"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Upload,
  Loader2,
  Package,
  Link2,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  getAmazonProducts,
  addAmazonProduct,
  deleteAmazonProduct,
} from "@/lib/firebase/firestoreService";

export default function ManageAmazonProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    ctaLink: "",
    mainImage: null,
    extraImages: [],
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getAmazonProducts();
    setProducts(data.products);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addAmazonProduct(form);
      toast({ title: "Product Deployed" });
      setShowForm(false);
      loadProducts();
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">
          Amazon Inventory
        </h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#6B46C1] rounded-full"
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus size={16} className="mr-2" /> New Product
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6 animate-in fade-in zoom-in duration-300"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-slate-400">
                  Product Name
                </Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-slate-400">
                  CTA Link (Amazon)
                </Label>
                <Input
                  required
                  value={form.ctaLink}
                  onChange={(e) =>
                    setForm({ ...form, ctaLink: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-slate-400">
                Main Display Image
              </Label>
              <Input
                type="file"
                required
                onChange={(e) =>
                  setForm({ ...form, mainImage: e.target.files[0] })
                }
                className="rounded-xl h-24 border-dashed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black text-slate-400">
              Description
            </Label>
            <Textarea
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="rounded-2xl min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black text-slate-400">
              Extra Images (Max 3)
            </Label>
            <Input
              type="file"
              multiple
              onChange={(e) =>
                setForm({
                  ...form,
                  extraImages: Array.from(e.target.files).slice(0, 3),
                })
              }
              className="rounded-xl border-dashed"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-[#0F0A1F] uppercase font-black italic tracking-widest rounded-xl"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Publish to Shop"
            )}
          </Button>
        </form>
      )}

      <div className="grid gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.mainImageUrl}
                className="w-12 h-12 rounded-lg object-cover"
                alt="thumb"
              />
              <span className="font-bold text-slate-800">{p.name}</span>
            </div>
            <Button
              variant="ghost"
              onClick={async () => {
                await deleteAmazonProduct(p.id);
                loadProducts();
              }}
              className="text-red-500"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

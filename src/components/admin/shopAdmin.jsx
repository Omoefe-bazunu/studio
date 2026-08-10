"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  PlusCircle,
  Pencil,
  Trash2,
  ShoppingBag,
  ClipboardList,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  Video,
} from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/firebase";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
} from "@/lib/firebase/shopFirestoreService";
import { useToast } from "@/hooks/use-toast";

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const EMPTY_FORM = {
  name: "",
  slug: "",
  category: "",
  price: 0,
  currency: "NGN",
  description: "",
  features: [],
  imageUrl: "",
  imageFile: null,
  videoUrl: "",
  videoFile: null,
  type: "digital",
  externalUrl: "",
};

/* ── Upload helper (mirrors gallery) ── */
function uploadToStorage(file, path, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        onProgress(pct);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      },
    );
  });
}

/* ── Product Form Modal ── */
function ProductFormModal({ open, onClose, onSaved, editing }) {
  const { toast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [featuresText, setFeaturesText] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imgProgress, setImgProgress] = useState(0);
  const [vidProgress, setVidProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({ ...editing, imageFile: null, videoFile: null });
      setFeaturesText((editing.features || []).join("\n"));
      setPreviewUrl(editing.imageUrl || "");
    } else {
      setForm(EMPTY_FORM);
      setFeaturesText("");
      setPreviewUrl("");
    }
    setImgProgress(0);
    setVidProgress(0);
  }, [editing, open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: name === "price" ? Number(value) : value,
      };
      if (name === "name") next.slug = slugify(value);
      return next;
    });
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, imageFile: file }));
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleVideoFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, videoFile: file }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = form.slug || slugify(form.name);

      // Image upload
      let resolvedImageUrl = editing ? editing.imageUrl || "" : "";
      if (form.imageFile) {
        resolvedImageUrl = await uploadToStorage(
          form.imageFile,
          `shop/${slug}/image_${Date.now()}_${form.imageFile.name}`,
          setImgProgress,
        );
      }

      // Video upload
      let resolvedVideoUrl = editing ? editing.videoUrl || "" : "";
      if (form.videoFile) {
        resolvedVideoUrl = await uploadToStorage(
          form.videoFile,
          `shop/${slug}/video_${Date.now()}_${form.videoFile.name}`,
          setVidProgress,
        );
      }

      const payload = {
        ...form,
        imageUrl: resolvedImageUrl,
        videoUrl: resolvedVideoUrl,
        imageFile: null,
        videoFile: null,
        features: featuresText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      };

      if (editing) {
        await updateProduct(editing.id, payload);
        toast({ title: "Product updated" });
      } else {
        await addProduct(payload);
        toast({ title: "Product added" });
      }
      onSaved();
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-bold text-lg text-foreground">
            {editing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Social Media Content Pack"
              required
              className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Slug
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="auto-generated"
              className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground">
              URL: /shop/
              <span className="text-foreground">
                {form.slug || "your-slug"}
              </span>
            </p>
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Templates"
                required
                className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Price (NGN)
              </label>
              <input
                name="price"
                type="number"
                min={0}
                value={form.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Product Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors"
            >
              <option value="digital">⚡ Digital — Flutterwave payment</option>
              <option value="external">↗ External — redirect to URL</option>
            </select>
          </div>

          {/* External URL */}
          {form.type === "external" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                External URL
              </label>
              <input
                name="externalUrl"
                type="url"
                value={form.externalUrl}
                onChange={handleChange}
                placeholder="https://gumroad.com/..."
                required
                className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the product…"
              rows={3}
              required
              className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors resize-y"
            />
          </div>

          {/* Features */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              What&apos;s Included{" "}
              <span className="normal-case font-normal">(one per line)</span>
            </label>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder={
                "30 Canva templates\nEditable PSD files\nFull commercial license"
              }
              rows={4}
              className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors resize-y"
            />
          </div>

          {/* Image + Video uploads — side by side, mirrors gallery admin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-border py-5">
            {/* Image */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Product Image
              </label>
              {previewUrl && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary"
              />
              {imgProgress > 0 && imgProgress < 100 && (
                <div className="w-full h-[3px] bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${imgProgress}%` }}
                  />
                </div>
              )}
              {imgProgress === 100 && (
                <p className="text-[11px] text-primary flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Image uploaded
                </p>
              )}
            </div>

            {/* Video */}
            <div className="space-y-2">
              <label className="flex text-xs font-medium text-muted-foreground uppercase tracking-wider items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Demo Video
                <span className="normal-case font-normal text-muted-foreground/60">
                  (optional)
                </span>
              </label>
              {editing?.videoUrl && !form.videoFile && (
                <p className="text-[11px] text-muted-foreground">
                  Current:{" "}
                  <a
                    href={editing.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    View video
                  </a>
                </p>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFile}
                className="w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary"
              />
              {form.videoFile && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {form.videoFile.name}
                </p>
              )}
              {vidProgress > 0 && vidProgress < 100 && (
                <div className="w-full h-[3px] bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${vidProgress}%` }}
                  />
                </div>
              )}
              {vidProgress === 100 && (
                <p className="text-[11px] text-primary flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Video uploaded
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-full border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading…
                </>
              ) : editing ? (
                "Save Changes"
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Delete Confirm Dialog ── (unchanged) ── */
function DeleteDialog({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="font-bold text-foreground text-lg mb-2">
          Delete Product?
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          This will permanently remove the product. Existing orders will remain.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-full border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-full bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Admin Component ── (unchanged) ── */
export default function ShopAdminPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
      setOrdersLoaded(true);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    if (tab === "orders" && !ordersLoaded) fetchOrders();
  }, [tab, ordersLoaded, fetchOrders]);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      toast({ title: "Product deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  }

  const tabs = [
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "orders", label: "Orders", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#0F0A1F] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-300/60 mb-1">
            Admin Panel
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Shop Management
          </h1>
        </div>
      </div>

      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 flex" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors relative bottom-[-1px] ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-foreground">All Products</h2>
                <p className="text-sm text-muted-foreground">
                  {products.length} product{products.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </button>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No products yet. Add your first one.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-semibold text-foreground text-sm truncate">
                          {p.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                            p.type === "digital"
                              ? "bg-primary/10 text-primary"
                              : "bg-orange-100 text-[#FF8C38] dark:bg-orange-950/30 dark:text-orange-400"
                          }`}
                        >
                          {p.type === "digital" ? (
                            <>
                              <Zap className="w-2.5 h-2.5" />
                              digital
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-2.5 h-2.5" />
                              external
                            </>
                          )}
                        </span>
                        {p.videoUrl && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                            <Video className="w-2.5 h-2.5" />
                            video
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {p.category} · {formatPrice(p.price, p.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        /shop/{p.slug}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setFormOpen(true);
                        }}
                        aria-label={`Edit ${p.name}`}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        aria-label={`Delete ${p.name}`}
                        className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-foreground">All Orders</h2>
                <p className="text-sm text-muted-foreground">
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={fetchOrders}
                disabled={ordersLoading}
                className="px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {ordersLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No orders yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-foreground text-sm">
                            {o.customerName}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                              o.status === "success"
                                ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                : o.status === "failed"
                                  ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                            }`}
                          >
                            {o.status === "success" ? (
                              <>
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                {o.status}
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-2.5 h-2.5" />
                                {o.status}
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-0.5">
                          {o.customerEmail} · {o.customerPhone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Product:{" "}
                          <span className="text-foreground">
                            {o.productName}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Ref:{" "}
                          <span className="font-mono text-foreground">
                            {o.flutterwaveRef}
                          </span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-foreground">
                          {formatPrice(o.amount, o.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(o.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchProducts}
        editing={editingProduct}
      />
      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

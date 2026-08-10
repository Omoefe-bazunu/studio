"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Zap, ExternalLink } from "lucide-react";
import { getProducts } from "@/lib/firebase/shopFirestoreService";

const PAGE_SIZE = 8;

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function ProductCard({ product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1 ${
                product.type === "digital"
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-[#FF8C38]/90 text-white"
              }`}
            >
              {product.type === "digital" ? (
                <>
                  <Zap className="w-2.5 h-2.5" />
                  Digital
                </>
              ) : (
                <>
                  <ExternalLink className="w-2.5 h-2.5" />
                  External
                </>
              )}
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price, product.currency)}
            </span>
            <span className="text-xs font-semibold text-primary group-hover:underline">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))].sort();
    return ["All", ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "All")
      list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, activeCategory, search]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset scroll window on filter/search change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, search]);

  // Infinite scroll via IntersectionObserver
  const handleObserver = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setVisibleCount((prev) => prev + PAGE_SIZE);
      }
    },
    [hasMore],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-[#0F0A1F] py-14 overflow-hidden text-center">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 70%, #6B46C1 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-purple-200 text-xs mb-5">
            <ShoppingBag
              className="w-3.5 h-3.5 text-[#FF8C38]"
              aria-hidden="true"
            />
            <span>HIGH-ER Enterprises Shop</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Digital Products &{" "}
            <span className="text-[#FF8C38]">Resources.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto leading-relaxed">
            Get Digital and Physical products at amazing offers.
          </p>
        </div>
      </section>

      {/* Filters — gallery-style bordered tab container */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Category tabs in bordered pill group — matches gallery pattern */}
          <div className="flex flex-wrap items-center gap-1 border border-border p-1 rounded-lg bg-card">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 h-8 text-sm bg-secondary border-0 rounded-full outline-none text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-5 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="w-full flex justify-center py-8">
          {hasMore && (
            <span className="text-[11px] tracking-widest uppercase text-muted-foreground/40 font-medium animate-pulse">
              Loading more…
            </span>
          )}
        </div>

        {/* Footer count — matches gallery */}
        {!loading && filtered.length > 0 && (
          <div className="border-t border-border pt-6 text-[11px] tracking-widest uppercase text-muted-foreground/60">
            Showing {visibleProducts.length} of {filtered.length} product
            {filtered.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

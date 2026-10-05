"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ChevronDown,
  Maximize2,
  Search,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAmazonProducts } from "@/lib/firebase/firestoreService";

const PAGE_SIZE = 10;

export default function AmazonProductsPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [fullScreenImg, setFullScreenImg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAmazonProducts().then((data) => {
      setProducts(data.products);
      setFiltered(data.products);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(result);
    setCurrentPage(1); // reset to page 1 on new search
  }, [search, products]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page number array with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <section className="min-h-screen bg-[#F8FAFC] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-slate-900">
              Premium <span className="text-[#FF8C38]">Curations</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Amazing products from Amazon for your essential and everyday use.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by product name..."
                className="w-full h-14 pl-12 pr-6 rounded-full border-none shadow-lg shadow-slate-200 focus:ring-2 ring-[#6B46C1]"
              />
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-6">
              Showing {paginated.length} of {filtered.length} product
              {filtered.length !== 1 ? "s" : ""}
              {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
            </p>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-8">
            {paginated.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewImage={setFullScreenImg}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-32">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-11 w-11 flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="h-11 w-11 flex items-center justify-center text-slate-400 font-bold text-sm select-none"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`h-11 w-11 flex items-center justify-center rounded-full text-sm font-black uppercase tracking-wider transition-all ${
                      currentPage === page
                        ? "bg-[#FF8C38] text-white shadow-lg shadow-orange-500/30"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-[#FF8C38] hover:text-[#FF8C38]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-11 w-11 flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Full Screen Image Portal */}
        <AnimatePresence>
          {fullScreenImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            >
              <button
                onClick={() => setFullScreenImg(null)}
                className="absolute top-8 right-8 text-white"
              >
                <X size={32} />
              </button>
              <img
                src={fullScreenImg}
                className="max-w-full max-h-full object-contain"
                alt="Full view"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}

function ProductCard({ product, onViewImage }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-500">
      <div className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
        <div
          className="relative h-48 w-48 shrink-0 group cursor-pointer"
          onClick={() => onViewImage(product.mainImageUrl)}
        >
          <img
            src={product.mainImageUrl}
            className="w-full h-full object-cover rounded-3xl"
            alt={product.name}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
            <Maximize2 className="text-white" size={24} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            {product.name}
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <Calendar size={12} /> Published:{" "}
            {product.createdAt?.toLocaleDateString()}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <Button
            asChild
            className="h-14 px-8 bg-[#FF8C38] hover:bg-[#e67e32] rounded-full font-black uppercase italic tracking-widest shadow-lg shadow-orange-500/20"
          >
            <a href={product.ctaLink} target="_blank" rel="noreferrer">
              Check Price <ExternalLink size={16} className="ml-2" />
            </a>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#6B46C1] font-black uppercase text-xs tracking-widest"
          >
            {isExpanded ? "Hide Details" : "View Details"}{" "}
            <ChevronDown
              size={16}
              className={`ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-50"
          >
            <div className="p-10 bg-slate-50/50 space-y-8">
              <p className="text-slate-600 leading-relaxed text-lg max-w-4xl whitespace-pre-wrap">
                {product.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {product.extraImageUrls?.map((url, i) => (
                  <div
                    key={i}
                    className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer border border-white"
                    onClick={() => onViewImage(url)}
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      alt={`Extra ${i}`}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

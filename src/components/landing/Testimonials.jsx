"use client";

import React, { useState, useEffect } from "react";
import { Quote, Star } from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import DiscussProjectCTA from "../DiscussProjectCTA";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchTestimonials = async () => {
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

    fetchTestimonials();
  }, []);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };

    handleResize(); // Set initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure index doesn't break if window is resized
  useEffect(() => {
    const maxIndex = Math.max(0, testimonials.length - itemsPerView);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsPerView, testimonials.length, currentIndex]);

  // Auto-slide logic
  useEffect(() => {
    if (isHovered || testimonials.length <= itemsPerView) return;

    const maxIndex = testimonials.length - itemsPerView;
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1,
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [isHovered, testimonials.length, itemsPerView]);

  if (loading) {
    return (
      <section className="py-24 bg-[#0F0A1F] flex justify-center">
        <div className="w-8 h-8 border-4 border-[#6B46C1] border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-[#0F0A1F] relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#6B46C1]/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-sm font-bold tracking-widest uppercase text-[#6B46C1] mb-3">
            Client Success
          </h2>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="font-sans text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Businesses Trust Us <br />
              <span className="font-accent font-normal italic text-[#FF8C38]">
                with Their Growth
              </span>
            </h3>
          </div>
        </div>

        {/* Auto-Slider Container */}
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {testimonials.map((testimonial) => {
              const clientName = testimonial.clientName || "Valued Client";
              const role = testimonial.role || "Client";
              const initial = clientName.charAt(0).toUpperCase();

              return (
                <div
                  key={testimonial.id}
                  className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-4 flex flex-col"
                >
                  <div className="group relative h-full bg-[#140f25] border border-white/10 p-8 rounded-[2rem] hover:border-[#6B46C1]/50 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(107,70,193,0.3)] flex flex-col">
                    <Quote className="w-10 h-10 text-[#6B46C1]/40 mb-6 group-hover:text-[#6B46C1]/80 transition-colors" />

                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (testimonial.rating || 5)
                              ? "fill-[#FF8C38] text-[#FF8C38]"
                              : "fill-slate-700 text-slate-700"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-8 flex-grow">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-full bg-[#6B46C1] flex items-center justify-center font-heading font-bold text-white text-lg shrink-0 shadow-lg shadow-[#6B46C1]/20">
                        {initial}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-white">
                          {clientName}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {role}
                          {testimonial.companyName
                            ? `, ${testimonial.companyName}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Section-closing CTA */}
        <div className="mt-12 flex flex-col items-center text-center gap-4">
          <p className="text-sm text-slate-400">Ready to start your project?</p>
          <DiscussProjectCTA colorClassName="text-white bg-primary hover:bg-primary/90 hover:text-white/90 border border-primary" />
        </div>
      </div>
    </section>
  );
}

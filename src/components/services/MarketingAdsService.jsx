"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  CalendarDays,
  Sparkles,
  MessageCircle,
  PlusCircle,
  Loader2,
  Edit3,
  Trash2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getMarketingAdProjects,
  addMarketingAdProject,
  updateMarketingAdProject,
  deleteMarketingAdProject,
} from "@/lib/firebase/firestoreService";
import ProjectForm from "@/components/admin/ProjectForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MarketingAdsService({ initialProjectsData = [] }) {
  const { isAdmin, loadingAuth } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState(initialProjectsData);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [modal, setModal] = useState({
    open: false,
    edit: null,
    del: null,
    sub: false,
  });

  const whatsappLink = `https://wa.me/447344685126?text=${encodeURIComponent(
    "Hello High-ER Enterprises, I'm interested in your marketing and creative design services."
  )}`;

  const paginate = useCallback(
    (newDirection) => {
      setDirection(newDirection);
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + newDirection + projects.length) % projects.length
      );
    },
    [projects.length]
  );

  // Auto-slide effect
  useEffect(() => {
    if (projects.length <= 1 || modal.open) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [currentIndex, projects.length, paginate, modal.open]);

  const refresh = async () => {
    setLoading(true);
    try {
      setProjects(await getMarketingAdProjects());
    } catch (e) {
      toast({ title: "Sync Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    setModal((p) => ({ ...p, sub: true }));
    try {
      modal.edit
        ? await updateMarketingAdProject(modal.edit.id, data)
        : await addMarketingAdProject(data);
      toast({ title: "Portfolio Updated" });
      setModal((p) => ({ ...p, open: false, edit: null }));
      refresh();
    } catch (e) {
      toast({ title: "Save Failed", variant: "destructive" });
    } finally {
      setModal((p) => ({ ...p, sub: false }));
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteMarketingAdProject(modal.del);
      toast({ title: "Asset Removed" });
      setModal((p) => ({ ...p, del: null }));
      refresh();
    } catch (e) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  if (loadingAuth)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F0A1F]">
        <Loader2 className="animate-spin text-white w-12 h-12" />
      </div>
    );

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative py-24 bg-[#0F0A1F] text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, #FF8C38 0%, transparent 75%)`,
          }}
        />
        <div className="relative z-10 container mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-200 text-sm mb-8">
            <Megaphone className="w-4 h-4 text-[#FF8C38]" />{" "}
            <span>Creative Design Studio</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
            Designs that <span className="text-[#FF8C38]">Sell.</span>
          </h1>
          <p className="mt-8 text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed">
            Create eye-catchy and scroll-stopping visuals that communicates your
            message clearly in seconds.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full h-16 px-12 text-lg font-bold shadow-2xl transition-all hover:scale-105"
          >
            <Link href={whatsappLink} target="_blank">
              Start Your Design <MessageCircle className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 2. SLIDING PORTFOLIO SECTION */}
      <section className="py-24 bg-slate-50 min-h-[900px] flex flex-col justify-center">
        <div className="container mx-auto px-6">
          <div className="flex justify-between w-full text-center items-end mb-12">
            <div className=" w-full mx-auto text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Featured Work
              </h2>
              <p className="text-slate-500">
                A sliding showcase of our high-impact marketing assets.
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() =>
                  setModal((p) => ({ ...p, open: true, edit: null }))
                }
                className="bg-[#FF8C38] rounded-full px-8 hover:bg-[#e67e32]"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add Asset
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#6B46C1] h-12 w-12" />
            </div>
          ) : projects.length > 0 ? (
            <div className="relative max-w-5xl mx-auto h-[800px] md:h-[600px]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Card className="h-full w-full flex flex-col md:flex-row border-none shadow-2xl rounded-lg overflow-hidden bg-white">
                    {/* Image Side - Increased height on mobile to 60% */}
                    <div
                      className="relative w-full md:w-3/5 h-[60%] md:h-full cursor-pointer group"
                      onClick={() =>
                        window.open(projects[currentIndex].imageSrc, "_blank")
                      }
                    >
                      <Image
                        src={projects[currentIndex].imageSrc}
                        alt={projects[currentIndex].title}
                        fill
                        className="object-cover"
                      />
                      {/* Permanent Full-screen Hint Overlay */}
                      <div className="absolute inset-0 bg-black/10 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 p-4 rounded-full shadow-xl">
                          <Maximize2 className="w-6 h-6 text-[#6B46C1]" />
                        </div>
                      </div>
                    </div>

                    {/* Content Side - Adjusted for mobile fit */}
                    <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-center relative bg-white">
                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModal((p) => ({
                                ...p,
                                open: true,
                                edit: projects[currentIndex],
                              }));
                            }}
                          >
                            <Edit3 className="w-4 h-4 text-[#6B46C1]" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModal((p) => ({
                                ...p,
                                del: projects[currentIndex].id,
                              }));
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <Badge className="w-fit mb-4 md:mb-6 bg-orange-100 text-[#FF8C38] rounded-full border-none px-4 font-bold">
                        {projects[currentIndex].category}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-4">
                        {projects[currentIndex].title}
                      </h3>
                      <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-4 md:mb-8 line-clamp-3 md:line-clamp-none">
                        {projects[currentIndex].description}
                      </p>
                      <div className="mt-auto pt-4 md:pt-6 border-t border-slate-100 flex items-center text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-tighter">
                        <CalendarDays className="w-4 h-4 mr-2 text-[#6B46C1]" />
                        Campaign Date:{" "}
                        {new Date(
                          projects[currentIndex].deliveryDate
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 z-20">
                <Button
                  onClick={() => paginate(-1)}
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg bg-white border-slate-100 text-[#6B46C1] hover:bg-[#6B46C1] hover:text-white transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              </div>
              <div className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 z-20">
                <Button
                  onClick={() => paginate(1)}
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg bg-white border-slate-100 text-[#6B46C1] hover:bg-[#6B46C1] hover:text-white transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              {/* Slider Indicators */}
              <div className="absolute -bottom-16 md:-bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      i === currentIndex
                        ? "w-8 bg-[#6B46C1]"
                        : "w-2 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200">
              <p className="text-slate-400">Our portfolio is being updated.</p>
            </div>
          )}
        </div>
      </section>

      {/* Admin Logic */}
      {isAdmin && (
        <ProjectForm
          isOpen={modal.open}
          onOpenChange={(v) => setModal((p) => ({ ...p, open: v }))}
          onSubmit={handleFormSubmit}
          initialData={modal.edit}
          isLoading={modal.sub}
        />
      )}
      <AlertDialog
        open={!!modal.del}
        onOpenChange={() => setModal((p) => ({ ...p, del: null }))}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive rounded-full"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  CalendarDays,
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProjectForm from "@/components/admin/ProjectForm";

// ─── Firebase imports ────────────────────────────────────────────────────────
import { db, storage } from "@/lib/firebase/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// ─── Firebase helpers ────────────────────────────────────────────────────────

/** Upload a single file to Firebase Storage and return its download URL. */
const uploadFile = async (file, folderPath) => {
  const ext = file.name.split(".").pop();
  const storageRef = ref(storage, `${folderPath}/${uuidv4()}.${ext}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

const marketingAdProjectsRef = collection(db, "marketingAdProjects");

/** Fetch all marketing ad projects ordered by delivery date. */
const getMarketingAdProjects = async () => {
  const q = query(marketingAdProjectsRef, orderBy("deliveryDate", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      deliveryDate:
        data.deliveryDate?.toDate().toISOString().split("T")[0] ?? "",
      createdAt:
        data.createdAt?.toDate().toISOString() ?? new Date(0).toISOString(),
      updatedAt:
        data.updatedAt?.toDate().toISOString() ?? new Date(0).toISOString(),
    };
  });
};

/** Add a new marketing ad project (uploads image file if present). */
const addMarketingAdProject = async (data) => {
  let url = data.imageSrc ?? "";
  if (data.imageFile)
    url = await uploadFile(
      data.imageFile,
      `marketingAdProjectImages/mad_${Date.now()}`,
    );
  const { imageFile, ...rest } = data;
  await addDoc(marketingAdProjectsRef, {
    ...rest,
    imageSrc: url,
    category: "Marketing & Ads Design",
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/** Update an existing marketing ad project. */
const updateMarketingAdProject = async (id, data) => {
  let url = data.imageSrc ?? "";
  if (data.imageFile)
    url = await uploadFile(data.imageFile, `marketingAdProjectImages/${id}`);
  const { imageFile, ...rest } = data;
  await updateDoc(doc(db, "marketingAdProjects", id), {
    ...rest,
    imageSrc: url,
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    updatedAt: serverTimestamp(),
  });
};

/** Delete a marketing ad project by ID. */
const deleteMarketingAdProject = (id) =>
  deleteDoc(doc(db, "marketingAdProjects", id));

// ─── Constants ───────────────────────────────────────────────────────────────
const WHATSAPP_LINK = `https://wa.me/2349043970401?text=${encodeURIComponent(
  "Hello High-ER Enterprises, I'm interested in your marketing and creative design services.",
)}`;

// ─── Main Component ───────────────────────────────────────────────────────────
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

  useEffect(() => {
    refresh();
  }, []);

  const paginate = useCallback(
    (d) => {
      setDirection(d);
      setCurrentIndex((p) => (p + d + projects.length) % projects.length);
    },
    [projects.length],
  );

  // Auto-advance carousel every 6 s (pause when a modal is open)
  useEffect(() => {
    if (projects.length <= 1 || modal.open) return;
    const t = setInterval(() => paginate(1), 6000);
    return () => clearInterval(t);
  }, [currentIndex, projects.length, paginate, modal.open]);

  const refresh = async () => {
    setLoading(true);
    try {
      setProjects(await getMarketingAdProjects());
    } catch (e) {
      toast({
        title: "Sync Error",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setModal((p) => ({ ...p, sub: true }));
    try {
      const submissionData = {
        ...formData,
        imageFile: formData.screenshots?.[0]?.file ?? null,
        imageSrc: formData.screenshots?.[0]?.url ?? formData.imageSrc ?? "",
      };
      delete submissionData.screenshots;

      if (modal.edit) {
        await updateMarketingAdProject(modal.edit.id, submissionData);
        toast({
          title: "Portfolio Updated",
          description: "The design asset is now live.",
        });
      } else {
        await addMarketingAdProject(submissionData);
        toast({
          title: "Portfolio Updated",
          description: "The design asset is now live.",
        });
      }
      setModal((p) => ({ ...p, open: false, edit: null }));
      refresh();
    } catch (e) {
      toast({
        title: "Save Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setModal((p) => ({ ...p, sub: false }));
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteMarketingAdProject(modal.del);
      setProjects((prev) => prev.filter((p) => p.id !== modal.del));
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
      toast({ title: "Asset Removed" });
    } catch {
      toast({ title: "Delete Failed", variant: "destructive" });
    } finally {
      setModal((p) => ({ ...p, del: null }));
    }
  };

  if (loadingAuth) {
    return (
      <div
        className="h-screen flex items-center justify-center bg-[#0F0A1F]"
        aria-busy="true"
      >
        <Loader2 className="animate-spin text-white w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative py-16 bg-[#0F0A1F] text-center overflow-hidden"
        aria-labelledby="marketing-hero-title"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #FF8C38 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-orange-200 text-xs mb-6">
            <Megaphone
              className="w-3.5 h-3.5 text-[#FF8C38]"
              aria-hidden="true"
            />
            <span>Creative Design Studio</span>
          </div>
          <h1
            id="marketing-hero-title"
            className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl mx-auto"
          >
            Designs that Sell <br />
            <span className="text-[#FF8C38]">Your Offer.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Eye-catchy, scroll-stopping visuals designed to communicate your
            message in seconds.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full h-14 px-10 text-base font-bold shadow-xl transition-all hover:scale-105"
          >
            <Link
              href={WHATSAPP_LINK}
              target="_blank"
              aria-label="Start your design project via WhatsApp"
            >
              Start Your Design{" "}
              <MessageCircle className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Sliding portfolio */}
      <section
        className="py-12 bg-slate-50 dark:bg-[#0F0A1F] min-h-[850px] flex flex-col justify-center overflow-hidden"
        aria-labelledby="featured-work-title"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-center md:text-left">
            <div className="w-full">
              <h2
                id="featured-work-title"
                className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-4 leading-none"
              >
                MARKETING & ADS DESIGN PROJECTS
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                A showcase of result-driven marketing and advertising assets
                delivered to clients across different industries and
                geographical regions.
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() =>
                  setModal((p) => ({ ...p, open: true, edit: null }))
                }
                className="bg-[#FF8C38] rounded-full px-8 hover:bg-[#e67e32] h-12 font-bold"
                aria-label="Add a new marketing asset"
              >
                <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" /> Add
                Asset
              </Button>
            )}
          </div>

          {loading ? (
            <div
              className="flex flex-col items-center justify-center py-20"
              aria-busy="true"
              aria-live="polite"
            >
              <Loader2 className="animate-spin text-[#6B46C1] h-12 w-12 mb-4" />
              <p className="text-slate-400 animate-pulse uppercase tracking-widest text-xs font-bold">
                Syncing Portfolio...
              </p>
            </div>
          ) : projects.length > 0 ? (
            <div className="relative max-w-5xl mx-auto">
              <div className="relative h-[700px] md:h-[600px] w-full">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0"
                  >
                    <Card className="h-full w-full flex flex-col md:flex-row border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden bg-white">
                      {/* Image side */}
                      <div
                        className="relative w-full md:w-3/5 h-[50%] md:h-full cursor-pointer group bg-slate-100"
                        onClick={() =>
                          window.open(projects[currentIndex].imageSrc, "_blank")
                        }
                        role="button"
                        tabIndex={0}
                        aria-label={`View full size image for ${projects[currentIndex].title}`}
                      >
                        <Image
                          src={projects[currentIndex].imageSrc}
                          alt={`Marketing design: ${projects[currentIndex].title}`}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 60vw"
                          className="object-contain md:object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/90 p-4 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                            <Maximize2
                              className="w-6 h-6 text-[#6B46C1]"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content side */}
                      <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center relative bg-white dark:bg-[#0F0A1F]">
                        {isAdmin && (
                          <div className="absolute top-6 right-6 flex gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-full border-slate-100 shadow-sm"
                              onClick={() =>
                                setModal((p) => ({
                                  ...p,
                                  open: true,
                                  edit: projects[currentIndex],
                                }))
                              }
                              aria-label={`Edit ${projects[currentIndex].title}`}
                            >
                              <Edit3
                                className="w-4 h-4 text-[#6B46C1]"
                                aria-hidden="true"
                              />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-10 w-10 rounded-full shadow-sm"
                              onClick={() =>
                                setModal((p) => ({
                                  ...p,
                                  del: projects[currentIndex].id,
                                }))
                              }
                              aria-label={`Delete ${projects[currentIndex].title}`}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </div>
                        )}
                        <Badge className="w-fit mb-6 bg-orange-100 text-[#FF8C38] rounded-full border-none px-4 py-1 font-bold text-[10px] uppercase tracking-widest">
                          {projects[currentIndex].category}
                        </Badge>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tighter">
                          {projects[currentIndex].title}
                        </h3>
                        <p className="text-slate-500 dark-text-white text-lg leading-relaxed mb-8 line-clamp-4 md:line-clamp-none">
                          {projects[currentIndex].description}
                        </p>
                        <div className="mt-auto pt-8 border-t border-slate-50 flex items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                          <CalendarDays
                            className="w-4 h-4 mr-2 text-[#6B46C1]"
                            aria-hidden="true"
                          />
                          <span>
                            Campaign Date:{" "}
                            {new Date(
                              projects[currentIndex].deliveryDate,
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <nav
                className="flex justify-center md:justify-start items-center gap-4 mt-12"
                aria-label="Portfolio navigation"
              >
                <Button
                  onClick={() => paginate(-1)}
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full shadow-xl bg-white border-none text-[#6B46C1] hover:bg-[#6B46C1] hover:text-white transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                </Button>
                <div className="flex gap-2 mx-4" role="tablist">
                  {projects.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > currentIndex ? 1 : -1);
                        setCurrentIndex(i);
                      }}
                      role="tab"
                      aria-selected={i === currentIndex}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? "w-10 bg-[#6B46C1]" : "w-2 bg-slate-200"}`}
                    />
                  ))}
                </div>
                <Button
                  onClick={() => paginate(1)}
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-full shadow-xl bg-white border-none text-[#6B46C1] hover:bg-[#6B46C1] hover:text-white transition-all"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          ) : (
            <div
              className="text-center py-32 bg-white dark:bg-[#0F0A1F] border-2 border-dashed border-slate-200 rounded-lg max-w-3xl mx-auto"
              role="status"
            >
              <Megaphone
                className="w-12 h-12 text-slate-200 mx-auto mb-4"
                aria-hidden="true"
              />
              <p className="text-slate-400 font-medium tracking-tight">
                Creative assets are being rendered.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Admin modals */}
      {isAdmin && (
        <ProjectForm
          isOpen={modal.open}
          onOpenChange={(v) => setModal((p) => ({ ...p, open: v }))}
          onSubmit={handleFormSubmit}
          initialData={
            modal.edit
              ? {
                  ...modal.edit,
                  screenshots: [
                    { url: modal.edit.imageSrc, hint: "Main Creative" },
                  ],
                }
              : null
          }
          isLoading={modal.sub}
        />
      )}

      <AlertDialog
        open={!!modal.del}
        onOpenChange={() => setModal((p) => ({ ...p, del: null }))}
      >
        <AlertDialogContent className="rounded-lg border-2 border-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl uppercase tracking-tighter italic">
              Confirm Asset Removal
            </AlertDialogTitle>
            <AlertDialogDescription>
              This asset will be permanently removed from the High-ER creative
              repository.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-full px-8">
              Abort
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8"
            >
              Delete Asset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CalendarDays,
  MessageCircle,
  PlusCircle,
  Loader2,
  Edit3,
  Trash2,
  Target,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import DiscussProjectCTA from "@/components/DiscussProjectCTA";

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
  onSnapshot,
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

/**
 * For each screenshot entry ({ file, url, hint }):
 *  - if it has a File object  → upload and collect the new URL
 *  - if it already has a URL  → keep it as-is
 */
const processScreenshots = async (screenshots = [], pathPrefix) => {
  const urls = [];
  const hints = [];
  for (const ss of screenshots) {
    if (ss.file) {
      urls.push(await uploadFile(ss.file, `projectScreenshots/${pathPrefix}`));
    } else if (ss.url) {
      urls.push(ss.url);
    }
    hints.push(ss.hint ?? "");
  }
  return { urls, hints };
};

const paidAdsProjectsRef = collection(db, "paidAdsProjects");

/** Subscribe to paidAdsProjects collection (real-time). Returns unsubscribe fn. */
const subscribeToPaidAdsProjects = (callback) => {
  const q = query(paidAdsProjectsRef, orderBy("deliveryDate", "desc"));
  return onSnapshot(q, (snap) => {
    const projects = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      deliveryDate:
        d.data().deliveryDate?.toDate().toISOString().split("T")[0] ?? "",
    }));
    callback(projects);
  });
};

/** Add a new paid ads project (uploads screenshots first). */
const addPaidAdsProject = async (data) => {
  const { urls, hints } = await processScreenshots(
    data.screenshots,
    `paidAds_${Date.now()}`,
  );
  const { screenshots, ...rest } = data;
  await addDoc(paidAdsProjectsRef, {
    ...rest,
    screenshots: urls,
    imageHints: hints,
    category: "Paid Ads",
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/** Update an existing paid ads project. */
const updatePaidAdsProject = async (id, data) => {
  const { urls, hints } = await processScreenshots(data.screenshots, id);
  const { screenshots, ...rest } = data;
  await updateDoc(doc(db, "paidAdsProjects", id), {
    ...rest,
    screenshots: urls,
    imageHints: hints,
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    updatedAt: serverTimestamp(),
  });
};

/** Delete a paid ads project by ID. */
const deletePaidAdsProject = (id) => deleteDoc(doc(db, "paidAdsProjects", id));

// ─── Constants ───────────────────────────────────────────────────────────────
const WHATSAPP_LINK = `https://wa.me/2349043970401?text=${encodeURIComponent(
  "Hello High-ER Enterprises, I'm interested in running paid ad campaigns for my business.",
)}`;

// ─── ProjectCard ─────────────────────────────────────────────────────────────
const ProjectCard = ({
  project,
  isAdmin,
  isPriority = false,
  onEdit,
  onDelete,
}) => {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const paginate = useCallback(
    (d) => {
      setDir(d);
      setIdx(
        (p) =>
          (p + d + project.screenshots.length) % project.screenshots.length,
      );
    },
    [project.screenshots.length],
  );

  // Auto-advance carousel every 5 s
  useEffect(() => {
    if (project.screenshots?.length <= 1) return;
    const t = setTimeout(() => paginate(1), 5000);
    return () => clearTimeout(t);
  }, [idx, paginate, project.screenshots]);

  return (
    <Card className="group overflow-hidden border-none shadow-xl flex flex-col bg-white dark:bg-[#0F0A1F] transition-all hover:-translate-y-1">
      <CardHeader className="p-0 relative aspect-video overflow-hidden bg-slate-100">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={{
              enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
              center: { zIndex: 1, x: 0, opacity: 1 },
              exit: (d) => ({ zIndex: 0, x: d < 0 ? 300 : -300, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={project.screenshots[idx]}
              alt={project.title}
              fill
              priority={isPriority}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel nav */}
        {project.screenshots.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 z-10 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-md rounded-full text-white"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-md rounded-full text-white"
              onClick={() => paginate(1)}
            >
              <ChevronRight />
            </Button>
          </div>
        )}

        {/* Admin controls */}
        {isAdmin && (
          <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/90 rounded-full"
              onClick={() => onEdit(project)}
            >
              <Edit3 className="h-4 w-4 text-[#6B46C1]" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-8 flex-grow">
        <CardTitle className="text-2xl font-bold text-slate-900 mb-3">
          <h3>{project.title}</h3>
        </CardTitle>

        <div className="relative mb-6">
          <motion.div
            animate={{ height: isExpanded ? "auto" : "72px" }}
            initial={false}
            className="overflow-hidden text-slate-500 text-sm leading-relaxed"
          >
            <p>{project.description}</p>
          </motion.div>
          {project.description?.length > 120 && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="text-[#6B46C1] text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1 hover:underline"
            >
              {isExpanded ? "Show Less" : "Read Full Breakdown"}
              <ChevronRight
                size={12}
                className={isExpanded ? "rotate-[270deg]" : "rotate-90"}
              />
            </button>
          )}
        </div>

        <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          <CalendarDays className="h-4 w-4 mr-2 text-[#FF8C38]" />
          <span>Deployed: {project.deliveryDate}</span>
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-3">
        <Button
          asChild
          className="flex-1 h-16 rounded-none bg-[#0F0A1F] hover:bg-[#6B46C1] text-white font-black uppercase italic tracking-tighter shadow-2xl transition-all active:scale-95"
        >
          <Link href={project.liveUrl || "#"} target="_blank">
            VIEW CAMPAIGN <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {project.sourceCodeUrl && (
          <Button
            asChild
            variant="outline"
            className="flex-1 h-16 rounded-none border-2 border-[#0F0A1F] text-[#0F0A1F] hover:bg-[#0F0A1F] hover:text-white font-black uppercase italic tracking-tighter shadow-xl transition-all active:scale-95"
          >
            <Link href={project.sourceCodeUrl} target="_blank">
              REPORT <Laptop className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PaidAdsDevelopmentService() {
  const { isAdmin, loadingAuth } = useAuth();
  const { toast } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    open: false,
    edit: null,
    del: null,
    sub: false,
  });

  // Real-time subscription — filter out docs still uploading (no screenshots yet)
  useEffect(() => {
    const unsubscribe = subscribeToPaidAdsProjects((data) => {
      setProjects(data.filter((p) => p.screenshots?.length > 0));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleFormSubmit = async (data) => {
    setModal((p) => ({ ...p, sub: true }));
    try {
      if (modal.edit) {
        await updatePaidAdsProject(modal.edit.id, data);
        toast({ title: "Campaign Updated" });
      } else {
        await addPaidAdsProject(data);
        toast({ title: "New Campaign Added" });
      }
      setModal((p) => ({ ...p, open: false, edit: null }));
    } catch (e) {
      toast({
        title: "Error Saving",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setModal((p) => ({ ...p, sub: false }));
    }
  };

  // Optimistic delete — real-time listener will re-sync if it fails
  const confirmDelete = async () => {
    const targetId = modal.del;
    setProjects((prev) => prev.filter((p) => p.id !== targetId));
    setModal((p) => ({ ...p, del: null }));
    try {
      await deletePaidAdsProject(targetId);
      toast({ title: "Project Deleted" });
    } catch {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  if (loadingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F0A1F]">
        <Loader2 className="animate-spin text-white w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-16 bg-[#0F0A1F] text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #6B46C1 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-purple-200 text-xs mb-6">
            <Target className="w-3.5 h-3.5 text-[#FF8C38]" aria-hidden="true" />
            <span>Performance Marketing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl mx-auto">
            Paid Ads <br />
            <span className="text-[#FF8C38]">That Drive Real ROI</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Data-driven Google, Meta, and social ad campaigns strategically set
            up to put your brand in front of the right audience and turn clicks
            into customers.
          </p>
          <div className="mt-10 flex justify-center">
            <DiscussProjectCTA
              label="Start Your Project"
              colorClassName="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white shadow-xl shadow-purple-500/20 hover:scale-105"
              className="h-14 px-10 text-base font-bold"
            />
          </div>
        </div>
      </section>

      {/* Portfolio grid */}
      <section
        className="py-12 bg-slate-50 dark:bg-[#0F0A1F]"
        aria-labelledby="portfolio-heading"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-center md:text-left">
            <div className="w-full">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-4 leading-none">
                PAID ADS PROJECTS
              </h2>
              <p className="text-slate-500 text-lg">
                A showcase of ad campaigns delivered to clients across different
                industries and geographical regions.
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() =>
                  setModal((p) => ({ ...p, open: true, edit: null }))
                }
                className="bg-[#FF8C38] hover:bg-[#e67e32] rounded-full px-8 shrink-0"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add Paid Ads Project
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#6B46C1] h-12 w-12" />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {projects.map((p, index) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  isAdmin={isAdmin}
                  isPriority={index < 2}
                  onEdit={(proj) =>
                    setModal((p) => ({ ...p, open: true, edit: proj }))
                  }
                  onDelete={(id) => setModal((p) => ({ ...p, del: id }))}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-[#0F0A1F] rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 dark:text-slate-400">
                Our portfolio is being updated with fresh case studies.
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
          isLoading={modal.sub}
          initialData={modal.edit}
        />
      )}

      <AlertDialog
        open={!!modal.del}
        onOpenChange={() => setModal((p) => ({ ...p, del: null }))}
      >
        <AlertDialogContent className="rounded-[2.5rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this paid ads record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-red-700 rounded-full"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

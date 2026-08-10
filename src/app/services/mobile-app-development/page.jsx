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
  Smartphone,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
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

const mobileProjectsRef = collection(db, "mobileProjects");

/** Subscribe to mobileProjects collection (real-time). Returns unsubscribe fn. */
const subscribeToMobileProjects = (callback) => {
  const q = query(mobileProjectsRef, orderBy("deliveryDate", "desc"));
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

/** Add a new mobile project (uploads screenshots first). */
const addMobileProject = async (data) => {
  const { urls, hints } = await processScreenshots(
    data.screenshots,
    `mob_${Date.now()}`,
  );
  const { screenshots, ...rest } = data;
  await addDoc(mobileProjectsRef, {
    ...rest,
    screenshots: urls,
    imageHints: hints,
    category: "Mobile App Development",
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/** Update an existing mobile project. */
const updateMobileProject = async (id, data) => {
  const { urls, hints } = await processScreenshots(data.screenshots, id);
  const { screenshots, ...rest } = data;
  await updateDoc(doc(db, "mobileProjects", id), {
    ...rest,
    screenshots: urls,
    imageHints: hints,
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    updatedAt: serverTimestamp(),
  });
};

/** Delete a mobile project by ID. */
const deleteMobileProject = (id) => deleteDoc(doc(db, "mobileProjects", id));

// ─── Constants ───────────────────────────────────────────────────────────────
const WHATSAPP_LINK = `https://wa.me/2349043970401?text=${encodeURIComponent(
  "Hello High-ER Enterprises, I want to develop a custom mobile application.",
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
    <Card className="group overflow-hidden border-none shadow-xl flex flex-col bg-white dark:bg-[#0F0A1F] transition-all hover:-translate-y-1 max-w-[340px] w-full mx-auto">
      {/* Screenshot frame — true mobile-screen aspect ratio, no cropping */}
      <div className="relative aspect-[9/19.5] w-full overflow-hidden bg-[#0F0A1F] border-b border-slate-100">
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
              x: { type: "spring", stiffness: 260, damping: 25 },
              opacity: { duration: 0.4 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={project.screenshots[idx]}
              alt={`${project.title} screenshot`}
              fill
              priority={isPriority}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel nav */}
        {project.screenshots.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3 z-10">
            <Button
              size="icon"
              variant="ghost"
              className="bg-[#0F0A1F]/50 backdrop-blur-xl hover:bg-[#6B46C1] rounded-full text-white h-8 w-8 border border-white/10 transition-all"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-[#0F0A1F]/50 backdrop-blur-xl hover:bg-[#6B46C1] rounded-full text-white h-8 w-8 border border-white/10 transition-all"
              onClick={() => paginate(1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}

        {/* Carousel dots */}
        {project.screenshots.length > 1 && (
          <div className="absolute top-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
            {project.screenshots.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-4 bg-[#FF8C38]" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Admin controls */}
        {isAdmin && (
          <div className="absolute top-3 right-3 z-20 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/90 backdrop-blur-md rounded-lg shadow-lg"
              onClick={() => onEdit(project)}
            >
              <Edit3 className="h-4 w-4 text-[#6B46C1]" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-lg shadow-lg"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Card body */}
      <CardContent className="p-5 flex-grow">
        <CardTitle className="text-lg font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-2 leading-tight">
          {project.title}
        </CardTitle>

        <div className="relative mb-4">
          <motion.div
            animate={{ height: isExpanded ? "auto" : "36px" }}
            initial={false}
            className="overflow-hidden text-slate-500 text-xs font-medium leading-relaxed"
          >
            <p>{project.description}</p>
          </motion.div>
          {project.description?.length > 60 && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="text-[#6B46C1] text-[9px] font-black uppercase tracking-[0.15em] mt-2 flex items-center gap-1 hover:underline"
            >
              {isExpanded ? "Close Specs" : "View Full Case"}
              <ChevronRight
                size={10}
                className={isExpanded ? "rotate-[270deg]" : "rotate-90"}
              />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 dark:bg-[#0F0A1F] dark:border-[#FF8C38]/20">
          <CalendarDays className="h-3.5 w-3.5 text-[#FF8C38]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Deployed: {project.deliveryDate}
          </span>
        </div>
      </CardContent>

      {/* Card footer */}
      <CardFooter className="p-5 pt-0 flex flex-col gap-2">
        <Button
          asChild
          className="w-full h-11 rounded-none bg-[#0F0A1F] hover:bg-[#6B46C1] dark:bg-[#FF8C38] dark:hover:bg-[#FF8C38]/80 text-white text-xs font-black uppercase italic tracking-tighter shadow-lg transition-all active:scale-95"
        >
          <Link href={project.liveUrl || "#"} target="_blank">
            VIEW APP <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
        {project.sourceCodeUrl && (
          <Button
            asChild
            variant="outline"
            className="w-full h-11 rounded-none border-2 border-[#0F0A1F] text-[#0F0A1F] hover:bg-[#0F0A1F] hover:text-white text-xs font-black uppercase italic tracking-tighter shadow-md transition-all active:scale-95"
          >
            <Link href={project.sourceCodeUrl} target="_blank">
              SOURCE CODE <Laptop className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MobileAppDevelopmentService() {
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
    const unsubscribe = subscribeToMobileProjects((data) => {
      setProjects(data.filter((p) => p.screenshots?.length > 0));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleForm = async (data) => {
    setModal((p) => ({ ...p, sub: true }));
    try {
      if (modal.edit) {
        await updateMobileProject(modal.edit.id, data);
        toast({ title: "Project Updated" });
      } else {
        await addMobileProject(data);
        toast({ title: "Project Added Successfully" });
      }
      setModal((p) => ({ ...p, open: false, edit: null }));
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setModal((p) => ({ ...p, sub: false }));
    }
  };

  // Optimistic delete — real-time listener will re-sync if it fails
  const handleDelete = async () => {
    const targetId = modal.del;
    setProjects((prev) => prev.filter((p) => p.id !== targetId));
    setModal((p) => ({ ...p, del: null }));
    try {
      await deleteMobileProject(targetId);
      toast({ title: "Deleted Successfully" });
    } catch {
      toast({ title: "Error Deleting", variant: "destructive" });
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
            <Smartphone
              className="w-3.5 h-3.5 text-[#FF8C38]"
              aria-hidden="true"
            />
            <span>Mobile Engineering</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
            Mobile Apps for <br />
            <span className="text-[#FF8C38]">Growth & Scale.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Innovative iOS & Android solutions engineered to engage your
            audience and scale your operations.
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
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-4 leading-none">
                MOBILE APP PROJECTS
              </h2>
              <p className="text-slate-500 text-lg">
                A showcase of high-performance mobile apps delivered to clients
                across different industries and geographical regions.
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() =>
                  setModal((p) => ({ ...p, open: true, edit: null }))
                }
                className="bg-[#FF8C38] hover:bg-[#e67e32] rounded-full px-8 shrink-0"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add Project
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#6B46C1] h-12 w-12" />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {projects.map((p, index) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  isAdmin={isAdmin}
                  isPriority={index < 4}
                  onEdit={(proj) =>
                    setModal((p) => ({ ...p, open: true, edit: proj }))
                  }
                  onDelete={(id) => setModal((p) => ({ ...p, del: id }))}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400">
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
          onSubmit={handleForm}
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
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

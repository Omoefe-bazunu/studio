"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import ProjectForm from "@/components/admin/ProjectForm";
import DiscussProjectCTA from "@/components/DiscussProjectCTA";

// ─── Firebase imports (all inlined here) ────────────────────────────────────
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
 * Returns { urls: string[], hints: string[] }
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
    hints.push(ss.hint || "");
  }
  return { urls, hints };
};

/** Format a raw Firestore doc into a plain JS object the UI can consume. */
const formatDoc = (d) => {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    deliveryDate: data.deliveryDate?.toDate().toISOString().split("T")[0] ?? "",
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    createdAt:
      data.createdAt?.toDate().toISOString() ?? new Date(0).toISOString(),
    updatedAt:
      data.updatedAt?.toDate().toISOString() ?? new Date(0).toISOString(),
  };
};

const webProjectsRef = collection(db, "webProjects");

/** Subscribe to the webProjects collection (real-time). Returns unsubscribe fn. */
const subscribeToWebProjects = (callback) => {
  const q = query(webProjectsRef, orderBy("deliveryDate", "desc"));
  return onSnapshot(q, (snap) => callback(snap.docs.map(formatDoc)));
};

/** Add a new web project (uploads screenshots first). */
const addWebProject = async (data) => {
  const { urls, hints } = await processScreenshots(
    data.screenshots,
    `web_${Date.now()}`,
  );
  const { screenshots, ...rest } = data;
  await addDoc(webProjectsRef, {
    ...rest,
    screenshots: urls,
    imageHints: hints,
    category: "Web Development",
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/** Update an existing web project. */
const updateWebProject = async (id, data) => {
  const { urls, hints } = await processScreenshots(data.screenshots, id);
  const { screenshots, ...rest } = data;
  await updateDoc(doc(db, "webProjects", id), {
    ...rest,
    screenshots: urls,
    imageHints: hints,
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    updatedAt: serverTimestamp(),
  });
};

/** Delete a web project by ID. */
const deleteWebProject = (id) => deleteDoc(doc(db, "webProjects", id));

// ─── Constants ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 4;
const WHATSAPP_NUMBER = "2349043970401";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello High-ER Enterprises, I'm interested in building a high-performance website.",
)}`;

// ─── ProjectCard ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, isAdmin, isPriority, onEdit, onDelete }) => {
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
    if (project.screenshots.length <= 1) return;
    const t = setTimeout(() => paginate(1), 5000);
    return () => clearTimeout(t);
  }, [idx, paginate, project.screenshots.length]);

  return (
    <Card className="group overflow-hidden border-none shadow-xl shadow-slate-200/50 flex flex-col bg-white dark:bg-[#0F0A1F] transition-all hover:-translate-y-1">
      {/* Screenshot carousel */}
      <CardHeader className="p-0 relative h-64 overflow-hidden bg-slate-100">
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
              alt={`Screenshot ${idx + 1} of ${project.title}`}
              fill
              priority={isPriority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel nav arrows */}
        {project.screenshots.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-md rounded-full text-white"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-md rounded-full text-white"
              onClick={() => paginate(1)}
            >
              <ChevronRight aria-hidden="true" />
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

      {/* Card body */}
      <CardContent className="p-8 flex-grow">
        <CardTitle className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-4 leading-none">
          {project.title}
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
              className="text-[#6B46C1] text-xs font-black uppercase tracking-widest mt-2 hover:underline flex items-center gap-1"
            >
              {isExpanded ? "Show Less" : "Read Full Description"}
              <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronRight size={12} className="rotate-90" />
              </motion.span>
            </button>
          )}
        </div>

        <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          <CalendarDays className="h-4 w-4 mr-2 text-[#FF8C38]" />
          <span>
            Deployed:{" "}
            {new Date(project.deliveryDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>

      {/* Card footer */}
      <CardFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-3">
        <Button
          asChild
          className="flex-1 h-16 rounded-none bg-[#0F0A1F] hover:bg-[#6B46C1] text-white dark:bg-[#FF8C38] font-black uppercase italic tracking-tighter shadow-2xl transition-all active:scale-95"
        >
          <Link href={project.liveUrl || "#"} target="_blank">
            VIEW LIVE SITE <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {project.sourceCodeUrl && (
          <Button
            asChild
            variant="outline"
            className="flex-1 h-16 rounded-none border-2 border-[#0F0A1F] text-[#0F0A1F] hover:bg-[#0F0A1F] hover:text-white font-black uppercase italic tracking-tighter shadow-xl transition-all active:scale-95"
          >
            <Link href={project.sourceCodeUrl} target="_blank">
              SOURCE CODE <Laptop className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WebDevelopmentService({ initialProjectsData = [] }) {
  useVisitorTracker("Service: Web Development");

  const { isAdmin, loadingAuth } = useAuth();
  const { toast } = useToast();

  const [projects, setProjects] = useState(initialProjectsData);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToWebProjects((updated) => {
      setProjects(updated);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Add or update a project
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        await updateWebProject(editingProject.id, data);
        toast({ title: "Project Updated!" });
      } else {
        await addWebProject(data);
        toast({ title: "Project Added!" });
      }
      setIsFormOpen(false);
      setEditingProject(null);
    } catch {
      toast({ title: "Error Saving", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a project (optimistic UI update)
  const confirmDelete = async () => {
    try {
      await deleteWebProject(projectToDeleteId);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDeleteId));
      toast({ title: "Deleted Successfully" });
    } catch {
      toast({ title: "Delete Failed", variant: "destructive" });
    } finally {
      setProjectToDeleteId(null);
    }
  };

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return projects.slice(start, start + ITEMS_PER_PAGE);
  }, [projects, currentPage]);

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
    <div className="flex flex-col bg-[#0F0A1F]">
      {/* Hero */}
      <section
        className="relative w-full py-16 bg-[#0F0A1F] overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #6B46C1 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-10"
          aria-hidden="true"
        />

        <div className="container relative z-10 mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-purple-200 text-xs mb-6">
            <Laptop className="w-3.5 h-3.5 text-[#FF8C38]" aria-hidden="true" />
            <span>Premium Web Engineering</span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight max-w-3xl mx-auto"
          >
            Websites built for{" "}
            <span className="text-[#FF8C38]">Performance.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            High-performance web applications designed to convert leads to
            paying customers, and position your business as an authority in your
            industry.
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
              <h2
                id="portfolio-heading"
                className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-4 leading-none"
              >
                WEB PROJECTS
              </h2>
              <p className="text-slate-500 text-lg">
                A showcase of high-performance websites and SaaS delivered to
                clients across different industries and geographical regions.
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => {
                  setEditingProject(null);
                  setIsFormOpen(true);
                }}
                className="bg-[#FF8C38] hover:bg-[#e67e32] text-white rounded-full px-8"
                aria-label="Add a new web project"
              >
                <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" /> Add
                Project
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20" aria-busy="true">
              <Loader2 className="animate-spin text-[#6B46C1] h-12 w-12" />
            </div>
          ) : currentProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {currentProjects.map((p, index) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  isAdmin={isAdmin}
                  isPriority={index < 2}
                  onEdit={(proj) => {
                    setEditingProject(proj);
                    setIsFormOpen(true);
                  }}
                  onDelete={setProjectToDeleteId}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-16 flex justify-center items-center gap-6"
              aria-label="Portfolio pagination"
            >
              <Button
                variant="outline"
                className="rounded-full border-slate-200"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="mr-2 h-4 w-4" aria-hidden="true" />{" "}
                Previous
              </Button>
              <span className="font-bold text-slate-400" aria-current="page">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                className="rounded-full border-slate-200"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next{" "}
                <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </nav>
          )}
        </div>
      </section>

      {/* Admin modals */}
      {isAdmin && (
        <ProjectForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          initialData={editingProject}
          isLoading={isSubmitting}
        />
      )}

      <AlertDialog
        open={!!projectToDeleteId}
        onOpenChange={() => setProjectToDeleteId(null)}
      >
        <AlertDialogContent className="rounded-[2.5rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white rounded-full"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

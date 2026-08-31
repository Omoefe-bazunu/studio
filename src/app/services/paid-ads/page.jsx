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
  PlusCircle,
  Loader2,
  Edit3,
  Trash2,
  Laptop,
  Tag,
  Layers,
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

const uploadFile = async (file, folderPath) => {
  const ext = file.name.split(".").pop();
  const storageRef = ref(storage, `${folderPath}/${uuidv4()}.${ext}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

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

const formatDoc = (d) => {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    category: data.category || "Paid Ads",
    deliveryDate: data.deliveryDate?.toDate().toISOString().split("T")[0] ?? "",
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    createdAt:
      data.createdAt?.toDate().toISOString() ?? new Date(0).toISOString(),
    updatedAt:
      data.updatedAt?.toDate().toISOString() ?? new Date(0).toISOString(),
  };
};

const paidAdsProjectsRef = collection(db, "paidAdsProjects");

const subscribeToPaidAdsProjects = (callback) => {
  const q = query(paidAdsProjectsRef, orderBy("deliveryDate", "desc"));
  return onSnapshot(q, (snap) => callback(snap.docs.map(formatDoc)));
};

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
    category: data.category || "Paid Ads",
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

const updatePaidAdsProject = async (id, data) => {
  const { urls, hints } = await processScreenshots(data.screenshots, id);
  const { screenshots, ...rest } = data;
  await updateDoc(doc(db, "paidAdsProjects", id), {
    ...rest,
    screenshots: urls,
    imageHints: hints,
    category: data.category || "Paid Ads",
    sourceCodeUrl: data.sourceCodeUrl ?? "",
    deliveryDate: Timestamp.fromDate(new Date(data.deliveryDate)),
    updatedAt: serverTimestamp(),
  });
};

const deletePaidAdsProject = (id) => deleteDoc(doc(db, "paidAdsProjects", id));

// ─── Constants ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 4;
const DEFAULT_CATEGORIES = [
  "ALL",
  "Paid Ads",
  "Google Ads",
  "Meta Ads",
  "Social Media Ads",
  "Lead Generation",
];

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

  useEffect(() => {
    if (project.screenshots?.length <= 1) return;
    const t = setTimeout(() => paginate(1), 5000);
    return () => clearTimeout(t);
  }, [idx, paginate, project.screenshots]);

  return (
    <Card className="group overflow-hidden border border-border/70 shadow-lg flex flex-col bg-card hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 rounded-2xl">
      {/* Screenshot Carousel Header */}
      <CardHeader className="p-0 relative h-64 overflow-hidden bg-muted/30">
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

        {/* Category Badge Overlay */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border/80 text-foreground text-xs font-bold shadow-md">
            <Tag className="w-3 h-3 text-primary" />
            {project.category}
          </span>
        </div>

        {/* Carousel Nav Controls */}
        {project.screenshots.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Button
              size="icon"
              variant="ghost"
              className="bg-background/80 backdrop-blur-md rounded-full text-foreground hover:bg-background"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-background/80 backdrop-blur-md rounded-full text-foreground hover:bg-background"
              onClick={() => paginate(1)}
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background/90 backdrop-blur-md rounded-full border-border"
              onClick={() => onEdit(project)}
            >
              <Edit3 className="h-4 w-4 text-primary" />
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

      {/* Card Body */}
      <CardContent className="p-6 md:p-8 flex-grow">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground mb-3">
          {project.title}
        </CardTitle>

        <div className="relative mb-5">
          <motion.div
            animate={{ height: isExpanded ? "auto" : "72px" }}
            initial={false}
            className="overflow-hidden text-muted-foreground text-sm leading-relaxed"
          >
            <p>{project.description}</p>
          </motion.div>
          {project.description?.length > 120 && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="text-primary text-xs font-bold uppercase tracking-wider mt-2 hover:underline flex items-center gap-1"
            >
              {isExpanded ? "Show Less" : "Read Full Breakdown"}
              <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronRight size={12} className="rotate-90" />
              </motion.span>
            </button>
          )}
        </div>

        <div className="flex items-center text-xs font-semibold text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2 text-primary" />
          <span>
            Deployed:{" "}
            {new Date(project.deliveryDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-6 md:p-8 pt-0 flex flex-col sm:flex-row gap-3">
        <Button
          asChild
          className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs uppercase tracking-wider shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
        >
          <Link href={project.liveUrl || "#"} target="_blank">
            View Campaign <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
        {project.sourceCodeUrl && (
          <Button
            asChild
            variant="outline"
            className="flex-1 h-12 rounded-xl border-border text-foreground hover:bg-muted font-medium text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
          >
            <Link href={project.sourceCodeUrl} target="_blank">
              Report / Case Study <Laptop className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PaidAdsDevelopmentService({
  initialProjectsData = [],
}) {
  useVisitorTracker("Service: Paid Ads");

  const { isAdmin, loadingAuth } = useAuth();
  const { toast } = useToast();

  const [projects, setProjects] = useState(initialProjectsData);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToPaidAdsProjects((updated) => {
      setProjects(updated.filter((p) => p.screenshots?.length > 0));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Compute Categories list dynamically from existing projects & defaults
  const categoriesList = useMemo(() => {
    const projectCategories = projects.map((p) => p.category).filter(Boolean);
    const combined = Array.from(
      new Set([...DEFAULT_CATEGORIES, ...projectCategories]),
    );
    return combined;
  }, [projects]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "ALL") return projects;
    return projects.filter(
      (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [projects, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Add or update project
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        await updatePaidAdsProject(editingProject.id, data);
        toast({ title: "Campaign Updated!" });
      } else {
        await addPaidAdsProject(data);
        toast({ title: "Campaign Added!" });
      }
      setIsFormOpen(false);
      setEditingProject(null);
    } catch {
      toast({ title: "Error Saving", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete project
  const confirmDelete = async () => {
    try {
      await deletePaidAdsProject(projectToDeleteId);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDeleteId));
      toast({ title: "Deleted Successfully" });
    } catch {
      toast({ title: "Delete Failed", variant: "destructive" });
    } finally {
      setProjectToDeleteId(null);
    }
  };

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  if (loadingAuth) {
    return (
      <div
        className="h-screen flex items-center justify-center bg-white dark:bg-background"
        aria-busy="true"
      >
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white dark:bg-background text-foreground min-h-screen">
      {/* High-Converting Hero Section */}
      <section
        className="w-full pt-28 pb-12 bg-white dark:bg-background border-b border-border/60"
        aria-labelledby="hero-heading"
      >
        <div className="container mx-auto px-6 text-center">
          <h1
            id="hero-heading"
            className="font-sans text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15] max-w-3xl mx-auto"
          >
            Run Paid Ads That{" "}
            <span className="text-[#FF8C38]">Bring You More Customers.</span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We design and manage targeted ad campaigns on Google, Meta, and
            social platforms that turn ad spend into profitable business
            revenue.
          </p>

          <div className="mt-9 flex justify-center">
            <DiscussProjectCTA
              label="Discuss your project"
              colorClassName="bg-primary hover:bg-primary/90 text-white hover:text-white/90 border border-primary"
              className="h-11 px-6 rounded-md font-medium"
            />
          </div>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section
        className="py-16 bg-muted/20"
        aria-labelledby="portfolio-heading"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>Selected Works</span>
              </div>
              <h2
                id="portfolio-heading"
                className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-foreground"
              >
                Paid Ads Campaigns
              </h2>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                A showcase of performance marketing campaigns delivered to
                clients across industries.
              </p>
            </div>

            {isAdmin && (
              <Button
                onClick={() => {
                  setEditingProject(null);
                  setIsFormOpen(true);
                }}
                className="bg-[#FF8C38] hover:bg-[#e67e32] text-white rounded-xl px-6 py-2.5 font-bold text-xs uppercase tracking-wider shadow-md shrink-0"
                aria-label="Add a new paid ads project"
              >
                <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" /> Add
                Paid Ads Project
              </Button>
            )}
          </div>

          {/* Category Tabs Header */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-border/60 mb-10">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat;
              const count =
                cat === "ALL"
                  ? projects.length
                  : projects.filter(
                      (p) => p.category?.toLowerCase() === cat.toLowerCase(),
                    ).length;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Project Grid */}
          {loading ? (
            <div className="flex justify-center py-20" aria-busy="true">
              <Loader2 className="animate-spin text-primary h-10 w-10" />
            </div>
          ) : currentProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground text-sm font-medium">
                No campaigns found under the &quot;{selectedCategory}&quot;
                category.
              </p>
            </div>
          )}

          {/* Pagination Nav */}
          {totalPages > 1 && (
            <nav
              className="mt-14 flex justify-center items-center gap-4"
              aria-label="Portfolio pagination"
            >
              <Button
                variant="outline"
                className="rounded-xl border-border text-xs font-bold uppercase tracking-wider"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />{" "}
                Previous
              </Button>
              <span
                className="text-xs font-bold text-muted-foreground px-2"
                aria-current="page"
              >
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                className="rounded-xl border-border text-xs font-bold uppercase tracking-wider"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next{" "}
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            </nav>
          )}
        </div>
      </section>

      {/* Admin Modals */}
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
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this campaign record from
              Firestore.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white rounded-xl"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

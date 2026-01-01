"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useVisitorTracker } from "@/hooks/useVisitorTracker";
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
  Layers,
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getSaasProjects,
  addSaasProject,
  updateSaasProject,
  deleteSaasProject,
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

const ITEMS_PER_PAGE = 4;

/**
 * Sub-Component: ProjectCard
 * Features an optimized screenshot carousel and accessibility enhancements.
 */
const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  isAdmin,
  isPriority = false,
}) => {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0);

  const paginate = useCallback(
    (d) => {
      setDir(d);
      setIdx(
        (p) => (p + d + project.screenshots.length) % project.screenshots.length
      );
    },
    [project.screenshots.length]
  );

  useEffect(() => {
    if (project.screenshots?.length <= 1) return;
    const t = setTimeout(() => paginate(1), 5000);
    return () => clearTimeout(t);
  }, [idx, paginate, project.screenshots]);

  return (
    <Card className="group overflow-hidden border-none shadow-xl shadow-slate-200/50 flex flex-col bg-white transition-all hover:translate-y-[-5px]">
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
              alt={`Screenshot ${idx + 1} of ${project.title}`} // FIX: Descriptive Alt Text
              fill
              priority={isPriority} // FIX: Performance (LCP) for top row
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        {project.screenshots.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-md rounded-full text-white"
              onClick={() => paginate(-1)}
              aria-label="Previous screenshot" // FIX: Accessible Button Name
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-md rounded-full text-white"
              onClick={() => paginate(1)}
              aria-label="Next screenshot" // FIX: Accessible Button Name
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
              aria-label={`Edit ${project.title}`}
            >
              <Edit3 className="h-4 w-4 text-[#6B46C1]" aria-hidden="true" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onDelete(project.id)}
              aria-label={`Delete ${project.title}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-8 flex-grow">
        {/* FIX: Ensure CardTitle renders as H3 for proper hierarchy */}
        <CardTitle className="text-2xl font-bold text-slate-900 mb-3">
          <h3>{project.title}</h3>
        </CardTitle>
        <CardDescription className="text-slate-500 line-clamp-3 mb-6">
          {project.description}
        </CardDescription>
        <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          <CalendarDays
            className="h-4 w-4 mr-2 text-[#FF8C38]"
            aria-hidden="true"
          />
          <span>
            Deployed:{" "}
            {new Date(project.deliveryDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-0">
        <Button
          asChild
          className="w-fit h-12 rounded-full bg-[#6B46C1] hover:bg-[#5a3aaa] font-bold"
        >
          <Link
            href={project.liveUrl || "#"}
            target="_blank"
            aria-label={`Access the live ${project.title} platform`}
          >
            Access Platform{" "}
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function SaasDevelopmentService({ initialProjectsData = [] }) {
  // useVisitorTracker("Service: SaaS Development");
  const { isAdmin, loadingAuth } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState(initialProjectsData);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({
    open: false,
    edit: null,
    del: null,
    sub: false,
  });

  const whatsappLink = `https://wa.me/447344685126?text=${encodeURIComponent(
    "Hello High-ER Enterprises, I'm interested in building a scalable SaaS platform."
  )}`;

  const fetchProjectsList = async () => {
    setLoading(true);
    try {
      const fetched = await getSaasProjects();
      setProjects(fetched);
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    setModal((p) => ({ ...p, sub: true }));
    try {
      modal.edit
        ? await updateSaasProject(modal.edit.id, data)
        : await addSaasProject(data);
      toast({ title: "Success!" });
      setModal((p) => ({ ...p, open: false, edit: null }));
      fetchProjectsList();
    } catch (e) {
      toast({ title: "Error Saving", variant: "destructive" });
    } finally {
      setModal((p) => ({ ...p, sub: false }));
    }
  };

  const confirmDelete = async () => {
    try {
      // 1. Perform the deletion in Firestore
      await deleteSaasProject(modal.del);

      // 2. OPTIMISTIC UPDATE: Filter out the deleted project from local state immediately
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== modal.del)
      );

      toast({ title: "Project Deleted" });

      // 3. Close the modal and reset deletion state
      setModal((p) => ({ ...p, del: null }));

      // Note: fetchProjectsList() is no longer strictly necessary because the
      // local filter ensures the UI is already in sync with the database.
    } catch (e) {
      console.error("SaaS Delete Error:", e);
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return projects.slice(start, start + ITEMS_PER_PAGE);
  }, [projects, currentPage]);

  if (loadingAuth)
    return (
      <div
        className="h-screen flex items-center justify-center bg-[#0F0A1F]"
        aria-busy="true"
      >
        <Loader2 className="animate-spin text-white w-12 h-12" />
      </div>
    );

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section
        className="relative py-24 bg-[#0F0A1F] text-center overflow-hidden"
        aria-labelledby="saas-hero-title"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, #6B46C1 0%, transparent 75%)`,
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-10"
          aria-hidden="true"
        />

        <div className="relative z-10 container mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-200 text-sm mb-8">
            <Layers className="w-4 h-4 text-[#FF8C38]" aria-hidden="true" />{" "}
            <span>Enterprise SaaS Engineering</span>
          </div>
          <h1
            id="saas-hero-title"
            className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8"
          >
            Scalable SaaS. <br />
            <span className="text-[#FF8C38]">Built to Scale Globally.</span>
          </h1>
          <p className="mt-8 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            From multi-tenant architecture to subscription logic, we build
            robust cloud platforms designed for high performance and rapid
            growth.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full h-16 px-12 text-lg font-bold shadow-2xl transition-all hover:scale-105"
          >
            <Link
              href={whatsappLink}
              target="_blank"
              aria-label="Inquire about SaaS development via WhatsApp"
            >
              Start Your SaaS{" "}
              <MessageCircle className="ml-2 h-6 w-6" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 2. PORTFOLIO GRID SECTION */}
      <section
        className="py-24 bg-slate-50"
        aria-labelledby="saas-portfolio-title"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className=" w-full text-center mx-auto">
              <h2
                id="saas-portfolio-title"
                className="text-4xl font-bold text-slate-900 mb-2"
              >
                SaaS Portfolio
              </h2>
              <p className="text-slate-500">
                Cloud solutions engineered for complex business logic.
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() =>
                  setModal((p) => ({ ...p, open: true, edit: null }))
                }
                className="bg-[#FF8C38] hover:bg-[#e67e32] text-white rounded-full px-8"
                aria-label="Add a new SaaS project"
              >
                <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" /> Add
                SaaS Project
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20" aria-busy="true">
              <Loader2 className="animate-spin text-[#6B46C1] h-12 w-12" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {currentProjects.map((p, index) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  isAdmin={isAdmin}
                  isPriority={index < 2} // FIX: Performance (LCP) for top row images
                  onEdit={(proj) =>
                    setModal((p) => ({ ...p, open: true, edit: proj }))
                  }
                  onDelete={(id) => setModal((p) => ({ ...p, del: id }))}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              className="mt-16 flex justify-center items-center gap-6"
              aria-label="SaaS Portfolio pagination"
            >
              <Button
                variant="outline"
                className="rounded-full border-slate-200"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
              >
                <ChevronLeft aria-hidden="true" /> Previous
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
                aria-label="Go to next page"
              >
                Next <ChevronRight aria-hidden="true" />
              </Button>
            </nav>
          )}
        </div>
      </section>

      {/* Admin Modals */}
      {isAdmin && (
        <ProjectForm
          isOpen={modal.open}
          onOpenChange={(v) => setModal((p) => ({ ...p, open: v }))}
          onSubmit={handleFormSubmit}
          initialData={
            modal.edit
              ? {
                  ...modal.edit,
                  screenshots: (modal.edit.screenshots || []).map((url, i) => ({
                    url: url,
                    hint: modal.edit.imageHints?.[i] || "",
                  })),
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
        <AlertDialogContent className="rounded-[2.5rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this SaaS record.
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

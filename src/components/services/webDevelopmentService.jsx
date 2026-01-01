"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
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
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getWebProjects,
  addWebProject,
  updateWebProject,
  deleteWebProject,
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
 * Features an animated screenshot carousel and admin controls.
 */
const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  isAdmin,
  priority = false,
}) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDir) => {
      setDirection(newDir);
      setIndex(
        (prev) =>
          (prev + newDir + project.screenshots.length) %
          project.screenshots.length
      );
    },
    [project.screenshots.length]
  );

  useEffect(() => {
    if (project.screenshots?.length <= 1) return;
    const timer = setTimeout(() => paginate(1), 5000);
    return () => clearTimeout(timer);
  }, [index, project.screenshots, paginate]);

  const variants = {
    enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (d) => ({ zIndex: 0, x: d < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <Card className="group overflow-hidden border-none shadow-xl shadow-slate-200/50  flex flex-col bg-white transition-all hover:translate-y-[-5px]">
      <CardHeader className="p-0 relative h-64 overflow-hidden bg-slate-100">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
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
              src={project.screenshots[index]}
              alt={`Screenshot ${index + 1} of ${project.title}`} // FIX: Descriptive Alt Text
              fill
              priority={priority} // FIX: Performance (LCP) for first row
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
              aria-label="Previous screenshot" // FIX: Accessibility Name
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-md rounded-full text-white"
              onClick={() => paginate(1)}
              aria-label="Next screenshot" // FIX: Accessibility Name
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* Admin Overlay Controls */}
        {isAdmin && (
          <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/90 rounded-full"
              onClick={() => onEdit(project)}
              aria-label="Edit project"
            >
              <Edit3 className="h-4 w-4 text-[#6B46C1]" aria-hidden="true" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onDelete(project.id)}
              aria-label="Delete project"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-8 flex-grow">
        {/* FIX: Ensure CardTitle renders as H3 for hierarchy */}
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
            Delivered:{" "}
            {new Date(project.deliveryDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-0">
        {project.liveUrl && project.liveUrl !== "#" ? (
          <Button
            asChild
            className="w-fit h-12 rounded-full bg-[#6B46C1] hover:bg-[#5a3aaa] font-bold"
          >
            <Link
              href={project.liveUrl}
              target="_blank"
              aria-label={`View live website for ${project.title}`}
            >
              View Live Project{" "}
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button
            disabled
            className="w-full h-12 rounded-full bg-slate-100 text-slate-400"
          >
            Internal Project
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

/**
 * Main Component: WebDevelopmentService
 */
export default function WebDevelopmentService({ initialProjectsData = [] }) {
  useVisitorTracker("Service: Web Development");
  const { isAdmin, loadingAuth } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState(initialProjectsData);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappNumber = "447344685126";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello High-ER Enterprises, I'm interested in building a high-performance website."
  )}`;

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const fetched = await getWebProjects();
      setProjects(fetched);
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to load projects.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminFormSubmit = async (data) => {
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
      fetchProjects();
    } catch (e) {
      toast({ title: "Error Saving", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const confirmDelete = async () => {
  //   try {
  //     await deleteWebProject(projectToDeleteId);
  //     toast({ title: "Deleted Successfully" });
  //     setProjectToDeleteId(null);
  //     fetchProjects();
  //   } catch (e) {
  //     toast({ title: "Delete Failed", variant: "destructive" });
  //   }
  // };

  const confirmDelete = async () => {
    try {
      // 1. Perform the actual deletion in Firebase
      await deleteWebProject(projectToDeleteId);

      // 2. OPTIMISTIC UPDATE: Remove the project from local state immediately
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectToDeleteId)
      );

      toast({ title: "Deleted Successfully" });

      // 3. Clean up UI state
      setProjectToDeleteId(null);

      // Optional: fetchProjects() is now a backup sync rather than the primary update
      // fetchProjects();
    } catch (e) {
      console.error("Delete Error:", e);
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
        className="relative w-full py-24 bg-[#0F0A1F] overflow-hidden"
        aria-labelledby="hero-heading"
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

        <div className="container relative z-10 mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-200 text-sm mb-8">
            <Laptop className="w-4 h-4 text-[#FF8C38]" aria-hidden="true" />{" "}
            <span>Premium Web Engineering</span>
          </div>

          <h1
            id="hero-heading"
            className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto"
          >
            Websites that act as your <br />
            <span className="text-[#FF8C38]">24/7 sales engine.</span>
          </h1>

          <p className="mt-8 text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From architecture to deployment, we build scalable web applications
            designed to dominate your market.
          </p>

          <div className="mt-12">
            <Button
              asChild
              size="lg"
              className="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full h-16 px-12 text-lg font-bold shadow-2xl shadow-purple-500/40 transition-all hover:scale-105"
            >
              <Link
                href={whatsappLink}
                target="_blank"
                aria-label="Inquire about web development via WhatsApp"
              >
                Inquire via WhatsApp{" "}
                <MessageCircle className="ml-2 h-6 w-6" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. PORTFOLIO GRID SECTION */}
      <section
        className="py-24 bg-slate-50"
        aria-labelledby="portfolio-heading"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl text-center mx-auto">
              <h2
                id="portfolio-heading"
                className="text-4xl font-bold text-slate-900 mb-4"
              >
                Our Portfolio
              </h2>
              <p className="text-lg text-slate-500">
                A showcase of high-performance digital products engineered for
                excellence.
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
                  priority={index < 2} // FIX: Performance (LCP) for first row
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
                aria-label="Go to previous page"
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
                aria-label="Go to next page"
              >
                Next{" "}
                <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
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
          onSubmit={handleAdminFormSubmit}
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

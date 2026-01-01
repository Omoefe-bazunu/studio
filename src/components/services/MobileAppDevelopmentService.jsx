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
  Smartphone,
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
  getMobileProjects,
  addMobileProject,
  updateMobileProject,
  deleteMobileProject,
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

/**
 * Sub-Component: ProjectCard
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
    <Card className="group overflow-hidden border-none shadow-xl flex flex-col bg-white transition-all hover:translate-y-[-5px]">
      <div className="relative h-80 overflow-hidden bg-slate-100">
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

        {project.screenshots.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 z-10 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-md rounded-full text-white"
              onClick={() => paginate(-1)}
              aria-label="Previous screenshot"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/20 backdrop-blur-md rounded-full text-white"
              onClick={() => paginate(1)}
              aria-label="Next screenshot"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        )}

        {isAdmin && (
          <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/90 rounded-full"
              onClick={() => onEdit(project)}
              aria-label="Edit mobile project"
            >
              <Edit3 className="h-4 w-4 text-[#6B46C1]" aria-hidden="true" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onDelete(project.id)}
              aria-label="Delete mobile project"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-8 flex-grow">
        <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
          <h3>{project.title}</h3>
        </CardTitle>
        <CardDescription className="text-slate-500 line-clamp-2 mb-4">
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
        <Button
          asChild
          className="w-fit h-12 rounded-full bg-[#6B46C1] hover:bg-[#5a3aaa] font-bold"
        >
          <Link
            href={project.liveUrl || "#"}
            target="_blank"
            aria-label={`View ${project.title} on the App Store`}
          >
            View App Store{" "}
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function MobileAppDevelopmentService({
  initialProjectsData = [],
}) {
  const { isAdmin, loadingAuth } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState(initialProjectsData);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    edit: null,
    del: null,
    sub: false,
  });

  const whatsappLink = `https://wa.me/447344685126?text=${encodeURIComponent(
    "Hello High-ER Enterprises, I want to develop a custom mobile application for my business."
  )}`;

  const refresh = async () => {
    setLoading(true);
    try {
      setProjects(await getMobileProjects());
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForm = async (data) => {
    setModal((p) => ({ ...p, sub: true }));
    try {
      modal.edit
        ? await updateMobileProject(modal.edit.id, data)
        : await addMobileProject(data);
      toast({ title: "Success" });
      setModal((p) => ({ ...p, open: false, edit: null }));
      refresh();
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setModal((p) => ({ ...p, sub: false }));
    }
  };

  const handleDelete = async () => {
    try {
      // 1. Delete from Firebase
      await deleteMobileProject(modal.del);

      // 2. FIX: Optimistic Update - filter the local state so the project leaves immediately
      setProjects((prev) => prev.filter((project) => project.id !== modal.del));

      toast({ title: "Deleted" });
      setModal((p) => ({ ...p, del: null }));

      // refresh(); // No longer strictly needed for immediate UI sync
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

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
      <section
        className="relative py-24 bg-[#0F0A1F] text-center overflow-hidden"
        aria-labelledby="mobile-hero-title"
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
            <Smartphone className="w-4 h-4 text-[#FF8C38]" aria-hidden="true" />{" "}
            <span>Native & Hybrid Mobile Solutions</span>
          </div>
          <h1
            id="mobile-hero-title"
            className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8"
          >
            iOS & Android apps. <br />
            <span className="text-[#FF8C38]">Built for Engagement.</span>
          </h1>
          <p className="mt-8 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            From intuitive UI/UX design to robust backend integration, we build
            mobile experiences that users love and businesses thrive on.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#6B46C1] hover:bg-[#5a3aaa] rounded-full h-16 px-12 text-lg font-bold shadow-2xl transition-all hover:scale-105"
          >
            <Link
              href={whatsappLink}
              target="_blank"
              aria-label="Start your mobile app project via WhatsApp"
            >
              Start Your App{" "}
              <MessageCircle className="ml-2 h-6 w-6" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <section
        className="py-24 bg-slate-50"
        aria-labelledby="mobile-portfolio-title"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className=" w-full mx-auto text-center">
              <h2
                id="mobile-portfolio-title"
                className="text-4xl font-bold text-slate-900 mb-2"
              >
                App Showcase
              </h2>
              <p className="text-slate-500">
                A look at our latest native and cross-platform builds.
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() =>
                  setModal((p) => ({ ...p, open: true, edit: null }))
                }
                className="bg-[#FF8C38] hover:bg-[#e67e32] rounded-full px-8"
                aria-label="Add a new mobile app project"
              >
                <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" /> Add
                Mobile Project
              </Button>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center py-20" aria-busy="true">
              <Loader2 className="animate-spin text-[#6B46C1] h-12 w-12" />
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {isAdmin && (
        <ProjectForm
          isOpen={modal.open}
          onOpenChange={(v) => setModal((p) => ({ ...p, open: v }))}
          onSubmit={handleForm}
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
            <AlertDialogTitle>Delete Mobile Project?</AlertDialogTitle>
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

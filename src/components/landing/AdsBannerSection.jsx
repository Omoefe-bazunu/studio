"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getAdsBannerContent,
  setAdsBannerContent,
} from "@/lib/firebase/firestoreService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Runtime validation schema remains for form safety
const adsBannerSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10).max(200),
  imageUrl: z.string().url().optional().or(z.literal("")),
  imageHint: z.string().min(2),
  ctaText: z.string().min(3),
  ctaLink: z.string().url(),
  isActive: z.boolean(),
});

const DEFAULT_BANNER = {
  title: "SUPERCHARGE YOUR GROWTH!",
  description:
    "Get a 20% discount on your first Marketing package. Let's make your brand shine!",
  imageUrl: "https://placehold.co/1200x400.png",
  imageHint: "abstract tech background",
  ctaText: "Claim Your Discount",
  ctaLink: "/contact",
  isActive: true,
};

export default function AdsBannerSection() {
  const [banner, setBanner] = useState(DEFAULT_BANNER);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(adsBannerSchema),
    defaultValues: DEFAULT_BANNER,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdsBannerContent();
      if (data) {
        setBanner(data);
        form.reset(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (data) => {
    try {
      await setAdsBannerContent(data);
      toast({ title: "Success", description: "Banner updated." });
      loadData();
      setOpen(false);
    } catch (e) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to save.",
      });
    }
  };

  if (loading && !banner)
    return (
      <div className="h-40 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6B46C1]" />
      </div>
    );
  if (!banner.isActive && !isAdmin) return null;

  return (
    <section className="py-12 bg-[#0F0A1F] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#6B46C1]/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#FF8C38] text-sm font-bold tracking-widest uppercase mb-4">
              Special Offer
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {banner.title}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              {banner.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <Button
              size="lg"
              asChild
              className="bg-[#FF8C38] hover:bg-[#e67e32] text-white rounded-full px-10 h-14 font-bold shadow-lg shadow-orange-500/20 transition-transform hover:scale-105"
            >
              <Link href={banner.ctaLink}>
                {banner.ctaText} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(true)}
                className="text-slate-500 hover:text-white"
              >
                <Edit className="mr-2 w-4 h-4" /> Edit Banner
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#6B46C1]">
              Edit Banner Content
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {[
                { name: "title", label: "Title", type: "input" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "ctaText", label: "Button Text", type: "input" },
                { name: "ctaLink", label: "Button Link", type: "input" },
              ].map((f) => (
                <FormField
                  key={f.name}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        {f.label}
                      </FormLabel>
                      <FormControl>
                        {f.type === "input" ? (
                          <Input {...field} />
                        ) : (
                          <Textarea {...field} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border rounded-xl p-3 bg-slate-50">
                    <FormLabel>Show Banner Site-wide</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#6B46C1] hover:bg-[#5a3aaa] rounded-xl"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

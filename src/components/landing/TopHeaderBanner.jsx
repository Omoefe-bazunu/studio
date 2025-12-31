"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, X, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getTopHeaderBannerContent,
  setTopHeaderBannerContent,
} from "@/lib/firebase/firestoreService";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const bannerSchema = z.object({
  text: z.string().min(5).max(150),
  ctaText: z.string().min(3).max(25),
  ctaLink: z.string().url(),
  isActive: z.boolean(),
  backgroundColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
  textColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
});

const DEFAULT_BANNER = {
  text: "🚀 Special Offer: Get 25% off on all SaaS & Web services this month!",
  ctaText: "Claim Discount",
  ctaLink: "/services",
  isActive: true,
  backgroundColor: "#6B46C1",
  textColor: "#FFFFFF",
};

const COLORS = [
  "#6B46C1",
  "#FF8C38",
  "#0F0A1F",
  "#FFFFFF",
  "#38A169",
  "#E53E3E",
];

export default function TopHeaderBanner() {
  const [banner, setBanner] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: DEFAULT_BANNER,
  });

  const loadData = useCallback(async () => {
    try {
      const data = await getTopHeaderBannerContent();
      const activeData = data || DEFAULT_BANNER;
      setBanner(activeData);
      form.reset(activeData);

      const isDismissed =
        sessionStorage.getItem("topBannerDismissed") === "true";
      if (activeData.isActive && !isDismissed) {
        setIsVisible(true);
      }
    } catch (e) {
      setBanner(DEFAULT_BANNER);
    }
  }, [form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => setIsVisible(false), 10000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible]);

  const onDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("topBannerDismissed", "true");
  };

  const onSubmit = async (data) => {
    try {
      await setTopHeaderBannerContent(data);
      toast({ title: "Banner Updated" });
      loadData();
      setOpen(false);
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  if (!isVisible || !banner) return null;

  return (
    <>
      <div
        /* Increased height: py-4 (16px top/bottom) + min-h for a substantial presence */
        className="relative z-[60] w-full py-4 px-6 min-h-[60px] flex items-center text-sm md:text-base font-medium animate-in slide-in-from-top duration-500"
        style={{
          backgroundColor: banner.backgroundColor,
          color: banner.textColor,
        }}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="text-center">{banner.text}</span>
            <Link
              href={banner.ctaLink}
              className="bg-orange-400 rounded-full px-4 py-2 cursor-pointer text-white hover:bg-white hover:text-primary transition-opacity"
            >
              {banner.ctaText}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="h-9 w-9 hover:bg-black/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="h-9 w-9 hover:bg-black/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Banner Settings</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {["text", "ctaText", "ctaLink"].map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        {name.replace(/([A-Z])/g, " $1")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="grid grid-cols-2 gap-4">
                {["backgroundColor", "textColor"].map((type) => (
                  <FormField
                    key={type}
                    control={form.control}
                    name={type}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {type === "backgroundColor" ? "BG" : "Text"}
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start gap-2"
                            >
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: field.value }}
                              />
                              {field.value}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2">
                            <div className="grid grid-cols-4 gap-2 mb-2">
                              {COLORS.map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => field.onChange(c)}
                                  className="w-8 h-8 rounded-full border"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                            <Input
                              type="color"
                              {...field}
                              className="h-8 p-1"
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border rounded-xl p-3 bg-slate-50">
                    <FormLabel>Enable Site-wide Banner</FormLabel>
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
                  className="w-full bg-[#6B46C1] hover:bg-[#5a3aaa] rounded-full h-12 text-white"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

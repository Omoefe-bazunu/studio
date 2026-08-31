"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  PlusCircle,
  XCircle,
  FileUp,
  Loader2,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import Image from "next/image";

const MAX_SCREENSHOTS = 5;

const PRESET_CATEGORIES = [
  "General Websites",
  "Web App & SaaS",
  "E-Commerce",
  "Landing Page",
  "Custom Software",
  "Paid Ads",
  "Google Ads",
  "Meta Ads",
  "Social Media Ads",
  "Lead Generation",
  "Cross-Platform",
  "Fintech & Banking",
  "Health & Fitness",
  "E-Commerce Apps",
  "Custom Software",
  "Workflow Automation",
  "AI Chatbots & Agents",
  "Document & Data AI",
  "Sales & CRM Automation",
  "Custom AI Systems",
];

const getFileName = (url) => {
  if (!url || typeof url !== "string") return "Existing Image";
  return url.substring(url.lastIndexOf("/") + 1).split("?")[0];
};

const screenshotSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().url("Invalid URL.").optional().or(z.literal("")),
    file: z
      .custom((val) => val === null || val instanceof File, {
        message: "Invalid file.",
      })
      .optional(),
    hint: z
      .string()
      .min(2, "Hint must be at least 2 characters.")
      .max(30, "Hint too long"),
    name: z.string().optional(),
  })
  .refine((data) => data.url || data.file, {
    message: "Screenshot content is required.",
    path: ["file"],
  });

const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  category: z.string().min(2, "Category is required."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  deliveryDate: z.date({ required_error: "Delivery date is required." }),
  liveUrl: z.string().url("Valid URL required").optional().or(z.literal("")),
  sourceCodeUrl: z
    .string()
    .url("Valid URL required")
    .optional()
    .or(z.literal("")),
  screenshots: z.array(screenshotSchema).max(MAX_SCREENSHOTS).min(0),
});

export default function ProjectForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}) {
  const defaultValues = React.useMemo(() => {
    if (initialData) {
      return {
        title: initialData.title || "",
        category: initialData.category || "General Websites",
        description: initialData.description || "",
        deliveryDate: initialData.deliveryDate
          ? parseISO(initialData.deliveryDate)
          : new Date(),
        liveUrl: initialData.liveUrl || "",
        sourceCodeUrl: initialData.sourceCodeUrl || "",
        screenshots: (initialData.screenshots || []).map((url, index) => ({
          id: `existing-${index}`,
          url: url,
          file: null,
          hint: initialData.imageHints?.[index] || "",
          name: getFileName(url),
        })),
      };
    }
    return {
      title: "",
      category: "Web Development",
      description: "",
      deliveryDate: new Date(),
      liveUrl: "",
      sourceCodeUrl: "",
      screenshots: [],
    };
  }, [initialData]);

  const form = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) form.reset(defaultValues);
  }, [isOpen, defaultValues, form]);

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "screenshots",
  });

  const handleFileChange = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const current = fields[index];
      update(index, { ...current, file, name: file.name, url: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[650px] p-4 sm:p-8 max-h-[92vh] overflow-y-auto rounded-3xl sm:rounded-[2rem] border-white/5 bg-[#1A142D] text-white">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white">
            {initialData ? "Update Project" : "Add Project"}
          </DialogTitle>
          <DialogDescription className="text-white/50 text-xs font-bold uppercase tracking-widest">
            {initialData
              ? "Refine project & deployment details."
              : "Launch a new project into your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Project Title"
                        className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/20 focus:ring-[#6B46C1] focus-visible:ring-[#6B46C1]"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] text-red-400" />
                  </FormItem>
                )}
              />

              {/* Category Field with Preset Quick-Pills & Custom Input */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF8C38] flex items-center gap-1.5">
                      <Tag className="w-3 h-3" /> Category
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2.5">
                        <Input
                          {...field}
                          placeholder="Select or type custom category..."
                          className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/20 focus:ring-[#6B46C1] focus-visible:ring-[#6B46C1]"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {PRESET_CATEGORIES.map((cat) => {
                            const isSelected =
                              field.value?.toLowerCase() === cat.toLowerCase();
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() =>
                                  form.setValue("category", cat, {
                                    shouldValidate: true,
                                  })
                                }
                                className={cn(
                                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                  isSelected
                                    ? "bg-[#6B46C1] text-white border-[#6B46C1] shadow-md shadow-[#6B46C1]/30"
                                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white",
                                )}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] text-red-400" />
                  </FormItem>
                )}
              />

              {/* Description Summary Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      Summary
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Detailed project overview..."
                        className="bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20 focus:ring-[#6B46C1] focus-visible:ring-[#6B46C1]"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Date */}
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Delivery
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-12 bg-white/5 border-white/10 rounded-xl justify-start text-left font-normal text-white hover:bg-white/10 hover:text-white"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#6B46C1]" />
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Live URL */}
                <FormField
                  control={form.control}
                  name="liveUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Live URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://..."
                          className="bg-white/5 border-white/10 rounded-xl h-12 text-white placeholder:text-white/20"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Source Code URL */}
                <FormField
                  control={form.control}
                  name="sourceCodeUrl"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF8C38]">
                        Source Code URL (GitHub/GitLab)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://github.com/..."
                          className="bg-white/5 border-[#FF8C38]/20 rounded-xl h-12 text-white placeholder:text-white/20"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Screenshots & Assets */}
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-4">
                <FormLabel className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FF8C38]">
                  Assets
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    append({ file: null, hint: "", name: "", url: "" })
                  }
                  disabled={fields.length >= MAX_SCREENSHOTS}
                  className="text-[#6B46C1] font-black uppercase text-[10px] tracking-widest hover:bg-[#6B46C1]/10 hover:text-[#6B46C1]"
                >
                  <PlusCircle className="mr-1 h-3.5 w-3.5" /> Add Slot
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative p-4 rounded-2xl bg-white/5 border border-white/5 overflow-hidden group"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 text-white/30 hover:text-red-400 hover:bg-transparent transition-colors"
                    >
                      <XCircle size={18} />
                    </Button>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {(item.url || item.file) && (
                        <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-white/10 shrink-0">
                          <Image
                            src={
                              item.file
                                ? URL.createObjectURL(item.file)
                                : item.url
                            }
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="w-full space-y-3">
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(index, e)}
                            className="hidden"
                            id={`file-${index}`}
                          />
                          <label
                            htmlFor={`file-${index}`}
                            className="flex items-center gap-2 cursor-pointer text-[10px] font-black uppercase text-white/30 hover:text-white transition-colors"
                          >
                            <FileUp size={14} className="text-[#6B46C1]" />
                            {item.name ? (
                              <span className="truncate max-w-[200px]">
                                {item.name}
                              </span>
                            ) : (
                              "Upload Screenshot"
                            )}
                          </label>
                        </div>
                        <FormField
                          control={form.control}
                          name={`screenshots.${index}.hint`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="UI Hint (e.g. Dashboard)"
                              className="h-9 text-xs bg-white/5 border-white/5 rounded-lg text-white placeholder:text-white/20"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <DialogFooter className="gap-3 sm:gap-0 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-none font-black uppercase italic tracking-widest text-white/30 hover:text-white hover:bg-transparent h-14"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#6B46C1] hover:bg-[#5a3aaa] rounded-none px-10 h-14 font-black uppercase italic tracking-widest shadow-xl text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : initialData ? (
                  "Push Updates"
                ) : (
                  "Deploy Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

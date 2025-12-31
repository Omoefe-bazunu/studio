
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { CalendarIcon, PlusCircle, Trash2, type LucideIcon } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { MarketingCaseStudy, Achievement } from "@/types";
import Image from "next/image";

const MAX_ACHIEVEMENTS = 5;
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const achievementSchema = z.object({
  metric: z.string().min(2, "Metric name is too short.").max(50, "Metric name is too long."),
  value: z.string().min(1, "Value cannot be empty.").max(20, "Value is too long."),
  unit: z.string().max(10, "Unit is too long.").optional().or(z.literal('')),
  iconName: z.string().max(50, "Icon name too long.").optional().or(z.literal('')),
});

const caseStudyFormSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  campaignDate: z.date({ required_error: "Campaign date is required." }),
  imageSrc: z.string().url("Invalid URL.").optional().or(z.literal('')), // For existing image URL or placeholder
  imageFile: z.instanceof(File, { message: "Please upload a valid image file." })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE_BYTES,
      `Max image size is ${MAX_FILE_SIZE_MB}MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported."
    )
    .nullable() 
    .optional(), 
  imageHint: z.string().min(2, "Hint must be at least 2 characters.").max(30, "Hint too long."),
  achievements: z.array(achievementSchema)
    .max(MAX_ACHIEVEMENTS, `You can add up to ${MAX_ACHIEVEMENTS} achievements.`)
    .min(0),
}).refine(data => !!data.imageFile || !!data.imageSrc, {
  message: "An image (either new upload or existing URL/placeholder) is required.",
  path: ["imageFile"],
});


export type MarketingCaseStudyFormData = z.infer<typeof caseStudyFormSchema>;

interface MarketingCaseStudyFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MarketingCaseStudyFormData) => void;
  initialData?: MarketingCaseStudy | null;
  isLoading?: boolean;
}

export default function MarketingCaseStudyForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: MarketingCaseStudyFormProps) {

  const defaultValues = React.useMemo<MarketingCaseStudyFormData>(() => {
    if (initialData) {
      return {
        clientName: initialData.clientName || "",
        description: initialData.description || "",
        campaignDate: initialData.campaignDate ? parseISO(initialData.campaignDate) : new Date(),
        imageSrc: initialData.imageSrc || "",
        imageFile: null,
        imageHint: initialData.imageHint || "",
        achievements: initialData.achievements.map(ach => ({
          metric: ach.metric || "",
          value: ach.value || "",
          unit: ach.unit || "",
          iconName: ach.iconName || "",
        })) || [],
      };
    }
    return {
      clientName: "",
      description: "",
      campaignDate: new Date(),
      imageSrc: "",
      imageFile: null,
      imageHint: "",
      achievements: [],
    };
  }, [initialData]);

  const form = useForm<MarketingCaseStudyFormData>({
    resolver: zodResolver(caseStudyFormSchema),
    defaultValues,
  });

  // const imageFileRef = form.register("imageFile"); // Removed form.register for imageFile

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [initialData, form, defaultValues]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  const handleFormSubmit = (data: MarketingCaseStudyFormData) => {
    onSubmit(data);
  };

  const currentImageSrc = form.watch("imageSrc");
  const currentImageFileWatch = form.watch("imageFile"); // Watch the imageFile to assist preview logic

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {initialData ? "Edit Case Study" : "Add New Case Study"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of this digital marketing case study." : "Fill in the details for the new case study."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Awesome Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe the campaign, strategies used, and outcomes."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="campaignDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Campaign End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, onBlur, value, ref, name } }) => ( // Destructure `name` from field
                <FormItem>
                  <FormLabel>Case Study Image (Client Logo or Campaign Visual)</FormLabel>
                  {currentImageSrc && !currentImageFileWatch && ( // Show existing image if no new file is watched
                    <div className="my-2">
                      <Image src={currentImageSrc} alt="Current case study image" width={150} height={100} className="rounded-md object-cover border" data-ai-hint={form.getValues("imageHint") || 'marketing visual'}/>
                      <p className="text-xs text-muted-foreground mt-1">Current image. Upload a new file to replace it.</p>
                    </div>
                  )}
                  {currentImageFileWatch && (
                      <p className="text-xs text-muted-foreground my-1 truncate">New file selected: {currentImageFileWatch.name}</p>
                    )}
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onBlur={onBlur}
                      name={name} // Pass name to Input
                      ref={ref}   // Pass ref to Input
                      onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          onChange(file); // Use field.onChange from Controller
                          if (file) {
                              form.setValue("imageSrc", "", { shouldValidate: false }); // Clear existing imageSrc
                          }
                      }}
                      className="text-sm file:mr-2 file:py-1.5 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </FormControl>
                  <FormDescription>Max file size: {MAX_FILE_SIZE_MB}MB. Accepted types: JPG, PNG, GIF, WEBP.</FormDescription>
                  <FormMessage>{form.formState.errors.imageFile?.message as React.ReactNode || form.formState.errors.root?.message as React.ReactNode}</FormMessage>
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Hint</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., client logo, campaign visual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Achievements (Up to {MAX_ACHIEVEMENTS})</FormLabel>
              <FormDescription className="mb-2">
                Highlight key metrics and results from the campaign.
              </FormDescription>
              {fields.map((item, index) => (
                <div key={item.id} className="space-y-2 p-3 border rounded-md mb-3 relative">
                  <FormLabel className="text-sm">Achievement {index + 1}</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.metric`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Metric Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Metric (e.g., ROI, Engagement)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Value</FormLabel>
                          <FormControl>
                            <Input placeholder="Value (e.g., 150, 5x)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Unit</FormLabel>
                          <FormControl>
                            <Input placeholder="Unit (e.g., %, +, followers)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`achievements.${index}.iconName`}
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel className="sr-only">Icon Name (Optional)</FormLabel>
                           <FormControl>
                             <Input placeholder="Lucide Icon Name (e.g., Eye, Users)" {...field} />
                           </FormControl>
                           <FormDescription className="text-xs">E.g., Eye, Users, LineChart. Case-sensitive.</FormDescription>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute top-1 right-1 text-destructive hover:text-destructive/80"
                    aria-label="Remove achievement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {fields.length < MAX_ACHIEVEMENTS && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ metric: "", value: "", unit: "", iconName: "" })}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Achievement
                </Button>
              )}
              <FormMessage>{form.formState.errors.achievements?.message}</FormMessage>
              {form.formState.errors.achievements?.root?.message && (
                 <FormMessage>{form.formState.errors.achievements.root.message}</FormMessage>
               )}
            </div>

            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => { form.reset(defaultValues); onOpenChange(false);}}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Case Study")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


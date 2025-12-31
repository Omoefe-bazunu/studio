
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form"; // Import Controller
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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { MarketingAdProject } from "@/types";
import Image from "next/image";

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const adProjectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  deliveryDate: z.date({ required_error: "Delivery date is required." }),
  imageSrc: z.string().url("Invalid URL.").optional().or(z.literal('')),
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
}).refine(data => !!data.imageFile || !!data.imageSrc, { 
  message: "An image (either new upload or existing URL/placeholder) is required.",
  path: ["imageFile"], 
});


export type MarketingAdProjectFormData = z.infer<typeof adProjectFormSchema>;

interface MarketingAdProjectFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MarketingAdProjectFormData) => void;
  initialData?: MarketingAdProject | null;
  isLoading?: boolean;
}

export default function MarketingAdProjectForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: MarketingAdProjectFormProps) {
  
  const defaultValues = React.useMemo<MarketingAdProjectFormData>(() => {
    if (initialData) {
      return {
        title: initialData.title || "",
        description: initialData.description || "",
        deliveryDate: initialData.deliveryDate ? parseISO(initialData.deliveryDate) : new Date(),
        imageSrc: initialData.imageSrc || "",
        imageFile: null, 
        imageHint: initialData.imageHint || "",
      };
    }
    return {
      title: "",
      description: "",
      deliveryDate: new Date(),
      imageSrc: "",
      imageFile: null, 
      imageHint: "",
    };
  }, [initialData]);

  const form = useForm<MarketingAdProjectFormData>({
    resolver: zodResolver(adProjectFormSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
    form.reset(defaultValues);
  }, [initialData, form, defaultValues]);

  const handleFormSubmit = (data: MarketingAdProjectFormData) => {
    onSubmit(data);
  };

  const currentImageSrcFromForm = form.watch("imageSrc");
  const currentImageFileWatch = form.watch("imageFile");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {initialData ? "Edit Ad Project" : "Add New Ad Project"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of this marketing/ad project." : "Fill in the details for the new project."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project/Campaign Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Summer Sale Campaign" {...field} />
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
                      placeholder="Briefly describe the project, objectives, and assets created."
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
              name="deliveryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Delivery Date</FormLabel>
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
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <FormItem>
                  <FormLabel>Primary Project Image</FormLabel>
                  {currentImageSrcFromForm && !currentImageFileWatch && (
                    <div className="my-2">
                      <Image src={currentImageSrcFromForm} alt="Current project image" width={150} height={100} className="rounded-md object-cover border" data-ai-hint={form.getValues("imageHint") || 'ad design visual'}/>
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
                        name={name}
                        ref={ref}
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            onChange(file); // Use field.onChange from Controller
                            if (file) {
                                form.setValue("imageSrc", "", { shouldValidate: false }); 
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
                    <Input placeholder="E.g., ad banner design" {...field} />
                  </FormControl>
                  <FormDescription>Short hint for AI image search if placeholder is replaced.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => { form.reset(defaultValues); onOpenChange(false);}}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Ad Project")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


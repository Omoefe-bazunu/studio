
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import * as z from "zod";
import Image from "next/image";
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
import type { AffiliateResourceImage } from "@/types";

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const affiliateImageResourceFormSchema = z.object({
  altText: z.string().min(3, "Alt text must be at least 3 characters."),
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
  imageUrl: z.string().url("Invalid URL for existing image.").optional().or(z.literal('')),
  imageHint: z.string().min(2, "Hint must be at least 2 characters.").max(30, "Hint too long."),
  downloadName: z.string().min(3, "Download name must be at least 3 characters (e.g., promo_banner.png)."),
}).refine(data => !!data.imageFile || !!data.imageUrl, {
  message: "An image (either new upload or existing URL) is required.",
  path: ["imageFile"], 
});


export type AffiliateResourceImageFormData = z.infer<typeof affiliateImageResourceFormSchema>;

interface AffiliateImageResourceFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AffiliateResourceImageFormData) => void;
  initialData?: AffiliateResourceImage | null;
  isLoading?: boolean;
}

export default function AffiliateImageResourceForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: AffiliateImageResourceFormProps) {
  
  const defaultValues = React.useMemo<AffiliateResourceImageFormData>(() => {
    if (initialData) {
      return {
        altText: initialData.altText || "",
        imageUrl: initialData.imageUrl || "",
        imageFile: null,
        imageHint: initialData.imageHint || "promo banner",
        downloadName: initialData.downloadName || "affiliate_image.png",
      };
    }
    return {
      altText: "",
      imageUrl: "",
      imageFile: null,
      imageHint: "promo banner",
      downloadName: "affiliate_image.png",
    };
  }, [initialData]);

  const form = useForm<AffiliateResourceImageFormData>({
    resolver: zodResolver(affiliateImageResourceFormSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
    form.reset(defaultValues);
  }, [initialData, form, defaultValues]);

  const handleFormSubmit = (data: AffiliateResourceImageFormData) => {
    onSubmit(data);
  };

  const currentImageUrl = form.watch("imageUrl");
  const currentImageFile = form.watch("imageFile");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {initialData ? "Edit Image Resource" : "Add New Image Resource"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of this image asset." : "Fill in the details for the new image asset."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Text (for accessibility)</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Promotional banner for summer sale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Controller
              name="imageFile"
              control={form.control}
              render={({ field: { onChange, onBlur, name, ref } }) => ( // Removed value from field destructuring
                <FormItem>
                  <FormLabel>Resource Image</FormLabel>
                  {currentImageUrl && !currentImageFile && (
                    <div className="my-2">
                      <Image src={currentImageUrl} alt="Current resource image" width={150} height={100} className="rounded-md object-cover border" data-ai-hint={form.getValues("imageHint") || 'promotional image'}/>
                      <p className="text-xs text-muted-foreground mt-1">Current image. Upload a new file to replace it.</p>
                    </div>
                  )}
                  {currentImageFile && (
                      <p className="text-xs text-muted-foreground my-1 truncate">New file selected: {currentImageFile.name}</p>
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
                                form.setValue("imageUrl", "", { shouldValidate: false }); 
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
                  <FormLabel>Image Hint (for AI)</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., modern banner tech" {...field} />
                  </FormControl>
                  <FormDescription>Short hint for AI image search if placeholder is replaced (1-2 words).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="downloadName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Download File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., higher_promo_banner.png" {...field} />
                  </FormControl>
                  <FormDescription>The name users will see when downloading the image.</FormDescription>
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
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Image Resource")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

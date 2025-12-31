
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import Image from "next/image"; // Removed Image import
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
  // FormDescription, // Removed if not used for image
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StarRating from "@/components/landing/StarRating";
import type { Testimonial, TestimonialFormData } from "@/types"; // TestimonialFormData will be updated
import { servicesNavData } from "@/data/servicesNavData";

// MAX_FILE_SIZE_MB and ACCEPTED_IMAGE_TYPES are no longer needed

const testimonialFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name is too long."),
  statement: z.string().min(10, "Statement must be at least 10 characters.").max(500, "Statement is too long."),
  rating: z.number().min(1, "Rating must be between 1 and 5.").max(5),
  serviceCategory: z.string().min(1, "Please select a service category."),
  // imageFile, imageSrc, imageHint fields are removed
});

// TestimonialFormData is now simpler as it doesn't include image fields.
// The type is inferred from the schema above.

interface TestimonialFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TestimonialFormData) => void;
  initialData?: Testimonial | null;
  isLoading?: boolean;
}

export default function TestimonialForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: TestimonialFormProps) {
  
  const defaultValues = React.useMemo<TestimonialFormData>(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        statement: initialData.statement || "",
        rating: initialData.rating || 0,
        serviceCategory: initialData.serviceCategory || "",
        // No image fields
      };
    }
    return {
      name: "",
      statement: "",
      rating: 0,
      serviceCategory: "",
      // No image fields
    };
  }, [initialData]);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues,
  });
  
  // imageFileRef is no longer needed

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [initialData, form, defaultValues]);

  const handleFormSubmit = (data: TestimonialFormData) => {
    onSubmit(data);
  };

  // currentImageUrl and currentImageFile are no longer needed

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {initialData ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of this testimonial." : "Fill in the details for the new testimonial."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="statement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testimonial Statement</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter client's feedback here..." {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rating (1-5 Stars)</FormLabel>
                    <FormControl>
                        <StarRating rating={field.value} onRatingChange={field.onChange} interactive starSize={24} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="serviceCategory"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {servicesNavData.map(service => (
                            <SelectItem key={service.id} value={service.title}>{service.title}</SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            {/* Removed Client Image and Image Hint FormItems */}
            
            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => { form.reset(defaultValues); onOpenChange(false);}}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Testimonial")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

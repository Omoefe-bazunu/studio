
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AffiliateResourceText } from "@/types";

const affiliateTextResourceFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
});

export type AffiliateResourceTextFormData = z.infer<typeof affiliateTextResourceFormSchema>;

interface AffiliateTextResourceFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AffiliateResourceTextFormData) => void;
  initialData?: AffiliateResourceText | null;
  isLoading?: boolean;
}

export default function AffiliateTextResourceForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: AffiliateTextResourceFormProps) {
  
  const defaultValues = React.useMemo(() => {
    if (initialData) {
      return {
        title: initialData.title || "",
        content: initialData.content || "",
      };
    }
    return {
      title: "",
      content: "",
    };
  }, [initialData]);

  const form = useForm<AffiliateResourceTextFormData>({
    resolver: zodResolver(affiliateTextResourceFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [initialData, form, defaultValues]);

  const handleFormSubmit = (data: AffiliateResourceTextFormData) => {
    onSubmit(data);
    if (!initialData) {
        form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {initialData ? "Edit Text Resource" : "Add New Text Resource"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of this text asset." : "Fill in the details for the new text asset."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., General Promo Text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the marketing copy here..."
                      {...field}
                      rows={5}
                    />
                  </FormControl>
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
                {isLoading ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Text Resource")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

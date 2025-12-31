
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
import type { CvSuccessStory } from "@/types";

const successStoryFormSchema = z.object({
  clientInfo: z.string().min(5, "Client info must be at least 5 characters (e.g., 'Role, City')."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  serviceDate: z.date({ required_error: "Service date is required." }),
});

export type CvSuccessStoryFormData = z.infer<typeof successStoryFormSchema>;

interface CvSuccessStoryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CvSuccessStoryFormData) => void;
  initialData?: CvSuccessStory | null;
  isLoading?: boolean;
}

export default function CvSuccessStoryForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: CvSuccessStoryFormProps) {
  
  const defaultValues = React.useMemo(() => {
    if (initialData) {
      return {
        clientInfo: initialData.clientInfo || "",
        description: initialData.description || "",
        serviceDate: initialData.serviceDate ? parseISO(initialData.serviceDate) : new Date(),
      };
    }
    return {
      clientInfo: "",
      description: "",
      serviceDate: new Date(),
    };
  }, [initialData]);

  const form = useForm<CvSuccessStoryFormData>({
    resolver: zodResolver(successStoryFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [initialData, form, defaultValues]);

  const handleFormSubmit = (data: CvSuccessStoryFormData) => {
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
            {initialData ? "Edit Success Story" : "Add New Success Story"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of this client success story." : "Fill in the details for the new success story."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="clientInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Information</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Software Engineer, London, UK" {...field} />
                  </FormControl>
                  <FormDescription>Role, Industry, Location, or other relevant info.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Success Story / Outcome</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe the positive outcome or achievement."
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
              name="serviceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Service Completion Date</FormLabel>
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
            
            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Success Story")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

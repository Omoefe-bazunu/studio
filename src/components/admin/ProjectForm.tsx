
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
import { CalendarIcon, PlusCircle, Trash2, FileImage, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { WebProject, ProjectFormData, ProjectScreenshotData } from "@/types";
import Image from "next/image";

const MAX_SCREENSHOTS = 5;

const screenshotSchema = z.object({
  id: z.string().optional(), // To identify existing screenshots during edit
  url: z.string().url("Invalid URL.").optional().or(z.literal('')), // For existing images
  file: z.custom<File | null>((val) => val === null || val instanceof File, { // Allow File or null
    message: "Invalid file.",
  }).optional(),
  hint: z.string().min(2, "Hint must be at least 2 characters.").max(30, "Hint too long"),
  name: z.string().optional(), // Original file name
}).refine(data => data.url || data.file, {
  message: "Either an existing image URL or a new file is required for a screenshot.",
  path: ["file"], // Attach error to file input for simplicity
});


const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  deliveryDate: z.date({ required_error: "Delivery date is required." }),
  liveUrl: z.string().url("Please enter a valid URL (e.g., https://example.com)").optional().or(z.literal('')),
  screenshots: z.array(screenshotSchema)
    .max(MAX_SCREENSHOTS, `You can add up to ${MAX_SCREENSHOTS} screenshots.`)
    .min(0),
});

// Type for what the form hook manages (ProjectFormData is what's submitted)
type ProjectFormValues = z.infer<typeof projectFormSchema>;


interface ProjectFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => void; // onSubmit expects ProjectFormData
  initialData?: WebProject | null;
  isLoading?: boolean;
}

export default function ProjectForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: ProjectFormProps) {
  
  const defaultValues = React.useMemo<ProjectFormValues>(() => {
    if (initialData) {
      return {
        title: initialData.title || "",
        description: initialData.description || "",
        deliveryDate: initialData.deliveryDate ? parseISO(initialData.deliveryDate) : new Date(),
        liveUrl: initialData.liveUrl || "",
        screenshots: initialData.screenshots.map((url, index) => ({
          id: `existing-${index}-${initialData.id}`, // Unique ID for existing
          url: url,
          file: null, // No file for existing, just URL
          hint: initialData.imageHints[index] || "",
          name: url.substring(url.lastIndexOf('/') + 1), // Extract name from URL if possible
        })) || [],
      };
    }
    return {
      title: "",
      description: "",
      deliveryDate: new Date(),
      liveUrl: "",
      screenshots: [],
    };
  }, [initialData]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [initialData, form, defaultValues]);


  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "screenshots",
  });

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const currentScreenshot = fields[index];
      update(index, { ...currentScreenshot, file: file, name: file.name, url: undefined }); // Clear URL if new file is chosen
    }
  };

  const handleFormSubmit = (data: ProjectFormValues) => {
     // Transform ProjectFormValues to ProjectFormData
    const submitData: ProjectFormData = {
      ...data,
      screenshots: data.screenshots.map(s => ({
        id: s.id, // Keep id for potential update logic
        url: s.url,
        file: s.file,
        hint: s.hint,
        name: s.name,
      })),
    };
    onSubmit(submitData); // Pass the transformed data
  };

  const addScreenshotField = () => {
    if (fields.length < MAX_SCREENSHOTS) {
      append({ file: null, hint: "", name: "", url: "" });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {initialData ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of this project." : "Fill in the details for the new web project."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Corporate Portfolio Website" {...field} />
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
                      placeholder="Briefly describe the project, technologies used, and its purpose."
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
                        // disabled={(date) =>
                        //   date > new Date() || date < new Date("1900-01-01")
                        // }
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
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Site URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Screenshots (Up to {MAX_SCREENSHOTS})</FormLabel>
              <FormDescription className="mb-2">
                Upload project screenshots and provide a short descriptive hint for each.
              </FormDescription>
              {fields.map((item, index) => (
                <div key={item.id} className="space-y-3 p-4 border rounded-md mb-3 relative bg-muted/30">
                   <div className="flex justify-between items-center">
                    <FormLabel className="text-sm font-medium text-primary">Screenshot {index + 1}</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive/80 h-7 w-7"
                      aria-label="Remove screenshot"
                    >
                      <XCircle className="h-4.5 w-4.5" />
                    </Button>
                   </div>
                  
                  {/* Display existing image or file name */}
                  {item.url && !item.file && (
                    <div className="my-2">
                      <Image src={item.url} alt={`Existing screenshot ${index + 1}`} width={100} height={60} className="rounded-md object-cover border" data-ai-hint={item.hint || 'website screenshot'}/>
                      <p className="text-xs text-muted-foreground mt-1 truncate">Current: {item.name || item.url}</p>
                    </div>
                  )}
                  {item.file && (
                     <p className="text-xs text-muted-foreground my-1 truncate">New file: {item.file.name}</p>
                  )}

                  <FormField
                    control={form.control}
                    name={`screenshots.${index}.file`}
                    render={({ field: { onChange: _onChange, value: _value, ...restField }}) => ( // field.onChange and field.value are handled manually
                      <FormItem>
                        <FormLabel className="sr-only">Screenshot File {index + 1}</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            onChange={(e) => handleFileChange(index, e)}
                            className="text-sm file:mr-2 file:py-1.5 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            {...restField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`screenshots.${index}.hint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Image Hint {index + 1}</FormLabel>
                        <FormControl>
                          <Input placeholder="Image Hint (e.g., homepage design)" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {fields.length < MAX_SCREENSHOTS && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addScreenshotField}
                  className="mt-2 border-dashed"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Screenshot Slot
                </Button>
              )}
               <FormMessage>{form.formState.errors.screenshots?.message || form.formState.errors.screenshots?.root?.message}</FormMessage>
            </div>
            
            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Project")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

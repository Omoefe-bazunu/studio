
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea"; 
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { BlogPost, BlogPostFormValues, BlogCategoryType } from "@/types";
import { blogCategoriesData } from "@/data/blogCategories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; 


const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const blogPostFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  slug: z.string().min(5, "Slug must be at least 5 characters.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and hyphenated."),
  category: z.custom<BlogCategoryType>((val) => blogCategoriesData.some(cat => cat.id === val), {
    message: "Invalid category selected.",
  }),
  imageSrc: z.string().url("Invalid URL for existing image.").optional().or(z.literal('')),
  imageFile: z.instanceof(File, { message: "Please upload a valid image file." })
    .refine( file => file.size <= MAX_FILE_SIZE_BYTES, `Max image size is ${MAX_FILE_SIZE_MB}MB.`)
    .refine( file => ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png, and .webp formats are supported.")
    .nullable()
    .optional(),
  imageHint: z.string().min(2, "Hint must be at least 2 characters.").max(30, "Hint too long."),
  imageCreditText: z.string().max(150, "Image credit text is too long.").optional(),
  imageCreditLink: z.string().url("Image credit link must be a valid URL.").optional().or(z.literal('')),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters.").max(200, "Excerpt too long."),
  content: z.string().min(100, "Content must be at least 100 characters."),
  authorName: z.string().min(2, "Author name must be at least 2 characters."),
  authorImageSrc: z.string().url("Invalid URL for existing author image.").optional().or(z.literal('')),
  authorImageFile: z.instanceof(File, { message: "Please upload a valid author image file." })
    .refine( file => file.size <= MAX_FILE_SIZE_BYTES, `Max author image size is ${MAX_FILE_SIZE_MB}MB.`)
    .refine( file => ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png, and .webp formats are supported for author image.")
    .nullable()
    .optional(),
  date: z.date({ required_error: "Publication date is required." }),
}).refine(data => data.imageFile || data.imageSrc, {
  message: "A main post image (either new upload or existing URL) is required.",
  path: ["imageFile"],
});

interface BlogPostFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BlogPostFormValues) => Promise<void> | void;
  initialData?: Partial<BlogPost> & { date?: string | Date } | null;
  isLoading?: boolean;
  defaultCategory?: BlogCategoryType;
}

export default function BlogPostForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
  defaultCategory = 'Tech',
}: BlogPostFormProps) {
  
  const { toast } = useToast();
  const [isUploading, setIsUploading] = React.useState(false);

  const defaultValues = React.useMemo<BlogPostFormValues>(() => {
    if (initialData) {
      let dateValue;
      if (initialData.date) {
        if (initialData.date instanceof Date) {
          dateValue = initialData.date;
        } else if (typeof initialData.date === 'string') {
          try {
            dateValue = parseISO(initialData.date);
            if (isNaN(dateValue.getTime())) dateValue = new Date();
          } catch (e) {
            dateValue = new Date(); 
          }
        } else {
          dateValue = new Date(); 
        }
      } else {
        dateValue = new Date();
      }
  
      return {
        title: initialData.title || "",
        slug: initialData.slug || "",
        category: initialData.category || defaultCategory,
        imageSrc: initialData.imageSrc || "",
        imageFile: null,
        imageHint: initialData.imageHint || "",
        imageCreditText: initialData.imageCreditText || "",
        imageCreditLink: initialData.imageCreditLink || "",
        excerpt: initialData.excerpt || "",
        content: initialData.content || "", 
        authorName: initialData.authorName || "",
        authorImageSrc: initialData.authorImageSrc || "",
        authorImageFile: null,
        date: dateValue,
      };
    }
    return {
      title: "",
      slug: "",
      category: defaultCategory,
      imageSrc: "",
      imageFile: null,
      imageHint: "",
      imageCreditText: "",
      imageCreditLink: "",
      excerpt: "",
      content: "", 
      authorName: "",
      authorImageSrc: "",
      authorImageFile: null,
      date: new Date(),
    };
  }, [initialData, defaultCategory]);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues,
    mode: "onChange",
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [initialData, form, defaultValues]);

  const handleFormSubmit = async (data: BlogPostFormValues) => {
    try {
      await onSubmit(data); 
    } catch (error) {
      console.error("Error submitting blog post form:", error);
      toast({
        title: "Submission Error",
        description: `An error occurred. ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const currentImageSrc = form.watch("imageSrc");
  const currentImageFile = form.watch("imageFile");
  const currentAuthorImageSrc = form.watch("authorImageSrc");
  const currentAuthorImageFile = form.watch("authorImageFile");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {initialData?.id ? "Edit Blog Post" : "Add New Blog Post"}
          </DialogTitle>
          <DialogDescription>
            {initialData?.id ? "Update the details of this blog post." : "Fill in the details for the new blog post."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-muted/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Blog Post Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="blog-post-slug" {...field} />
                      </FormControl>
                      <FormDescription>Lowercase, hyphenated, e.g., "my-first-post"</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {blogCategoriesData.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <Controller
                  name="imageFile"
                  control={form.control}
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                      <FormLabel>Post Image</FormLabel>
                      {currentImageSrc && !currentImageFile && (
                        <div className="my-2">
                          <Image src={currentImageSrc} alt="Current post image" width={150} height={100} className="rounded-md object-cover border" data-ai-hint={form.getValues("imageHint") || 'blog post image'}/>
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
                                onChange(file); 
                                if (file) {
                                    form.setValue("imageSrc", "", { shouldValidate: false }); 
                                }
                            }}
                            className="text-sm file:mr-2 file:py-1.5 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                      </FormControl>
                      <FormDescription>Max file size: {MAX_FILE_SIZE_MB}MB. Accepted: JPG, PNG, WEBP.</FormDescription>
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
                        <Input placeholder="E.g., abstract tech" {...field} />
                      </FormControl>
                      <FormDescription>For AI image search (1-2 words).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="imageCreditText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Credit Text (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Photo by Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageCreditLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Credit Link (Optional)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://example.com/photographer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Input placeholder="Short summary of the post (max 200 chars)..." {...field} maxLength={200} />
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
                    <FormLabel>Full Content</FormLabel>
                    <FormControl>
                       <Textarea placeholder="Write your blog post here..." {...field} rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  name="authorImageFile"
                  control={form.control}
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                      <FormLabel>Author Image (Optional)</FormLabel>
                       {currentAuthorImageSrc && !currentAuthorImageFile && (
                        <div className="my-2">
                          <Image src={currentAuthorImageSrc} alt="Current author image" width={60} height={60} className="rounded-full object-cover border" data-ai-hint="author portrait"/>
                          <p className="text-xs text-muted-foreground mt-1">Current image. Upload new to replace.</p>
                        </div>
                      )}
                      {currentAuthorImageFile && (
                        <p className="text-xs text-muted-foreground my-1 truncate">New file selected: {currentAuthorImageFile.name}</p>
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
                                onChange(file);
                                if (file) {
                                    form.setValue("authorImageSrc", "", { shouldValidate: false });
                                }
                            }}
                            className="text-sm file:mr-2 file:py-1.5 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                      </FormControl>
                      <FormDescription>Max {MAX_FILE_SIZE_MB}MB. JPG, PNG, WEBP.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Publication Date</FormLabel>
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-6 sticky bottom-0 bg-background pb-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={() => { onOpenChange(false); form.reset(defaultValues); }}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isUploading || isLoading}>
                  {isUploading ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> ) 
                    : isLoading ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {initialData?.id ? "Saving..." : "Adding..."}</> ) 
                    : (initialData?.id ? "Save Changes" : "Add Post")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

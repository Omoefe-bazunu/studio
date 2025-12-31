"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  PlusCircle,
  Send,
  Trash2,
  UserCircle2,
  Sparkles,
} from "lucide-react";
import StarRating from "./StarRating";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import TestimonialForm from "@/components/admin/TestimonialForm";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/firebase/firestoreService";
import { servicesNavData } from "@/data/servicesNavData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";

const reviewSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  serviceCategory: z.string().min(1),
  rating: z.number().min(1).max(5),
  review: z.string().min(10).max(500),
});

const DUMMY_TESTIMONIALS = [
  {
    id: "d1",
    name: "Success Partner",
    serviceCategory: "Strategy",
    rating: 5,
    statement:
      "The quality of work exceeded our expectations. Truly a premium service at a fair price.",
  },
];

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const { currentUser, isAdmin } = useAuth();
  const { toast } = useToast();

  const [modal, setModal] = useState({
    admin: false,
    review: false,
    delete: null,
    editing: null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(
        data.length > 0 ? data : isAdmin ? [] : DUMMY_TESTIMONIALS
      );
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to load testimonials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reviewForm = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: currentUser?.displayName || "",
      email: currentUser?.email || "",
      rating: 5,
      serviceCategory: "",
      review: "",
    },
  });

  const handleReviewSubmit = async (values) => {
    try {
      await addTestimonial({
        ...values,
        statement: values.review,
        userId: currentUser.uid,
        status: "approved",
      });
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      setModal((p) => ({ ...p, review: false }));
      fetchData();
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const next = () => setIndex((p) => (p + 1) % testimonials.length);
  const prev = () =>
    setIndex((p) => (p - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[index];

  return (
    <section
      id="testimonials"
      className="py-20 bg-slate-50 relative overflow-hidden"
    >
      {/* Background decoration to match professional theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#6B46C1]/20 to-transparent" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            What Our Clients Say
          </h2>
          {isAdmin && (
            <Button
              onClick={() =>
                setModal((p) => ({ ...p, admin: true, editing: null }))
              }
              className="mt-6 bg-[#6B46C1] hover:bg-[#5a3aaa] rounded-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
            </Button>
          )}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#6B46C1] w-10 h-10" />
          </div>
        ) : current ? (
          <div className="relative group">
            <Card className="border-none shadow-2xl shadow-purple-500/5 rounded-[2rem] overflow-hidden bg-white">
              <CardContent className="pt-12 pb-10 px-8 md:px-16 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-6 ring-4 ring-purple-50">
                  <AvatarFallback className="bg-[#6B46C1] text-white text-xl font-bold">
                    {current.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <StarRating
                  rating={current.rating}
                  className="justify-center mb-6 text-[#FF8C38]"
                  starSize={20}
                />

                <blockquote className="text-xl md:text-2xl text-slate-800 leading-relaxed mb-8 ">
                  &ldquo;{current.statement}&rdquo;
                </blockquote>

                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    {current.name}
                  </h4>
                  <p className="text-[#6B46C1] text-sm font-semibold tracking-wide uppercase">
                    {current.serviceCategory}
                  </p>
                </div>

                {isAdmin && (
                  <div className="flex justify-center gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setModal((p) => ({
                          ...p,
                          admin: true,
                          editing: current,
                        }));
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() =>
                        setModal((p) => ({ ...p, delete: current }))
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {testimonials.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-slate-200"
                  onClick={prev}
                >
                  <ChevronLeft />
                </Button>
                <div className="text-sm font-medium text-slate-400">
                  {index + 1} / {testimonials.length}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-slate-200"
                  onClick={next}
                >
                  <ChevronRight />
                </Button>
              </div>
            )}
          </div>
        ) : null}

        {/* CTA Area */}
        <div className="mt-20 text-center">
          {!currentUser ? (
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg inline-block max-w-md">
              <h3 className="text-xl font-bold mb-2">Share your experience</h3>
              <p className="text-slate-500 mb-6">
                Join our happy clients and let us know how we did.
              </p>
              <Button
                asChild
                className="bg-[#FF8C38] hover:bg-[#e67e32] rounded-full px-8"
              >
                <Link href="/login">Sign In to Review</Link>
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setModal((p) => ({ ...p, review: true }))}
              className="bg-[#FF8C38] hover:bg-[#e67e32] text-white rounded-full h-14 px-10 font-bold shadow-lg shadow-orange-500/20"
            >
              <Send className="mr-2 h-5 w-5" /> Leave a Review
            </Button>
          )}
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog
        open={modal.review}
        onOpenChange={(v) => setModal((p) => ({ ...p, review: v }))}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Your Feedback</DialogTitle>
          </DialogHeader>
          <Form {...reviewForm}>
            <form
              onSubmit={reviewForm.handleSubmit(handleReviewSubmit)}
              className="space-y-4"
            >
              <FormField
                name="serviceCategory"
                control={reviewForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {servicesNavData.map((s) => (
                          <SelectItem key={s.id} value={s.title}>
                            {s.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="rating"
                control={reviewForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      interactive
                      starSize={24}
                    />
                  </FormItem>
                )}
              />
              <FormField
                name="review"
                control={reviewForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="How was your experience?"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#6B46C1]"
                disabled={reviewForm.formState.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Admin Dialog */}
      {isAdmin && (
        <TestimonialForm
          isOpen={modal.admin}
          onOpenChange={(v) => setModal((p) => ({ ...p, admin: v }))}
          initialData={modal.editing}
          onSubmit={fetchData}
        />
      )}

      {/* Delete Dialog */}
      <AlertDialog
        open={!!modal.delete}
        onOpenChange={() => setModal((p) => ({ ...p, delete: null }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={async () => {
                await deleteTestimonial(modal.delete.id);
                fetchData();
                setModal((p) => ({ ...p, delete: null }));
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

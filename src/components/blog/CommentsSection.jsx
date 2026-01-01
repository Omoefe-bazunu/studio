"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  MessageSquare,
  User,
  Calendar,
  ShieldCheck,
  LogIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation Schema
const commentFormSchema = z.object({
  authorName: z.string().min(2, "Identification required.").max(50),
  text: z.string().min(5, "Comment is too brief.").max(500),
});

export default function CommentsSection({
  postId,
  initialComments = [],
  onCommentSubmit,
  isAuthenticated,
}) {
  const { currentUser } = useAuth();

  const form = useForm({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      authorName: currentUser?.displayName || "",
      text: "",
    },
  });

  // Keep Name field in sync with Auth Profile
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      form.setValue(
        "authorName",
        currentUser.displayName || currentUser.email.split("@")[0]
      );
    } else if (!isAuthenticated) {
      form.setValue("authorName", "");
    }
  }, [currentUser, isAuthenticated, form]);

  const handleFormSubmit = (data) => {
    onCommentSubmit(data);
    form.reset({ authorName: currentUser?.displayName || "", text: "" });
  };

  return (
    <section className="mt-20 py-12 border-t border-slate-100">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#6B46C1] p-2 rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tighter">
            Discussion{" "}
            <span className="text-slate-400 font-light">
              ({initialComments.length})
            </span>
          </h2>
        </div>
      </div>

      {/* 1. COMMENT FORM AREA */}
      {isAuthenticated ? (
        <div className="mb-16 bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1 text-[#6B46C1]" /> Secure
              Commenting Active
            </span>
          </div>

          <div className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Display Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your identity"
                          className="h-12 rounded-lg border-slate-200 focus:border-[#6B46C1] bg-slate-50"
                          {...field}
                          readOnly={!!currentUser?.displayName}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Your Perspective
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Technical query or feedback..."
                          className="rounded-lg border-slate-200 focus:border-[#6B46C1] bg-slate-50 min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full px-8 h-12 font-bold transition-all hover:scale-105"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Syncing..."
                    : "Post Perspective"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <div className="mb-16 text-center p-10 bg-slate-50 border border-dashed border-slate-300">
          <p className="text-slate-500 font-medium mb-4">
            You must be part of the community to join the discussion.
          </p>
          <Button
            asChild
            className="bg-[#FF8C38] hover:bg-[#e67e32] rounded-full px-10 font-bold"
          >
            <a href="/login">
              <LogIn className="mr-2 h-4 w-4" /> Sign In to Comment
            </a>
          </Button>
        </div>
      )}

      {/* 2. COMMENTS LIST */}
      <div className="space-y-10">
        {initialComments.length > 0 ? (
          initialComments.map((comment, index) => (
            <div key={comment.id || index} className="group">
              <article className="flex items-start space-x-6">
                <Avatar className="h-12 w-12 border-2 border-white shadow-md rounded-lg">
                  {comment.authorImageSrc && (
                    <AvatarImage
                      src={comment.authorImageSrc}
                      alt={comment.authorName}
                    />
                  )}
                  <AvatarFallback className="bg-slate-100 text-[#6B46C1] font-bold">
                    {comment.authorName?.substring(0, 1).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 bg-white p-6 border border-slate-100 group-hover:border-slate-200 transition-colors shadow-sm relative">
                  {/* Decorative accent */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#6B46C1] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-900 text-sm tracking-tight">
                      {comment.authorName}
                    </h4>
                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <Calendar className="w-3 h-3 mr-1 text-[#FF8C38]" />
                      {format(new Date(comment.date), "MMM d, yyyy • h:mm a")}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              </article>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="h-px w-24 bg-slate-100 mx-auto mb-6" />
            <p className="text-slate-400 font-medium italic">
              The floor is quiet. Be the first to start the conversation.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

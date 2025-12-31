
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Comment } from '@/types';
import { format } from 'date-fns';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from '../ui/separator';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CommentsSectionProps {
  postId: string;
  initialComments: Comment[];
  onCommentSubmit: (commentData: { authorName: string; text: string }) => void;
  isAuthenticated: boolean;
}

const commentFormSchema = z.object({
  authorName: z.string().min(2, "Name is too short.").max(50, "Name is too long."),
  text: z.string().min(5, "Comment is too short.").max(500, "Comment is too long."),
});

type CommentFormData = z.infer<typeof commentFormSchema>;

export default function CommentsSection({ postId, initialComments, onCommentSubmit, isAuthenticated }: CommentsSectionProps) {
  const { currentUser } = useAuth(); // Get currentUser for pre-filling name

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      authorName: currentUser?.displayName || "", // Pre-fill if user is logged in
      text: "",
    },
  });

  // Update default authorName if currentUser changes
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      form.setValue("authorName", currentUser.displayName || "");
    } else if (!isAuthenticated) {
      form.setValue("authorName", ""); // Clear if not authenticated
    }
  }, [currentUser, isAuthenticated, form]);

  const handleFormSubmit: SubmitHandler<CommentFormData> = (data) => {
    onCommentSubmit(data); // Pass only authorName and text
    form.reset({ authorName: currentUser?.displayName || "", text: ""}); // Reset with pre-filled name if still authenticated
  };

  return (
    <section className="mt-12 py-8 border-t">
      <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center">
        <MessageSquare className="mr-3 h-6 w-6" />
        Comments ({initialComments.length})
      </h2>
      
      {isAuthenticated ? (
        <div className="mb-8 bg-card p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-foreground mb-4">Leave a Comment</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} readOnly={!!currentUser?.displayName} />
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
                    <FormLabel>Your Comment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your comment here..." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="mb-8 text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">Please <Button variant="link" asChild className="p-0"><a href="/login">sign in</a></Button> to leave a comment.</p>
        </div>
      )}

      {initialComments.length > 0 ? (
        <div className="space-y-6">
          {initialComments.map((comment, index) => (
            <React.Fragment key={comment.id || index}>
              <article className="flex items-start space-x-4 p-4 bg-card rounded-lg shadow">
                <Avatar className="h-10 w-10 border">
                  {comment.authorImageSrc && <AvatarImage src={comment.authorImageSrc} alt={comment.authorName} />}
                  <AvatarFallback>{comment.authorName?.substring(0,1).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{comment.authorName}</h4>
                    <time dateTime={comment.date} className="text-xs text-muted-foreground">
                      {format(new Date(comment.date), "MMM d, yyyy 'at' h:mm a")}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{comment.text}</p>
                </div>
              </article>
              {index < initialComments.length - 1 && <Separator className="my-2" />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center">No comments yet. Be the first to comment!</p>
      )}
    </section>
  );
}

    
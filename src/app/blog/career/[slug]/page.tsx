
"use client";

import * as React from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import type { BlogPost, BlogPostFormValues } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit3, ThumbsDown, ThumbsUp, Trash2, Loader2, AlertCircle, LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import AdsBannerSection from '@/components/landing/AdsBannerSection';
import CommentsSection from '@/components/blog/CommentsSection';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { useToast } from '@/hooks/use-toast';
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
import { useAuth } from '@/contexts/AuthContext';
import { getBlogPosts, updateBlogPost, deleteBlogPost, updateBlogPostEngagement, addCommentToBlogPost } from '@/lib/firebase/firestoreService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { increment } from 'firebase/firestore';

export default function CareerBlogPostPage() {
  const router = useRouter();
  const paramsInput = useParams(); 
  const { toast } = useToast();
  const { currentUser, isAdmin, loadingAuth } = useAuth();

  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [isLoadingPost, setIsLoadingPost] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formIsLoading, setFormIsLoading] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const slug = React.useMemo(() => {
    const slugParam = typeof paramsInput?.slug === 'string' ? paramsInput.slug : undefined;
    return slugParam;
  }, [paramsInput]);


  const fetchPostData = React.useCallback(async () => {
    if (!slug) {
      setIsLoadingPost(false);
      notFound();
      return;
    }
    setIsLoadingPost(true);
    setFetchError(null);
    try {
      const posts = await getBlogPosts({ category: 'Career', slug });
      if (posts.length > 0) {
        const fetchedPost = posts[0];
        setPost(fetchedPost);
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Error fetching career blog post:", error);
      setFetchError("Could not load the blog post. Please try again.");
    } finally {
      setIsLoadingPost(false);
    }
  }, [slug]);

  React.useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  if (isLoadingPost || loadingAuth) {
    return (
      <div className="text-center py-20 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
        <Alert variant="destructive" className="my-8 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Post</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
    );
  }
  
  if (!post) {
    return notFound();
  }

  const postDate = post.date ? format(new Date(post.date), "MMMM d, yyyy") : 'Date not available';

  const handleEditPost = () => setIsFormOpen(true);

  const handlePostFormSubmit = async (data: BlogPostFormValues) => {
    if (!post) return;
    setFormIsLoading(true);
    try {
      await updateBlogPost(post.id, data);
      toast({
        title: "Post Updated!",
        description: `"${data.title}" has been updated.`,
      });
      setIsFormOpen(false);
      await fetchPostData(); 
      if (post.slug !== data.slug || post.category !== data.category) {
        router.replace(`/blog/${data.category.toLowerCase()}/${data.slug}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({ title: "Error", description: `Failed to update post. ${(error as Error).message}`, variant: "destructive" });
    } finally {
      setFormIsLoading(false);
    }
  };
  
  const handleDeletePost = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeletePost = async () => {
    if (!post) return;
    try {
      await deleteBlogPost(post.id);
      toast({
        title: "Post Deleted",
        description: `"${post.title}" has been removed. You will be redirected.`,
      });
      localStorage.setItem('postJustDeleted', post.id); 
      router.push('/blog/career'); 
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({ title: "Error", description: `Failed to delete post. ${(error as Error).message}`, variant: "destructive" });
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleLike = async () => {
    if (!post || !currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to like a post.", variant: "destructive" });
      return;
    }
    const originalLikes = post.likes || 0;
    setPost(p => p ? { ...p, likes: (p.likes || 0) + 1 } : null);
    try {
      await updateBlogPostEngagement(post.id, { likes: increment(1) });
    } catch (error) {
      console.error("Error updating likes:", error);
      setPost(p => p ? { ...p, likes: originalLikes } : null);
      toast({ title: "Error", description: "Could not update like.", variant: "destructive" });
    }
  };

  const handleDislike = async () => {
    if (!post || !currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to dislike a post.", variant: "destructive" });
      return;
    }
    const originalDislikes = post.dislikes || 0;
    setPost(p => p ? { ...p, dislikes: (p.dislikes || 0) + 1 } : null);
    try {
      await updateBlogPostEngagement(post.id, { dislikes: increment(1) });
    } catch (error) {
      console.error("Error updating dislikes:", error);
       setPost(p => p ? { ...p, dislikes: originalDislikes } : null);
      toast({ title: "Error", description: "Could not update dislike.", variant: "destructive" });
    }
  };

  const handleCommentSubmit = async (commentData: { authorName: string; text: string; }) => {
    if (!post || !currentUser) {
      toast({ title: "Error", description: "You must be logged in to comment.", variant: "destructive" });
      return;
    }
    const newCommentPayload = {
      authorName: commentData.authorName,
      text: commentData.text,
      userId: currentUser.uid,
    };
    try {
      await addCommentToBlogPost(post.id, newCommentPayload);
      toast({ title: "Comment Added!", description: "Your comment has been posted." });
      await fetchPostData(); 
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({ title: "Error", description: `Could not add comment. ${(error as Error).message}`, variant: "destructive" });
    }
  };
  
  const hasValidImage = post.imageSrc && !post.imageSrc.startsWith('https://placehold.co');
  const hasValidAuthorImage = post.authorImageSrc && !post.authorImageSrc.startsWith('https://placehold.co');

  return (
    <>
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-2">
            <Badge className="bg-accent text-accent-foreground">{post.category}</Badge>
            {isAdmin && !loadingAuth && (
              <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleEditPost}>
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeletePost}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
              </div>
            )}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              {hasValidAuthorImage && <AvatarImage src={post.authorImageSrc} alt={post.authorName} />}
              <AvatarFallback>{post.authorName?.substring(0,1).toUpperCase() || 'A'}</AvatarFallback>
            </Avatar>
            <span>By {post.authorName}</span>
          </div>
          <span>&bull;</span>
          <div className="flex items-center space-x-1">
            <CalendarDays className="h-4 w-4" />
            <span>{postDate}</span>
          </div>
        </div>
      </header>

      {hasValidImage && (
        <div className="relative w-full h-64 md:h-96 mb-2 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={post.imageSrc}
            alt={post.title}
            data-ai-hint={post.imageHint}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      {post.imageCreditText && (
        <div className="text-xs text-muted-foreground text-right mt-0 mb-8 px-1">
          Image Credit: {post.imageCreditLink ? (
            <Link href={post.imageCreditLink} target="_blank" rel="noopener noreferrer" className="hover:underline text-accent">
              {post.imageCreditText} <LinkIcon className="inline h-3 w-3" />
            </Link>
          ) : (
            post.imageCreditText
          )}
        </div>
      )}

      <div className="text-foreground leading-relaxed my-8 whitespace-pre-wrap">
        {post.content}
      </div>

      <div className="my-8 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
        <Button variant="outline" onClick={handleLike} className="flex items-center gap-2 group" disabled={!currentUser}>
          <ThumbsUp className="h-5 w-5 text-green-500 group-hover:fill-green-500/20" /> 
          <span className="text-foreground">Like ({post.likes || 0})</span>
        </Button>
        <Button variant="outline" onClick={handleDislike} className="flex items-center gap-2 group" disabled={!currentUser}>
          <ThumbsDown className="h-5 w-5 text-red-500 group-hover:fill-red-500/20" /> 
          <span className="text-foreground">Dislike ({post.dislikes || 0})</span>
        </Button>
      </div>

      <div className="my-12">
        <AdsBannerSection />
      </div>

      <CommentsSection 
        postId={post.id} 
        initialComments={post.comments || []} 
        onCommentSubmit={handleCommentSubmit}
        isAuthenticated={!!currentUser} 
      />
    </article>

    {isAdmin && (
      <BlogPostForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handlePostFormSubmit}
          initialData={{ 
            ...post,
            date: post.date ? new Date(post.date) : new Date(),
            imageSrc: post.imageSrc || '',
            imageFile: null,
            imageCreditText: post.imageCreditText || '',
            imageCreditLink: post.imageCreditLink || '',
            authorImageSrc: post.authorImageSrc || '',
            authorImageFile: null,
           }}
          isLoading={formIsLoading}
          defaultCategory="Career" 
        />
    )}
    
    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              "{post.title}" from Firestore.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePost} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import * as React from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Edit3,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Loader2,
  AlertCircle,
  LinkIcon,
  ChevronLeft,
  Share2,
} from "lucide-react";
import { format } from "date-fns";
import AdsBannerSection from "@/components/landing/AdsBannerSection";
import CommentsSection from "@/components/blog/CommentsSection";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { useToast } from "@/hooks/use-toast";
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
import { useAuth } from "@/contexts/AuthContext";
import {
  getBlogPosts,
  updateBlogPost,
  deleteBlogPost,
  updateBlogPostEngagement,
  addCommentToBlogPost,
} from "@/lib/firebase/firestoreService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { increment } from "firebase/firestore";

export default function BusinessBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { currentUser, isAdmin, loadingAuth } = useAuth();

  const [post, setPost] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);

  const fetchPost = React.useCallback(async () => {
    if (!params.slug) return;
    setIsLoading(true);
    try {
      const posts = await getBlogPosts({
        category: "Business",
        slug: params.slug,
      });
      if (posts.length > 0) {
        setPost(posts[0]);
      } else {
        notFound();
      }
    } catch (error) {
      setFetchError("Failed to synchronize with article database.");
    } finally {
      setIsLoading(false);
    }
  }, [params.slug]);

  React.useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleEngagement = async (type) => {
    if (!currentUser) {
      toast({
        title: "Verification Required",
        description: "Please sign in to engage with this article.",
        variant: "destructive",
      });
      return;
    }
    const update =
      type === "like" ? { likes: increment(1) } : { dislikes: increment(1) };
    // Optimistic UI update
    setPost((p) => ({ ...p, [type + "s"]: (p[type + "s"] || 0) + 1 }));
    try {
      await updateBlogPostEngagement(post.id, update);
    } catch (e) {
      fetchPost(); // Revert on error
    }
  };

  const handleComment = async (data) => {
    try {
      await addCommentToBlogPost(post.id, { ...data, userId: currentUser.uid });
      toast({
        title: "Insight Published",
        description: "Your comment is now part of the discussion.",
      });
      fetchPost();
    } catch (e) {
      toast({
        title: "Sync Error",
        description: "Could not publish comment.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteBlogPost(post.id);
      toast({ title: "Article Removed" });
      router.push("/blog/business");
    } catch (e) {
      toast({
        title: "Error",
        description: "Deletion protocol failed.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      // Check if the browser supports the native share API
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard if native share is unavailable
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description:
            "Share API not supported, link copied to clipboard instead.",
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (isLoading || loadingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#6B46C1]" />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Fetching Intelligence...
        </p>
      </div>
    );
  }

  if (fetchError || !post) return notFound();

  return (
    <main className="bg-white min-h-screen pb-24">
      {/* 1. PROGRESSIVE HEADER */}
      <div className="bg-slate-50 border-b border-slate-100 py-4 mb-12">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <Link
            href="/blog/business"
            className="text-xs font-bold text-slate-500 hover:text-[#6B46C1] flex items-center gap-2 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Business Feed
          </Link>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-8"
                  onClick={() => setIsFormOpen(true)}
                >
                  <Edit3 size={14} className="mr-2" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full h-8"
                  onClick={() => setShowDelete(true)}
                >
                  <Trash2 size={14} className="mr-2" /> Delete
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 text-slate-400 hover:text-[#6B46C1] hover:bg-purple-50 transition-colors"
              onClick={handleShare}
              title="Share Article"
            >
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        <header className="mb-12 space-y-6">
          <Badge className="bg-[#6B46C1] text-white rounded-full px-4 py-1 border-none font-bold uppercase tracking-widest text-[10px]">
            {post.category}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter italic">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white shadow-md rounded-lg">
                <AvatarImage src={post.authorImageSrc} />
                <AvatarFallback className="bg-slate-100 font-bold">
                  {post.authorName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">
                  {post.authorName}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                  Contributor
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tighter">
              <CalendarDays className="h-4 w-4 text-[#FF8C38]" />
              {format(new Date(post.date), "MMMM dd, yyyy")}
            </div>
          </div>
        </header>

        {/* FEATURED IMAGE */}
        <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden shadow-2xl shadow-slate-200/50 group">
          <Image
            src={post.imageSrc}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
        </div>
        {post.imageCreditText && (
          <p className="text-[10px] text-slate-400 text-right font-medium italic mb-12">
            Image by:{" "}
            {post.imageCreditLink ? (
              <a href={post.imageCreditLink} className="underline">
                {post.imageCreditText}
              </a>
            ) : (
              post.imageCreditText
            )}
          </p>
        )}

        {/* CONTENT BLOCK */}
        <div className="prose prose-slate max-w-none mb-16">
          <div className="text-slate-700 text-lg leading-[1.8] whitespace-pre-wrap tracking-tight">
            {post.content}
          </div>
        </div>

        {/* ENGAGEMENT BAR */}
        <div className="grid grid-cols-2 gap-4 p-8 bg-slate-50 border border-slate-100 mb-16">
          <Button
            variant="outline"
            onClick={() => handleEngagement("like")}
            className="bg-white rounded-lg h-14 font-bold border-slate-200 group transition-all hover:border-green-500 hover:text-green-600"
          >
            <ThumbsUp
              className={`mr-2 h-5 w-5 ${
                post.likes > 0
                  ? "fill-green-500 text-green-500"
                  : "text-slate-400 group-hover:text-green-500"
              }`}
            />
            Valuable ({post.likes || 0})
          </Button>
          <Button
            variant="outline"
            onClick={() => handleEngagement("dislike")}
            className="bg-white rounded-lg h-14 font-bold border-slate-200 group transition-all hover:border-red-500 hover:text-red-600"
          >
            <ThumbsDown
              className={`mr-2 h-5 w-5 ${
                post.dislikes > 0
                  ? "fill-red-500 text-red-500"
                  : "text-slate-400 group-hover:text-red-500"
              }`}
            />
            Irrelevant ({post.dislikes || 0})
          </Button>
        </div>

        <AdsBannerSection />

        <CommentsSection
          postId={post.id}
          initialComments={post.comments || []}
          onCommentSubmit={handleComment}
          isAuthenticated={!!currentUser}
        />
      </article>

      {/* ADMIN FORMS */}
      {isAdmin && (
        <BlogPostForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={async (data) => {
            setFormLoading(true);
            await updateBlogPost(post.id, data);
            setIsFormOpen(false);
            fetchPost();
            setFormLoading(false);
          }}
          initialData={{ ...post, date: new Date(post.date) }}
          isLoading={formLoading}
          defaultCategory="Business"
        />
      )}

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-xl uppercase tracking-tighter italic">
              Confirm Permanent Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Article "{post.title}" will be purged from the High-ER repository.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Abort
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 rounded-full"
            >
              Execute Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

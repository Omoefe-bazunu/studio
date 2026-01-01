"use client";

import React, { useState, useEffect, useCallback } from "react";
import BlogCard from "./BlogCard";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  PlusCircle,
  AlertCircle,
  LayoutGrid,
  Briefcase,
} from "lucide-react";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogPosts, addBlogPost } from "@/lib/firebase/firestoreService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ITEMS_PER_PAGE = 6;

export default function CareerBlogFeed() {
  const [allPosts, setAllPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formIsLoading, setFormIsLoading] = useState(false);

  const { toast } = useToast();
  const { isAdmin, loadingAuth } = useAuth();

  // 1. Data Fetching
  const fetchCareerPosts = useCallback(async () => {
    setIsLoadingFeed(true);
    setFetchError(null);
    try {
      const posts = await getBlogPosts({ category: "Career" });
      setAllPosts(posts);
      setVisiblePosts(posts.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to sync career database.";
      setFetchError(msg);
    } finally {
      setIsLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    fetchCareerPosts();
  }, [fetchCareerPosts]);

  // 2. Pagination Logic
  const hasMore = visiblePosts.length < allPosts.length;

  const loadMorePosts = () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);

    // Smooth transition delay
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const newVisiblePosts = allPosts.slice(0, nextPage * ITEMS_PER_PAGE);
      setVisiblePosts(newVisiblePosts);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 600);
  };

  // 3. Admin Submission
  const handleAddPostSubmit = async (formData) => {
    setFormIsLoading(true);
    try {
      await addBlogPost(formData);
      toast({
        title: "Career Post Published",
        description: "New article is now visible to the talent community.",
      });
      setIsFormOpen(false);
      fetchCareerPosts();
    } catch (error) {
      toast({
        title: "Publication Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormIsLoading(false);
    }
  };

  if (loadingAuth || isLoadingFeed) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#6B46C1] mx-auto" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Updating Career Insights...
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <Alert variant="destructive" className="my-12 rounded-none border-2">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="font-bold uppercase tracking-tighter">
          Sync Error
        </AlertTitle>
        <AlertDescription className="text-sm opacity-90">
          {fetchError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="py-12">
      {/* Admin Editor Bar */}
      {isAdmin && (
        <div className="mb-12 p-6 bg-slate-50 border border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-600">
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Career Editor Console
            </span>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full px-6 font-bold shadow-lg shadow-purple-500/20"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Career Insight
          </Button>
        </div>
      )}

      {allPosts.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-200">
          <Briefcase className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">
            The career vault is currently empty.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {visiblePosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <BlogCard post={post} />

                {/* AdSense Strategic Placement */}
                {(index + 1) % 3 === 0 && index !== visiblePosts.length - 1 && (
                  <div className="md:col-span-2 lg:col-span-3 py-6">
                    <div className="w-full h-32 bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                      Native Advertisement
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination Controls */}
          {hasMore && (
            <div className="flex flex-col items-center gap-6 pt-12">
              <div className="h-px w-20 bg-slate-200" />
              <Button
                onClick={loadMorePosts}
                disabled={isLoadingMore}
                className="bg-white border-2 border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-full px-12 h-14 font-bold transition-all shadow-xl shadow-slate-200/50"
              >
                {isLoadingMore ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </span>
                ) : (
                  "Expand Talent Library"
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Admin Publication Form */}
      {isAdmin && (
        <BlogPostForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleAddPostSubmit}
          isLoading={formIsLoading}
          defaultCategory="Career"
        />
      )}
    </section>
  );
}

"use client";

import * as React from 'react';
import type { BlogPost, BlogPostFormValues, BlogPostSubmitData } from '@/types';
import BlogCard from './BlogCard';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, AlertCircle } from 'lucide-react';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getBlogPosts, addBlogPost } from '@/lib/firebase/firestoreService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { uploadBlogImage } from '@/lib/firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const ITEMS_PER_PAGE = 6;

export default function TechBlogFeed() {
  const [allTechPosts, setAllTechPosts] = React.useState<BlogPost[]>([]);
  const [visiblePosts, setVisiblePosts] = React.useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formIsLoading, setFormIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { isAdmin, loadingAuth } = useAuth();

  const fetchTechPosts = React.useCallback(async () => {
    setIsLoadingFeed(true);
    setFetchError(null);
    try {
      const posts = await getBlogPosts({ category: 'Tech' });
      setAllTechPosts(posts);
      setVisiblePosts(posts.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching tech blog posts:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not load tech articles.";
      setFetchError(`Failed to load articles: ${errorMessage}. Check Firestore rules for 'blogPosts'.`);
      toast({ title: "Error Fetching Articles", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoadingFeed(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchTechPosts();
  }, [fetchTechPosts]);

  const hasMore = visiblePosts.length < allTechPosts.length;

  const loadMorePosts = () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const newVisiblePosts = allTechPosts.slice(0, nextPage * ITEMS_PER_PAGE);
      setVisiblePosts(newVisiblePosts);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleAddPostSubmit = async (formData: BlogPostFormValues) => {
    try {
      setFormIsLoading(true);
      
      // Call the updated addBlogPost function
      await addBlogPost(formData);
      
      toast({
        title: "Blog Post Added!",
        description: `"${formData.title}" has been added to Tech.`,
      });
      
      setIsFormOpen(false);
      fetchTechPosts(); // Refresh the list
    } catch (error) {
      console.error("Error adding blog post:", error);
      toast({
        title: "Error",
        description: `Failed to add blog post: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setFormIsLoading(false);
    }
  };

  if (loadingAuth || isLoadingFeed) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground mt-2">Loading Tech Articles...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Articles</AlertTitle>
        <AlertDescription>{fetchError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-8 text-right">
          <Button onClick={() => setIsFormOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Tech Post
          </Button>
        </div>
      )}

      {allTechPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No tech articles available at the moment.</p>
          {isAdmin && <p className="text-sm text-muted-foreground mt-2">Click "Add New Tech Post" to get started.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visiblePosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-12 text-center">
          <Button
            onClick={loadMorePosts}
            disabled={isLoadingMore}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
              </>
            ) : (
              'Load More Articles'
            )}
          </Button>
        </div>
      )}

      {isAdmin && (
        <BlogPostForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleAddPostSubmit}
          isLoading={formIsLoading}
          defaultCategory="Tech"
        />
      )}
    </div>
  );
}
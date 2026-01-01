"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CalendarDays, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBlogPosts } from "@/lib/firebase/firestoreService";
import { useToast } from "@/hooks/use-toast";

export default function BlogArticles() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestFromEach = async () => {
      try {
        setLoading(true);
        const categories = ["Tech", "Business", "Career"];

        // Fetch 1 post for each category in parallel
        const results = await Promise.all(
          categories.map((cat) => getBlogPosts({ category: cat, limit: 1 }))
        );

        // Filter out empty results and flatten to get exactly one post per category
        const latest = results
          .filter((arr) => arr.length > 0)
          .map((arr) => arr[0])
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        setPosts(latest);
      } catch (error) {
        toast({
          title: "Fetch Error",
          description: "Could not sync latest articles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLatestFromEach();
  }, [toast]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center bg-white">
        <Loader2 className="animate-spin text-[#6B46C1] h-10 w-10" />
      </div>
    );
  }

  return (
    <section id="blog" className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 bg-none text-primary font-bold uppercase tracking-widest text-sm">
              Expert Insights
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter">
              Latest Blogs
            </h2>
          </div>
          <Button
            variant="ghost"
            asChild
            className="text-[#FF8C38] hover:text-white font-bold px-4 text-lg group"
          >
            <Link href="/blog">
              View All Articles{" "}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>

        {/* Blog Grid - Fixed to 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {posts.map((post) => {
            const postHref = `/blog/${post.category?.toLowerCase()}/${
              post.slug
            }`;

            return (
              <Card
                key={post.id}
                className="group border-none shadow-2xl shadow-slate-200/40 rounded-lg flex flex-col h-full bg-white transition-all duration-300 hover:translate-y-[-8px]"
              >
                <CardHeader className="p-0 relative">
                  <Link
                    href={postHref}
                    className="relative block h-64 overflow-hidden"
                  >
                    <Image
                      src={post.imageSrc || "/images/blog-placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </Link>
                  <Badge className="absolute top-4 left-4 bg-[#6B46C1] text-white rounded-full border-none font-bold">
                    {post.category}
                  </Badge>
                </CardHeader>

                <CardContent className="p-8 flex-grow">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <CalendarDays className="h-3.5 w-3.5 text-[#FF8C38]" />
                    {format(new Date(post.date), "MMMM dd, yyyy")}
                  </div>

                  <CardTitle className="text-xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-[#6B46C1] transition-colors">
                    <Link href={postHref}>{post.title}</Link>
                  </CardTitle>

                  <CardDescription className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>

                <CardFooter className="px-8 pb-8 pt-0 flex items-center gap-3">
                  <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                    <AvatarImage src={post.authorImageSrc} />
                    <AvatarFallback className="bg-slate-100 text-[#6B46C1] text-[10px] font-bold">
                      {post.authorName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">
                      {post.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium italic">
                      Contributor
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

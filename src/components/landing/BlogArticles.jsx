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
import {
  ArrowRight,
  MessageSquare,
  ThumbsUp,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBlogPosts } from "@/lib/firebase/firestoreService";
import { useToast } from "@/hooks/use-toast";

export default function BlogArticles() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        // Fetching top posts across core categories
        const categories = ["Tech", "Business", "Career"];
        const results = await Promise.all(
          categories.map((cat) => getBlogPosts({ category: cat, limit: 1 }))
        );

        const latest = results
          .flat()
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        setPosts(latest);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load posts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, [toast]);

  // Loading Skeleton State
  if (loading)
    return (
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[450px] rounded-[2rem] bg-white animate-pulse shadow-sm border border-slate-100"
              />
            ))}
          </div>
        </div>
      </section>
    );

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1   text-[#6B46C1] text-xs font-bold uppercase tracking-wider mb-4">
            Latest Insights
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            From Our Blog
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Stay updated with trends in tech, business, and career development.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const postHref = `/blog/${post.category?.toLowerCase()}/${
              post.slug
            }`;
            return (
              <Card
                key={post.id}
                className="group border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden flex flex-col h-full hover:translate-y-[-4px] transition-all duration-300"
              >
                <CardHeader className="p-0">
                  <Link
                    href={postHref}
                    className="relative block h-56 overflow-hidden"
                  >
                    <Image
                      src={post.imageSrc || "/images/blog-placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#6B46C1] hover:bg-white border-none shadow-sm font-bold">
                      {post.category}
                    </Badge>
                  </Link>
                </CardHeader>

                <CardContent className="p-8 flex-grow">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
                  </div>

                  <CardTitle className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#6B46C1] transition-colors line-clamp-2">
                    <Link href={postHref}>{post.title}</Link>
                  </CardTitle>

                  <CardDescription className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>

                <CardFooter className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 ring-2 ring-white">
                      <AvatarImage src={post.authorImageSrc} />
                      <AvatarFallback className="bg-[#6B46C1] text-white text-[10px]">
                        {post.authorName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-slate-700">
                      {post.authorName}
                    </span>
                  </div>

                  <Button
                    variant="link"
                    asChild
                    className="text-[#FF8C38] p-0 h-auto hover:text-[#e67e32] font-bold"
                  >
                    <Link href={postHref} className="flex items-center">
                      Read <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Button
            size="lg"
            asChild
            className="bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full px-10 h-14 font-bold shadow-lg shadow-purple-500/20"
          >
            <Link href="/blog">
              Visit Entire Blog <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

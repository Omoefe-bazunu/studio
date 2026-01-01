"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  MessageSquare,
  ThumbsUp,
  CalendarDays,
  ImageIcon,
} from "lucide-react";
import { format } from "date-fns";

export default function BlogCard({ post }) {
  // Safe date formatting
  const postDate = post.date
    ? format(new Date(post.date), "MMMM dd, yyyy")
    : "Recent";
  const categoryHref = `/blog/${post.category?.toLowerCase() || "general"}`;
  const postHref = `${categoryHref}/${post.slug}`;

  // Check for valid image content
  const hasValidImage =
    post.imageSrc &&
    post.imageSrc.trim() !== "" &&
    !post.imageSrc.startsWith("https://placehold.co");

  return (
    <Card className="group border-none shadow-2xl shadow-slate-200/40 rounded-lg overflow-hidden flex flex-col h-full bg-white transition-all duration-300 hover:translate-y-[-8px]">
      {/* 1. Header with Hover Image Effect */}
      <CardHeader className="p-0 relative">
        <Link href={postHref} className="relative block h-60 overflow-hidden">
          {hasValidImage ? (
            <Image
              src={post.imageSrc}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-50">
              <ImageIcon className="h-12 w-12 text-slate-200" />
            </div>
          )}
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
        </Link>
        <Badge className="absolute top-4 left-4 bg-[#6B46C1] text-white rounded-full border-none font-bold uppercase tracking-widest text-[10px] px-3 py-1">
          {post.category}
        </Badge>
      </CardHeader>

      {/* 2. Main Content Body */}
      <CardContent className="p-8 flex-grow">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          <CalendarDays className="h-3.5 w-3.5 text-[#FF8C38]" />
          {postDate}
        </div>

        <CardTitle className="text-xl font-bold text-slate-900 mb-4 leading-snug tracking-tighter group-hover:text-[#6B46C1] transition-colors">
          <Link href={postHref}>{post.title}</Link>
        </CardTitle>

        <CardDescription className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-6">
          {post.excerpt}
        </CardDescription>

        {/* Engagement Metadata */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{post.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{post.commentsCount || 0}</span>
          </div>
        </div>
      </CardContent>

      {/* 3. Footer with Author & CTA */}
      <CardFooter className="px-8 pb-8 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
            {post.authorImageSrc &&
            !post.authorImageSrc.startsWith("https://placehold.co") ? (
              <AvatarImage src={post.authorImageSrc} alt={post.authorName} />
            ) : null}
            <AvatarFallback className="bg-slate-100 text-[#6B46C1] text-[10px] font-bold">
              {post.authorName?.charAt(0).toUpperCase() || "H"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 leading-none mb-0.5">
              {post.authorName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium italic">
              Contributor
            </span>
          </div>
        </div>

        <Button
          variant="link"
          asChild
          className="text-[#FF8C38] p-0 h-auto hover:text-[#e67e32] font-bold text-sm group/btn"
        >
          <Link href={postHref} className="flex items-center">
            Read{" "}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { BlogPost } from '@/types';
import { ArrowRight, MessageSquare, ThumbsUp, CalendarDays, ImageIcon } from 'lucide-react'; // Removed EyeIcon
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const postDate = format(new Date(post.date), "MMM d, yyyy");
  const categoryHref = `/blog/${post.category.toLowerCase()}`;
  const postHref = `${categoryHref}/${post.slug}`;

  const hasValidImage = post.imageSrc && post.imageSrc.trim() !== '' && !post.imageSrc.startsWith('https://placehold.co');

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group h-full">
      <CardHeader className="p-0">
        <Link href={postHref} aria-label={`Read more about ${post.title}`}>
          <div className="relative h-52 w-full bg-muted">
            {hasValidImage ? (
              <Image
                src={post.imageSrc}
                alt={post.title}
                data-ai-hint={post.imageHint}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">{post.category}</Badge>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold text-primary mb-2 line-clamp-2 group-hover:text-accent">
          <Link href={postHref}>{post.title}</Link>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</CardDescription>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Avatar className="h-6 w-6">
            {post.authorImageSrc && !post.authorImageSrc.startsWith('https://placehold.co') ? (
              <AvatarImage src={post.authorImageSrc} alt={post.authorName} />
            ) : null}
            <AvatarFallback>{post.authorName?.substring(0,1)?.toUpperCase() || 'A'}</AvatarFallback>
          </Avatar>
          <span>{post.authorName}</span>
          <span>&bull;</span>
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{postDate}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-muted/50 flex justify-between items-center">
        <div className="flex items-center gap-x-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentsCount || 0}</span>
          </div>
          {/* Removed Views Display */}
        </div>
        <Button variant="link" asChild className="text-accent p-0 hover:text-accent/80 font-semibold">
          <Link href={postHref}>
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  starSize?: number;
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  starSize = 20,
  className,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={interactive && onRatingChange ? () => onRatingChange(starValue) : undefined}
            className={cn(
              "p-0 bg-transparent border-none",
              interactive ? "cursor-pointer" : "cursor-default"
            )}
            aria-label={interactive ? `Set rating to ${starValue}` : undefined}
          >
            <Star
              size={starSize}
              className={cn(
                starValue <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600',
                interactive && 'hover:text-yellow-300 hover:fill-yellow-300 transition-colors'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      {/* Branding or Icon */}
      <div className="mb-8 p-4 rounded-full bg-primary/10">
        <Search className="h-12 w-12 text-primary animate-pulse" />
      </div>

      <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Lost in the Journey?</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved. Don't
        worry, even the best intelligence systems hit a dead end sometimes.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button variant="default" className="flex items-center gap-2">
            <Home size={18} />
            Back to Home
          </Button>
        </Link>

        <Link href="/blog/business">
          <Button variant="outline" className="flex items-center gap-2">
            Explore Business Insights
            <MoveLeft className="rotate-180" size={18} />
          </Button>
        </Link>
      </div>

      {/* Optional: Add a subtle graphic or HIGH-ER Hub signature */}
      <p className="mt-16 text-xs text-muted-foreground/50 uppercase tracking-widest">
        HIGH-ER Enterprises
      </p>
    </div>
  );
}

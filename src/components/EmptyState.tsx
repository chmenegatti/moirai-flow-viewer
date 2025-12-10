import { Search, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type: "no-results" | "no-data";
  searchTerm?: string;
  className?: string;
}

export function EmptyState({ type, searchTerm, className }: EmptyStateProps) {
  if (type === "no-results") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-20", className)}>
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-foreground font-medium mb-2">No exchanges found</p>
        <p className="text-muted-foreground text-sm font-mono">
          No results for "{searchTerm}"
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-20", className)}>
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-foreground font-medium mb-2">No exchanges available</p>
      <p className="text-muted-foreground text-sm">
        Check your API connection
      </p>
    </div>
  );
}

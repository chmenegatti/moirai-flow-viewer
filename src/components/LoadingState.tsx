import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
}

export function LoadingState({ className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20", className)}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
      </div>
      <p className="mt-6 text-muted-foreground font-mono text-sm animate-pulse">
        Fetching exchanges...
      </p>
    </div>
  );
}

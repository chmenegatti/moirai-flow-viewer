import { cn } from "@/lib/utils";
import { ArrowRight, GitBranch } from "lucide-react";

interface ExchangeCardProps {
  name: string;
  index: number;
  onClick: () => void;
}

const colorVariants = [
  "border-monokai-green/30 hover:border-monokai-green hover:glow-green",
  "border-monokai-pink/30 hover:border-monokai-pink hover:glow-pink",
  "border-monokai-blue/30 hover:border-monokai-blue hover:glow-accent",
  "border-monokai-orange/30 hover:border-monokai-orange",
  "border-monokai-purple/30 hover:border-monokai-purple",
];

const iconColors = [
  "text-monokai-green",
  "text-monokai-pink",
  "text-monokai-blue",
  "text-monokai-orange",
  "text-monokai-purple",
];

export function ExchangeCard({ name, index, onClick }: ExchangeCardProps) {
  const colorIndex = index % colorVariants.length;
  const parts = name.split(".");
  const prefix = parts.slice(0, 2).join(".");
  const action = parts.slice(2).join(".");

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left p-4 rounded-lg border-2 bg-card/50 backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        "hover:bg-card hover:scale-[1.02] hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "animate-fade-in",
        colorVariants[colorIndex]
      )}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5", iconColors[colorIndex])}>
          <GitBranch className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-muted-foreground font-mono text-xs block mb-1">
            {prefix}
          </span>
          <span className="font-mono text-sm text-foreground font-medium block truncate">
            {action}
          </span>
        </div>
        <ArrowRight
          className={cn(
            "w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-x-0",
            iconColors[colorIndex]
          )}
        />
      </div>
    </button>
  );
}

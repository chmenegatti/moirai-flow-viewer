import { Network } from "lucide-react";

interface HeaderProps {
  prefix?: string;
  count?: number;
}

export function Header({ prefix, count }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-40">
      <div className="container py-6 px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/30">
            <Network className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              <span className="text-gradient-green">Moirai</span>{" "}
              <span className="text-muted-foreground font-normal">Exchange Explorer</span>
            </h1>
            {prefix && (
              <p className="text-muted-foreground font-mono text-sm mt-1">
                prefix: <span className="text-monokai-blue">{prefix}</span>
                {count !== undefined && (
                  <>
                    {" • "}
                    <span className="text-monokai-orange">{count}</span> exchanges
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

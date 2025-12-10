import { useEffect, useRef, useState, useCallback } from "react";
import { X, Download, ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import mermaid from "mermaid";

interface FlowchartViewerProps {
  content: string;
  exchangeName: string;
  onClose: () => void;
  isLoading?: boolean;
}

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 20,
    nodeSpacing: 100,
    rankSpacing: 100,
    diagramPadding: 20,
  },
  themeVariables: {
    primaryColor: "#A6E22E",
    primaryTextColor: "#F8F8F2",
    primaryBorderColor: "#A6E22E",
    lineColor: "#66D9EF",
    secondaryColor: "#272822",
    tertiaryColor: "#3E3D32",
    background: "#272822",
    mainBkg: "#272822",
    nodeBkg: "#3E3D32",
    nodeTextColor: "#F8F8F2",
    clusterBkg: "#272822",
    clusterBorder: "#75715E",
    defaultLinkColor: "#66D9EF",
    titleColor: "#F8F8F2",
    edgeLabelBackground: "#272822",
    actorBkg: "#3E3D32",
    actorBorder: "#A6E22E",
    actorTextColor: "#F8F8F2",
    signalColor: "#66D9EF",
    signalTextColor: "#F8F8F2",
    fontSize: "16px",
  },
});

export function FlowchartViewer({
  content,
  exchangeName,
  onClose,
  isLoading,
}: FlowchartViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1.5);
  const [svgContent, setSvgContent] = useState<string>("");
  const [renderError, setRenderError] = useState<string | null>(null);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsPanning(true);
    setStartPanPosition({
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y,
    });
  }, [panPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanPosition({
      x: e.clientX - startPanPosition.x,
      y: e.clientY - startPanPosition.y,
    });
  }, [isPanning, startPanPosition]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1.5);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    async function renderDiagram() {
      if (!content) {
        setRenderError("No content to display");
        return;
      }

      // Ensure content is a string
      const contentStr = typeof content === 'string' ? content : String(content);

      // Check if content is SVG
      if (contentStr.trim().startsWith("<svg") || contentStr.trim().startsWith("<?xml")) {
        setSvgContent(contentStr);
        setRenderError(null);
        return;
      }

      // Try to render as Mermaid
      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, contentStr);
        setSvgContent(svg);
        setRenderError(null);
      } catch (error) {
        console.error("Mermaid render error:", error);
        setRenderError("Failed to render flowchart");
      }
    }

    renderDiagram();
  }, [content]);

  const handleDownload = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exchangeName}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.5, 6));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.5, 0.5));

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md animate-fade-in">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-16 border-b border-border bg-card/80 backdrop-blur-sm z-10">
        <div className="container h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-monokai-green animate-pulse-glow" />
            <h2 className="font-mono text-sm md:text-base text-foreground truncate max-w-[200px] md:max-w-none">
              {exchangeName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-mono px-2 text-muted-foreground">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleResetView}
                title="Reset view"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1">
              <Move className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Drag to pan</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              onClick={handleDownload}
              disabled={!svgContent}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div
        className="absolute inset-0 top-16 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: isPanning ? 'grabbing' : 'grab',
        }}
      >
        <div
          ref={contentRef}
          className="min-h-full flex items-center justify-center p-8 w-full h-full"
          style={{
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
            willChange: 'transform',
          }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground font-mono text-sm">
                Loading flowchart...
              </p>
            </div>
          ) : renderError ? (
            <div className="text-center">
              <p className="text-destructive font-mono">{renderError}</p>
              <pre className="mt-4 p-4 bg-muted rounded-lg text-xs text-left overflow-auto max-w-2xl">
                {content}
              </pre>
            </div>
          ) : svgContent ? (
            <div
              className={cn(
                "bg-card/50 rounded-xl p-8 border border-border",
                "[&_svg]:min-w-[800px] [&_svg]:max-w-full [&_svg]:h-auto"
              )}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

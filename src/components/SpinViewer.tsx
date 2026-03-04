import { useRef, useState, useCallback, useEffect } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpinViewerProps {
  photos: { id: string; dataUrl: string; label: string }[];
  onClose: () => void;
}

const SpinViewer = ({ photos, onClose }: SpinViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  const frameCount = photos.length;

  // Auto-rotate
  useEffect(() => {
    if (!autoPlay || isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % frameCount);
    }, 150);
    return () => clearInterval(interval);
  }, [autoPlay, isDragging, frameCount]);

  const handlePointerDown = useCallback((clientX: number) => {
    setIsDragging(true);
    setAutoPlay(false);
    setStartX(clientX);
  }, []);

  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      const diff = clientX - startX;
      const sensitivity = 8;
      if (Math.abs(diff) > sensitivity) {
        const direction = diff > 0 ? 1 : -1;
        setCurrentIndex((prev) => (prev + direction + frameCount) % frameCount);
        setStartX(clientX);
      }
    },
    [isDragging, startX, frameCount]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handlePointerDown(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handlePointerMove(e.clientX);
  const onMouseUp = () => handlePointerUp();

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handlePointerDown(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handlePointerMove(e.touches[0].clientX);
  const onTouchEnd = () => handlePointerUp();

  return (
    <div
      className={`${
        fullscreen
          ? "fixed inset-0 z-50 bg-background"
          : "relative rounded-xl overflow-hidden border border-border bg-card"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-sm">360° View</h3>
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} / {frameCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoPlay(!autoPlay)}
            className="text-xs"
          >
            {autoPlay ? "Pause" : "Play"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Viewer */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing select-none bg-muted/30"
        style={{ minHeight: fullscreen ? undefined : 400 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={photos[currentIndex]?.dataUrl}
          alt={photos[currentIndex]?.label}
          className="max-w-full max-h-full object-contain pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          Drag left/right to rotate • Click Play for auto-spin
        </p>
      </div>
    </div>
  );
};

export default SpinViewer;

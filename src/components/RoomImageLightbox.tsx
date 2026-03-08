import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

interface RoomImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomImageLightbox({ images, initialIndex = 0, open, onOpenChange }: RoomImageLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (open) setCurrent(initialIndex);
  }, [open, initialIndex]);

  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : images.length - 1)), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c < images.length - 1 ? c + 1 : 0)), [images.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, prev, next]);

  if (!images.length) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl p-0 bg-black/95 border-none gap-0 [&>button]:hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative flex items-center justify-center min-h-[60vh] max-h-[85vh]">
          <img
            src={images[current]}
            alt={`Room image ${current + 1}`}
            className="max-w-full max-h-[80vh] object-contain select-none"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/25 hover:text-white"
                onClick={prev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/25 hover:text-white"
                onClick={next}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 px-4 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-75"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

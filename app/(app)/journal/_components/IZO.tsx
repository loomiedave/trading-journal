"use client";

import { useRef, useState } from "react";

// Pinch-zoom via CSS transform only — never touches the viewport meta tag,
// so PWA standalone mode stays intact.
function usePinchZoom() {
  const [scale, setScale] = useState(1);
  const lastDist = useRef<number | null>(null);

  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (lastDist.current != null) {
        setScale((s) => Math.min(4, Math.max(1, s * (dist / lastDist.current!))));
      }
      lastDist.current = dist;
    }
  }

  function onTouchEnd() {
    lastDist.current = null;
  }

  function reset() {
    setScale(1);
    lastDist.current = null;
  }

  return { scale, onTouchMove, onTouchEnd, reset };
}

export default function ImageZoomOverlay({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  const { scale, onTouchMove, onTouchEnd, reset } = usePinchZoom();

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <div
      onClick={handleClose}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 bg-foreground/90 flex items-center justify-center z-[200] p-4 cursor-zoom-out overflow-hidden"
    >
      <img
        src={src}
        alt="Trade screenshot expanded"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `scale(${scale})`,
          transition: scale === 1 ? "transform 0.15s" : "none",
        }}
        className="max-w-full max-h-full rounded-md object-contain"
      />
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-background text-2xl bg-foreground/50 rounded-full w-10 h-10 flex items-center justify-center"
      >
        ✕
      </button>
    </div>
  );
}

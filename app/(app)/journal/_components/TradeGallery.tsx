"use client";
import { useState, useEffect } from "react";
import { Trade } from "@/types/type";
import { getSignedScreenshotUrl } from "../_actions/trades";

function GalleryCard({ trade }: { trade: Trade }) {
  const [url, setUrl] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // New state to manage note expansion
  const [showFullNotes, setShowFullNotes] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (trade.screenshot_url) {
      getSignedScreenshotUrl(trade.screenshot_url).then((u) => {
        if (!cancelled) setUrl(u);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [trade.screenshot_url]);

  if (!url) return null;

  // Set a threshold for when the text is considered "long"
  const isLongNote = (trade.notes?.length ?? 0) > 100;

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden mb-3">
      <img
        src={url}
        alt={`${trade.pair} setup`}
        onClick={() => setExpanded(true)}
        className="w-full max-h-[260px] object-cover cursor-pointer"
      />
      <div className="px-3 py-[10px]">
        <div className="flex justify-between items-center">
          <span className="text-[13px] font-semibold text-card-foreground">
            {trade.pair}
          </span>
          <span className="text-[12px] text-muted-foreground">{trade.date}</span>
        </div>
        {trade.strategy && (
          <div className="text-[12px] text-primary mt-[2px]">{trade.strategy}</div>
        )}

        {/* Trade Notes Section */}
        {trade.notes && (
          <div className="mt-[6px]">
            <p
              className={`text-[13px] text-muted-foreground leading-snug ${
                !showFullNotes ? "line-clamp-2" : ""
              }`}
            >
              {trade.notes}
            </p>
            {isLongNote && (
              <button
                type="button"
                onClick={() => setShowFullNotes((prev) => !prev)}
                className="text-[11px] font-medium text-primary hover:underline mt-1 focus:outline-none"
              >
                {showFullNotes ? "Show less" : "Read all"}
              </button>
            )}
          </div>
        )}
      </div>

      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 cursor-zoom-out"
        >
          <img
            src={url}
            alt="Expanded setup"
            className="max-w-full max-h-full rounded-md object-contain"
          />
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default function TradeGallery({ trades }: { trades: Trade[] }) {
  const withScreenshots = [...trades]
    .filter((t) => t.screenshot_url)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (withScreenshots.length === 0) {
    return (
      <div className="text-muted-foreground text-[13px] py-3 text-center">
        No setups with screenshots yet.
      </div>
    );
  }

  return (
    <div>
      {withScreenshots.map((t) => (
        <GalleryCard key={t.id} trade={t} />
      ))}
    </div>
  );
}

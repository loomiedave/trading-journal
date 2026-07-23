"use client";

import { useState, useEffect } from "react";
import { Trade } from "@/types/type";
import { OUTCOME_LABEL } from "../_config/config";
import { getSignedScreenshotUrl } from "../_actions/trades";
import {
  fmt,
  resultColorClass,
  outcomeColorClass,
  stripColorClass,
  formatShortDate,
  rSideLabel,
} from "../_utils/tradeDisplay";
import DeleteConfirmDialog from "./DCD";
import ImageZoomOverlay from "./IZO";

export default function TradeCard({
  trade,
  onDelete,
  onEdit,
}: {
  trade: Trade;
  onDelete: (id: string) => void;
  onEdit: (trade: Trade) => void;
}) {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [rowExpanded, setRowExpanded] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (trade.screenshot_url) {
      getSignedScreenshotUrl(trade.screenshot_url).then((url) => {
        if (!cancelled) setScreenshotUrl(url);
      });
    } else {
      setScreenshotUrl(null);
    }

    return () => {
      cancelled = true;
    };
  }, [trade.screenshot_url]);

  const rLabel = rSideLabel(trade);

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden mb-2">
      {/* Collapsed row — tap to expand */}
      <button
        type="button"
        onClick={() => setRowExpanded((v) => !v)}
        className="w-full flex items-stretch text-left bg-transparent border-none cursor-pointer p-0"
      >
        <span className={`w-1 shrink-0 ${stripColorClass(trade.outcome)}`} />
        <span className="flex-1 min-w-0 flex justify-between items-center px-3 py-[10px] gap-2">
          <span className="min-w-0">
            <span className="flex items-baseline gap-[6px]">
              <span className="text-xs font-semibold text-card-foreground">
                {trade.pair}
              </span>
              <span className="text-[14px] text-muted-foreground">
                {trade.direction}
              </span>
              <span className={`text-[13px] font-semibold ${outcomeColorClass(trade.outcome)}`}>
                {OUTCOME_LABEL[trade.outcome]}
              </span>
            </span>
            <span className="block text-[14px] text-muted-foreground truncate mt-[2px]">
              {trade.strategy ? `${trade.strategy} · ${formatShortDate(trade.date)}` : formatShortDate(trade.date)}
            </span>
          </span>
          <span className="shrink-0 flex items-center gap-2">
            <span className="text-right">
              {trade.result != null && (
                <span className={`block text-[15px] font-semibold ${resultColorClass(trade.result)}`}>
                  {fmt(trade.result)}
                </span>
              )}
              {rLabel && (
                <span className={`block text-[13px] ${outcomeColorClass(trade.outcome)}`}>
                  {rLabel}
                </span>
              )}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-muted-foreground transition-transform ${rowExpanded ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>

      {/* Expanded details */}
      {rowExpanded && (
        <div className="px-3 pb-3">
          {screenshotUrl && (
            <img
              src={screenshotUrl}
              alt="Trade screenshot"
              onClick={() => setImageExpanded(true)}
              className="w-full rounded-md border border-border mt-1 max-h-[200px] object-cover cursor-pointer"
            />
          )}

          {(trade.risk != null ||
            trade.rr_planned != null ||
            trade.rr_achieved != null) && (
            <div className="flex gap-4 mt-3 text-[14px] text-muted-foreground">
              {trade.risk != null && (
                <span>
                  RISK <span className="text-foreground">${trade.risk}</span>
                </span>
              )}
              {trade.rr_planned != null && (
                <span>
                  PLAN <span className="text-foreground">{trade.rr_planned}R</span>
                </span>
              )}
              {trade.rr_achieved != null && (
                <span>
                  GOT{" "}
                  <span
                    className={
                      trade.rr_achieved >= (trade.rr_planned || 0)
                        ? "text-success"
                        : "text-warning"
                    }
                  >
                    {trade.rr_achieved}R
                  </span>
                </span>
              )}
            </div>
          )}

          {trade.notes && (
            <div className="text-[15px] text-muted-foreground mt-3">{trade.notes}</div>
          )}

          <div className="flex justify-between items-center mt-3">
            <span className="text-[14px] text-muted-foreground/70">
              {formatShortDate(trade.date)}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(trade)}
                className="text-[14px] text-muted-foreground/70 bg-transparent border-none cursor-pointer p-0 hover:text-primary"
              >
                ✎ edit
              </button>
              {trade.id && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-[14px] text-muted-foreground/70 bg-transparent border-none cursor-pointer p-0 hover:text-destructive"
                >
                  ✕ delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {imageExpanded && screenshotUrl && (
        <ImageZoomOverlay src={screenshotUrl} onClose={() => setImageExpanded(false)} />
      )}

      {confirmDelete && (
        <DeleteConfirmDialog
          label={`${trade.pair} · ${formatShortDate(trade.date)}`}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            onDelete(trade.id!);
            setConfirmDelete(false);
          }}
        />
      )}
    </div>
  );
}

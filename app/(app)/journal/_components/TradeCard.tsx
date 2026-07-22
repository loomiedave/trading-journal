"use client";

import { useState, useEffect } from "react";
import { Trade } from "@/types/type";
import { OUTCOME_LABEL } from "../_config/config";
import { getToday, getSignedScreenshotUrl } from "../_actions/trades";

const fmt = (v: number) =>
  v >= 0 ? `+$${v.toFixed(2)}` : `-$${Math.abs(v).toFixed(2)}`;
const resultColorClass = (v: number) =>
  v > 0 ? "text-success" : v < 0 ? "text-destructive" : "text-warning";
const outcomeColorClass = (outcome: string) =>
  outcome === "win"
    ? "text-success"
    : outcome === "loss"
      ? "text-destructive"
      : "text-warning";

export default function TradeCard({
  trade,
  onDelete,
  onEdit,
}: {
  trade: Trade;
  onDelete: (id: string) => void;
  onEdit: (trade: Trade) => void;
}) {
  const today = getToday();
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
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

  return (
    <div className="bg-card border border-border rounded-md px-[14px] py-3 mb-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-card-foreground">
          {trade.pair}
        </span>
        <span className="text-[14px] text-muted-foreground">
          {trade.direction}
        </span>
      </div>

      {screenshotUrl && (
        <>
          <img
            src={screenshotUrl}
            alt="Trade screenshot"
            onClick={() => setExpanded(true)}
            className="w-full rounded-md border border-border mt-2 max-h-[160px] object-cover cursor-pointer"
          />
          {expanded && (
            <div
              onClick={() => setExpanded(false)}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 cursor-zoom-out"
            >
              <img
                src={screenshotUrl}
                alt="Trade screenshot expanded"
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
        </>
      )}

      <div className="flex justify-between items-center mt-1">
        <span className={`text-[15px] font-semibold ${outcomeColorClass(trade.outcome)}`}>
          {OUTCOME_LABEL[trade.outcome]}
        </span>
        {trade.result != null && (
          <span className={`text-xs font-semibold ${resultColorClass(trade.result)}`}>
            {fmt(trade.result)}
          </span>
        )}
      </div>
      {trade.strategy && (
        <div className="text-[14px] text-primary mt-1">
          {trade.strategy}
        </div>
      )}
      {(trade.risk != null ||
        trade.rr_planned != null ||
        trade.rr_achieved != null) && (
        <div className="flex gap-4 mt-2 text-[14px] text-muted-foreground">
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
        <div className="text-[15px] text-muted-foreground mt-2">{trade.notes}</div>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className="text-[14px] text-muted-foreground/70">
          {trade.date}
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

      {confirmDelete && (
        <div
          onClick={() => setConfirmDelete(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] px-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-lg px-5 py-5 max-w-[300px] w-full"
          >
            <div className="text-xs text-card-foreground font-semibold mb-1">
              Delete this trade?
            </div>
            <div className="text-[15px] text-muted-foreground mb-4">
              {trade.pair} · {trade.date} — this can't be undone.
            </div>
            <div className="flex gap-[10px]">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-[9px] rounded-md border border-border bg-transparent text-muted-foreground text-[15px] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  onDelete(trade.id!);
                  setConfirmDelete(false);
                }}
                className="flex-1 py-[9px] rounded-md border-none bg-destructive text-destructive-foreground text-[15px] font-semibold cursor-pointer"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

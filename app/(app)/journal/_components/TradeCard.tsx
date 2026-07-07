"use client";

import { useState, useEffect } from "react";
import { Trade } from "@/types/type";
import { OUTCOME_LABEL } from "../_config/config";
import { getToday, getSignedScreenshotUrl } from "../_actions/trades";

const fmt = (v: number) =>
  v >= 0 ? `+$${v.toFixed(2)}` : `-$${Math.abs(v).toFixed(2)}`;
const resultColor = (v: number) =>
  v > 0 ? "#3ecf72" : v < 0 ? "#e05252" : "#e0a752";

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
    <div className="bg-[#151820] border border-[#222630] rounded-md px-[14px] py-3 mb-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs font-semibold text-[#e8ecf4]">
          {trade.pair}
        </span>
        <span className="font-mono text-[10px] text-[#6b7280]">
          {trade.direction}
        </span>
      </div>

      {screenshotUrl && (
        <>
          <img
            src={screenshotUrl}
            alt="Trade screenshot"
            onClick={() => setExpanded(true)}
            className="w-full rounded-md border border-[#222630] mt-2 max-h-[160px] object-cover cursor-pointer"
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
        <span
          className="font-mono text-[11px] font-semibold"
          style={{
            color:
              trade.outcome === "win"
                ? "#3ecf72"
                : trade.outcome === "loss"
                  ? "#e05252"
                  : "#e0a752",
          }}
        >
          {OUTCOME_LABEL[trade.outcome]}
        </span>
        {trade.result != null && (
          <span
            className="font-mono text-xs font-semibold"
            style={{ color: resultColor(trade.result) }}
          >
            {fmt(trade.result)}
          </span>
        )}
      </div>
      {trade.strategy && (
        <div className="font-mono text-[10px] text-[#4f7cff] mt-1">
          {trade.strategy}
        </div>
      )}
      {(trade.risk != null ||
        trade.rr_planned != null ||
        trade.rr_achieved != null) && (
        <div className="flex gap-4 mt-2 font-mono text-[10px] text-[#6b7280]">
          {trade.risk != null && (
            <span>
              RISK <span className="text-[#c9cdd6]">${trade.risk}</span>
            </span>
          )}
          {trade.rr_planned != null && (
            <span>
              PLAN <span className="text-[#c9cdd6]">{trade.rr_planned}R</span>
            </span>
          )}
          {trade.rr_achieved != null && (
            <span>
              GOT{" "}
              <span
                style={{
                  color:
                    trade.rr_achieved >= (trade.rr_planned || 0)
                      ? "#3ecf72"
                      : "#e0a752",
                }}
              >
                {trade.rr_achieved}R
              </span>
            </span>
          )}
        </div>
      )}
      {trade.notes && (
        <div className="text-[11px] text-[#6b7280] mt-2">{trade.notes}</div>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className="font-mono text-[10px] text-[#3a4050]">
          {trade.date}
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(trade)}
            className="font-mono text-[12px] text-[#3a4050] bg-transparent border-none cursor-pointer p-0 hover:text-[#4f7cff]"
          >
            ✎ edit
          </button>
          {trade.id && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="font-mono text-[12px] text-[#3a4050] bg-transparent border-none cursor-pointer p-0 hover:text-[#e05252]"
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
            className="bg-[#151820] border border-[#222630] rounded-lg px-5 py-5 max-w-[300px] w-full"
          >
            <div className="font-mono text-xs text-[#e8ecf4] font-semibold mb-1">
              Delete this trade?
            </div>
            <div className="font-mono text-[11px] text-[#6b7280] mb-4">
              {trade.pair} · {trade.date} — this can't be undone.
            </div>
            <div className="flex gap-[10px]">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-[9px] rounded-md border border-[#222630] bg-transparent text-[#6b7280] font-mono text-[11px] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  onDelete(trade.id!);
                  setConfirmDelete(false);
                }}
                className="flex-1 py-[9px] rounded-md border-none bg-[#e05252] text-white font-mono text-[11px] font-semibold cursor-pointer"
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

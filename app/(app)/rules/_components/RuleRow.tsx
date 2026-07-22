"use client";
import { useState } from "react";
import { RuleItem } from "../_data/default-rules";

export default function RuleRow({
  rule,
  cardClass,
  textClass,
  onEdit,
  onDelete,
}: {
  rule: RuleItem;
  cardClass: string;
  textClass: string;
  onEdit: (rule: RuleItem) => void;
  onDelete: (rule: RuleItem) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div
      className={`px-[14px] py-[11px] border rounded-md mb-[6px] ${cardClass}`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <div className={`text-[15px] ${textClass}`}>{rule.text}</div>
          {rule.note && (
            <div className="text-[15px] text-muted-foreground mt-[2px]">
              {rule.note}
            </div>
          )}
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => onEdit(rule)}
            className="text-[20px] text-muted-foreground bg-transparent border-none cursor-pointer p-0 hover:text-primary"
          >
            ✎
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-[20px] text-muted-foreground bg-transparent border-none cursor-pointer p-0 hover:text-destructive"
          >
            ✕
          </button>
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
              Delete this rule?
            </div>
            <div className="text-[15px] text-muted-foreground mb-4">
              {rule.text} — this can't be undone.
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
                  onDelete(rule);
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

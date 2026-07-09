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
          <div className={`text-[13px] ${textClass}`}>{rule.text}</div>
          {rule.note && (
            <div className="text-[11px] text-[#6b7280] mt-[2px]">
              {rule.note}
            </div>
          )}
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => onEdit(rule)}
            className="text-[20px] text-[#3a4050] bg-transparent border-none cursor-pointer p-0 hover:text-[#4f7cff]"
          >
            ✎
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-[20px] text-[#3a4050] bg-transparent border-none cursor-pointer p-0 hover:text-[#e05252]"
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
            className="bg-[#151820] border border-[#222630] rounded-lg px-5 py-5 max-w-[300px] w-full"
          >
            <div className="font-mono text-xs text-[#e8ecf4] font-semibold mb-1">
              Delete this rule?
            </div>
            <div className="font-mono text-[11px] text-[#6b7280] mb-4">
              {rule.text} — this can't be undone.
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
                  onDelete(rule);
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

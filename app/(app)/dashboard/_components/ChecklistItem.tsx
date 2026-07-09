"use client";
import { useState } from "react";
import { ChecklistDefaultItem } from "../_data/default-checklist";

export default function ChecklistItem({
  item,
  checked,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: ChecklistDefaultItem;
  checked: boolean;
  onToggle: (id: string) => void;
  onEdit: (item: ChecklistDefaultItem) => void;
  onDelete: (item: ChecklistDefaultItem) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="flex gap-3 px-[14px] py-[11px] rounded-md mb-[2px] border"
      style={{
        borderColor: checked ? "#2a3d22" : "transparent",
        background: checked ? "#1a2214" : "transparent",
      }}
    >
      <div
        onClick={() => onToggle(item.id)}
        className="w-[18px] h-[18px] min-w-[18px] rounded-[4px] flex items-center justify-center mt-[1px] border-[1.5px] cursor-pointer"
        style={{
          borderColor: checked ? "#3ecf72" : "#3a4050",
          background: checked ? "#3ecf72" : "transparent",
        }}
      >
        {checked && <span className="text-white text-[10px]">✓</span>}
      </div>

      <div className="flex-1 cursor-pointer" onClick={() => onToggle(item.id)}>
        <div
          className="text-[13px]"
          style={{
            color: checked ? "#6b7280" : "#c9cdd6",
            textDecoration: checked ? "line-through" : "none",
          }}
        >
          {item.text}
        </div>
        {item.note && (
          <div className="text-[11px] text-[#6b7280] mt-[2px]">{item.note}</div>
        )}
      </div>

      <div className="flex gap-2 shrink-0 mt-[2px]">
        <button
          onClick={() => onEdit(item)}
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
              Delete this item?
            </div>
            <div className="font-mono text-[11px] text-[#6b7280] mb-4">
              {item.text} — this can't be undone.
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
                  onDelete(item);
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

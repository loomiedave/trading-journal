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
      className={`flex gap-3 px-[14px] py-[11px] rounded-md mb-[2px] border ${
        checked ? "border-success/30 bg-success/10" : "border-transparent bg-transparent"
      }`}
    >
      <div
        onClick={() => onToggle(item.id)}
        className={`w-[18px] h-[18px] min-w-[18px] rounded-[4px] flex items-center justify-center mt-[1px] border-[1.5px] cursor-pointer ${
          checked ? "border-success bg-success" : "border-border bg-transparent"
        }`}
      >
        {checked && <span className="text-white text-[14px]">✓</span>}
      </div>
      <div className="flex-1 cursor-pointer" onClick={() => onToggle(item.id)}>
        <div
          className={`text-[15px] ${
            checked ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {item.text}
        </div>
        {item.note && (
          <div className="text-[15px] text-muted-foreground mt-[2px]">{item.note}</div>
        )}
      </div>
      <div className="flex gap-2 shrink-0 mt-[2px]">
        <button
          onClick={() => onEdit(item)}
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
              Delete this item?
            </div>
            <div className="text-[15px] text-muted-foreground mb-4">
              {item.text} — this can't be undone.
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
                  onDelete(item);
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

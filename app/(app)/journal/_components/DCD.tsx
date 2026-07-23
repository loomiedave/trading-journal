"use client";

export default function DeleteConfirmDialog({
  label,
  onCancel,
  onConfirm,
}: {
  label: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-foreground/70 flex items-center justify-center z-[200] px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-lg px-5 py-5 max-w-[300px] w-full"
      >
        <div className="text-xs text-card-foreground font-semibold mb-1">
          Delete this trade?
        </div>
        <div className="text-[15px] text-muted-foreground mb-4">
          {label} — this can't be undone.
        </div>
        <div className="flex gap-[10px]">
          <button
            onClick={onCancel}
            className="flex-1 py-[9px] rounded-md border border-border bg-transparent text-muted-foreground text-[15px] cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-[9px] rounded-md border-none bg-destructive text-destructive-foreground text-[15px] font-semibold cursor-pointer"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}

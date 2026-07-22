"use client";
const inputClass =
  "w-full bg-background border border-border rounded-md text-foreground px-[10px] py-[9px] text-xs outline-none box-border";

export default function RuleModal({
  label,
  section,
  editingId,
  form,
  setForm,
  saving,
  onCancel,
  onSave,
  textPlaceholder,
}: {
  label: string;
  section: string;
  editingId: string | null;
  form: { section: string; text: string; note: string };
  setForm: (form: { section: string; text: string; note: string }) => void;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
  textPlaceholder: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-end z-[100]">
      <div className="bg-card border-t border-border rounded-t-2xl w-full px-5 pt-6 pb-10">
        <div className="text-[15px] tracking-[0.15em] text-muted-foreground mb-4">
          {editingId ? `EDIT ${label}` : `ADD ${label} — ${section}`}
        </div>
        <div className="mb-[10px]">
          <div className="text-[15px] text-muted-foreground mb-1">{label}</div>
          <input
            type="text"
            placeholder={textPlaceholder}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="mb-4">
          <div className="text-[15px] text-muted-foreground mb-1">NOTE (optional)</div>
          <input
            type="text"
            placeholder="Extra context..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex gap-[10px]">
          <button
            onClick={onCancel}
            className="flex-1 py-[11px] rounded-md border border-border bg-transparent text-muted-foreground text-[15px] cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-[2] py-[11px] rounded-md border-none bg-primary text-primary-foreground text-[15px] font-semibold cursor-pointer disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
}

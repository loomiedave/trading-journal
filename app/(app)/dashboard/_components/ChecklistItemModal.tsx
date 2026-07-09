"use client";

const inputClass =
  "w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-[10px] py-[9px] text-xs font-mono outline-none box-border";

export default function ChecklistItemModal({
  section,
  editingId,
  form,
  setForm,
  saving,
  onCancel,
  onSave,
}: {
  section: string;
  editingId: string | null;
  form: { section: string; text: string; note: string };
  setForm: (form: { section: string; text: string; note: string }) => void;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-end z-[100]">
      <div className="bg-[#151820] border-t border-[#222630] rounded-t-2xl w-full px-5 pt-6 pb-10">
        <div className="font-mono text-[11px] tracking-[0.15em] text-[#6b7280] mb-4">
          {editingId ? "EDIT ITEM" : `ADD ITEM — ${section}`}
        </div>
        <div className="mb-[10px]">
          <div className="text-[11px] text-[#6b7280] mb-1">ITEM</div>
          <input
            type="text"
            placeholder="e.g. HTF structure confirmed"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="mb-4">
          <div className="text-[11px] text-[#6b7280] mb-1">NOTE (optional)</div>
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
            className="flex-1 py-[11px] rounded-md border border-[#222630] bg-transparent text-[#6b7280] font-mono text-[11px] cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-[2] py-[11px] rounded-md border-none bg-[#4f7cff] text-white font-mono text-[11px] font-semibold cursor-pointer disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
}

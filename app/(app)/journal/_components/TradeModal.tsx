"use client";

import { useState, useEffect } from "react";
import { Trade } from "@/types/type";
import { PAIRS, STRATEGIES, OUTCOMES, OUTCOME_LABEL } from "../_config/config";
import { uploadScreenshot, getSignedScreenshotUrl } from "../_actions/trades";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] text-[#6b7280] mb-1">{label}</div>
      {children}
    </div>
  );
}

const selectClass =
  "w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-[10px] py-[9px] text-xs font-mono outline-none";
const inputClass =
  "w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-[10px] py-[9px] text-xs font-mono outline-none box-border";

export default function TradeModal({
  form,
  setForm,
  saving,
  editingTrade,
  onSave,
  onClose,
}: {
  form: Trade;
  setForm: (form: Trade) => void;
  saving: boolean;
  editingTrade: Trade | null;
  onSave: () => void;
  onClose: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (form.screenshot_url) {
      getSignedScreenshotUrl(form.screenshot_url).then((url) => {
        if (!cancelled) setPreviewUrl(url);
      });
    } else {
      setPreviewUrl(null);
    }

    return () => {
      cancelled = true;
    };
  }, [form.screenshot_url]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const path = await uploadScreenshot(file);
    setUploading(false);

    if (path) {
      setForm({ ...form, screenshot_url: path });
    } else {
      alert("Upload failed — check console.");
    }

    e.target.value = "";
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end z-[100]">
      <div className="bg-[#151820] border-t border-[#222630] rounded-t-2xl w-full px-5 pt-6 pb-10 max-h-[90vh] overflow-y-auto">
        <div className="font-mono text-[11px] tracking-[0.15em] text-[#6b7280] mb-4">
          {editingTrade ? "EDIT TRADE" : "LOG TRADE"}
        </div>

        <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
          <Field label="TRADE DATE">
            <input
              type="date"
              value={form.date || getToday()}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="PAIR">
            <select
              value={form.pair}
              onChange={(e) => setForm({ ...form, pair: e.target.value })}
              className={selectClass}
            >
              {PAIRS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
          <Field label="DIRECTION">
            <select
              value={form.direction}
              onChange={(e) => setForm({ ...form, direction: e.target.value })}
              className={selectClass}
            >
              <option>LONG</option>
              <option>SHORT</option>
            </select>
          </Field>
          <Field label="OUTCOME">
            <select
              value={form.outcome}
              onChange={(e) => setForm({ ...form, outcome: e.target.value })}
              className={selectClass}
            >
              {OUTCOMES.map((o) => (
                <option key={o} value={o}>
                  {OUTCOME_LABEL[o]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mb-[10px]">
          <Field label="STRATEGY">
            <select
              value={form.strategy}
              onChange={(e) => setForm({ ...form, strategy: e.target.value })}
              className={selectClass}
            >
              <option value="">— select —</option>
              {STRATEGIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
          <Field label="RISK ($)">
            <input
              type="number"
              placeholder="e.g. 20"
              value={form.risk ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  risk: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className={inputClass}
            />
          </Field>
          <Field label="RESULT ($)">
            <input
              type="number"
              placeholder="e.g. -20"
              value={form.result ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  result: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
          <Field label="RR PLANNED">
            <input
              type="number"
              placeholder="e.g. 2"
              value={form.rr_planned ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  rr_planned: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                })
              }
              className={inputClass}
            />
          </Field>
          <Field label="RR ACHIEVED">
            <input
              type="number"
              placeholder="e.g. 1.8"
              value={form.rr_achieved ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  rr_achieved: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                })
              }
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mb-[10px]">
          <Field label="SCREENSHOT">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Trade screenshot"
                  className="w-full rounded-md border border-[#222630] max-h-[200px] object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, screenshot_url: null })}
                  className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded"
                >
                  ✕ remove
                </button>
              </div>
            ) : (
              <label className="w-full flex items-center justify-center bg-[#0e1015] border border-dashed border-[#222630] rounded-md text-[#6b7280] px-[10px] py-[20px] text-xs font-mono cursor-pointer">
                {uploading ? "Uploading..." : "+ upload screenshot"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </Field>
        </div>

        <div className="mb-4">
          <Field label="NOTES">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="4H bullish OB, 15M CHoCH confirmed..."
              className="w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-[10px] py-[9px] text-xs font-mono resize-none h-[70px] box-border outline-none"
            />
          </Field>
        </div>

        <div className="flex gap-[10px]">
          <button
            onClick={onClose}
            className="flex-1 py-[11px] rounded-md border border-[#222630] bg-transparent text-[#6b7280] font-mono text-[11px] cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={onSave}
            disabled={saving || uploading}
            className="flex-[2] py-[11px] rounded-md border-none bg-[#4f7cff] text-white font-mono text-[11px] font-semibold cursor-pointer disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
}

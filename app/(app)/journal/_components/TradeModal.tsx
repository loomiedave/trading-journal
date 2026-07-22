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
      <div className="text-[15px] text-muted-foreground mb-1">{label}</div>
      {children}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[13px] tracking-[0.12em] text-muted-foreground/70 font-semibold mt-5 mb-2 first:mt-0">
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-background border border-border rounded-md text-foreground pl-[10px] pr-8 py-[9px] text-xs outline-none cursor-pointer transition-colors hover:border-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/30"
      >
        {children}
      </select>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const inputClass =
  "w-full bg-background border border-border rounded-md text-foreground px-[10px] py-[9px] text-xs outline-none box-border";

const outcomeStyles: Record<string, { active: string }> = {
  win: { active: "bg-success text-success-foreground border-success" },
  loss: { active: "bg-destructive text-destructive-foreground border-destructive" },
  be: { active: "bg-warning text-warning-foreground border-warning" },
  missed: { active: "bg-muted text-muted-foreground border-muted" },
};

function getOutcomeActiveClass(o: string) {
  const key = o?.trim().toLowerCase();
  return outcomeStyles[key]?.active ?? "bg-primary text-primary-foreground border-primary";
}

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
  const [showMore, setShowMore] = useState(false);

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

  // Once anything in the "more" section has content (editing an existing
  // trade, for example), keep it expanded by default instead of hiding it.
  useEffect(() => {
    if (
      form.strategy ||
      form.rr_planned != null ||
      form.rr_achieved != null ||
      form.screenshot_url ||
      form.notes
    ) {
      setShowMore(true);
    }
  }, [editingTrade]);

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
      <div className="bg-card border-t border-border rounded-t-2xl w-full px-5 pt-6 pb-10 max-h-[90vh] overflow-y-auto">
        <div className="text-[15px] tracking-[0.15em] text-muted-foreground mb-4">
          {editingTrade ? "EDIT TRADE" : "LOG TRADE"}
        </div>

        <SectionHeader>TRADE</SectionHeader>
        <div className="grid grid-cols-2 gap-[10px]">
          <Field label="DATE">
            <input
              type="date"
              value={form.date || getToday()}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="PAIR">
            <Select
              value={form.pair}
              onChange={(e) => setForm({ ...form, pair: e.target.value })}
            >
              {PAIRS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-[10px]">
          <Field label="DIRECTION">
            <div className="flex gap-[10px]">
              {["LONG", "SHORT"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm({ ...form, direction: d })}
                  className={`flex-1 py-[9px] rounded-md border text-xs font-semibold cursor-pointer ${
                    form.direction === d
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <SectionHeader>OUTCOME</SectionHeader>
        <div className="flex gap-[10px]">
          {OUTCOMES.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setForm({ ...form, outcome: o })}
              className={`flex-1 py-[9px] rounded-md border text-xs font-semibold cursor-pointer ${
                form.outcome === o
                  ? getOutcomeActiveClass(o)
                  : "bg-background text-muted-foreground border-border"
              }`}
            >
              {OUTCOME_LABEL[o]}
            </button>
          ))}
        </div>
        <div className="mt-[10px] grid grid-cols-2 gap-[10px]">
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

        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="w-full flex items-center justify-between mt-5 py-2 bg-transparent border-none cursor-pointer"
        >
          <span className="text-[13px] tracking-[0.12em] text-muted-foreground/70 font-semibold">
            MORE DETAILS
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-muted-foreground transition-transform ${showMore ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showMore && (
          <>
            <div className="mt-2">
              <Field label="STRATEGY">
                <Select
                  value={form.strategy}
                  onChange={(e) => setForm({ ...form, strategy: e.target.value })}
                >
                  <option value="">— select —</option>
                  {STRATEGIES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="mt-[10px] grid grid-cols-2 gap-[10px]">
              <Field label="RR PLANNED">
                <input
                  type="number"
                  placeholder="e.g. 2"
                  value={form.rr_planned ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rr_planned: e.target.value ? parseFloat(e.target.value) : null,
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
                      rr_achieved: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-[10px]">
              <Field label="SCREENSHOT">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Trade screenshot"
                      className="w-full rounded-md border border-border max-h-[200px] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, screenshot_url: null })}
                      className="absolute top-2 right-2 bg-black/70 text-white text-[14px] px-2 py-1 rounded"
                    >
                      ✕ remove
                    </button>
                  </div>
                ) : (
                  <label className="w-full flex items-center justify-center bg-background border border-dashed border-border rounded-md text-muted-foreground px-[10px] py-[20px] text-xs cursor-pointer">
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

            <div className="mt-[10px]">
              <Field label="NOTES">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="4H bullish OB, 15M CHoCH confirmed..."
                  className="w-full bg-background border border-border rounded-md text-foreground px-[10px] py-[9px] text-xs resize-none h-[70px] box-border outline-none"
                />
              </Field>
            </div>
          </>
        )}

        <div className="flex gap-[10px] mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-[11px] rounded-md border border-border bg-transparent text-muted-foreground text-[15px] cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={onSave}
            disabled={saving || uploading}
            className="flex-[2] py-[11px] rounded-md border-none bg-primary text-primary-foreground text-[15px] font-semibold cursor-pointer disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
}

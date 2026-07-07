"use client";
import { useEffect, useState } from "react";
import { DEFAULT_RULES, SECTIONS, RuleItem } from "./_data/default-rules";
import {
  fetchRuleOverrides,
  upsertRule,
  deleteRule,
  RuleOverride,
} from "./_actions/rules";

const inputClass =
  "w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-[10px] py-[9px] text-xs font-mono outline-none box-border";

export default function Rules() {
  const [overrides, setOverrides] = useState<RuleOverride[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    section: SECTIONS[0],
    text: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRuleOverrides().then(setOverrides);
  }, []);

  // merge defaults + overrides
  const merged: RuleItem[] = (() => {
    const result: RuleItem[] = [];
    for (const def of DEFAULT_RULES) {
      const override = overrides.find((o) => o.default_id === def.id);
      if (override?.deleted) continue;
      if (override)
        result.push({
          id: def.id,
          section: override.section,
          text: override.text,
          note: override.note,
        });
      else result.push(def);
    }
    // user-added rules (no default_id)
    for (const o of overrides) {
      if (!o.default_id && !o.deleted)
        result.push({
          id: o.id,
          section: o.section,
          text: o.text,
          note: o.note,
        });
    }
    return result;
  })();

  function openAdd(section: string) {
    setEditingId(null);
    setForm({ section, text: "", note: "" });
    setShowModal(true);
  }

  function openEdit(rule: RuleItem) {
    setEditingId(rule.id);
    setForm({ section: rule.section, text: rule.text, note: rule.note || "" });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm({ section: SECTIONS[0], text: "", note: "" });
  }

  async function save() {
    if (!form.text.trim()) return;
    setSaving(true);
    const isDefault = DEFAULT_RULES.some((d) => d.id === editingId);
    const id = editingId || crypto.randomUUID();
    const success = await upsertRule({
      id,
      section: form.section,
      text: form.text,
      note: form.note || null,
      default_id: isDefault ? editingId : null,
    });
    if (success) {
      const fresh = await fetchRuleOverrides();
      setOverrides(fresh);
      closeModal();
    }
    setSaving(false);
  }

  async function handleDelete(rule: RuleItem) {
    const isDefault = DEFAULT_RULES.some((d) => d.id === rule.id);
    await deleteRule(rule.id, isDefault);
    const fresh = await fetchRuleOverrides();
    setOverrides(fresh);
  }

  const sectionColor = (section: string) =>
    section === "WHEN TO SKIP"
      ? { card: "bg-[#1a1414] border-[#3d2222]", text: "text-[#e05252]" }
      : { card: "bg-[#151820] border-[#222630]", text: "text-[#c9cdd6]" };

  return (
    <div className="bg-[#0e1015] min-h-screen font-mono text-[#c9cdd6] w-full">
      <div className="px-5 pt-4 pb-10">
        {SECTIONS.map((section) => {
          const items = merged.filter((r) => r.section === section);
          const style = sectionColor(section);
          return (
            <div key={section}>
              <div className="text-[9px] tracking-[0.2em] text-[#6b7280] mt-5 mb-[10px]">
                {section}
              </div>
              {items.map((rule) => (
                <div
                  key={rule.id}
                  className={`px-[14px] py-[11px] border rounded-md mb-[6px] ${style.card}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className={`text-[13px] ${style.text}`}>
                        {rule.text}
                      </div>
                      {rule.note && (
                        <div className="text-[11px] text-[#6b7280] mt-[2px]">
                          {rule.note}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => openEdit(rule)}
                        className="text-[10px] text-[#3a4050] bg-transparent border-none cursor-pointer p-0 hover:text-[#4f7cff]"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(rule)}
                        className="text-[10px] text-[#3a4050] bg-transparent border-none cursor-pointer p-0 hover:text-[#e05252]"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => openAdd(section)}
                className="w-full py-[10px] border border-dashed border-[#3a4050] rounded-md text-[#3a4050] text-[10px] tracking-[0.1em] bg-transparent cursor-pointer hover:border-[#4f7cff] hover:text-[#4f7cff] mb-2"
              >
                + ADD RULE
              </button>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end z-[100]">
          <div className="bg-[#151820] border-t border-[#222630] rounded-t-2xl w-full px-5 pt-6 pb-10">
            <div className="font-mono text-[11px] tracking-[0.15em] text-[#6b7280] mb-4">
              {editingId ? "EDIT RULE" : `ADD RULE — ${form.section}`}
            </div>
            <div className="mb-[10px]">
              <div className="text-[11px] text-[#6b7280] mb-1">RULE</div>
              <input
                type="text"
                placeholder="e.g. Never trade the first 15 minutes"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="mb-4">
              <div className="text-[11px] text-[#6b7280] mb-1">
                NOTE (optional)
              </div>
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
                onClick={closeModal}
                className="flex-1 py-[11px] rounded-md border border-[#222630] bg-transparent text-[#6b7280] font-mono text-[11px] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-[2] py-[11px] rounded-md border-none bg-[#4f7cff] text-white font-mono text-[11px] font-semibold cursor-pointer disabled:opacity-50"
              >
                {saving ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

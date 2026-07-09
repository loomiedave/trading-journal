"use client";
import { useEffect, useState } from "react";
import { DEFAULT_RULES, SECTIONS, RuleItem } from "./_data/default-rules";
import {
  fetchRuleOverrides,
  upsertRule,
  deleteRule,
  RuleOverride,
} from "./_actions/rules";
import RuleRow from "./_components/RuleRow";
import RuleModal from "./_components/RuleModal";

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
                <RuleRow
                  key={rule.id}
                  rule={rule}
                  cardClass={style.card}
                  textClass={style.text}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
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
        <RuleModal
          label="RULE"
          textPlaceholder="e.g. Never trade the first 15 minutes"
          section={form.section}
          editingId={editingId}
          form={form}
          setForm={setForm}
          saving={saving}
          onCancel={closeModal}
          onSave={save}
        />
      )}
    </div>
  );
}

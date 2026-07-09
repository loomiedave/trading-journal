"use client";
import { useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";
import {
  DEFAULT_CHECKLIST,
  ChecklistDefaultItem,
} from "./_data/default-checklist";
import {
  fetchChecklistOverrides,
  upsertChecklistItem,
  deleteChecklistItem,
  ChecklistOverride,
} from "./_actions/checklist";
import ChecklistItem from "./_components/ChecklistItem";
import ChecklistItemModal from "./_components/ChecklistItemModal";

// Fixed this shit at module scope so sections never disappear when items are deleted
const ALL_SECTIONS = [...new Set(DEFAULT_CHECKLIST.map((d) => d.section))];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function loadLocalState() {
  if (typeof window === "undefined") return { checks: [], killed: false };
  const saved = localStorage.getItem("checklist_date");
  const today = getToday();
  if (saved !== today) {
    localStorage.setItem("checklist_date", today);
    localStorage.setItem("checklist_checks", "[]");
    localStorage.setItem("checklist_killed", "0");
    return { checks: [], killed: false };
  }
  return {
    checks: JSON.parse(localStorage.getItem("checklist_checks") || "[]"),
    killed: localStorage.getItem("checklist_killed") === "1",
  };
}

export default function Dashboard() {
  const [overrides, setOverrides] = useState<ChecklistOverride[]>([]);
  const [checks, setChecks] = useState<string[]>([]);
  const [killed, setKilled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ section: "", text: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = loadLocalState();
    setChecks(local.checks);
    setKilled(local.killed);
    fetchChecklistOverrides().then((data) => {
      setOverrides(data);
      setLoading(false);
    });
  }, []);

  const merged: ChecklistDefaultItem[] = (() => {
    const result: ChecklistDefaultItem[] = [];
    for (const def of DEFAULT_CHECKLIST) {
      const override = overrides.find((o) => o.default_id === def.id);
      if (override?.deleted) continue;
      if (override)
        result.push({
          id: def.id,
          section: override.section,
          text: override.text,
          note: override.note || "",
        });
      else result.push(def);
    }
    for (const o of overrides) {
      if (!o.default_id && !o.deleted)
        result.push({
          id: o.id,
          section: o.section,
          text: o.text,
          note: o.note || "",
        });
    }
    return result;
  })();

  function saveLocal(newChecks: string[], newKilled: boolean) {
    localStorage.setItem("checklist_checks", JSON.stringify(newChecks));
    localStorage.setItem("checklist_killed", newKilled ? "1" : "0");
  }

  function toggle(id: string) {
    const next = checks.includes(id)
      ? checks.filter((c) => c !== id)
      : [...checks, id];
    setChecks(next);
    saveLocal(next, killed);
  }

  function toggleKill() {
    const next = !killed;
    setKilled(next);
    saveLocal(checks, next);
  }

  function reset() {
    if (!confirm("Reset today's checklist?")) return;
    setChecks([]);
    setKilled(false);
    saveLocal([], false);
  }

  function openAdd(section: string) {
    setEditingId(null);
    setForm({ section, text: "", note: "" });
    setShowModal(true);
  }

  function openEdit(item: ChecklistDefaultItem) {
    setEditingId(item.id);
    setForm({ section: item.section, text: item.text, note: item.note });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm({ section: "", text: "", note: "" });
  }

  async function saveItem() {
    if (!form.text.trim()) return;
    setSaving(true);
    const isDefault = DEFAULT_CHECKLIST.some((d) => d.id === editingId);
    const id = editingId || crypto.randomUUID();
    const success = await upsertChecklistItem({
      id,
      section: form.section,
      text: form.text,
      note: form.note || null,
      default_id: isDefault ? editingId : null,
    });
    if (success) {
      const fresh = await fetchChecklistOverrides();
      setOverrides(fresh);
      closeModal();
    }
    setSaving(false);
  }

  async function handleDelete(item: ChecklistDefaultItem) {
    const isDefault = DEFAULT_CHECKLIST.some((d) => d.id === item.id);
    await deleteChecklistItem(item.id, isDefault);
    const fresh = await fetchChecklistOverrides();
    setOverrides(fresh);
  }

  if (loading) return <PageLoader />;

  const TOTAL = merged.length;

  return (
    <div className="bg-[#0e1015] min-h-screen font-mono text-[#c9cdd6] w-full">
      <div className="px-5 pt-4 pb-[120px]">
        {ALL_SECTIONS.map((section) => (
          <div key={section}>
            <div className="text-[9px] tracking-[0.2em] text-[#6b7280] mt-5 mb-[10px] uppercase">
              {section}
            </div>
            {merged
              .filter((i) => i.section === section)
              .map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  checked={checks.includes(item.id)}
                  onToggle={toggle}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            <button
              onClick={() => openAdd(section)}
              className="w-full py-[9px] border border-dashed border-[#3a4050] rounded-md text-[#3a4050] text-[10px] tracking-[0.1em] bg-transparent cursor-pointer hover:border-[#4f7cff] hover:text-[#4f7cff] mb-2"
            >
              + ADD ITEM
            </button>
          </div>
        ))}

        <div className="mt-6 px-4 py-[14px] rounded-lg border border-[#3d2222] bg-[#1a1414] flex items-center justify-between">
          <div>
            <div className="text-[#e05252] text-xs font-semibold">
              KILL SWITCH
            </div>
            <div className="text-[#6b7280] text-[11px] mt-[2px]">
              3 fails today → sit out
            </div>
          </div>
          <button
            onClick={toggleKill}
            className="font-mono text-[11px] font-semibold px-[14px] py-2 rounded-[5px] border-[1.5px] border-[#e05252] cursor-pointer"
            style={{
              background: killed ? "#e05252" : "transparent",
              color: killed ? "#fff" : "#e05252",
            }}
          >
            {killed ? "TRIGGERED" : "ARMED"}
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0e1015] border-t border-[#222630] px-5 pt-[10px] pb-[14px]">
        <div className="flex justify-between mb-[6px]">
          <span className="text-[10px] text-[#6b7280] tracking-[0.1em]">
            CHECKLIST
          </span>
          <span className="text-[10px] text-[#4f7cff] font-mono">
            {checks.length} / {TOTAL}
          </span>
        </div>
        <div className="h-[3px] bg-[#222630] rounded-full">
          <div
            className="h-full bg-[#4f7cff] rounded-full transition-[width] duration-300"
            style={{ width: `${TOTAL ? (checks.length / TOTAL) * 100 : 0}%` }}
          />
        </div>
        <div className="text-right mt-2">
          <span
            onClick={reset}
            className="text-[10px] text-[#6b7280] cursor-pointer tracking-[0.1em]"
          >
            RESET DAY
          </span>
        </div>
      </div>

      {showModal && (
        <ChecklistItemModal
          section={form.section}
          editingId={editingId}
          form={form}
          setForm={setForm}
          saving={saving}
          onCancel={closeModal}
          onSave={saveItem}
        />
      )}
    </div>
  );
}

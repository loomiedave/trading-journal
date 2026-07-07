"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trade } from "@/types/type";
import {
  PAIRS,
  STRATEGIES,
  OUTCOMES,
  OUTCOME_LABEL,
  empty,
} from "./_config/config";
import {
  fetchTrades,
  insertTrade,
  updateTrade,
  deleteTrade,
} from "./_actions/trades";
import TradeCard from "./_components/TradeCard";
import { getToday } from "./_actions/trades";
import TradeModal from "./_components/TradeModal";

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

export default function Journal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Trade>(empty);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"today" | "history">("today");
  const router = useRouter();
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const load = useCallback(async () => {
    const data = await fetchTrades();
    if (data === null) {
      router.push("/auth/login");
      return;
    }
    setTrades(data);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  function handleEdit(trade: Trade) {
    setForm({ ...trade });
    setEditingTrade(trade);
    setShowModal(true);
  }

  async function saveTrade() {
    setSaving(true);
    const success = editingTrade?.id
      ? await updateTrade(editingTrade.id, form)
      : await insertTrade(form);
    if (!success) {
      alert("Failed to save — check console.");
      setSaving(false);
      return;
    }
    setShowModal(false);
    setForm(empty);
    setEditingTrade(null);
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    await deleteTrade(id);
    load();
  }

  function closeModal() {
    setShowModal(false);
    setForm(empty);
    setEditingTrade(null);
  }

  const today = getToday();
  const todayTrades = trades.filter((t) => t.date === today);
  const historyTrades = trades.filter((t) => t.date !== today);

  const selectClass =
    "w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-[10px] py-[9px] text-xs font-mono outline-none";
  const inputClass =
    "w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-[10px] py-[9px] text-xs font-mono outline-none box-border";

  return (
    <div className="bg-[#0e1015] min-h-screen font-mono text-[#c9cdd6] w-full">
      {/* Tabs */}
      <div className="flex border-b border-[#222630] px-5">
        {(["today", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="font-mono text-[10px] tracking-[0.12em] font-semibold px-3 pt-[10px] pb-[9px] bg-transparent border-none cursor-pointer"
            style={{
              color: tab === t ? "#e8ecf4" : "#6b7280",
              borderBottom: `2px solid ${tab === t ? "#4f7cff" : "transparent"}`,
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="px-5 pt-4 pb-[100px]">
        {tab === "today" && (
          <>
            {todayTrades.length === 0 && (
              <div className="text-[#6b7280] text-xs py-3">
                No trades logged today.
              </div>
            )}
            {todayTrades.map((t) => (
              <TradeCard
                key={t.id}
                trade={t}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </>
        )}
        {tab === "history" && (
          <>
            {historyTrades.length === 0 && (
              <div className="text-[#6b7280] text-xs py-3">No history yet.</div>
            )}
            {historyTrades.map((t) => (
              <TradeCard
                key={t.id}
                trade={t}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-[#4f7cff] border-none rounded-full w-[52px] h-[52px] text-2xl text-white cursor-pointer shadow-[0_4px_20px_rgba(79,124,255,0.4)] z-10"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <TradeModal
          form={form}
          setForm={setForm}
          saving={saving}
          editingTrade={editingTrade}
          onSave={saveTrade}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

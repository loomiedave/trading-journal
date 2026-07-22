"use client";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

type DayTrade = { date: string; outcome: string; result?: number | null };

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon-first grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function TradeCalendar({ trades }: { trades: DayTrade[] }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const dayMap = useMemo(() => {
    const map: Record<string, { wins: number; total: number; pnl: number }> = {};
    for (const t of trades) {
      if (t.outcome === "missed") continue;
      if (!map[t.date]) map[t.date] = { wins: 0, total: 0, pnl: 0 };
      map[t.date].total += 1;
      if (t.outcome === "win") map[t.date].wins += 1;
      if (t.result != null) map[t.date].pnl += t.result;
    }
    return map;
  }, [trades]);

  const cells = buildMonthGrid(cursor.year, cursor.month);
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(
    "en-GB",
    { month: "long", year: "numeric" }
  );

  function shiftMonth(delta: number) {
    setCursor((prev) => {
      let month = prev.month + delta;
      let year = prev.year;
      if (month < 0) { month = 11; year -= 1; }
      if (month > 11) { month = 0; year += 1; }
      return { year, month };
    });
  }

  function dayClass(day: number | null) {
    if (day == null) return "bg-transparent";
    const key = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const stat = dayMap[key];
    if (!stat) return "bg-secondary/60 text-muted-foreground border border-border/50";
    const winRate = stat.wins / stat.total;
    if (stat.pnl < 0) return "bg-destructive/25 text-destructive border border-destructive/40";
    if (winRate >= 0.5 && stat.pnl > 0) return "bg-success/25 text-success border border-success/40";
    return "bg-warning/25 text-warning border border-warning/40";
  }

  const monthPnl = Object.entries(dayMap)
    .filter(([key]) => key.startsWith(`${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}`))
    .reduce((s, [, v]) => s + v.pnl, 0);

  return (
    <div className="bg-card border border-border rounded-lg px-4 py-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shiftMonth(-1)} className="text-muted-foreground hover:text-primary p-1">
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <div className="text-xs font-semibold text-card-foreground tracking-[0.08em]">
            {monthLabel.toUpperCase()}
          </div>
          <div className={`text-[14px] mt-[2px] ${monthPnl >= 0 ? "text-success" : "text-destructive"}`}>
            {monthPnl >= 0 ? "+" : "-"}${Math.abs(monthPnl).toFixed(2)}
          </div>
        </div>
        <button onClick={() => shiftMonth(1)} className="text-muted-foreground hover:text-primary p-1">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[4px] mb-[6px]">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-center text-[15px] text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[4px]">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`aspect-square rounded-md flex items-center justify-center text-[14px] font-medium ${dayClass(day)}`}
          >
            {day ?? ""}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-3 justify-center text-[15px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-success/60 inline-block" /> WIN DAY
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-warning/60 inline-block" /> BREAKEVEN/MIXED
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-destructive/60 inline-block" /> LOSS DAY
        </span>
      </div>
    </div>
  );
}

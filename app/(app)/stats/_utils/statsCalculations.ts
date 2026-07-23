import { statsTrade } from "@/types/type";

export const fmt = (v: number) => `${v >= 0 ? "+" : "-"}$${Math.abs(v).toFixed(2)}`;
export const pnlColorClass = (v: number) => (v >= 0 ? "text-success" : "text-destructive");

function weekKey(d: string) {
  const dt = new Date(d + "T12:00:00");
  const day = dt.getDay() || 7;
  dt.setDate(dt.getDate() - day + 1);
  return dt.toISOString().slice(0, 10);
}

export interface PairOrStrategyStats {
  w: number;
  l: number;
  pnl: number;
}

export interface TradeStats {
  traded: statsTrade[];
  wins: statsTrade[];
  losses: statsTrade[];
  missedCount: number;
  wr: number | null;
  totalPnl: number;
  hasResults: boolean;
  avgWin: number | null;
  avgLoss: number | null;
  weeks: string[];
  weekMap: Record<string, number>;
  months: string[];
  monthMap: Record<string, number>;
  pairMap: Record<string, PairOrStrategyStats>;
  stratMap: Record<string, PairOrStrategyStats>;
}

export function computeStats(trades: statsTrade[]): TradeStats {
  const traded = trades.filter((t) => t.outcome !== "missed");
  const wins = traded.filter((t) => t.outcome === "win");
  const losses = traded.filter((t) => t.outcome === "loss");
  const missedCount = trades.filter((t) => t.outcome === "missed").length;

  const wr = traded.length
    ? Math.round((wins.length / traded.length) * 100)
    : null;

  const withResult = traded.filter((t) => t.result != null);
  const totalPnl = withResult.reduce((s, t) => s + (t.result || 0), 0);

  const winsWithResult = wins.filter((t) => t.result != null);
  const avgWin = winsWithResult.length
    ? winsWithResult.reduce((s, t) => s + (t.result || 0), 0) / winsWithResult.length
    : null;

  const lossesWithResult = losses.filter((t) => t.result != null);
  const avgLoss = lossesWithResult.length
    ? lossesWithResult.reduce((s, t) => s + (t.result || 0), 0) / lossesWithResult.length
    : null;

  // Weekly
  const weekMap: Record<string, number> = {};
  withResult.forEach((t) => {
    const k = weekKey(t.date);
    weekMap[k] = (weekMap[k] || 0) + (t.result || 0);
  });
  const weeks = Object.keys(weekMap)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 8);

  // Monthly
  const monthMap: Record<string, number> = {};
  withResult.forEach((t) => {
    const k = t.date.slice(0, 7);
    monthMap[k] = (monthMap[k] || 0) + (t.result || 0);
  });
  const months = Object.keys(monthMap).sort((a, b) => b.localeCompare(a));

  // By pair
  const pairMap: Record<string, PairOrStrategyStats> = {};
  traded.forEach((t) => {
    if (!pairMap[t.pair]) pairMap[t.pair] = { w: 0, l: 0, pnl: 0 };
    if (t.outcome === "win") pairMap[t.pair].w++;
    if (t.outcome === "loss") pairMap[t.pair].l++;
    if (t.result != null) pairMap[t.pair].pnl += t.result;
  });

  // By strategy
  const stratMap: Record<string, PairOrStrategyStats> = {};
  traded.forEach((t) => {
    if (!t.strategy) return;
    if (!stratMap[t.strategy]) stratMap[t.strategy] = { w: 0, l: 0, pnl: 0 };
    if (t.outcome === "win") stratMap[t.strategy].w++;
    if (t.outcome === "loss") stratMap[t.strategy].l++;
    if (t.result != null) stratMap[t.strategy].pnl += t.result;
  });

  return {
    traded,
    wins,
    losses,
    missedCount,
    wr,
    totalPnl,
    hasResults: withResult.length > 0,
    avgWin,
    avgLoss,
    weeks,
    weekMap,
    months,
    monthMap,
    pairMap,
    stratMap,
  };
}

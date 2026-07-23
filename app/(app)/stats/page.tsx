"use client";

import PageLoader from "@/components/PageLoader";
import TradeCalendar from "@/app/(app)/stats/_components/TradeCalendar";
import EquityCurve from "@/app/(app)/stats/_components/EquityCurve";
import StatCard from "./_components/StatCard";
import StatRow from "./_components/StatRow";
import StatSection from "./_components/StatSection";
import { useTrades } from "./_utils/useTrades";
import { computeStats, fmt } from "./_utils/statsCalculations";

export default function Stats() {
  const { trades, loading } = useTrades();

  if (loading) return <PageLoader />;

  const {
    traded,
    wr,
    totalPnl,
    hasResults,
    avgWin,
    avgLoss,
    missedCount,
    weeks,
    weekMap,
    months,
    monthMap,
    pairMap,
    stratMap,
  } = computeStats(trades);

  return (
    <div className="bg-background min-h-screen text-foreground w-full">
      <div className="px-5 pt-4 pb-10">
        <TradeCalendar trades={trades} />
        <EquityCurve trades={trades} />

        <div className="grid grid-cols-2 gap-2 mb-2">
          <StatCard
            label="WIN RATE"
            value={wr != null ? `${wr}%` : "—"}
            colorClass={wr != null ? (wr >= 50 ? "text-success" : "text-warning") : undefined}
          />
          <StatCard
            label="NET P&L"
            value={hasResults ? fmt(totalPnl) : "—"}
            colorClass={hasResults ? (totalPnl >= 0 ? "text-success" : "text-destructive") : undefined}
          />
          <StatCard
            label="AVG WIN"
            value={avgWin != null ? `+$${avgWin.toFixed(2)}` : "—"}
            colorClass="text-success"
          />
          <StatCard
            label="AVG LOSS"
            value={avgLoss != null ? `-$${Math.abs(avgLoss).toFixed(2)}` : "—"}
            colorClass="text-destructive"
          />
          <StatCard label="TRADES" value={String(traded.length)} />
          <StatCard label="MISSED" value={String(missedCount)} colorClass="text-warning" />
        </div>

        {weeks.length > 0 && (
          <StatSection title="WEEKLY P&L">
            {weeks.map((w) => (
              <StatRow
                key={w}
                label={`WK ${new Date(w + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`}
                pnl={weekMap[w]}
              />
            ))}
          </StatSection>
        )}

        {months.length > 0 && (
          <StatSection title="MONTHLY P&L">
            {months.map((m) => (
              <StatRow
                key={m}
                label={new Date(m + "-15")
                  .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                  .toUpperCase()}
                pnl={monthMap[m]}
              />
            ))}
          </StatSection>
        )}

        {Object.keys(pairMap).length > 0 && (
          <StatSection title="BY PAIR">
            {Object.keys(pairMap)
              .sort()
              .map((p) => {
                const { w, l, pnl } = pairMap[p];
                const pwr = Math.round((w / (w + l)) * 100);
                return <StatRow key={p} label={p} sub={`${w}W / ${l}L · ${pwr}%`} pnl={pnl} />;
              })}
          </StatSection>
        )}

        {Object.keys(stratMap).length > 0 && (
          <StatSection title="BY STRATEGY">
            {Object.keys(stratMap)
              .sort((a, b) => stratMap[b].w + stratMap[b].l - (stratMap[a].w + stratMap[a].l))
              .map((s) => {
                const { w, l, pnl } = stratMap[s];
                const swr = Math.round((w / (w + l)) * 100);
                return <StatRow key={s} label={s} sub={`${w}W / ${l}L · ${swr}%`} pnl={pnl} />;
              })}
          </StatSection>
        )}
      </div>
    </div>
  );
}

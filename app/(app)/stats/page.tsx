"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { statsTrade } from "@/types/type";
import PageLoader from "@/components/PageLoader";
import TradeCalendar from "@/app/(app)/stats/_components/TradeCalendar";
import EquityCurve from "@/components/EquityCurve";

export default function Stats() {
  const [trades, setTrades] = useState<statsTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { data } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id);
    setTrades(data || []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    load();
  }, [load]);

  const traded = trades.filter((t) => t.outcome !== "missed");
  const wins = traded.filter((t) => t.outcome === "win");
  const losses = traded.filter((t) => t.outcome === "loss");
  const wr = traded.length
    ? Math.round((wins.length / traded.length) * 100)
    : null;
  const withResult = traded.filter((t) => t.result != null);
  const totalPnl = withResult.reduce((s, t) => s + (t.result || 0), 0);
  const avgWin = wins.filter((t) => t.result != null).length
    ? wins
        .filter((t) => t.result != null)
        .reduce((s, t) => s + (t.result || 0), 0) /
      wins.filter((t) => t.result != null).length
    : null;
  const avgLoss = losses.filter((t) => t.result != null).length
    ? losses
        .filter((t) => t.result != null)
        .reduce((s, t) => s + (t.result || 0), 0) /
      losses.filter((t) => t.result != null).length
    : null;

  // Weekly
  function weekKey(d: string) {
    const dt = new Date(d + "T12:00:00");
    const day = dt.getDay() || 7;
    dt.setDate(dt.getDate() - day + 1);
    return dt.toISOString().slice(0, 10);
  }
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
  const pairMap: Record<string, { w: number; l: number; pnl: number }> = {};
  traded.forEach((t) => {
    if (!pairMap[t.pair]) pairMap[t.pair] = { w: 0, l: 0, pnl: 0 };
    if (t.outcome === "win") pairMap[t.pair].w++;
    if (t.outcome === "loss") pairMap[t.pair].l++;
    if (t.result != null) pairMap[t.pair].pnl += t.result;
  });

  // By strategy
  const stratMap: Record<string, { w: number; l: number; pnl: number }> = {};
  traded.forEach((t) => {
    if (!t.strategy) return;
    if (!stratMap[t.strategy]) stratMap[t.strategy] = { w: 0, l: 0, pnl: 0 };
    if (t.outcome === "win") stratMap[t.strategy].w++;
    if (t.outcome === "loss") stratMap[t.strategy].l++;
    if (t.result != null) stratMap[t.strategy].pnl += t.result;
  });

  const fmt = (v: number) => `${v >= 0 ? "+" : "-"}$${Math.abs(v).toFixed(2)}`;
  const pnlColorClass = (v: number) => (v >= 0 ? "text-success" : "text-destructive");

  const StatCard = ({
    label,
    value,
    colorClass,
  }: {
    label: string;
    value: string;
    colorClass?: string;
  }) => (
    <div className="bg-card border border-border rounded-lg px-[14px] py-3">
      <div className="text-[15px] tracking-[0.15em] text-muted-foreground mb-1">
        {label}
      </div>
      <div className={`text-[22px] font-semibold leading-none ${colorClass || "text-card-foreground"}`}>
        {value}
      </div>
    </div>
  );

  const Row = ({
    label,
    pnl,
    sub,
  }: {
    label: string;
    wr?: number;
    pnl: number;
    sub?: string;
  }) => (
    <div className="flex items-center justify-between px-[14px] py-[10px] bg-card border border-border rounded-md mb-[6px]">
      <div>
        <div className="text-xs font-semibold text-card-foreground">
          {label}
        </div>
        {sub && (
          <div className="text-[14px] text-muted-foreground mt-[2px]">
            {sub}
          </div>
        )}
      </div>
      <span className={`text-xs font-semibold ${pnlColorClass(pnl)}`}>
        {fmt(pnl)}
      </span>
    </div>
  );

  if (loading) return <PageLoader />;

  return (
    <div className="bg-background min-h-screen text-foreground w-full">
      <div className="px-5 pt-4 pb-10">

        <TradeCalendar trades={trades} />
        <EquityCurve trades={trades} />
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <StatCard
            label="WIN RATE"
            value={wr != null ? `${wr}%` : "—"}
            colorClass={wr != null ? (wr >= 50 ? "text-success" : "text-warning") : undefined}
          />
          <StatCard
            label="NET P&L"
            value={withResult.length ? fmt(totalPnl) : "—"}
            colorClass={withResult.length ? pnlColorClass(totalPnl) : undefined}
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
          <StatCard
            label="MISSED"
            value={String(trades.filter((t) => t.outcome === "missed").length)}
            colorClass="text-warning"
          />
        </div>

        {weeks.length > 0 && (
          <>
            <div className="text-[15px] tracking-[0.2em] text-muted-foreground mt-5 mb-[10px]">
              WEEKLY P&L
            </div>
            {weeks.map((w) => (
              <Row
                key={w}
                label={`WK ${new Date(w + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`}
                pnl={weekMap[w]}
              />
            ))}
          </>
        )}

        {months.length > 0 && (
          <>
            <div className="text-[15px] tracking-[0.2em] text-muted-foreground mt-5 mb-[10px]">
              MONTHLY P&L
            </div>
            {months.map((m) => (
              <Row
                key={m}
                label={new Date(m + "-15")
                  .toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })
                  .toUpperCase()}
                pnl={monthMap[m]}
              />
            ))}
          </>
        )}

        {Object.keys(pairMap).length > 0 && (
          <>
            <div className="text-[15px] tracking-[0.2em] text-muted-foreground mt-5 mb-[10px]">
              BY PAIR
            </div>
            {Object.keys(pairMap)
              .sort()
              .map((p) => {
                const { w, l, pnl } = pairMap[p];
                const pwr = Math.round((w / (w + l)) * 100);
                return (
                  <Row
                    key={p}
                    label={p}
                    sub={`${w}W / ${l}L · ${pwr}%`}
                    pnl={pnl}
                  />
                );
              })}
          </>
        )}

        {Object.keys(stratMap).length > 0 && (
          <>
            <div className="text-[15px] tracking-[0.2em] text-muted-foreground mt-5 mb-[10px]">
              BY STRATEGY
            </div>
            {Object.keys(stratMap)
              .sort(
                (a, b) =>
                  stratMap[b].w +
                  stratMap[b].l -
                  (stratMap[a].w + stratMap[a].l),
              )
              .map((s) => {
                const { w, l, pnl } = stratMap[s];
                const swr = Math.round((w / (w + l)) * 100);
                return (
                  <Row
                    key={s}
                    label={s}
                    sub={`${w}W / ${l}L · ${swr}%`}
                    pnl={pnl}
                  />
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}

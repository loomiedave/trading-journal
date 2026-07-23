"use client";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

type EquityTrade = { date: string; result?: number | null };

export default function EquityCurve({ trades }: { trades: EquityTrade[] }) {
  const data = useMemo(() => {
    const sorted = [...trades]
      .filter((t) => t.result != null)
      .sort((a, b) => a.date.localeCompare(b.date));

    let running = 0;
    return sorted.map((t) => {
      running += t.result || 0;
      return { date: t.date, equity: running };
    });
  }, [trades]);

  const isPositive = data.length ? data[data.length - 1].equity >= 0 : true;

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg px-4 py-6 mb-4 text-center text-xs text-muted-foreground">
        Log trades with results to see your equity curve.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg px-4 pt-4 pb-2 mb-4">
      <div className="text-[15px] tracking-[0.15em] text-muted-foreground mb-2">
        EQUITY CURVE
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 6,
              fontSize: 11,
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            itemStyle={{ color: "hsl(var(--card-foreground))" }}
            formatter={(value) => [`$${Number(value ?? 0).toFixed(2)}`, "Equity"]}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
            strokeWidth={2}
            fill="url(#equityFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

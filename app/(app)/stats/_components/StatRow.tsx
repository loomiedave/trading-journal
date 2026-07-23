import { fmt, pnlColorClass } from "../_utils/statsCalculations";

export default function StatRow({
  label,
  pnl,
  sub,
}: {
  label: string;
  pnl: number;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between px-[14px] py-[10px] bg-card border border-border rounded-md mb-[6px]">
      <div>
        <div className="text-xs font-semibold text-card-foreground">{label}</div>
        {sub && (
          <div className="text-[14px] text-muted-foreground mt-[2px]">{sub}</div>
        )}
      </div>
      <span className={`text-xs font-semibold ${pnlColorClass(pnl)}`}>
        {fmt(pnl)}
      </span>
    </div>
  );
}

export default function StatCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg px-[14px] py-3">
      <div className="text-[15px] tracking-[0.15em] text-muted-foreground mb-1">
        {label}
      </div>
      <div className={`text-[22px] font-semibold leading-none ${colorClass || "text-card-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

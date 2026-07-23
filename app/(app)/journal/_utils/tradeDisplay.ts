import { Trade } from "@/types/type";

export const fmt = (v: number) =>
  v >= 0 ? `+$${v.toFixed(2)}` : `-$${Math.abs(v).toFixed(2)}`;

export const resultColorClass = (v: number) =>
  v > 0 ? "text-success" : v < 0 ? "text-destructive" : "text-warning";

const OUTCOME_TEXT_CLASS: Record<string, string> = {
  win: "text-success",
  loss: "text-destructive",
  be: "text-warning",
  missed: "text-muted-foreground",
};

const OUTCOME_STRIP_CLASS: Record<string, string> = {
  win: "bg-success",
  loss: "bg-destructive",
  be: "bg-warning",
  missed: "bg-muted",
};

export function outcomeColorClass(outcome: string) {
  return OUTCOME_TEXT_CLASS[outcome] ?? "text-muted-foreground";
}

export function stripColorClass(outcome: string) {
  return OUTCOME_STRIP_CLASS[outcome] ?? "bg-muted";
}

export function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function rSideLabel(trade: Trade): string | null {
  if (trade.outcome === "be") return "BE";
  if (trade.rr_achieved != null) {
    return `${trade.rr_achieved}R`;
  }
  return null;
}

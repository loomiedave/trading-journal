import { Trade } from "@/types/type";

export const PAIRS = [
  "EURUSD",
  "USDJPY",
  "XAU/USD",
  "NAS100",
  "USDCAD",
  "OTHER",
];

export const STRATEGIES = [
  "OB Retest",
  "FVG Fill",
  "Liquidity Sweep + Reversal",
  "BOS Continuation",
  "CHoCH Entry",
  "MSS + OB Combo",
  "Breaker Block",
  "Mitigation Block",
  "SIBI / BISI",
  "Premium / Discount Entry",
  "Other",
];

export const OUTCOMES = ["win", "loss", "be", "missed"];

export const OUTCOME_LABEL: Record<string, string> = {
  win: "WIN ✓",
  loss: "LOSS ✗",
  be: "BREAKEVEN ~",
  missed: "MISSED",
};

export const empty: Trade = {
  pair: "EURUSD",
  direction: "LONG",
  outcome: "win",
  strategy: "",
  risk: null,
  result: null,
  rr_planned: null,
  rr_achieved: null,
  notes: "",
  date: "",
};

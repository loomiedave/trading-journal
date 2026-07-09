import { Trade } from "@/types/type";

export const PAIRS = [
  // Majors
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "USDCHF",
  "USDCAD",
  "AUDUSD",
  "NZDUSD",

  // Minors / Crosses
  "EURGBP",
  "EURJPY",
  "GBPJPY",
  "EURAUD",
  "EURCHF",
  "AUDJPY",
  "GBPCAD",

  // Indices
  "NAS100",
  "US30",
  "SPX500",
  "GER40",
  "UK100",

  // Metals
  "XAU/USD",
  "XAG/USD",

  // Oil
  "USOIL",

  // Crypto
  "BTCUSD",
  "ETHUSD",
  "SOLUSD",
  "XRPUSD",
  "LTCUSD",

  "DXY",

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

export type ChecklistDefaultItem = {
  id: string;
  section: string;
  text: string;
  note: string;
};

export const DEFAULT_CHECKLIST: ChecklistDefaultItem[] = [
  {
    id: "b1",
    section: "1 — BIAS",
    text: "HTF structure confirmed",
    note: "4H clearly bullish or bearish",
  },
  {
    id: "b2",
    section: "1 — BIAS",
    text: "Last BOS/CHoCH identified",
    note: "Know which swing was broken and when",
  },
  {
    id: "b3",
    section: "1 — BIAS",
    text: "Key POI marked on 4H",
    note: "OB or FVG price is returning to",
  },
  {
    id: "e1",
    section: "2 — ENTRY",
    text: "15M CHoCH or MSS present",
    note: "Structural shift confirming bias on LTF",
  },
  {
    id: "e2",
    section: "2 — ENTRY",
    text: "Entry OB or FVG refined",
    note: "Specific candle/zone — not a vague area",
  },
  {
    id: "e3",
    section: "2 — ENTRY",
    text: "Liquidity swept before entry",
    note: "Stop hunt taken — reduces fakeout risk",
  },
  {
    id: "r1",
    section: "3 — RISK",
    text: "SL placed beyond structure",
    note: "Behind OB or last swing",
  },
  {
    id: "r2",
    section: "3 — RISK",
    text: "TP is a real target",
    note: "Opposing liquidity pool or HTF OB",
  },
  {
    id: "r3",
    section: "3 — RISK",
    text: "RR ≥ 1:2 confirmed",
    note: "If it doesn't math, skip it",
  },
  {
    id: "r4",
    section: "3 — RISK",
    text: "News check done",
    note: "No high-impact event in next 2h",
  },
  {
    id: "m1",
    section: "4 — MINDSET",
    text: "Not revenge trading",
    note: "Previous loss isn't the reason you're entering",
  },
  {
    id: "m2",
    section: "4 — MINDSET",
    text: "Not forcing a trade",
    note: "Setup came to you — you didn't hunt it",
  },
  {
    id: "m3",
    section: "4 — MINDSET",
    text: "Daily loss limit not near",
    note: "You have room to take this loss cleanly",
  },
];

export type RuleItem = {
  id: string;
  section: string;
  text: string;
  note: string | null;
};

export const DEFAULT_RULES: RuleItem[] = [
  {
    id: "r1",
    section: "NON-NEGOTIABLES",
    text: "4H gives the bias. 15M gives the entry. Never flip this.",
    note: null,
  },
  {
    id: "r2",
    section: "NON-NEGOTIABLES",
    text: "No entry without a confirmed LTF shift.",
    note: "HTF OB alone is not a trigger",
  },
  {
    id: "r3",
    section: "NON-NEGOTIABLES",
    text: "Size small until the framework is second nature.",
    note: null,
  },
  {
    id: "r4",
    section: "NON-NEGOTIABLES",
    text: "Log every missed trade. Skipping is also data.",
    note: null,
  },
  {
    id: "r5",
    section: "NON-NEGOTIABLES",
    text: "A 1:3 that gets skipped is worse than a 1:2 taken clean.",
    note: null,
  },
  {
    id: "r6",
    section: "PAIRS CONTEXT",
    text: "EURUSD",
    note: "Cleanest SMC structure. Main pair for building edge.",
  },
  {
    id: "r7",
    section: "PAIRS CONTEXT",
    text: "USDJPY",
    note: "Breakout-prone. Respect momentum once it runs.",
  },
  {
    id: "r8",
    section: "PAIRS CONTEXT",
    text: "XAU/USD",
    note: "High volatility. Account growth vehicle — tighter rules.",
  },
  {
    id: "r9",
    section: "PAIRS CONTEXT",
    text: "NAS100",
    note: "SMC works but session timing is critical (NY open).",
  },
  {
    id: "r10",
    section: "WHEN TO SKIP",
    text: "Price already deep in OB / at TP area",
    note: null,
  },
  {
    id: "r11",
    section: "WHEN TO SKIP",
    text: "High-impact news within 1 hour",
    note: null,
  },
  {
    id: "r12",
    section: "WHEN TO SKIP",
    text: "You've had 2 losses today",
    note: null,
  },
  {
    id: "r13",
    section: "WHEN TO SKIP",
    text: "You can't explain the trade in one sentence",
    note: null,
  },
];

export const SECTIONS = ["NON-NEGOTIABLES", "PAIRS CONTEXT", "WHEN TO SKIP"];

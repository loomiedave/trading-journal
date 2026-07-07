export type Trade = {
  id?: string;
  pair: string;
  direction: string;
  outcome: string;
  strategy?: string;
  risk?: number | null;
  result?: number | null;
  rr_planned?: number | null;
  rr_achieved?: number | null;
  notes?: string;
  screenshot_url?: string | null;
  date: string;
  created_at?: string;
};

export type statsTrade = {
  outcome: string;
  result?: number | null;
  pair: string;
  strategy?: string;
  date: string;
  rr_planned?: number | null;
  rr_achieved?: number | null;
};

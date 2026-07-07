import { createClient } from "@/lib/supabase/client";
import { Trade } from "@/types/type";

export async function fetchTrades() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchTrades error:", error);
    return [];
  }
  return data;
}

export async function insertTrade(form: Trade) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("No user found");
    return false;
  }

  const { error } = await supabase.from("trades").insert({
    user_id: user.id,
    date: form.date || new Date().toISOString().slice(0, 10),
    pair: form.pair,
    direction: form.direction,
    outcome: form.outcome,
    strategy: form.strategy || null,
    risk: form.risk || null,
    result: form.result || null,
    rr_planned: form.rr_planned || null,
    rr_achieved: form.rr_achieved || null,
    notes: form.notes || null,
    screenshot_url: form.screenshot_url || null,
  });

  if (error) {
    console.error("insertTrade error:", error);
    return false;
  }
  return true;
}

export async function updateTrade(id: string, form: Trade) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("No user found");
    return false;
  }

  const { error } = await supabase
    .from("trades")
    .update({
      pair: form.pair,
      direction: form.direction,
      outcome: form.outcome,
      strategy: form.strategy || null,
      risk: form.risk || null,
      result: form.result || null,
      rr_planned: form.rr_planned || null,
      rr_achieved: form.rr_achieved || null,
      notes: form.notes || null,
      date: form.date,
      screenshot_url: form.screenshot_url || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("updateTrade error:", error);
    return false;
  }
  return true;
}

export async function deleteTrade(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("trades").delete().eq("id", id);
  if (error) {
    console.error("deleteTrade error:", error);
    return false;
  }
  return true;
}

export function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export async function uploadScreenshot(file: File): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error } = await supabase.storage
    .from("trade-screenshots")
    .upload(filePath, file);

  if (error) {
    console.error("uploadScreenshot error:", error);
    return null;
  }
  return filePath;
}

export async function getSignedScreenshotUrl(
  path: string,
): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("trade-screenshots")
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error("getSignedScreenshotUrl error:", error);
    return null;
  }
  return data.signedUrl;
}

// app/(app)/rules/_actions/rules.ts
import { createClient } from "@/lib/supabase/client";

export type RuleOverride = {
  id: string;
  default_id: string | null; // null = user-added rule, not a default
  section: string;
  text: string;
  note: string | null;
  deleted: boolean;
};

export async function fetchRuleOverrides(): Promise<RuleOverride[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("rules")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("fetchRuleOverrides error:", error);
    return [];
  }
  return data || [];
}

export async function upsertRule(rule: {
  id: string;
  section: string;
  text: string;
  note: string | null;
  default_id: string | null;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase
    .from("rules")
    .upsert({ ...rule, user_id: user.id, deleted: false });
  if (error) {
    console.error("upsertRule error:", error);
    return false;
  }
  return true;
}

export async function deleteRule(id: string, isDefault: boolean) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  if (isDefault) {
    // mark as deleted via tombstone, don't actually delete a default row that doesn't exist yet
    const { error } = await supabase
      .from("rules")
      .upsert({
        id,
        user_id: user.id,
        deleted: true,
        section: "",
        text: "",
        note: null,
        default_id: id,
      });
    if (error) {
      console.error("deleteRule error:", error);
      return false;
    }
  } else {
    const { error } = await supabase
      .from("rules")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      console.error("deleteRule error:", error);
      return false;
    }
  }
  return true;
}

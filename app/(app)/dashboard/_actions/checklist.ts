import { createClient } from "@/lib/supabase/client";

export type ChecklistOverride = {
  id: string;
  default_id: string | null;
  section: string;
  text: string;
  note?: string | null;
  deleted: boolean;
};

export async function fetchChecklistOverrides(): Promise<ChecklistOverride[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("fetchChecklistOverrides error:", error);
    return [];
  }
  return data || [];
}

export async function upsertChecklistItem(item: {
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
    .from("checklist_items")
    .upsert({ ...item, user_id: user.id, deleted: false });

  if (error) {
    console.error("upsertChecklistItem error:", error);
    return false;
  }
  return true;
}

export async function deleteChecklistItem(id: string, isDefault: boolean) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  if (isDefault) {
    const { error } = await supabase.from("checklist_items").upsert({
      id,
      user_id: user.id,
      deleted: true,
      section: "",
      text: "",
      note: null,
      default_id: id,
    });
    if (error) {
      console.error("deleteChecklistItem error:", error);
      return false;
    }
  } else {
    const { error } = await supabase
      .from("checklist_items")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      console.error("deleteChecklistItem error:", error);
      return false;
    }
  }
  return true;
}

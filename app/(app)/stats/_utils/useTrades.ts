import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { statsTrade } from "@/types/type";

export function useTrades() {
  const [trades, setTrades] = useState<statsTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { data } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id);
    setTrades(data || []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    load();
  }, [load]);

  return { trades, loading };
}

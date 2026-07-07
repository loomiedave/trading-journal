import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function AuthRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");
  else redirect("/auth/login");

  // eslint-disable-next-line no-unreachable
  return null;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e1015] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#4f7cff] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthRedirect />
    </Suspense>
  );
}

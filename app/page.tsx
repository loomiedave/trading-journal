import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import OnboardingContent from "@/components/OnboardingContent";

async function AuthCheck() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <OnboardingContent signedIn={!!user} />;
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
      <AuthCheck />
    </Suspense>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="min-h-screen bg-[#0e1015] flex items-center justify-center font-mono px-4">
        <div className="bg-[#151820] border border-[#222630] rounded-xl px-7 py-8 w-full max-w-[360px]">
          <div className="text-[#4f7cff] text-[11px] tracking-[0.2em] mb-6">
            PRE-TRADE
          </div>
          <div className="text-[#e8ecf4] text-base font-semibold mb-1">
            New password
          </div>
          <div className="text-[#6b7280] text-[11px] mb-6">
            Enter your new password below
          </div>
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="password"
                className="text-[11px] text-[#6b7280] block mb-1"
              >
                NEW PASSWORD
              </label>
              <input
                id="password"
                type="password"
                placeholder="New password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-3 py-[10px] text-[13px] outline-none box-border"
              />
            </div>
            {error && <p className="text-[#e05252] text-xs">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4f7cff] border-none rounded-md text-white py-[11px] text-xs font-semibold cursor-pointer tracking-[0.1em] disabled:opacity-50 mt-1"
            >
              {isLoading ? "Saving..." : "SAVE NEW PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

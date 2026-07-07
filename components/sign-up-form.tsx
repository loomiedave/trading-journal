"use client";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;

      // Supabase returns an identities array — if empty, email already exists
      if (data?.user?.identities?.length === 0) {
        setError("An account with this email already exists.");
        setIsLoading(false);
        return;
      }
      router.push("/auth/sign-up-success");
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
            Create account
          </div>
          <div className="text-[#6b7280] text-[11px] mb-6">
            Sign up for a new account
          </div>
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="text-[11px] text-[#6b7280] block mb-1"
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-3 py-[10px] text-[13px] outline-none box-border"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-[11px] text-[#6b7280] block mb-1"
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-3 py-[10px] text-[13px] outline-none box-border"
              />
            </div>
            <div>
              <label
                htmlFor="repeat-password"
                className="text-[11px] text-[#6b7280] block mb-1"
              >
                REPEAT PASSWORD
              </label>
              <input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full bg-[#0e1015] border border-[#222630] rounded-md text-[#e8ecf4] px-3 py-[10px] text-[13px] outline-none box-border"
              />
            </div>
            {error && <p className="text-[#e05252] text-xs">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4f7cff] border-none rounded-md text-white py-[11px] text-xs font-semibold cursor-pointer tracking-[0.1em] disabled:opacity-50 mt-1"
            >
              {isLoading ? "Creating account..." : "CREATE ACCOUNT"}
            </button>
            <div className="text-center text-[11px] text-[#6b7280] mt-1">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#4f7cff] underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

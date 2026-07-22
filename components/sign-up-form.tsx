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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-xl px-7 py-8 w-full max-w-[360px]">
          <div className="text-primary text-[15px] tracking-[0.2em] mb-6">
            PRE-TRADER
          </div>
          <div className="text-card-foreground text-base font-semibold mb-1">
            Create account
          </div>
          <div className="text-muted-foreground text-[15px] mb-6">
            Sign up for a new account
          </div>
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="text-[15px] text-muted-foreground block mb-1"
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
                className="w-full bg-background border border-border rounded-md text-foreground px-3 py-[10px] text-[15px] outline-none box-border"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-[15px] text-muted-foreground block mb-1"
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-md text-foreground px-3 py-[10px] text-[15px] outline-none box-border"
              />
            </div>
            <div>
              <label
                htmlFor="repeat-password"
                className="text-[15px] text-muted-foreground block mb-1"
              >
                REPEAT PASSWORD
              </label>
              <input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-md text-foreground px-3 py-[10px] text-[15px] outline-none box-border"
              />
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary border-none rounded-md text-primary-foreground py-[11px] text-xs font-semibold cursor-pointer tracking-[0.1em] disabled:opacity-50 mt-1"
            >
              {isLoading ? "Creating account..." : "CREATE ACCOUNT"}
            </button>
            <div className="text-center text-[15px] text-muted-foreground mt-1">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary underline-offset-4 hover:underline"
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

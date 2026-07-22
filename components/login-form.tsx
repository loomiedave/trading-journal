"use client";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-xl px-7 py-8 w-full max-w-[360px]">
          <div className="text-primary text-[15px] tracking-[0.2em] mb-6">
            PRE-TRADER
          </div>
          <div className="text-card-foreground text-base font-semibold mb-1">
            Sign in
          </div>
          <div className="text-muted-foreground text-[15px] mb-6">
            Enter your credentials to continue
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="text-[15px] text-muted-foreground"
                >
                  PASSWORD
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[15px] text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-md text-foreground px-3 py-[10px] text-[15px] outline-none box-border"
              />
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary border-none rounded-md text-primary-foreground py-[11px] text-xs font-semibold cursor-pointer tracking-[0.1em] disabled:opacity-50 mt-1"
            >
              {isLoading ? "Signing in..." : "SIGN IN"}
            </button>
            <div className="text-center text-[15px] text-muted-foreground mt-1">
              No account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

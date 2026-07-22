import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-xl px-7 py-8 w-full max-w-[360px]">
        <div className="text-primary text-[15px] tracking-[0.2em] mb-6">
          PRE-TRADE
        </div>
        <div className="text-card-foreground text-base font-semibold mb-1">
          Account created
        </div>
        <div className="text-muted-foreground text-[15px] mb-6">
          Check your email to confirm
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed mb-6">
          You've successfully signed up. Please check your email to confirm your
          account before signing in.
        </p>
        <Link
          href="/auth/login"
          className="block w-full bg-primary rounded-md text-primary-foreground py-[11px] text-xs font-semibold tracking-[0.1em] text-center no-underline"
        >
          BACK TO LOGIN
        </Link>
      </div>
    </div>
  );
}

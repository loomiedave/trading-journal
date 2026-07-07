import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0e1015] flex items-center justify-center font-mono px-4">
      <div className="bg-[#151820] border border-[#222630] rounded-xl px-7 py-8 w-full max-w-[360px]">
        <div className="text-[#4f7cff] text-[11px] tracking-[0.2em] mb-6">
          PRE-TRADE
        </div>
        <div className="text-[#e8ecf4] text-base font-semibold mb-1">
          Account created
        </div>
        <div className="text-[#6b7280] text-[11px] mb-6">
          Check your email to confirm
        </div>
        <p className="text-[#6b7280] text-xs leading-relaxed mb-6">
          You've successfully signed up. Please check your email to confirm your
          account before signing in.
        </p>
        <Link
          href="/auth/login"
          className="block w-full bg-[#4f7cff] rounded-md text-white py-[11px] text-xs font-semibold tracking-[0.1em] text-center no-underline"
        >
          BACK TO LOGIN
        </Link>
      </div>
    </div>
  );
}

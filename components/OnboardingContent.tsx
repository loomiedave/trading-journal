"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OnboardingContent({ signedIn }: { signedIn: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#0e1015] min-h-screen flex flex-col items-center justify-center px-6">
      <span
        className="text-[#4f7cff] text-[15px] font-semibold tracking-[0.2em] mb-8 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-8px)",
        }}
      >
        PRE-TRADER
      </span>

      <h1
        className="text-[#e8ecf4] text-xl font-semibold mb-8 text-center transition-all duration-700 delay-150"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        {signedIn ? "Welcome back." : "Welcome."}
      </h1>

      <Link
        href={signedIn ? "/dashboard" : "/auth/login"}
        className="bg-[#4f7cff] text-white text-xs font-semibold tracking-[0.1em] px-8 py-3 rounded-md no-underline transition-all duration-700 delay-300 animate-pulse [animation-duration:5s] hover:animate-none"
        style={{
          opacity: visible ? 1 : 0,
        }}
      >
        {signedIn ? "LET'S GO" : "SIGN IN"}
      </Link>
    </div>
  );
}

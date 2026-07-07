"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/dashboard", label: "CHECKLIST" },
  { href: "/rules", label: "RULES" },
  { href: "/journal", label: "JOURNAL" },
  { href: "/stats", label: "STATS" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <div className="border-b border-[#222630] bg-[#0e1015] sticky top-0 z-50">
      <div className="px-5 pt-[18px] pb-[10px] flex justify-between items-center">
        <span className="text-[#4f7cff] text-[11px] font-semibold tracking-[0.2em] font-mono">
          PRE-TRADER
        </span>

        {/* Desktop links */}
        <div className="hidden sm:flex gap-4 items-center">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[0.1em] no-underline font-mono"
              style={{
                color: pathname === link.href ? "#e8ecf4" : "#6b7280",
              }}
            >
              {link.label}
            </Link>
          ))}
          <span
            onClick={signOut}
            className="text-[#6b7280] text-[10px] tracking-[0.1em] cursor-pointer font-mono"
          >
            SIGN OUT
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden flex flex-col gap-[4px] bg-transparent border-none cursor-pointer p-1"
          aria-label="Menu"
        >
          <span
            className="block w-5 h-[1.5px] bg-[#6b7280] transition-transform"
            style={{
              transform: open ? "translateY(5.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-5 h-[1.5px] bg-[#6b7280] transition-opacity"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-5 h-[1.5px] bg-[#6b7280] transition-transform"
            style={{
              transform: open ? "translateY(-5.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="sm:hidden flex flex-col border-t border-[#222630] px-5 py-3 gap-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[11px] tracking-[0.1em] no-underline font-mono"
              style={{
                color: pathname === link.href ? "#e8ecf4" : "#6b7280",
              }}
            >
              {link.label}
            </Link>
          ))}
          <span
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="text-[#6b7280] text-[11px] tracking-[0.1em] cursor-pointer font-mono"
          >
            SIGN OUT
          </span>
        </div>
      )}
    </div>
  );
}

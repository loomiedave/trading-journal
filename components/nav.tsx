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
    <>
      {/* ===== Desktop / tablet: original inline nav bar ===== */}
      <div className="hidden sm:flex px-5 pt-[18px] pb-[10px] border-b border-[#222630] justify-between items-center bg-[#0e1015] sticky top-0 z-50">
        <span className="text-[#4f7cff] text-[11px] font-semibold tracking-[0.2em] font-mono">
          PRE-TRADER
        </span>
        <div className="flex gap-4 items-center">
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
      </div>

      {/* ===== Mobile: brand top-left + floating dropdown top-right ===== */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <span className="text-[#4f7cff] text-[11px] font-semibold tracking-[0.2em] font-mono bg-[#0e1015]/80 backdrop-blur px-2 py-1 rounded-md">
          PRE-TRADER
        </span>
      </div>

      <div className="sm:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#151820] border border-[#222630] rounded-md w-10 h-10 flex flex-col items-center justify-center gap-[3px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer"
          aria-label="Menu"
        >
          <span
            className="block w-4 h-[1.5px] bg-[#c9cdd6] transition-transform"
            style={{
              transform: open ? "translateY(4.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-4 h-[1.5px] bg-[#c9cdd6] transition-opacity"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-4 h-[1.5px] bg-[#c9cdd6] transition-transform"
            style={{
              transform: open ? "translateY(-4.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>

        {open && (
          <div className="absolute top-[50px] right-0 bg-[#151820] border border-[#222630] rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] px-4 py-3 min-w-[150px] flex flex-col gap-3">
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
            <div className="border-t border-[#222630] pt-3 mt-1">
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
          </div>
        )}

        {open && (
          <div onClick={() => setOpen(false)} className="fixed inset-0 -z-10" />
        )}
      </div>

      {/* Spacer so fixed mobile elements don't overlap page content */}
      <div className="sm:hidden h-16" />
    </>
  );
}

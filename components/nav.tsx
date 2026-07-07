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
    <div className="fixed top-4 right-4 z-50">
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#151820] border border-[#222630] rounded-full w-10 h-10 flex flex-col items-center justify-center gap-[3px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer"
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

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-[50px] right-0 bg-[#151820] border border-[#222630] rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] px-4 py-3 min-w-[150px] flex flex-col gap-3">
          <span className="text-[#4f7cff] text-[10px] font-semibold tracking-[0.2em] font-mono mb-1">
            PRE-TRADER
          </span>
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

      {/* Click-outside overlay to close */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 -z-10"
        />
      )}
    </div>
  );
}

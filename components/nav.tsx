"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/dashboard", label: "CHECKLIST" },
  { href: "/rules", label: "RULES" },
  { href: "/journal", label: "JOURNAL" },
  { href: "/stats", label: "STATS" },
];

const SWIPE_THRESHOLD = 60; // min horizontal px to count as a swipe
const SWIPE_RATIO = 1.5; // horizontal must dominate vertical by this much

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const activeIndex = Math.max(
    0,
    LINKS.findIndex((link) => link.href === pathname)
  );

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  // ===== Swipe-to-switch-tab gesture (mobile only, anywhere on screen) =====
  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    }

    function onTouchEnd(e: TouchEvent) {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;

      const currentIndex = Math.max(
        0,
        LINKS.findIndex((link) => link.href === pathname)
      );

      if (dx < 0 && currentIndex < LINKS.length - 1) {
        // swipe left -> next tab
        router.push(LINKS[currentIndex + 1].href);
      } else if (dx > 0 && currentIndex > 0) {
        // swipe right -> previous tab
        router.push(LINKS[currentIndex - 1].href);
      }
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pathname, router]);

  return (
    <>
      {/* ===== Desktop / tablet: original inline nav bar ===== */}
      <div className="hidden sm:flex px-5 pt-[18px] pb-[10px] border-b border-border justify-between items-center bg-background sticky top-0 z-50">
        <span className="text-primary text-[15px] font-semibold tracking-[0.2em]">
          PRE-TRADER
        </span>
        <div className="flex gap-4 items-center">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[14px] tracking-[0.1em] no-underline ${
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span
            onClick={signOut}
            className="text-muted-foreground text-[14px] tracking-[0.1em] cursor-pointer"
          >
            SIGN OUT
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* ===== Mobile: fixed header (brand + sign out) ===== */}
      <div
        className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="flex justify-between items-center px-4 h-12">
          <span className="text-primary text-[15px] font-semibold tracking-[0.2em]">
            PRE-TRADER
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="text-muted-foreground text-[15px] tracking-[0.1em] border border-border rounded-md px-2 py-1"
            >
              SIGN OUT
            </button>
          </div>
        </div>

        {/* ===== Swipeable full-width tab bar ===== */}
        <div className="relative grid grid-cols-4">
          {LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="no-underline text-center py-3"
            >
              <span
                className={`text-[14px] tracking-[0.1em] ${
                  i === activeIndex ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}

          {/* sliding active indicator */}
          <div
            className="absolute bottom-0 h-[2px] bg-primary transition-transform duration-300 ease-out"
            style={{
              width: `${100 / LINKS.length}%`,
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          />
        </div>
      </div>

      {/* Spacer so fixed mobile header + tab bar don't overlap page content */}
      <div
        className="sm:hidden"
        style={{
          height: "calc(env(safe-area-inset-top, 0px) + 3rem + 2.75rem)",
        }}
      />
    </>
  );
}

// components/theme-color-updater.tsx
"use client";
import { useEffect } from "react";
import { useTheme } from "next-themes";

const LIGHT = "#f7f9fd";
const DARK = "#131722";

export function ThemeColorUpdater() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme === "dark" ? DARK : LIGHT;

    document.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.remove());

    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("content", color);
    document.head.appendChild(meta);
  }, [resolvedTheme]);

  return null;
}

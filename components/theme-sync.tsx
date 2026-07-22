"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // 1. Target or create the theme-color meta tag
    let metaTag = document.querySelector('meta[name="theme-color"]');

    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "theme-color");
      document.head.appendChild(metaTag);
    }

    // 2. Set the exact color matching your resolved theme
    const themeColor = resolvedTheme === "dark" ? "#131722" : "#f7f9fd";
    metaTag.setAttribute("content", themeColor);
  }, [resolvedTheme]);

  return null;
}

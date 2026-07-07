"use client";
import { useEffect, useState } from "react";

export default function PageLoader() {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d % 3) + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0e1015] min-h-screen flex items-center justify-center">
      <div className="font-mono text-xs text-[#6b7280] w-[70px]">
        Loading{".".repeat(dots)}
      </div>
    </div>
  );
}

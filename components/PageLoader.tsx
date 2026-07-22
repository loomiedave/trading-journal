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
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className=" text-xs text-foreground w-[70px]">
        Loading{".".repeat(dots)}
      </div>
    </div>
  );
}

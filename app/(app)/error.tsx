"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-[#0e1015] min-h-screen flex flex-col items-center justify-center gap-3 text-[#6b7280] font-mono text-xs px-6 text-center">
      <div>Something went wrong. Check your connection and try again.</div>
      <button onClick={reset} className="text-[#4f7cff] underline">
        Retry
      </button>
    </div>
  );
}

"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center gap-3 text-muted-foreground text-xs px-6 text-center">
      <div>Something went wrong. Check your connection and try again.</div>
      <button onClick={reset} className="text-primary underline">
        Retry
      </button>
    </div>
  );
}

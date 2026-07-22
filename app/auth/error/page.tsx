import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;
  return (
    <p className="text-[#6b7280] text-xs leading-relaxed">
      {params?.error
        ? `Error: ${params.error}`
        : "An unspecified error occurred."}
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="min-h-screen bg-[#0e1015] flex items-center justify-center px-4">
      <div className="bg-[#151820] border border-[#222630] rounded-xl px-7 py-8 w-full max-w-[360px]">
        <div className="text-[#4f7cff] text-[15px] tracking-[0.2em] mb-6">
          PRE-TRADE
        </div>
        <div className="text-[#e8ecf4] text-base font-semibold mb-1">
          Something went wrong
        </div>
        <div className="text-[#6b7280] text-[15px] mb-6">Auth error</div>
        <Suspense>
          <ErrorContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

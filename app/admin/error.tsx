"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin page error:", error);
  }, [error]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Admin change could not finish</h2>
        <p className="text-slate-600 mb-6">
          {/unexpected response|failed to fetch|network/i.test(error.message)
            ? "The dashboard lost the connection while saving. Go back and try the same change again."
            : error.message || "The dashboard request failed."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg"
          >
            Try Again
          </button>
          <Link
            href="/admin"
            className="border border-slate-300 text-slate-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-slate-50"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

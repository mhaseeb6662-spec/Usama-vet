"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Page Temporarily Unavailable</h2>
            <p className="text-slate-500 mb-6">
              We&apos;re experiencing a brief connection issue. Please try again in a moment.
            </p>
            <button
              onClick={() => reset()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

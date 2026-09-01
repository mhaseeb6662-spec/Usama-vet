import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Page not found</h1>
        <p className="text-slate-500 mb-6">
          This page does not exist. Cart and account checkout are not available yet.
        </p>
        <Link
          href="/"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

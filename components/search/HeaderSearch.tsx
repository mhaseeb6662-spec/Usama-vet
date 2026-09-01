"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

type SearchHit = {
  slug: string;
  name: string;
  images: string[];
};

export default function HeaderSearch({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setHits([]);
      setError("");
      return;
    }

    const timer = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(term)}`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.message || "Search failed.");
          }
          setHits(data.data);
          setOpen(true);
          setError("");
        })
        .catch((err) => {
          console.error(err);
          setHits([]);
          setError(err instanceof Error ? err.message : "Search failed.");
        });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  const goSearch = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (term.length < 2) {
      setError("Enter at least 2 characters to search.");
      return;
    }
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const inputClass =
    variant === "desktop"
      ? "w-full bg-transparent text-[14px] text-slate-850 outline-none placeholder:text-slate-400 focus:outline-none"
      : "w-full bg-transparent text-xs text-slate-800 outline-none focus:outline-none";

  return (
    <form action="/search" method="get" onSubmit={goSearch} className="w-full relative">
      <div className={variant === "desktop"
        ? "w-full flex items-center bg-slate-100/70 border border-slate-200 rounded-full pl-5 pr-2 py-1.5 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:shadow-sm transition-all duration-200"
        : "flex bg-slate-100/70 border border-slate-200 rounded-full pl-3 pr-1 py-1 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:shadow-sm transition-all duration-200"
      }>
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hits.length > 0 && setOpen(true)}
          placeholder={variant === "desktop" ? "What Are You Looking For..." : "What Are You Looking For"}
          aria-label="Search products"
          className={inputClass}
        />
        <button
          type="submit"
          className={variant === "desktop"
            ? "w-10 h-10 rounded-full bg-[#009473] hover:bg-[#028467] text-white flex items-center justify-center shrink-0"
            : "w-7 h-7 rounded-full bg-[#009473] text-white flex items-center justify-center shrink-0"
          }
          aria-label="Search"
        >
          <Search className={variant === "desktop" ? "w-5 h-5" : "w-3.5 h-3.5"} />
        </button>
      </div>
      {error ? <p className="absolute left-0 top-full mt-1 text-xs text-rose-600">{error}</p> : null}
      {open && hits.length > 0 ? (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {hits.map((hit) => (
            <Link
              key={hit.slug}
              href={`/products/${hit.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                {hit.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hit.images[0]} alt={hit.name} className="w-full h-full object-contain" />
                ) : null}
              </div>
              <span className="text-sm font-medium text-slate-800 truncate">{hit.name}</span>
            </Link>
          ))}
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-sm font-semibold text-emerald-700 border-t border-slate-100"
          >
            See all results
          </button>
        </div>
      ) : null}
    </form>
  );
}

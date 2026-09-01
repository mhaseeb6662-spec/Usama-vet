"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { safeAccountNext } from "@/lib/accountRedirect";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeAccountNext(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log you in.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 text-center">Login</h1>
      <p className="text-sm text-slate-500 text-center">You can also order without an account from checkout.</p>
      {error ? <p className="text-rose-600 text-sm">{error}</p> : null}
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Email</span>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="you@example.com" />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-slate-700">Password</span>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
      </label>
      <button type="submit" disabled={loading} className="w-full bg-[#009473] hover:bg-[#028467] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg">
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="text-sm text-center text-slate-600">
        New here? <Link href={`/account/register?next=${encodeURIComponent(next)}`} className="text-emerald-700 font-semibold">Create an account</Link>
      </p>
    </form>
  );
}

"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { safeAccountNext } from "@/lib/accountRedirect";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeAccountNext(searchParams.get("next"));
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Could not create your account.");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 text-center">Create Account</h1>
      <p className="text-sm text-slate-500 text-center">You can still checkout as a guest if you do not want an account.</p>
      {error ? <p className="text-rose-600 text-sm">{error}</p> : null}
      {[
        ["name", "Full Name", "text", "Ahmed Khan"],
        ["email", "Email", "email", "you@example.com"],
        ["phone", "Mobile Number", "tel", "03001234567"],
        ["password", "Password", "password", ""],
        ["confirmPassword", "Confirm Password", "password", ""],
      ].map(([name, label, type, placeholder]) => (
        <label key={name} className="block text-sm">
          <span className="font-medium text-slate-700">{label}</span>
          <input
            type={type}
            required
            value={form[name as keyof typeof form]}
            onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-3 text-base outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={placeholder}
          />
        </label>
      ))}
      <button type="submit" disabled={loading} className="w-full min-h-12 bg-[#009473] hover:bg-[#028467] disabled:opacity-50 text-white font-semibold py-3 rounded-lg">
        {loading ? "Creating account..." : "Register"}
      </button>
      <p className="text-sm text-center text-slate-600">
        Already have an account? <Link href={`/account/login?next=${encodeURIComponent(next)}`} className="text-emerald-700 font-semibold">Login</Link>
      </p>
    </form>
  );
}

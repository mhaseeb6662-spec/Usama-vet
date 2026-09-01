"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogout = async () => {
    setError("");
    setLoading(true);
    const res = await fetch("/api/account/logout", { method: "POST" });
    if (!res.ok) {
      setLoading(false);
      setError("Could not log out. Please try again.");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={() => {
          void onLogout();
        }}
        disabled={loading}
        className="text-sm font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
      {error ? <p className="text-xs text-rose-600 mt-1">{error}</p> : null}
    </div>
  );
}

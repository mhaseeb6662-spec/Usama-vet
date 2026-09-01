"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b", marginBottom: "0.75rem" }}>
              Something went wrong
            </h2>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              We&apos;re experiencing a brief issue. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{ backgroundColor: "#009473", color: "white", fontWeight: "600", padding: "0.75rem 2rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontSize: "1rem" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

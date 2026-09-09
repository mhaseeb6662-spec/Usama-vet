"use client";

import React, { useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";

interface PaymentProofUploaderProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export default function PaymentProofUploader({ value, onChange, error }: PaymentProofUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/payment-proof", {
        method: "POST",
        body: formData,
      });
      let data: { url?: string; error?: string };
      try {
        data = await res.json();
      } catch (cause) {
        throw new Error("Upload failed. The server did not return a valid response.", { cause });
      }
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload payment screenshot.");
      }
      onChange(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Payment screenshot" className="object-contain w-full h-full" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove payment screenshot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-xs aspect-video border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-3 text-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
            )}
            <p className="mb-1 text-sm text-slate-600 font-semibold">
              {uploading ? "Uploading..." : "Upload payment screenshot"}
            </p>
            <p className="text-xs text-slate-400">PNG, JPG or WEBP</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}
      {(uploadError || error) && <p className="text-rose-600 text-xs">{uploadError || error}</p>}
    </div>
  );
}

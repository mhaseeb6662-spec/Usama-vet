"use client";

import React, { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  name: string; // The name of the hidden input
  defaultImage?: string;
}

export default function ImageUploader({ name, defaultImage }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload");
      }

      const data = await res.json();
      setImageUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input type="hidden" name={name} value={imageUrl} />
      
      {imageUrl ? (
        <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Uploaded" className="object-cover w-full h-full" />
          <button 
            type="button" 
            onClick={() => setImageUrl("")}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-xs aspect-video border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
            )}
            <p className="mb-2 text-sm text-slate-500 font-semibold">
              {isUploading ? "Uploading..." : "Click to upload"}
            </p>
            <p className="text-xs text-slate-400">PNG, JPG or WEBP</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
        </label>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

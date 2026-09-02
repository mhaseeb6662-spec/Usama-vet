"use client";

import React, { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface VideoUploaderProps {
  name: string;
  defaultVideo?: string;
}

export default function VideoUploader({ name, defaultVideo }: VideoUploaderProps) {
  const [videoUrl, setVideoUrl] = useState<string>(defaultVideo || "");
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
      const res = await fetch("/api/admin/upload-video", {
        method: "POST",
        body: formData,
      });
      let data: { url?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error("Upload failed. The server did not return a valid response.");
      }
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload video.");
      }
      setVideoUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input type="hidden" name={name} value={videoUrl} />

      {videoUrl ? (
        <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
          <video src={videoUrl} className="object-cover w-full h-full" controls muted />
          <button
            type="button"
            onClick={() => setVideoUrl("")}
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
              {isUploading ? "Uploading..." : "Click to upload video"}
            </p>
            <p className="text-xs text-slate-400">MP4, WEBM or MOV, under 40 MB</p>
          </div>
          <input type="file" className="hidden" accept="video/mp4,video/webm,video/quicktime" onChange={handleFileChange} disabled={isUploading} />
        </label>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface VideoUploaderProps {
  name: string;
  defaultVideo?: string;
}

export default function VideoUploader({ name, defaultVideo }: VideoUploaderProps) {
  const [videoUrl, setVideoUrl] = useState<string>(defaultVideo || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onSubmit = (event: Event) => {
      if (isUploading) {
        event.preventDefault();
        alert("Please wait for the video upload to complete before saving.");
      }
    };
    form.addEventListener("submit", onSubmit);
    return () => form.removeEventListener("submit", onSubmit);
  }, [isUploading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload-video");

    xhr.upload.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          setVideoUrl(data.url);
        } else {
          setError(data.error || "Failed to upload video.");
        }
      } catch {
        setError("Upload failed. The server did not return a valid response.");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setError("Network error occurred during video upload.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    xhr.send(formData);
  };

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

  return (
    <div className="w-full" ref={rootRef}>
      <input type="hidden" name={name} value={videoUrl} />

      {videoUrl ? (
        <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
          {isYouTube ? (
            <iframe src={videoUrl} className="w-full h-full" allowFullScreen />
          ) : (
            <video src={videoUrl} className="w-full h-full object-contain" controls preload="metadata" />
          )}
          <button
            type="button"
            onClick={() => setVideoUrl("")}
            title="Remove video"
            className="absolute top-2 right-2 bg-red-600/90 text-white p-1.5 rounded-full hover:bg-red-700 shadow transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-md aspect-video border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden">
          <div className="flex flex-col items-center justify-center p-5 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center w-full px-6">
                <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Uploading video... {uploadProgress}%
                </p>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="w-9 h-9 text-slate-400 mb-3" />
                <p className="mb-1 text-sm text-slate-700 font-semibold">
                  Click to select video from your laptop
                </p>
                <p className="text-xs text-slate-400">MP4, WEBM or MOV (Max 50 MB)</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            form="uv-file-upload-ignore"
            className="hidden"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

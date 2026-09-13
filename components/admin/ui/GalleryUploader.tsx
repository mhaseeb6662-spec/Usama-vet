"use client";

import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { MAX_PRODUCT_GALLERY_IMAGES } from "@/lib/constants/products";

interface GalleryUploaderProps {
  name: string; // The name shared by every hidden input
  defaultImages?: string[];
  maxImages?: number;
}

export default function GalleryUploader({
  name,
  defaultImages,
  maxImages = MAX_PRODUCT_GALLERY_IMAGES,
}: GalleryUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(defaultImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) {
      return;
    }
    const onSubmit = (event: Event) => {
      if (isUploading) {
        event.preventDefault();
      }
    };
    form.addEventListener("submit", onSubmit);
    return () => form.removeEventListener("submit", onSubmit);
  }, [isUploading]);

  const uploadOne = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
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
      throw new Error(data.error || "Failed to upload image.");
    }
    return data.url;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    const freeSlots = maxImages - imageUrls.length;
    if (freeSlots <= 0) {
      setError(`You can add up to ${maxImages} gallery images.`);
      return;
    }

    setIsUploading(true);
    setError("");

    const skipped = files.length - freeSlots;
    try {
      for (const file of files.slice(0, freeSlots)) {
        const url = await uploadOne(file);
        setImageUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
      }
      if (skipped > 0) {
        setError(`Only ${freeSlots} image(s) were added. Limit is ${maxImages} gallery images.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((value) => value !== url));
  };

  return (
    <div className="w-full" ref={rootRef}>
      {imageUrls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {imageUrls.map((url, index) => (
          <div
            key={url}
            className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Gallery image ${index + 1}`} className="object-cover w-full h-full" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
              aria-label={`Remove gallery image ${index + 1}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {imageUrls.length < maxImages && (
          <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors text-center px-2">
            {isUploading ? (
              <Loader2 className="w-7 h-7 text-emerald-500 animate-spin mb-2" />
            ) : (
              <UploadCloud className="w-7 h-7 text-slate-400 mb-2" />
            )}
            <span className="text-xs text-slate-500 font-semibold">
              {isUploading ? "Uploading..." : "Add images"}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              {imageUrls.length}/{maxImages}
            </span>
            <input
              type="file"
              form="uv-file-upload-ignore"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

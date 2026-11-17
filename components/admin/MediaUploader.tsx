"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import type { MediaRef } from "@/lib/types";
import { videoPosterUrl } from "@/lib/media";
import { getUploadSignature } from "@/app/admin/upload-actions";
import { secondaryButtonClass } from "./styles";

// Cloudinary free plan limits per file.
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

type Folder = "products" | "portfolio" | "hero" | "testimonials" | "site";

type CloudinaryResponse = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  width?: number;
  height?: number;
  error?: { message: string };
};

/** Upload one file straight from the browser to Cloudinary. */
function uploadFile(file: File, folder: Folder, onProgress: (pct: number) => void) {
  return getUploadSignature(folder).then(
    (sig) =>
      new Promise<MediaRef>((resolve, reject) => {
        const body = new FormData();
        body.append("file", file);
        body.append("api_key", sig.apiKey);
        body.append("timestamp", String(sig.timestamp));
        body.append("signature", sig.signature);
        body.append("folder", sig.folder);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`);
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
        xhr.onerror = () => reject(new Error("Upload failed. Check your internet connection."));
        xhr.onload = () => {
          let res: CloudinaryResponse;
          try {
            res = JSON.parse(xhr.responseText);
          } catch {
            return reject(new Error("Unexpected reply from Cloudinary."));
          }
          if (xhr.status >= 300 || res.error) return reject(new Error(res.error?.message ?? "Upload failed."));
          const kind = res.resource_type === "video" ? "video" : "image";
          resolve({
            kind,
            publicId: res.public_id,
            url: res.secure_url,
            width: res.width ?? null,
            height: res.height ?? null,
            posterUrl: kind === "video" ? videoPosterUrl(res.secure_url) : null,
          });
        };
        xhr.send(body);
      }),
  );
}

/**
 * File picker that uploads to Cloudinary and reports each finished file.
 * Files go straight to Cloudinary, so large videos never pass through the website server.
 */
export function MediaUploader({
  folder,
  onUploaded,
  accept = "image/*,video/*",
  multiple = false,
  label = "Upload",
}: {
  folder: Folder;
  onUploaded: (media: MediaRef) => void | Promise<void>;
  accept?: string;
  multiple?: boolean;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    const list = [...files];
    try {
      for (const [i, file] of list.entries()) {
        const isVideo = file.type.startsWith("video/");
        if (!isVideo && !file.type.startsWith("image/")) throw new Error(`${file.name} is not a photo or video.`);
        const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
        if (file.size > limit) {
          throw new Error(`${file.name} is too large (max ${limit / 1024 / 1024} MB for ${isVideo ? "videos" : "photos"}).`);
        }
        const prefix = list.length > 1 ? `File ${i + 1} of ${list.length}: ` : "";
        const media = await uploadFile(file, folder, (pct) => setStatus(`${prefix}uploading ${pct}%`));
        setStatus(`${prefix}saving...`);
        await onUploaded(media);
      }
      setStatus(list.length > 1 ? `${list.length} files uploaded.` : "Uploaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setStatus(null);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handle(e.target.files)}
        disabled={busy}
        tabIndex={-1}
      />
      <button type="button" className={secondaryButtonClass} disabled={busy} onClick={() => input.current?.click()}>
        <Upload size={16} />
        {busy ? "Uploading..." : label}
      </button>
      {status && <p className="mt-2 text-xs text-(--text-muted)">{status}</p>}
      {error && (
        <p role="alert" className="mt-2 text-xs text-[#a5432f]">
          {error}
        </p>
      )}
    </div>
  );
}

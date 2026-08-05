"use client";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type MediaUploadProps = {
  label: string;
  accept: "image/*" | "video/*" | "audio/*";
  currentUrl?: string | null;
  onUploaded: (publicUrl: string) => void;
  folder?: string; // e.g. "images" | "videos" | "screenshots" | "audio"
};

export default function MediaUpload({
  label,
  accept,
  currentUrl,
  onUploaded,
  folder = "misc",
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    setProgressText("Uploading...");

    try {
      const ext = file.name.split(".").pop();
      const safeName = `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-media")
        .upload(safeName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from("product-media")
        .getPublicUrl(safeName);

      setPreview(data.publicUrl);
      onUploaded(data.publicUrl);
      setProgressText("Uploaded ✓");
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="media-upload">
      <label className="media-label">{label}</label>

      <div
        className="media-dropzone"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          accept === "video/*" ? (
            <video src={preview} className="media-preview" muted loop autoPlay playsInline />
          ) : accept === "audio/*" ? (
            <audio src={preview} controls className="media-audio-preview" />
          ) : (
            <img src={preview} className="media-preview" alt="preview" />
          )
        ) : (
          <span className="media-placeholder">
            {uploading ? progressText : `Click to upload ${label.toLowerCase()}`}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="media-input-hidden"
      />

      {error && <p className="media-error">{error}</p>}

      <style jsx>{`
        .media-upload {
          margin-bottom: 16px;
        }
        .media-label {
          display: block;
          color: #cfcfcf;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .media-dropzone {
          position: relative;
          height: 140px;
          border: 1px dashed #333;
          border-radius: 10px;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .media-dropzone:hover {
          border-color: #e0303f;
        }
        .media-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .media-audio-preview {
          width: 90%;
        }
        .media-placeholder {
          color: #666;
          font-size: 13px;
          text-align: center;
          padding: 0 16px;
        }
        .media-input-hidden {
          display: none;
        }
        .media-error {
          color: #e0303f;
          font-size: 12px;
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
}

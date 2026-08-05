"use client";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type PreviewType = "image" | "video" | "audio";

type ProductPreviewUploadProps = {
  currentUrl?: string | null;
  currentType?: PreviewType | null;
  onUploaded: (url: string, type: PreviewType) => void;
};

function detectType(file: File): PreviewType | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return null;
}

/**
 * Single dropzone for the product's PUBLIC preview media.
 * Accepts any image, video, or audio file — auto-detects the type and
 * uploads to the public "product-preview" bucket. No size cap is
 * enforced here beyond Supabase's own project limits; raise those in
 * Supabase Dashboard > Storage > Settings if you need larger uploads.
 *
 * This is NOT the real deliverable file — that goes through
 * ProductFileUpload.tsx into the PRIVATE "product-files" bucket.
 */
export default function ProductPreviewUpload({
  currentUrl,
  currentType,
  onUploaded,
}: ProductPreviewUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [type, setType] = useState<PreviewType | null>(currentType ?? null);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    const detected = detectType(file);
    if (!detected) {
      setError("Only image, video, or audio files are supported for preview.");
      return;
    }

    setUploading(true);
    setProgress("Uploading 0%...");

    try {
      const ext = file.name.split(".").pop();
      const path = `${detected}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-preview")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from("product-preview").getPublicUrl(path);

      setPreview(data.publicUrl);
      setType(detected);
      onUploaded(data.publicUrl, detected);
      setProgress("Uploaded ✓");
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

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="ppu-wrap">
      <label className="ppu-label">🖼️ Product Preview (Image / Video / Audio)</label>

      <div
        className="ppu-dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {preview ? (
          type === "video" ? (
            <video src={preview} className="ppu-media" muted loop autoPlay playsInline />
          ) : type === "audio" ? (
            <div className="ppu-audio-box">
              <span className="ppu-audio-icon">🎵</span>
              <audio src={preview} controls className="ppu-audio" />
            </div>
          ) : (
            <img src={preview} className="ppu-media" alt="preview" />
          )
        ) : (
          <div className="ppu-empty">
            <span className="ppu-empty-icon">📤</span>
            <span className="ppu-empty-title">
              {uploading ? progress : "Click or drop any file here"}
            </span>
            <span className="ppu-empty-sub">Image, Video, or Audio — any size</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        onChange={onChange}
        className="ppu-hidden-input"
      />

      {error && <p className="ppu-error">{error}</p>}

      <style jsx>{`
        .ppu-wrap {
          margin-bottom: 20px;
        }
        .ppu-label {
          display: block;
          color: #fafafa;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .ppu-dropzone {
          position: relative;
          min-height: 220px;
          border: 2px dashed #e0303f;
          border-radius: 14px;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .ppu-dropzone:hover {
          background: #131313;
        }
        .ppu-media {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }
        .ppu-audio-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
        }
        .ppu-audio-icon {
          font-size: 32px;
        }
        .ppu-audio {
          width: 260px;
        }
        .ppu-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 24px;
        }
        .ppu-empty-icon {
          font-size: 30px;
        }
        .ppu-empty-title {
          color: #e0303f;
          font-weight: 700;
          font-size: 14px;
        }
        .ppu-empty-sub {
          color: #777;
          font-size: 12px;
        }
        .ppu-hidden-input {
          display: none;
        }
        .ppu-error {
          color: #e0303f;
          font-size: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}

"use client";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProductFileUploadProps = {
  currentFileName?: string | null;
  onUploaded: (filePath: string, fileName: string) => void;
};

/**
 * Uploads the REAL deliverable file (the thing customers actually pay for)
 * DIRECTLY to the private "product-files" Supabase bucket, using a
 * short-lived signed upload URL issued by /api/upload-file. This avoids
 * routing large files through the Next.js server, so any file size your
 * Supabase plan allows will work (check Dashboard > Storage > Settings).
 */
export default function ProductFileUpload({
  currentFileName,
  onUploaded,
}: ProductFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [fileName, setFileName] = useState<string | null>(currentFileName ?? null);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    setProgressText("Preparing upload...");

    try {
      // Step 1: ask our server for a signed upload URL (uses service role key)
      const res = await fetch("/api/upload-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not start upload");
        setUploading(false);
        return;
      }

      // Step 2: upload the file directly to Supabase Storage
      setProgressText("Uploading file...");
      const { error: uploadError } = await supabase.storage
        .from("product-files")
        .uploadToSignedUrl(data.path, data.token, file);

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      setFileName(file.name);
      onUploaded(data.path, file.name);
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
    <div className="pfu-wrap">
      <label className="pfu-label">📦 Product File (the real deliverable — private)</label>
      <div className="pfu-dropzone" onClick={() => inputRef.current?.click()}>
        {fileName ? (
          <span className="pfu-filename">✓ {fileName}</span>
        ) : (
          <span className="pfu-placeholder">
            {uploading ? progressText : "Click to upload file (ZIP, MP4, PSD, AI, anything — any size)"}
          </span>
        )}
      </div>
      <input ref={inputRef} type="file" onChange={onChange} className="pfu-hidden-input" />
      {error && <p className="pfu-error">{error}</p>}

      <style jsx>{`
        .pfu-wrap {
          margin-bottom: 20px;
        }
        .pfu-label {
          display: block;
          color: #fafafa;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .pfu-dropzone {
          border: 1px dashed #333;
          border-radius: 10px;
          background: #0f0f0f;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .pfu-dropzone:hover {
          border-color: #e0303f;
        }
        .pfu-filename {
          color: #7ee787;
          font-size: 13px;
          font-weight: 600;
        }
        .pfu-placeholder {
          color: #666;
          font-size: 13px;
        }
        .pfu-hidden-input {
          display: none;
        }
        .pfu-error {
          color: #e0303f;
          font-size: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}

"use client";
import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet, do nothing
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard failed silently
    }
  };

  return (
    <button className="share-btn" onClick={handleShare} type="button">
      {copied ? "✓ Link Copied" : "↗ Share"}
      <style jsx>{`
        .share-btn {
          background: transparent;
          color: #444;
          border: 1px solid #ddd;
          padding: 13px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .share-btn:hover {
          background: #f7f7f7;
          border-color: #ccc;
        }
      `}</style>
    </button>
  );
}

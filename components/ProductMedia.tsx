"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  imageUrl?: string | null;
  videoUrl?: string | null;
  galleryUrls?: string[] | null;
  name: string;
};

// Detects whether a media URL is an image, video, or audio file based on its extension.
// This is needed because the admin panel stores images, videos, and audio all in the
// same `image_url` field — so we can't rely on a separate `video_url` being set.
const getMediaType = (url?: string | null): "image" | "video" | "audio" | "unknown" => {
  if (!url) return "unknown";
  const ext = url.split(".").pop()?.toLowerCase().split("?")[0] || "";
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  return "unknown";
};

export default function ProductMedia({ imageUrl, videoUrl, galleryUrls, name }: Props) {
  // If imageUrl is actually a video/audio file, treat it as such instead of an image.
  const primaryType = getMediaType(imageUrl);
  const resolvedVideoUrl = videoUrl || (primaryType === "video" ? imageUrl : null);
  const resolvedAudioUrl = primaryType === "audio" ? imageUrl : null;
  const resolvedImageUrl = primaryType === "image" ? imageUrl : null;

  const media = [
    ...(resolvedImageUrl ? [{ type: "image" as const, src: resolvedImageUrl }] : []),
    ...(resolvedVideoUrl ? [{ type: "video" as const, src: resolvedVideoUrl }] : []),
    ...(resolvedAudioUrl ? [{ type: "audio" as const, src: resolvedAudioUrl }] : []),
    ...((galleryUrls || []).map((src) => ({ type: "image" as const, src }))),
  ];

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = media[active];

  // Lock page scroll while the zoom overlay is open — done via a plain
  // side effect instead of a second <style jsx> tag, since Next.js
  // doesn't allow nested/conditional styled-jsx blocks in one component.
  useEffect(() => {
    if (zoomOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomOpen]);

  if (!current) {
    return (
      <div className="detail-image">
        <div className="placeholder">◈</div>
        <style jsx>{`
          .detail-image {
            border-radius: 18px;
            overflow: hidden;
            background: linear-gradient(135deg, #fdf2f3, #f7f7f7);
            aspect-ratio: 4/3;
            min-height: 480px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .placeholder {
            font-size: 64px;
            color: #e0303f;
            opacity: 0.6;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <div className="detail-image">
        {current.type === "video" ? (
          <>
            <video
              ref={videoRef}
              src={current.src}
              className="media-el"
              controls={playing}
              onPause={() => setPlaying(false)}
            />
            {!playing && (
              <button
                className="play-btn"
                onClick={() => {
                  setPlaying(true);
                  videoRef.current?.play();
                }}
                aria-label="Play preview"
              >
                ▶
              </button>
            )}
          </>
        ) : current.type === "audio" ? (
          <div className="audio-wrap">
            <div className="audio-icon">🎵</div>
            <audio src={current.src} controls className="audio-el" />
          </div>
        ) : (
          <>
            <img
              src={current.src}
              alt={name}
              className="media-el media-el-clickable"
              draggable={false}
              onClick={() => setZoomOpen(true)}
            />
            <button
              className="zoom-btn"
              onClick={() => setZoomOpen(true)}
              aria-label="Zoom image"
            >
              🔍 Zoom
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="thumb-strip">
          {media.map((m, i) => (
            <button
              key={m.src + i}
              className={`thumb ${i === active ? "thumb-active" : ""}`}
              onClick={() => {
                setActive(i);
                setPlaying(false);
              }}
            >
              {m.type === "image" ? (
                <img src={m.src} alt="" />
              ) : (
                <span className="thumb-fallback">{m.type === "video" ? "▶" : "🎵"}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {zoomOpen && current.type === "image" && (
        <div className="zoom-overlay" onClick={() => setZoomOpen(false)}>
          <button
            className="zoom-close"
            onClick={() => setZoomOpen(false)}
            aria-label="Close zoom"
          >
            ✕
          </button>
          <img
            src={current.src}
            alt={name}
            className="zoom-img"
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx>{`
        .detail-image {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: linear-gradient(135deg, #fdf2f3, #f7f7f7);
          aspect-ratio: 4/3;
          min-height: 480px;
          max-height: 640px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .media-el {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
        .media-el-clickable {
          pointer-events: auto;
          cursor: zoom-in;
        }
        .zoom-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .zoom-btn:hover {
          background: rgba(224, 48, 63, 0.85);
        }
        .audio-wrap {
          width: 100%;
          padding: 40px;
          text-align: center;
        }
        .audio-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .audio-el {
          width: 100%;
        }
        .play-btn {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: #e0303f;
          color: #fff;
          border: none;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 32px rgba(224, 48, 63, 0.45);
          transition: transform 0.25s ease;
        }
        .play-btn:hover {
          transform: scale(1.08);
        }
        .thumb-strip {
          display: flex;
          gap: 10px;
          margin-top: 14px;
          overflow-x: auto;
        }
        .thumb {
          position: relative;
          width: 96px;
          height: 72px;
          flex-shrink: 0;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
          padding: 0;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s ease, border-color 0.2s ease;
          background: #111;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumb-fallback {
          color: #fff;
          font-size: 20px;
        }
        .thumb-active,
        .thumb:hover {
          opacity: 1;
          border-color: #e0303f;
        }

        .zoom-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          cursor: zoom-out;
        }
        .zoom-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          cursor: default;
          border-radius: 6px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .zoom-close {
          position: absolute;
          top: 24px;
          right: 32px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .zoom-close:hover {
          background: rgba(224, 48, 63, 0.85);
        }

        @media (max-width: 768px) {
          .detail-image {
            min-height: 300px;
            max-height: 420px;
          }
        }
      `}</style>
    </div>
  );
}
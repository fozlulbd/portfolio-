"use client";
import { useEffect, useRef, useState } from "react";

type PreviewType = "image" | "video" | "audio" | null | undefined;

type ProductPreviewProps = {
  url?: string | null;
  type?: PreviewType;
  name: string;
  watermarkText?: string;
};

/**
 * Renders a product's PUBLIC preview (image / video / audio) with a
 * diagonal repeating watermark overlay and download deterrents:
 * - right-click / context menu disabled on the media
 * - drag-to-save disabled
 * - video/audio "download" button hidden from native controls
 *
 * Note: this is a front-end deterrent, not cryptographic protection —
 * the real deliverable file never reaches the browser until an order
 * is approved (see the secure download flow), so this component only
 * needs to stop casual right-click saves of the preview itself.
 */
export default function ProductPreview({
  url,
  type,
  name,
  watermarkText = "SEVENXP • PREVIEW",
}: ProductPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current || type !== "video") return;
    if (hovered) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [hovered, type]);

  const blockContextMenu = (e: React.MouseEvent) => e.preventDefault();

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setAudioPlaying(!audioPlaying);
  };

  if (!url || !type) {
    return (
      <div className="pp-wrap pp-empty">
        <span className="pp-diamond">◈</span>
        <style jsx>{`
          .pp-wrap {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
          }
          .pp-diamond {
            color: #e0303f;
            font-size: 32px;
            opacity: 0.6;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="pp-wrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onContextMenu={blockContextMenu}
    >
      {!inView && <div className="pp-skeleton" />}

      {inView && type === "image" && (
        <img src={url} alt={name} className="pp-media" draggable={false} />
      )}

      {inView && type === "video" && (
        <video
          ref={videoRef}
          src={url}
          className="pp-media"
          muted
          loop
          playsInline
          preload="none"
          controlsList="nodownload noremoteplayback nofullscreen"
          disablePictureInPicture
        />
      )}

      {inView && type === "audio" && (
        <div className="pp-audio-box">
          <button className="pp-audio-btn" onClick={toggleAudio}>
            {audioPlaying ? "❚❚" : "▶"}
          </button>
          <audio
            ref={audioRef}
            src={url}
            controlsList="nodownload"
            onEnded={() => setAudioPlaying(false)}
          />
        </div>
      )}

      {inView && (
        <div className="pp-watermark" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="pp-watermark-text">
              {watermarkText}
            </span>
          ))}
        </div>
      )}

      <style jsx>{`
        .pp-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pp-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #131313 25%, #1a1a1a 50%, #131313 75%);
          background-size: 200% 100%;
          animation: pp-shimmer 1.4s infinite;
        }
        @keyframes pp-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .pp-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
        }
        .pp-audio-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .pp-audio-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #e0303f;
          color: #fff;
          border: none;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .pp-audio-btn:hover {
          background: #c22530;
          transform: scale(1.08);
        }
        .pp-watermark {
          position: absolute;
          inset: -20%;
          display: flex;
          flex-wrap: wrap;
          align-content: space-around;
          justify-content: space-around;
          transform: rotate(-28deg);
          pointer-events: none;
          user-select: none;
        }
        .pp-watermark-text {
          color: rgba(255, 255, 255, 0.28);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
          white-space: nowrap;
          margin: 14px 22px;
        }
      `}</style>
    </div>
  );
}

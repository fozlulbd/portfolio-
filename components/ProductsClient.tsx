"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  slug?: string;
  name: string;
  category: string;
  price: number;
  format: string;
  sales: number;
  image_url?: string | null;
  video_url?: string | null;
  screenshots?: string[] | null;
  code_snippet?: string | null;
  code_language?: string | null;
  audio_preview_url?: string | null;
};

const categories = [
  "All",
  "Website Templates",
  "Audio",
  "Video Assets",
  "UI/UX Design",
  "Graphic Design Assets",
  "App & Software",
];

const paymentMethods = [
  { id: "payoneer", label: "Payoneer", detail: "fozlulhoqueinfo@gmail.com" },
  { id: "skrill", label: "Skrill", detail: "fozlulhoqueinfo@gmail.com" },
  { id: "binance", label: "Binance Pay", detail: "Binance ID: 123456789" },
];

// Detects whether a media URL is an image, video, or audio file based on its extension.
// The admin panel stores images, videos, and audio all in the same `image_url` field,
// so we can't rely on category or a separate `video_url`/`audio_preview_url` column
// actually being populated — we resolve the real type straight from the file itself.
const getMediaType = (url?: string | null): "image" | "video" | "audio" | "unknown" => {
  if (!url) return "unknown";
  const ext = url.split(".").pop()?.toLowerCase().split("?")[0] || "";
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  return "unknown";
};

type PreviewType = "video" | "audio" | "code" | "app" | "image";

function getPreviewType(category: string): PreviewType {
  const c = (category || "").toLowerCase();
  if (c.includes("video")) return "video";
  if (c.includes("audio")) return "audio";
  if (c.includes("source code")) return "code";
  if (c.includes("app") || c.includes("software")) return "app";
  return "image";
}

function ProductThumb({ product }: { product: Product }) {
  const categoryType = getPreviewType(product.category);
  const fileType = getMediaType(product.image_url);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [shotIndex, setShotIndex] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  // Tracks whether the actual media element (img/video) failed to load —
  // e.g. broken URL, 404, unsupported format. When true we always fall
  // back to the diamond icon so the card never renders an empty box.
  const [mediaError, setMediaError] = useState(false);

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

  const resolvedVideoSrc = product.video_url || (fileType === "video" ? product.image_url : null);
  const resolvedAudioSrc =
    product.audio_preview_url || (fileType === "audio" ? product.image_url : null);

  const handleEnter = () => {
    setHovered(true);
    if (resolvedVideoSrc && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setHovered(false);
    if (resolvedVideoSrc && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setAudioPlaying(!audioPlaying);
  };

  const shots = product.screenshots ?? [];

  const nextShot = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shots.length) return;
    setShotIndex((i) => (i + 1) % shots.length);
  };

  const prevShot = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shots.length) return;
    setShotIndex((i) => (i - 1 + shots.length) % shots.length);
  };

  const effectiveType: PreviewType =
    !mediaError && resolvedVideoSrc
      ? "video"
      : !mediaError && resolvedAudioSrc
      ? "audio"
      : categoryType === "code" || categoryType === "app"
      ? categoryType
      : "image";

  const showFallbackIcon =
    mediaError ||
    (effectiveType === "image" && !(fileType === "image" && product.image_url)) ||
    (effectiveType === "app" && shots.length === 0 && !(fileType === "image" && product.image_url));

  return (
    <div
      ref={containerRef}
      className="product-thumb"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {!inView && <div className="thumb-skeleton" />}

      {inView && showFallbackIcon && <span className="thumb-icon">◈</span>}

      {inView && !mediaError && effectiveType === "image" && fileType === "image" && product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="thumb-img"
          draggable={false}
          onError={() => setMediaError(true)}
        />
      )}

      {inView && !mediaError && effectiveType === "video" && resolvedVideoSrc && (
        <video
          ref={videoRef}
          src={resolvedVideoSrc}
          className={`thumb-video ${hovered ? "thumb-video-active" : ""}`}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setMediaError(true)}
        />
      )}

      {inView && effectiveType === "code" && (
        <div className="thumb-code">
          <div className="code-dots">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
            <span className="code-lang">{product.code_language ?? "code"}</span>
          </div>
          <pre className="code-text">{product.code_snippet ?? "// preview not available"}</pre>
          <div className="code-fade" />
        </div>
      )}

      {inView && !mediaError && effectiveType === "app" && shots.length > 0 && (
        <div className="thumb-app">
          <img
            src={shots[shotIndex]}
            alt={product.name}
            className="thumb-img"
            draggable={false}
            onError={() => setMediaError(true)}
          />
          {shots.length > 1 && (
            <>
              <button className="app-arrow app-arrow-left" onClick={prevShot}>‹</button>
              <button className="app-arrow app-arrow-right" onClick={nextShot}>›</button>
              <div className="app-dots">
                {shots.map((_, i) => (
                  <span key={i} className={`app-dot ${i === shotIndex ? "app-dot-active" : ""}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {inView && !mediaError && effectiveType === "app" && shots.length === 0 && fileType === "image" && product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="thumb-img"
          draggable={false}
          onError={() => setMediaError(true)}
        />
      )}

      {inView && !mediaError && effectiveType === "audio" && resolvedAudioSrc && (
        <div className="thumb-audio">
          <button className="audio-play-btn" onClick={toggleAudio}>
            {audioPlaying ? "❚❚" : "▶"}
          </button>
          <audio
            ref={audioRef}
            src={resolvedAudioSrc}
            onEnded={() => setAudioPlaying(false)}
            onError={() => setMediaError(true)}
          />
        </div>
      )}
    </div>
  );
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [name, setName] = useState("");
  const [txnId, setTxnId] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const openCheckout = (product: Product) => {
    setSelectedProduct(product);
    setSubmitted(false);
    setTxnId("");
    setEmail("");
    setName("");
    setErrorMsg("");
    setPaymentMethod(paymentMethods[0].id);
  };

  const closeCheckout = () => setSelectedProduct(null);

  const submitOrder = async () => {
    if (!selectedProduct || !name || !email || !txnId) return;
    setLoading(true);
    setErrorMsg("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        name,
        email,
        transactionId: txnId,
        paymentMethod,
        amount: selectedProduct.price,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।");
    }
  };

  return (
    <section className="products-section">
      <div className="products-inner">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          DIGITAL PRODUCTS
        </div>
        <h2 className="headline">
          Grab, don't build.
          <br />
          Ready-to-use digital assets.
        </h2>

        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${activeCategory === cat ? "tab-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: "#666" }}>No products in this category yet.</p>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <div key={p.id} className="product-card">
                <Link href={`/product/${p.slug}`} className="card-link">
                  <div className="thumb-wrap">
                    <ProductThumb product={p} />
                    <span className="thumb-badge">{p.category}</span>
                  </div>
                  <div className="product-body">
                    <h3 className="product-name">{p.name}</h3>
                    <span className="product-format">{p.format || "—"}</span>
                  </div>
                </Link>
                <div className="product-footer">
                  <div>
                    <span className="product-price">${p.price}</span>
                    <span className="product-sales">{p.sales} sales</span>
                  </div>
                  <button className="buy-btn" onClick={() => openCheckout(p)}>
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeCheckout}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeCheckout}>
              ✕
            </button>

            {!submitted ? (
              <>
                <span className="modal-eyebrow">CHECKOUT</span>
                <h3 className="modal-title">{selectedProduct.name}</h3>
                <p className="modal-price">${selectedProduct.price}</p>

                <div className="method-list">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      className={`method-item ${
                        paymentMethod === m.id ? "method-active" : ""
                      }`}
                      onClick={() => setPaymentMethod(m.id)}
                    >
                      <span>{m.label}</span>
                      {paymentMethod === m.id && <span className="dot" />}
                    </button>
                  ))}
                </div>

                <div className="pay-instructions">
                  Send <strong>${selectedProduct.price}</strong> to:
                  <div className="pay-detail">
                    {paymentMethods.find((m) => m.id === paymentMethod)?.detail}
                  </div>
                </div>

                <input
                  className="input"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="input"
                  type="email"
                  placeholder="Your email (for download link)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="input"
                  type="text"
                  placeholder="Transaction ID"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                />

                <button className="submit-btn" onClick={submitOrder} disabled={loading}>
                  {loading ? "Submitting..." : "Submit Order"}
                </button>
                {errorMsg && (
                  <p className="modal-note" style={{ color: "#e0303f" }}>
                    {errorMsg}
                  </p>
                )}
                <p className="modal-note">
                  Payment verify হওয়ার পর download link email এ পাঠানো হবে
                  (usually few hours এর মধ্যে)।
                </p>
              </>
            ) : (
              <div className="success-box">
                <div className="success-icon">✓</div>
                <h3 className="modal-title">Order Received</h3>
                <p className="modal-note">
                  আপনার order verify হচ্ছে। Confirm হলে download link{" "}
                  <strong>{email}</strong> এ পাঠানো হবে।
                </p>
                <button className="submit-btn" onClick={closeCheckout}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .products-section {
          background: #0a0a0a;
          padding: 120px 0;
        }
        .products-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e0303f;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          margin-bottom: 24px;
        }
        .eyebrow-line {
          width: 32px;
          height: 2px;
          background: #e0303f;
        }
        .headline {
          color: #fafafa;
          font-size: 52px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 48px 0;
        }
        .category-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .tab {
          background: #131313;
          border: 1px solid #232323;
          color: #a0a0a0;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .tab:hover {
          border-color: rgba(224, 48, 63, 0.5);
          color: #fafafa;
        }
        .tab-active {
          background: #e0303f;
          border-color: #e0303f;
          color: #fff;
        }

        /* KEY FIX #1: align-items: start stops CSS Grid from stretching every
           card in a row to match the tallest sibling. Without this, one card
           with slightly different intrinsic height (or a media load failure)
           drags every other card in that row to match it. */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 28px;
          align-items: start;
        }

        /* HARD-FIXED total card size — every card is exactly the same
           height no matter what its content is (long/short title, missing
           media, different format text, etc). The footer (price + Buy Now)
           is pinned with absolute positioning so it always sits at the
           exact same Y coordinate on every card, regardless of image size
           or content overflow. */
        .product-card {
          background: #131313;
          border: 1px solid #232323;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 420px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease,
            transform 0.3s ease;
        }
        .product-card:hover {
          border-color: rgba(224, 48, 63, 0.5);
          box-shadow: 0 0 30px rgba(224, 48, 63, 0.15);
          transform: translateY(-4px);
        }
        .card-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          height: 340px;
          overflow: hidden;
        }
        .thumb-wrap {
          position: relative;
          flex: 0 0 auto;
        }
        .thumb-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(10, 10, 10, 0.72);
          backdrop-filter: blur(6px);
          color: #ff8a94;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(224, 48, 63, 0.35);
          z-index: 2;
        }

        /* KEY FIX #2: this height is fixed regardless of whether the media
           inside loaded successfully — the fallback diamond icon renders
           inside this same fixed box instead of leaving it empty/collapsed. */
        .product-thumb {
          position: relative;
          height: 220px;
          background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .thumb-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #131313 25%, #1a1a1a 50%, #131313 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .thumb-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
        .thumb-icon {
          color: #e0303f;
          font-size: 32px;
          opacity: 0.6;
        }

        .thumb-code {
          position: relative;
          width: 100%;
          height: 100%;
          background: #0d1117;
          padding: 14px 16px;
          overflow: hidden;
        }
        .code-dots {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .dot-red, .dot-yellow, .dot-green {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot-red { background: #ff5f56; }
        .dot-yellow { background: #ffbd2e; }
        .dot-green { background: #27c93f; }
        .code-lang {
          margin-left: 6px;
          font-size: 10px;
          color: #6e7681;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .code-text {
          font-family: "Fira Code", monospace;
          font-size: 11px;
          line-height: 1.5;
          color: #7ee787;
          white-space: pre-wrap;
          margin: 0;
        }
        .code-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(transparent, #0d1117);
        }

        .thumb-app {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .app-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.55);
          color: #fff;
          border: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .product-thumb:hover .app-arrow {
          opacity: 1;
        }
        .app-arrow-left { left: 8px; }
        .app-arrow-right { right: 8px; }
        .app-dots {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
        }
        .app-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
        }
        .app-dot-active {
          background: #e0303f;
        }

        .thumb-audio {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, #1a0508 0%, #0a0a0a 100%);
        }
        .audio-play-btn {
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
        .audio-play-btn:hover {
          background: #c22530;
          transform: scale(1.08);
        }

        /* Body fills the space below the thumb, inside the 420px card-link
           box — its own content (title) is clamped to 2 lines so long
           titles never push anything else. */
        .product-body {
          padding: 20px 20px 0 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1 1 auto;
          min-height: 0;
          overflow: hidden;
        }
        .product-name {
          color: #fafafa;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-format {
          color: #7a7a7a;
          font-size: 13.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        /* Pinned to the exact same Y position on every card — always
           420px from the top, regardless of what's above it. */
        .product-footer {
          position: absolute;
          left: 0;
          right: 0;
          top: 340px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          background: #131313;
          border-top: 1px solid #1e1e1e;
        }
        .product-price {
          color: #fafafa;
          font-size: 21px;
          font-weight: 800;
          margin-right: 10px;
        }
        .product-sales {
          color: #666;
          font-size: 11.5px;
        }
        .buy-btn {
          background: #e0303f;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.25s ease;
        }
        .buy-btn:hover {
          background: #c22530;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }
        .modal {
          background: #131313;
          border: 1px solid #262626;
          border-radius: 18px;
          padding: 32px;
          width: 100%;
          max-width: 420px;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: none;
          border: none;
          color: #888;
          font-size: 16px;
          cursor: pointer;
        }
        .modal-eyebrow {
          color: #e0303f;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .modal-title {
          color: #fafafa;
          font-size: 22px;
          font-weight: 800;
          margin: 8px 0 4px 0;
        }
        .modal-price {
          color: #e0303f;
          font-size: 26px;
          font-weight: 800;
          margin: 0 0 20px 0;
        }
        .method-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .method-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0f0f0f;
          border: 1px solid #262626;
          color: #cfcfcf;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .method-active {
          border-color: #e0303f;
          color: #fafafa;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e0303f;
        }
        .pay-instructions {
          background: #0f0f0f;
          border: 1px dashed #333;
          border-radius: 10px;
          padding: 14px 16px;
          color: #9a9a9a;
          font-size: 13px;
          margin-bottom: 18px;
        }
        .pay-detail {
          color: #fafafa;
          font-weight: 700;
          margin-top: 4px;
          word-break: break-all;
        }
        .input {
          width: 100%;
          background: #0f0f0f;
          border: 1px solid #262626;
          color: #fafafa;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 10px;
          outline: none;
          box-sizing: border-box;
        }
        .input:focus {
          border-color: #e0303f;
        }
        .submit-btn {
          width: 100%;
          background: #e0303f;
          color: #fff;
          border: none;
          padding: 13px;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 6px;
        }
        .submit-btn:hover {
          background: #c22530;
        }
        .modal-note {
          color: #777;
          font-size: 12px;
          margin-top: 12px;
          line-height: 1.5;
        }
        .success-box {
          text-align: center;
          padding: 10px 0;
        }
        .success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(224, 48, 63, 0.12);
          color: #e0303f;
          font-size: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }

        @media (max-width: 640px) {
          .headline {
            font-size: 32px;
          }
        }
      `}</style>
    </section>
  );
}
"use client";
import { useRef, useState } from "react";

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
// so we can't rely on a separate `video_url` column being populated.
const getMediaType = (url?: string | null): "image" | "video" | "audio" | "unknown" => {
  if (!url) return "unknown";
  const ext = url.split(".").pop()?.toLowerCase().split("?")[0] || "";
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  return "unknown";
};

function ProductThumb({
  imageUrl,
  videoUrl,
  name,
}: {
  imageUrl?: string | null;
  videoUrl?: string | null;
  name: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const mediaType = getMediaType(imageUrl);
  // If the single image_url is itself a video/audio file, use it as the primary media.
  const resolvedVideoUrl = videoUrl || (mediaType === "video" ? imageUrl : null);
  const isAudio = mediaType === "audio";
  const showStaticImage = mediaType === "image" && imageUrl;
  // When image_url IS the video (no separate hover-preview video), show it muted/looping directly.
  const videoIsAlsoPoster = mediaType === "video" && !videoUrl;

  const handleEnter = () => {
    if (!resolvedVideoUrl || videoIsAlsoPoster) return;
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    if (!resolvedVideoUrl || videoIsAlsoPoster) return;
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="product-thumb" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {isAudio ? (
        <span className="thumb-icon">🎵</span>
      ) : videoIsAlsoPoster ? (
        <video
          src={imageUrl!}
          className="thumb-img"
          muted
          loop
          autoPlay
          playsInline
        />
      ) : showStaticImage ? (
        <img src={imageUrl} alt={name} className="thumb-img" draggable={false} />
      ) : (
        <span className="thumb-icon">◈</span>
      )}
      {resolvedVideoUrl && videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className={`thumb-video ${hovered ? "thumb-video-active" : ""}`}
          muted
          loop
          playsInline
        />
      )}
    </div>
  );
}

export default function ProductsGrid({ products }: { products: Product[] }) {
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

        <div className="product-grid">
          {filtered.map((p) => (
            <div key={p.id} className="product-card">
              <ProductThumb imageUrl={p.image_url} videoUrl={p.video_url} name={p.name} />
              <div className="product-body">
                <span className="product-category">{p.category}</span>
                <h3 className="product-name">{p.name}</h3>
                <span className="product-format">{p.format}</span>
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
            </div>
          ))}
        </div>
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
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .product-card {
          background: #131313;
          border: 1px solid #232323;
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease,
            transform 0.3s ease;
        }
        .product-card:hover {
          border-color: rgba(224, 48, 63, 0.5);
          box-shadow: 0 0 30px rgba(224, 48, 63, 0.15);
          transform: translateY(-4px);
        }
        .product-thumb {
          position: relative;
          height: 140px;
          background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
        .thumb-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .thumb-video-active {
          opacity: 1;
        }
        .thumb-icon {
          color: #e0303f;
          font-size: 32px;
          opacity: 0.6;
        }
        .product-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .product-category {
          color: #e0303f;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .product-name {
          color: #fafafa;
          font-size: 17px;
          font-weight: 700;
          margin: 0;
        }
        .product-format {
          color: #7a7a7a;
          font-size: 12.5px;
        }
        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
        }
        .product-price {
          color: #fafafa;
          font-size: 20px;
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
"use client";

import { useRef, useState } from "react";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  old_price: number | null;
  format: string;
  sales: number;
  description: string | null;
  features: string[] | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  video_url: string | null;
  preview_video_url: string | null;
  thumbnail_url: string | null;
  screenshots: string[] | null;
  file_url: string | null;
  file_size: string | null;
  tag: string | null;
  status: string | null;
  keywords: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  meta_title: string | null;
  meta_description: string | null;
  preview_url: string | null;
  created_at: string | null;
};

// Same manual-payment methods used on the listing/checkout page.
// Move this to a `payment_methods` table later if you want it admin-editable.
const paymentMethods = [
  { id: "payoneer", label: "Payoneer", detail: "fozlulhoqueinfo@gmail.com" },
  { id: "skrill", label: "Skrill", detail: "fozlulhoqueinfo@gmail.com" },
  { id: "binance", label: "Binance Pay", detail: "Binance ID: 123456789" },
];

export default function ProductDetailClient({ product }: { product: Product }) {
  // Build the media list for the hero gallery: gallery_urls > screenshots > [image_url]
  const galleryImages =
    (product.gallery_urls && product.gallery_urls.length > 0 && product.gallery_urls) ||
    (product.screenshots && product.screenshots.length > 0 && product.screenshots) ||
    (product.image_url ? [product.image_url] : []);

  const heroVideo = product.video_url || product.preview_video_url || null;

  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [name, setName] = useState("");
  const [txnId, setTxnId] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const discountPct =
    product.old_price && product.old_price > product.price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : null;

  const openCheckout = () => {
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
    <section className="pd-section">
      <div className="pd-inner">
        <nav className="pd-breadcrumb">
          <a href="/">Home</a> <span>/</span> <a href="/products">Products</a>{" "}
          <span>/</span> <span className="pd-breadcrumb-current">{product.name}</span>
        </nav>

        <div className="pd-grid">
          {/* ---------- Media ---------- */}
          <div className="pd-media">
            <div className="pd-media-main">
              {heroVideo ? (
                <video
                  ref={videoRef}
                  src={heroVideo}
                  poster={product.thumbnail_url || product.image_url || undefined}
                  controls
                  playsInline
                  className="pd-media-video"
                />
              ) : galleryImages.length > 0 ? (
                <img
                  src={galleryImages[activeIndex]}
                  alt={product.name}
                  className="pd-media-img"
                  draggable={false}
                />
              ) : (
                <span className="pd-media-fallback">◈</span>
              )}
              {product.tag && <span className="pd-tag">{product.tag}</span>}
            </div>

            {!heroVideo && galleryImages.length > 1 && (
              <div className="pd-thumbs">
                {galleryImages.map((src, i) => (
                  <button
                    key={src + i}
                    className={`pd-thumb-btn ${i === activeIndex ? "pd-thumb-active" : ""}`}
                    onClick={() => setActiveIndex(i)}
                  >
                    <img src={src} alt={`${product.name} ${i + 1}`} draggable={false} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Info ---------- */}
          <div className="pd-info">
            <span className="pd-category">{product.category}</span>
            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-price-row">
              <span className="pd-price">${product.price}</span>
              {product.old_price && product.old_price > product.price && (
                <span className="pd-old-price">${product.old_price}</span>
              )}
              {discountPct && <span className="pd-discount">-{discountPct}%</span>}
            </div>

            <div className="pd-meta-row">
              <span>{product.format}</span>
              <span className="pd-dot">•</span>
              <span>{product.sales} sales</span>
              {product.file_size && (
                <>
                  <span className="pd-dot">•</span>
                  <span>{product.file_size}</span>
                </>
              )}
            </div>

            {product.description && <p className="pd-description">{product.description}</p>}

            {product.features && product.features.length > 0 && (
              <ul className="pd-features">
                {product.features.map((f, i) => (
                  <li key={i}>
                    <span className="pd-check">✓</span> {f}
                  </li>
                ))}
              </ul>
            )}

            <button className="pd-buy-btn" onClick={openCheckout}>
              Buy Now — ${product.price}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Checkout modal (same flow as the listing page) ---------- */}
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
                      className={`method-item ${paymentMethod === m.id ? "method-active" : ""}`}
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
                  Payment verify হওয়ার পর download link email এ পাঠানো হবে (usually few hours এর
                  মধ্যে)।
                </p>
              </>
            ) : (
              <div className="success-box">
                <div className="success-icon">✓</div>
                <h3 className="modal-title">Order Received</h3>
                <p className="modal-note">
                  আপনার order verify হচ্ছে। Confirm হলে download link <strong>{email}</strong> এ
                  পাঠানো হবে।
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
        .pd-section {
          background: #0a0a0a;
          padding: 60px 0 120px;
          min-height: 100vh;
        }
        .pd-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .pd-breadcrumb {
          color: #7a7a7a;
          font-size: 13px;
          margin-bottom: 36px;
        }
        .pd-breadcrumb a {
          color: #a0a0a0;
          text-decoration: none;
        }
        .pd-breadcrumb a:hover {
          color: #fafafa;
        }
        .pd-breadcrumb-current {
          color: #fafafa;
        }
        .pd-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 56px;
        }
        @media (max-width: 860px) {
          .pd-grid {
            grid-template-columns: 1fr;
          }
        }

        .pd-media-main {
          position: relative;
          background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
          border: 1px solid #232323;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pd-media-img,
        .pd-media-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pd-media-fallback {
          color: #e0303f;
          font-size: 48px;
          opacity: 0.6;
        }
        .pd-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #e0303f;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 5px 10px;
          border-radius: 6px;
        }
        .pd-thumbs {
          display: flex;
          gap: 10px;
          margin-top: 14px;
          overflow-x: auto;
        }
        .pd-thumb-btn {
          flex: 0 0 auto;
          width: 68px;
          height: 68px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #232323;
          background: none;
          padding: 0;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s ease, border-color 0.2s ease;
        }
        .pd-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pd-thumb-active {
          opacity: 1;
          border-color: #e0303f;
        }

        .pd-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pd-category {
          color: #e0303f;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .pd-title {
          color: #fafafa;
          font-size: 34px;
          font-weight: 800;
          line-height: 1.2;
          margin: 4px 0 14px 0;
        }
        .pd-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 10px;
        }
        .pd-price {
          color: #fafafa;
          font-size: 32px;
          font-weight: 800;
        }
        .pd-old-price {
          color: #666;
          font-size: 18px;
          text-decoration: line-through;
        }
        .pd-discount {
          background: rgba(224, 48, 63, 0.15);
          color: #e0303f;
          font-size: 12.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .pd-meta-row {
          color: #7a7a7a;
          font-size: 13.5px;
          display: flex;
          gap: 8px;
          margin-bottom: 22px;
        }
        .pd-dot {
          color: #444;
        }
        .pd-description {
          color: #c0c0c0;
          font-size: 15px;
          line-height: 1.7;
          margin: 0 0 20px 0;
        }
        .pd-features {
          list-style: none;
          padding: 0;
          margin: 0 0 28px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pd-features li {
          color: #cfcfcf;
          font-size: 14px;
        }
        .pd-check {
          color: #e0303f;
          font-weight: 800;
          margin-right: 6px;
        }
        .pd-buy-btn {
          background: #e0303f;
          color: #fff;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 15.5px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.25s ease;
        }
        .pd-buy-btn:hover {
          background: #c22530;
        }

        /* ---- Checkout modal (matches listing page) ---- */
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
      `}</style>
    </section>
  );
}
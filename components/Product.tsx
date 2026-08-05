"use client";
import { useEffect, useRef, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  format: string;
  sales: number;
  image_url?: string | null;
  video_url?: string | null;
  screenshots?: string[];
  code_snippet?: string;
  code_language?: string;
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

const products: Product[] = [
  { id: "p1", name: "Modern Sans Font Family", category: "Fonts", price: 9, format: "OTF, TTF, WOFF", sales: 143, image_url: "https://picsum.photos/seed/p1/600/400" },
  { id: "p2", name: "Handwritten Script Font Duo", category: "Fonts", price: 7, format: "OTF, TTF", sales: 98, image_url: "https://picsum.photos/seed/p2/600/400" },
  { id: "p3", name: "Social Media Post Template Pack", category: "Templates & Graphics", price: 12, format: "PSD, Canva", sales: 176, image_url: "https://picsum.photos/seed/p3/600/400" },
  { id: "p4", name: "Business Flyer Bundle", category: "Templates & Graphics", price: 10, format: "AI, PSD", sales: 88, image_url: "https://picsum.photos/seed/p4/600/400" },
  {
    id: "p5",
    name: "IMO-Style Calling App Source",
    category: "Source Code",
    price: 79,
    format: "Kotlin + Node.js",
    sales: 21,
    code_language: "kotlin",
    code_snippet: `class CallActivity : AppCompatActivity() {
  private lateinit var socket: Socket

  override fun onCreate(state: Bundle?) {
    super.onCreate(state)
    socket = IO.socket(SIGNAL_URL)
    socket.on("offer") { args ->
      handleOffer(args[0] as JSONObject)
    }
    socket.connect()
  }
}`,
  },
  {
    id: "p6",
    name: "E-commerce Admin Dashboard Source",
    category: "Source Code",
    price: 65,
    format: "React + Node.js",
    sales: 34,
    code_language: "typescript",
    code_snippet: `export async function getOrders(req: Request, res: Response) {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });
  return res.json(orders);
}`,
  },
  { id: "p7", name: "SEVENXP Next.js Portfolio Theme", category: "Website Templates", price: 35, format: "Next.js + Tailwind", sales: 47, image_url: "https://picsum.photos/seed/p7/600/400" },
  { id: "p8", name: "SaaS Landing Page Template", category: "Website Templates", price: 28, format: "HTML + Tailwind", sales: 61, image_url: "https://picsum.photos/seed/p8/600/400" },
  { id: "p9", name: "UI/UX Design Fundamentals Course", category: "E-books & Courses", price: 24, format: "MP4 + PDF", sales: 52, image_url: "https://picsum.photos/seed/p9/600/400" },
  { id: "p10", name: "Freelancing Starter Kit E-book", category: "E-books & Courses", price: 8, format: "PDF, EPUB", sales: 119, image_url: "https://picsum.photos/seed/p10/600/400" },
  { id: "p11", name: "Daily & Weekly Planner Bundle", category: "Printables", price: 12, format: "PDF, Canva", sales: 113, image_url: "https://picsum.photos/seed/p11/600/400" },
  { id: "p12", name: "Budget Tracker Printable Kit", category: "Printables", price: 9, format: "PDF", sales: 88, image_url: "https://picsum.photos/seed/p12/600/400" },
  { id: "p13", name: "Notion Life OS Template", category: "Productivity", price: 15, format: "Notion", sales: 204, image_url: "https://picsum.photos/seed/p13/600/400" },
  { id: "p14", name: "Freelancer Invoice & CRM Sheet", category: "Productivity", price: 11, format: "Excel, Sheets", sales: 76, image_url: "https://picsum.photos/seed/p14/600/400" },
  { id: "p15", name: "AI Prompt Pack for Designers", category: "AI Products", price: 14, format: "PDF, Notion", sales: 91, image_url: "https://picsum.photos/seed/p15/600/400" },
  { id: "p16", name: "Custom GPT Persona Bundle", category: "AI Products", price: 19, format: "JSON, PDF", sales: 43, image_url: "https://picsum.photos/seed/p16/600/400" },
  {
    id: "p17",
    name: "Lofi Background Music Pack",
    category: "Audio",
    price: 10,
    format: "MP3, WAV",
    sales: 67,
    audio_preview_url: "https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3",
  },
  {
    id: "p18",
    name: "Podcast Intro Sound Kit",
    category: "Audio",
    price: 8,
    format: "WAV",
    sales: 39,
    audio_preview_url: "https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3",
  },
  {
    id: "p19",
    name: "Cinematic Transition Pack",
    category: "Video Assets",
    price: 16,
    format: "MP4, MOGRT",
    sales: 58,
    video_url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "p20",
    name: "Social Reel Template Bundle",
    category: "Video Assets",
    price: 13,
    format: "MP4, Premiere",
    sales: 72,
    video_url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  { id: "p21", name: "Isometric Room 3D Model Pack", category: "3D Assets", price: 22, format: "OBJ, Blend", sales: 29, image_url: "https://picsum.photos/seed/p21/600/400" },
  { id: "p22", name: "Low-Poly Character Bundle", category: "3D Assets", price: 18, format: "FBX, Blend", sales: 24, image_url: "https://picsum.photos/seed/p22/600/400" },
  { id: "p23", name: "Airline Booking UI Kit", category: "UI/UX Design", price: 22, format: "Figma", sales: 58, image_url: "https://picsum.photos/seed/p23/600/400" },
  { id: "p24", name: "Mobile App UI Kit Vol.3", category: "UI/UX Design", price: 20, format: "Figma, XD", sales: 84, image_url: "https://picsum.photos/seed/p24/600/400" },
  { id: "p25", name: "Isometric City Vector Set", category: "Graphic Design Assets", price: 9, format: "AI, SVG", sales: 210, image_url: "https://picsum.photos/seed/p25/600/400" },
  { id: "p26", name: "Minimal Icon Pack Vol.2", category: "Graphic Design Assets", price: 12, format: "AI, EPS, SVG", sales: 84, image_url: "https://picsum.photos/seed/p26/600/400" },
  {
    id: "p27",
    name: "WebRTC Video Calling App",
    category: "App & Software",
    price: 89,
    format: "Android + Node.js",
    sales: 17,
    screenshots: [
      "https://picsum.photos/seed/p27a/600/400",
      "https://picsum.photos/seed/p27b/600/400",
      "https://picsum.photos/seed/p27c/600/400",
    ],
  },
  {
    id: "p28",
    name: "Inventory Management Software",
    category: "App & Software",
    price: 95,
    format: "Next.js + PostgreSQL",
    sales: 12,
    screenshots: [
      "https://picsum.photos/seed/p28a/600/400",
      "https://picsum.photos/seed/p28b/600/400",
    ],
  },
];

const paymentMethods = [
  { id: "payoneer", label: "Payoneer", detail: "fozlulhoqueinfo@gmail.com" },
  { id: "skrill", label: "Skrill", detail: "fozlulhoqueinfo@gmail.com" },
  { id: "binance", label: "Binance Pay", detail: "Binance ID: 123456789" },
];

type PreviewType = "video" | "audio" | "code" | "app" | "image";

function getPreviewType(category: string): PreviewType {
  const c = category.toLowerCase();
  if (c.includes("video")) return "video";
  if (c.includes("audio")) return "audio";
  if (c.includes("source code")) return "code";
  if (c.includes("app") || c.includes("software")) return "app";
  return "image";
}

function ProductThumb({ product }: { product: Product }) {
  const type = getPreviewType(product.category);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [shotIndex, setShotIndex] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Lazy-load: only mount media once the card scrolls into view
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

  const handleEnter = () => {
    setHovered(true);
    if (type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setHovered(false);
    if (type === "video" && videoRef.current) {
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

  const nextShot = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shots = product.screenshots ?? [];
    if (!shots.length) return;
    setShotIndex((i) => (i + 1) % shots.length);
  };

  const prevShot = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shots = product.screenshots ?? [];
    if (!shots.length) return;
    setShotIndex((i) => (i - 1 + shots.length) % shots.length);
  };

  return (
    <div
      ref={containerRef}
      className="product-thumb"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {!inView && <div className="thumb-skeleton" />}

      {inView && type === "image" && (
        product.image_url ? (
          <img src={product.image_url} alt={product.name} className="thumb-img" draggable={false} />
        ) : (
          <span className="thumb-icon">◈</span>
        )
      )}

      {inView && type === "video" && (
        product.video_url ? (
          <>
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="thumb-img"
                style={{ opacity: hovered ? 0 : 1 }}
                draggable={false}
              />
            )}
            <video
              ref={videoRef}
              src={product.video_url}
              className={`thumb-video ${hovered ? "thumb-video-active" : ""}`}
              muted
              loop
              playsInline
              preload="none"
            />
          </>
        ) : (
          <span className="thumb-icon">◈</span>
        )
      )}

      {inView && type === "code" && (
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

      {inView && type === "app" && (
        product.screenshots && product.screenshots.length > 0 ? (
          <div className="thumb-app">
            <img
              src={product.screenshots[shotIndex]}
              alt={product.name}
              className="thumb-img"
              draggable={false}
            />
            {product.screenshots.length > 1 && (
              <>
                <button className="app-arrow app-arrow-left" onClick={prevShot}>
                  ‹
                </button>
                <button className="app-arrow app-arrow-right" onClick={nextShot}>
                  ›
                </button>
                <div className="app-dots">
                  {product.screenshots.map((_, i) => (
                    <span key={i} className={`app-dot ${i === shotIndex ? "app-dot-active" : ""}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <span className="thumb-icon">◈</span>
        )
      )}

      {inView && type === "audio" && (
        <div className="thumb-audio">
          {product.audio_preview_url ? (
            <>
              <button className="audio-play-btn" onClick={toggleAudio}>
                {audioPlaying ? "❚❚" : "▶"}
              </button>
              <audio
                ref={audioRef}
                src={product.audio_preview_url}
                onEnded={() => setAudioPlaying(false)}
              />
            </>
          ) : (
            <span className="thumb-icon">◈</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
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
              <ProductThumb product={p} />
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

        /* Source code preview */
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

        /* App/software carousel */
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

        /* Audio preview */
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
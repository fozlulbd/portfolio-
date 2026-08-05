import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notFound } from "next/navigation";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";
import ProductMedia from "@/components/ProductMedia";
import ShareButton from "@/components/ShareButton";

// Detects whether a media URL is an image, video, or audio file based on its extension.
// Needed because the admin panel stores images, videos, and audio all in the same
// `image_url` field, so related-product thumbnails can't assume it's always an image.
function getMediaType(url?: string | null): "image" | "video" | "audio" | "unknown" {
  if (!url) return "unknown";
  const ext = url.split(".").pop()?.toLowerCase().split("?")[0] || "";
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  return "unknown";
}

async function getProduct(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getProduct error:", error.message);
  }
  return data;
}

async function getRelatedProducts(category: string, excludeId: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id, slug, name, category, price, format, sales, image_url")
    .eq("category", category)
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("getRelatedProducts error:", error.message);
    return [];
  }
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found | SEVENXP" };

  const title = product.meta_title || `${product.name} | SEVENXP`;
  const description =
    product.meta_description || product.description || `Buy ${product.name} on SEVENXP.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return notFound();

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.meta_description || product.description,
    image: product.image_url || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <section className="detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Basic image-protection: blocks right-click save, drag-out, and text/image selection
          inside the media area. This deters casual copying but cannot fully prevent
          a determined user (e.g. via devtools) from saving the image. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('contextmenu', function (e) {
              if (e.target.closest('.protected-media')) e.preventDefault();
            });
            document.addEventListener('dragstart', function (e) {
              if (e.target.closest('.protected-media')) e.preventDefault();
            });
          `,
        }}
      />

      <div className="breadcrumb">
        <Link href="/product">Products</Link> / <span>{product.category}</span> / {product.name}
      </div>

      <div className="detail-grid">
        <div className="protected-media">
          <ProductMedia
            imageUrl={product.image_url}
            videoUrl={product.video_url}
            galleryUrls={product.gallery_urls}
            name={product.name}
          />
        </div>

        <div className="detail-info">
          <span className="category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="format">{product.format}</p>

          <div className="actions">
            {product.preview_url && (
              <a href={product.preview_url} target="_blank" rel="noopener noreferrer" className="preview-link">
                Live Preview ↗
              </a>
            )}
            <BuyButton product={{ id: product.id, name: product.name, price: product.price }} />
            <ShareButton title={product.name} />
          </div>

          <div className="meta-row">{product.sales} sales</div>
        </div>
      </div>

      {/* Description now lives in its own full-width section below the
          main grid, with a larger font and full text — no truncation,
          no cramped sidebar column. */}
      {(product.description || (product.features && product.features.length > 0)) && (
        <div className="description-section">
          <h2 className="description-title">About this product</h2>
          {product.description && (
            <p className="description-text">{product.description}</p>
          )}
          {product.features && product.features.length > 0 && (
            <ul className="features">
              {product.features.map((f: string, i: number) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2 className="related-title">Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map((rp) => {
              const rpMediaType = getMediaType(rp.image_url);
              return (
                <Link key={rp.id} href={`/product/${rp.slug}`} className="related-card">
                  <div className="related-thumb protected-media">
                    {rpMediaType === "video" && rp.image_url ? (
                      <video src={rp.image_url} muted loop playsInline autoPlay preload="metadata" />
                    ) : rpMediaType === "audio" ? (
                      <span className="related-thumb-icon">🎵</span>
                    ) : rp.image_url ? (
                      <img src={rp.image_url} alt={rp.name} draggable={false} />
                    ) : (
                      <span className="related-thumb-icon">◈</span>
                    )}
                  </div>
                  <div className="related-body">
                    <span className="related-category">{rp.category}</span>
                    <h3 className="related-name">{rp.name}</h3>
                    <div className="related-footer">
                      <span className="related-price">${rp.price}</span>
                      <span className="related-sales">{rp.sales} sales</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .detail-page { max-width: 1280px; margin: 0 auto; padding: 140px 32px 100px; }
        .breadcrumb { color: #999; font-size: 13px; margin-bottom: 32px; }
        .breadcrumb a { color: #e0303f; text-decoration: none; }
        .detail-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 56px; align-items: start; }
        .category { color: #e0303f; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        h1 { font-size: 34px; font-weight: 800; color: #111; margin: 8px 0 4px 0; }
        .format { color: #999; font-size: 13px; margin: 0 0 20px 0; }
        .actions { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
        .preview-link {
          color: #e0303f; border: 1px solid #f0d3d5; padding: 13px 20px;
          border-radius: 10px; font-size: 14px; font-weight: 700; text-decoration: none;
        }
        .preview-link:hover { background: #fff5f5; }
        .meta-row { color: #999; font-size: 12.5px; }

        .protected-media {
          user-select: none;
          -webkit-user-select: none;
        }
        .protected-media img {
          pointer-events: none;
        }

        /* Full-width, larger description block below the main product grid */
        .description-section {
          margin-top: 56px;
          border-top: 1px solid #eee;
          padding-top: 40px;
          max-width: 780px;
        }
        .description-title {
          font-size: 24px;
          font-weight: 800;
          color: #111;
          margin: 0 0 18px 0;
        }
        .description-text {
          color: #333;
          font-size: 17px;
          line-height: 1.85;
          margin: 0 0 24px 0;
          white-space: pre-wrap;
        }
        .features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .features li { color: #222; font-size: 15.5px; }

        .related-section { margin-top: 64px; border-top: 1px solid #eee; padding-top: 48px; }
        .related-title { font-size: 30px; font-weight: 800; color: #111; margin: 0 0 32px 0; }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .related-card {
          display: block;
          text-decoration: none;
          color: inherit;
          border: 1px solid #eee;
          border-radius: 18px;
          overflow: hidden;
          transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
        }
        .related-card:hover {
          border-color: #f0c9cc;
          box-shadow: 0 8px 24px rgba(224, 48, 63, 0.1);
          transform: translateY(-3px);
        }
        .related-thumb {
          height: 280px;
          background: linear-gradient(135deg, #f7f7f7, #eee);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .related-thumb img,
        .related-thumb video { width: 100%; height: 100%; object-fit: cover; }
        .related-thumb-icon { color: #e0303f; font-size: 44px; opacity: 0.5; }
        .related-body { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 8px; }
        .related-category {
          color: #e0303f; font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .related-name {
          font-size: 20px; font-weight: 700; color: #111; margin: 0;
          line-height: 1.35;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .related-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
        .related-price { color: #111; font-weight: 800; font-size: 22px; }
        .related-sales { color: #999; font-size: 14px; }

        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; }
          h1 { font-size: 26px; }
          .description-text { font-size: 16px; }
          .related-grid { grid-template-columns: 1fr; gap: 20px; }
          .related-thumb { height: 220px; }
        }
      `}</style>
    </section>
  );
}
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | VENUZEN",
  description: "VENUZEN's refund and cancellation policy for digital products and freelance services.",
};

const sectionStyle: React.CSSProperties = { marginBottom: 32 };
const h2Style: React.CSSProperties = { color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 12, marginTop: 0 };
const pStyle: React.CSSProperties = { color: "#999", fontSize: 15, lineHeight: 1.85, marginBottom: 12 };
const liStyle: React.CSSProperties = { color: "#999", fontSize: 15, lineHeight: 1.85, marginBottom: 8 };

export default function RefundPolicyPage() {
  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", padding: "64px 20px 100px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Link href="/#home" style={{ color: "#E8192C", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          ← Back to Home
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 32, marginBottom: 8 }}>
          <div style={{ width: 40, height: 2, background: "#E8192C" }} />
          <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Legal</span>
        </div>
        <h1 style={{ color: "#fff", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, marginBottom: 8 }}>
          Refund Policy
        </h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 48 }}>Last updated: August 2026</p>

        <div style={sectionStyle}>
          <p style={pStyle}>
            This Refund Policy applies to purchases made on venuzen.com, operated by Fozlul Hoque, trading as
            VENUZEN. We want you to be happy with what you buy — please read below for how refunds work for
            digital products and freelance services.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Digital Products</h2>
          <p style={pStyle}>
            Because digital products (templates, source code, design assets, and similar downloadable items) are
            delivered instantly and can be copied once downloaded, refunds are handled as follows:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>
              <strong style={{ color: "#ccc" }}>Before delivery:</strong> If your order has not yet been approved
              and the download link has not been sent, you may cancel and request a full refund at any time.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#ccc" }}>After delivery:</strong> Once a download link has been delivered,
              the sale is generally final, since the product cannot be &quot;returned&quot;. Exceptions are made in the
              following cases:
            </li>
            <li style={liStyle}>The file is corrupted, incomplete, or does not match the product description</li>
            <li style={liStyle}>You were charged more than once for the same order (duplicate payment)</li>
            <li style={liStyle}>The product was never delivered within a reasonable time after payment was verified</li>
          </ul>
          <p style={pStyle}>
            To request a refund under these exceptions, email us within <strong style={{ color: "#ccc" }}>7 days</strong> of
            purchase with your order details and a description of the issue. We will review and respond within
            2–3 business days.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>2. Freelance / Custom Services</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>
              <strong style={{ color: "#ccc" }}>Before work begins:</strong> If you cancel before any work has
              started on your project, you are entitled to a full refund.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#ccc" }}>After work has started:</strong> Refunds are prorated based on
              the amount of work already completed. For example, if 40% of a website build is complete, up to
              60% of the payment may be refunded, at our discretion, minus any non-recoverable costs already
              incurred (e.g. licensed assets purchased on your behalf).
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#ccc" }}>After delivery:</strong> Once final deliverables have been
              approved and handed over, the project is considered complete and is generally non-refundable.
              Revisions within the agreed scope are provided instead of a refund.
            </li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>3. How to Request a Refund</h2>
          <p style={pStyle}>Email us at the address below with:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>Your order/transaction ID</li>
            <li style={liStyle}>The email address used at checkout</li>
            <li style={liStyle}>A brief explanation of the reason for your request</li>
          </ul>
          <p style={pStyle}>
            Approved refunds are returned to your original payment method where possible. Processing time
            depends on your payment provider and can take up to 10 business days after approval.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>4. Non-Refundable Situations</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>Change of mind after a digital product has been downloaded</li>
            <li style={liStyle}>Failure to read the product description, requirements, or compatibility notes before purchase</li>
            <li style={liStyle}>Completed and approved freelance deliverables</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Contact Us</h2>
          <p style={{ ...pStyle, color: "#ccc" }}>
            VENUZEN (operated by Fozlul Hoque)
            <br />
            Email:{" "}
            <a href="mailto:fozlulhoqueinfo@gmail.com" style={{ color: "#E8192C" }}>
              fozlulhoqueinfo@gmail.com
            </a>
            <br />
            WhatsApp: +880 1939-828993
            <br />
            Address: Gazipur Sodor, Gazipur 1702, Bangladesh
          </p>
        </div>
      </div>
    </main>
  );
}
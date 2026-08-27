import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | VENUZEN",
  description: "The terms and conditions that govern your use of VENUZEN's website, digital products, and services.",
};

const sectionStyle: React.CSSProperties = { marginBottom: 32 };
const h2Style: React.CSSProperties = { color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 12, marginTop: 0 };
const pStyle: React.CSSProperties = { color: "#999", fontSize: 15, lineHeight: 1.85, marginBottom: 12 };
const liStyle: React.CSSProperties = { color: "#999", fontSize: 15, lineHeight: 1.85, marginBottom: 8 };

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 48 }}>Last updated: August 2026</p>

        <div style={sectionStyle}>
          <p style={pStyle}>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of venuzen.com (the &quot;Site&quot;), operated by
            Fozlul Hoque, trading as VENUZEN (&quot;VENUZEN&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;), a sole proprietorship based in
            Gazipur, Bangladesh. By accessing the Site, purchasing a digital product, or engaging our freelance
            services, you agree to be bound by these Terms. If you do not agree, please do not use the Site.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Who We Are</h2>
          <p style={pStyle}>
            VENUZEN is a creative digital studio offering graphic design, web development, video editing, brand
            identity, and UI/UX design services, as well as a marketplace of ready-made digital products
            (templates, source code, design assets, and similar downloadable items).
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>2. Digital Products</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>Digital products listed on the Site are delivered electronically via a secure, time-limited download link after payment is verified.</li>
            <li style={liStyle}>You are granted a non-exclusive, non-transferable license to use purchased digital products for the purpose described on the product page. You may not resell, redistribute, or claim purchased assets as your own original work unless explicitly stated as permitted.</li>
            <li style={liStyle}>Product screenshots, previews, and descriptions are provided in good faith to represent the actual product; minor variations may occur.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>3. Freelance Services</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>Custom services (web development, design, video editing, branding) are scoped, priced, and agreed upon directly with the client before work begins, typically via WhatsApp, email, or a written proposal.</li>
            <li style={liStyle}>Delivery timelines, number of revisions, and deliverables vary by package and are communicated at the time of order.</li>
            <li style={liStyle}>Ownership of final, fully-paid custom deliverables transfers to the client upon full payment, unless otherwise agreed in writing.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>4. Payments</h2>
          <p style={pStyle}>
            Prices are listed in US Dollars (USD) unless stated otherwise. Payments may be processed through our
            merchant of record and/or supported manual payment channels (such as Payoneer, Skrill, or Binance
            Pay) as indicated at checkout. You are responsible for providing accurate payment and contact
            information to receive your order.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Refunds</h2>
          <p style={pStyle}>
            Refunds are handled according to our{" "}
            <Link href="/refund-policy" style={{ color: "#E8192C" }}>
              Refund Policy
            </Link>
            , which forms part of these Terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>6. Acceptable Use</h2>
          <p style={pStyle}>You agree not to:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>Use the Site or its products for any unlawful purpose</li>
            <li style={liStyle}>Attempt to gain unauthorized access to our systems, admin panel, or other users&apos; data</li>
            <li style={liStyle}>Redistribute, resell, or share purchased digital products outside the granted license</li>
            <li style={liStyle}>Submit false, misleading, or fraudulent payment or transaction information</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>7. Intellectual Property</h2>
          <p style={pStyle}>
            All Site content — including the VENUZEN name, logo, design, and original portfolio work — is owned
            by VENUZEN / Fozlul Hoque unless otherwise credited, and may not be copied or reused without
            permission. Digital products are licensed, not sold outright, under the terms stated on each product
            page.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>8. Limitation of Liability</h2>
          <p style={pStyle}>
            The Site and its products/services are provided &quot;as is&quot;. To the fullest extent permitted by law,
            VENUZEN is not liable for any indirect, incidental, or consequential damages arising from your use of
            the Site, digital products, or freelance services.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>9. Changes to These Terms</h2>
          <p style={pStyle}>
            We may update these Terms from time to time. Continued use of the Site after changes are posted
            constitutes acceptance of the revised Terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>10. Governing Law</h2>
          <p style={pStyle}>
            These Terms are governed by the laws of the People&apos;s Republic of Bangladesh, without regard to its
            conflict of law principles.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>11. Contact Us</h2>
          <p style={{ ...pStyle, color: "#ccc" }}>
            VENUZEN (operated by Fozlul Hoque)
            <br />
            Email:{" "}
            <a href="mailto:fozlulhoqueinfo@gmail.com" style={{ color: "#E8192C" }}>
              fozlulhoqueinfo@gmail.com
            </a>
            <br />
            Address: Gazipur Sodor, Gazipur 1702, Bangladesh
          </p>
        </div>
      </div>
    </main>
  );
}
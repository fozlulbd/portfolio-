import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | VENUZEN",
  description: "How VENUZEN collects, uses, and protects your personal information.",
};

const sectionStyle: React.CSSProperties = { marginBottom: 32 };
const h2Style: React.CSSProperties = { color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 12, marginTop: 0 };
const pStyle: React.CSSProperties = { color: "#999", fontSize: 15, lineHeight: 1.85, marginBottom: 12 };
const liStyle: React.CSSProperties = { color: "#999", fontSize: 15, lineHeight: 1.85, marginBottom: 8 };

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 48 }}>Last updated: August 2026</p>

        <div style={sectionStyle}>
          <p style={pStyle}>
            This Privacy Policy explains how VENUZEN (&quot;VENUZEN&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operated by
            Fozlul Hoque as a sole proprietor based in Gazipur, Bangladesh, collects, uses, and protects
            information when you visit venuzen.com (the &quot;Site&quot;), purchase a digital product, or engage our
            freelance services (collectively, the &quot;Services&quot;). By using the Site, you agree to the practices
            described in this policy.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Information We Collect</h2>
          <p style={pStyle}>We collect information you provide directly to us, including:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li style={liStyle}>Name, email address, and (optionally) postal address, submitted through our contact form, chat widget, or checkout process</li>
            <li style={liStyle}>Order details, including the product or service purchased, transaction ID, and payment method used</li>
            <li style={liStyle}>Messages you send us through the site chat, email, or WhatsApp</li>
            <li style={liStyle}>Newsletter subscription email addresses</li>
          </ul>
          <p style={pStyle}>We also automatically collect limited technical information when you visit the Site, including:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>IP address, approximate location (country/city), device type, browser, and operating system</li>
            <li style={liStyle}>Pages visited and general usage patterns, used to improve the Site</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>2. How We Use Your Information</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>To process and deliver digital product orders, including generating secure, time-limited download links</li>
            <li style={liStyle}>To communicate with you about your order, project, or inquiry</li>
            <li style={liStyle}>To provide customer support via our chat assistant, email, or WhatsApp</li>
            <li style={liStyle}>To send newsletter updates, only to users who have explicitly subscribed</li>
            <li style={liStyle}>To detect and prevent fraud, abuse, or unauthorized access</li>
            <li style={liStyle}>To improve the performance, security, and content of the Site</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>3. Payment Information</h2>
          <p style={pStyle}>
            VENUZEN does not directly store your full payment card details. Payments are processed through
            third-party payment providers and processors (such as our merchant of record and/or manual payment
            channels including Payoneer, Skrill, and Binance Pay). These providers maintain their own privacy
            policies governing how they handle your payment data.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>4. Sharing of Information</h2>
          <p style={pStyle}>We do not sell your personal information. We may share limited information with:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>Payment processors and our merchant of record, solely to complete and verify transactions</li>
            <li style={liStyle}>Service providers that host our Site, database, and email delivery (e.g. Supabase, Vercel, our email provider)</li>
            <li style={liStyle}>Legal or regulatory authorities, only where required by law</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Data Retention</h2>
          <p style={pStyle}>
            We retain order and communication records for as long as necessary to provide our Services, comply
            with legal and tax obligations, and resolve disputes. You may request deletion of your personal data
            at any time, subject to our legal retention requirements, by contacting us at the email below.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>6. Your Rights</h2>
          <p style={pStyle}>Depending on your location, you may have the right to:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={liStyle}>Request a copy of the personal information we hold about you</li>
            <li style={liStyle}>Request correction of inaccurate information</li>
            <li style={liStyle}>Request deletion of your personal information</li>
            <li style={liStyle}>Withdraw consent to marketing communications (e.g. unsubscribe from the newsletter) at any time</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>7. Cookies</h2>
          <p style={pStyle}>
            The Site may use essential cookies and similar technologies (such as local storage) to keep you
            signed into an active chat session and remember basic preferences. We do not use cookies for
            third-party advertising.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>8. Children&apos;s Privacy</h2>
          <p style={pStyle}>
            Our Services are not directed at children under 16, and we do not knowingly collect personal
            information from children.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>9. Changes to This Policy</h2>
          <p style={pStyle}>
            We may update this Privacy Policy from time to time. Material changes will be reflected by updating
            the &quot;Last updated&quot; date at the top of this page.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>10. Contact Us</h2>
          <p style={pStyle}>
            If you have questions about this Privacy Policy or wish to exercise any of your rights, contact us
            at:
          </p>
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
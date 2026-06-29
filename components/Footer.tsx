"use client";
export default function Footer() {
  return (
    <>
      {/* CTA Banner */}
      <section style={{ background: "#111", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
          <div>
            <div style={{ color: "#888", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Get in Touch</div>
            <div style={{ width: 40, height: 2, background: "#E8192C", marginBottom: 20 }}></div>
            <h2 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800 }}>Let&apos;s Create Something Great</h2>
          </div>
          <a href="mailto:fozlulhoqueinfo@gmail.com"
            style={{ background: "#E8192C", color: "#fff", padding: "16px 40px", fontWeight: 700, fontSize: 15, textDecoration: "none", borderRadius: 4, letterSpacing: 1 }}>
            Let&apos;s Talk
          </a>
        </div>
      </section>

      <div style={{ background: "#111", borderTop: "1px solid #222" }}></div>

      {/* Footer */}
      <footer style={{ background: "#111", padding: "60px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 60, flexWrap: "wrap", marginBottom: 48 }}>
          
          {/* Brand */}
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: 2, marginBottom: 24 }}>SEVENXP</div>
            <div style={{ color: "#ccc", fontSize: 14, marginBottom: 16 }}>🚀 What You Get:</div>
            {[
              "High-end Branding & Logo Design",
              "Conversion-Focused Website Development",
              "Premium UI/UX Systems",
              "Cinematic Video Editing & Motion Graphics",
              "Social Media Visual Domination",
              "Fast Delivery + Professional Communication",
            ].map((item, i) => (
              <div key={i} style={{ color: "#888", fontSize: 13, padding: "4px 0" }}>✔ {item}</div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {["𝕏", "📷", "💬"].map((icon, i) => (
                <a key={i} href="#" style={{ color: "#fff", fontSize: 18, textDecoration: "none", width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 24 }}>Links</div>
            {["BLOG", "ABOUT", "FAQS", "AUTHORS"].map(link => (
              <div key={link} style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: "#888", textDecoration: "none", fontSize: 13, letterSpacing: 1, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#E8192C"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#888"}>
                  {link}
                </a>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 24 }}>Contact Info</div>
            {[
              { icon: "✉️", text: "fozlulhoqueinfo@gmail.com" },
              { icon: "📍", text: "Gazipur sodor Gazipur 1702" },
              { icon: "📞", text: "+8801939828993" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontSize: 16 }}>{c.icon}</span>
                <span style={{ color: "#888", fontSize: 13 }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #222", paddingTop: 24, textAlign: "center" }}>
          <p style={{ color: "#555", fontSize: 13 }}>© 2026 Sevenxp . All Rights Reserved</p>
        </div>
      </footer>
    </>
  );
}

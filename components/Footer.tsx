"use client";
import { useState, useEffect } from "react";

const waNumber = "8801939828993";
const waLink = (msg: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim() || subscribing) return;
    setSubscribing(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );
      const { error } = await sb.from("newsletter").insert([{ email: email.trim() }]);
      if (!error) {
        setSent(true);
        setEmail("");
        setTimeout(() => setSent(false), 3000);
      } else if (error.code === "23505") {
        alert("This email is already subscribed.");
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch {
      alert("Something went wrong, please try again.");
    }
    setSubscribing(false);
  };

  return (
    <>
      {/* ===== CTA BANNER ===== */}
      <section style={{ background: "#0a0a0a", padding: "100px 32px", position: "relative", overflow: "hidden" }}>
        {/* Animated bg orbs */}
        <div style={{ position: "absolute", top: "50%", left: "10%", transform: "translateY(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,25,44,0.08) 0%, transparent 70%)", pointerEvents: "none", animation: "float 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "50%", right: "5%", transform: "translateY(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,25,44,0.05) 0%, transparent 70%)", pointerEvents: "none", animation: "float 8s ease-in-out infinite reverse" }} />

        {/* Grid lines bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(232,25,44,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,25,44,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 48 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 2, background: "#E8192C" }} />
                <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Get in Touch</span>
              </div>
              <h2 style={{ color: "#fff", fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
                Let&apos;s Create<br />
                <span style={{ color: "#E8192C" }}>Something Great</span>
              </h2>
              <p style={{ color: "#555", fontSize: 15, lineHeight: 1.7, maxWidth: 400 }}>
                Ready to take your brand to the next level? Let&apos;s talk and build something unforgettable together.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
              <a href={waLink("Hi! I want to discuss a project with SevenXP. Can we talk?")}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#E8192C", color: "#fff", padding: "18px 44px", fontWeight: 800, fontSize: 16, textDecoration: "none", borderRadius: 12, boxShadow: "0 8px 40px rgba(232,25,44,0.4)", transition: "all 0.3s ease", letterSpacing: 0.5, whiteSpace: "nowrap" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-4px) scale(1.02)"; el.style.boxShadow = "0 20px 60px rgba(232,25,44,0.6)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0) scale(1)"; el.style.boxShadow = "0 8px 40px rgba(232,25,44,0.4)"; }}>
                <span style={{ fontSize: 22 }}>💬</span> Let&apos;s Talk on WhatsApp
              </a>

              <div style={{ display: "flex", gap: 12 }}>
                <a href="mailto:fozlulhoqueinfo@gmail.com"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", color: "#888", padding: "12px 24px", fontWeight: 600, fontSize: 13, textDecoration: "none", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.3s ease" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#E8192C"; el.style.color = "#fff"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.color = "#888"; }}>
                  ✉️ Send Email
                </a>
                <a href="https://www.fiverr.com/s/vvN9q0e" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", color: "#888", padding: "12px 24px", fontWeight: 600, fontSize: 13, textDecoration: "none", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.3s ease" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#E8192C"; el.style.color = "#fff"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.color = "#888"; }}>
                  🟢 Fiverr Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "#060606", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "80px 32px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.2fr", gap: 60, marginBottom: 64, flexWrap: "wrap" }}>

            {/* Brand col */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 6, height: 28, background: "#E8192C", borderRadius: 2 }} />
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 3 }}>SEVENXP</span>
              </div>
              <p style={{ color: "#555", fontSize: 14, lineHeight: 1.8, marginBottom: 24, maxWidth: 280 }}>
                Premium creative digital services — Graphic Design, Web Development, Video Editing & Brand Identity. Let&apos;s build your dream brand.
              </p>

              {/* What you get */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>🚀 WHAT YOU GET</div>
                {["High-end Branding & Logo Design", "Conversion-Focused Websites", "Premium UI/UX Systems", "Cinematic Video Editing", "Social Media Domination", "Fast Delivery + Pro Support"].map((item, i) => (
                  <div key={i} style={{ color: "#555", fontSize: 13, padding: "4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#E8192C", fontSize: 10 }}>✓</span> {item}
                  </div>
                ))}
              </div>

              {/* Social icons */}
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { icon: "𝕏", href: "https://twitter.com/fozlulbd", title: "Twitter" },
                  { icon: "📷", href: "https://instagram.com", title: "Instagram" },
                  { icon: "💬", href: "https://wa.me/8801939828993?text=Hi!%20I%20want%20to%20discuss%20a%20project%20with%20SevenXP.%20Can%20we%20talk%3F", title: "WhatsApp" },
                  { icon: "in", href: "https://linkedin.com", title: "LinkedIn" },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title}
                    style={{ width: 38, height: 38, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontSize: 14, textDecoration: "none", transition: "all 0.3s ease", fontWeight: 700 }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(232,25,44,0.15)"; el.style.borderColor = "rgba(232,25,44,0.4)"; el.style.color = "#E8192C"; el.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(255,255,255,0.06)"; el.style.color = "#666"; el.style.transform = "translateY(0)"; }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links col */}
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 24, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Quick Links</div>
              {[
                { label: "Home", href: "#home" },
                { label: "About", href: "#about" },
                { label: "Services", href: "#services" },
                { label: "Projects", href: "#projects" },
                { label: "Contact", href: "#contact" },
                { label: "Blog", href: "#blog" },
              ].map((link, i) => (
                <a key={i} href={link.href}
                  style={{ display: "block", color: "#555", textDecoration: "none", fontSize: 14, padding: "7px 0", transition: "all 0.3s ease", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#E8192C"; el.style.paddingLeft = "8px"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#555"; el.style.paddingLeft = "0"; }}>
                  → {link.label}
                </a>
              ))}
            </div>

            {/* Services col */}
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 24, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Services</div>
              {["Graphic Design", "Web Development", "Video Editing", "Brand Identity", "UI/UX Design", "Social Media"].map((s, i) => (
                <a key={i} href="#services"
                  style={{ display: "block", color: "#555", textDecoration: "none", fontSize: 14, padding: "7px 0", transition: "all 0.3s ease", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#E8192C"; el.style.paddingLeft = "8px"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#555"; el.style.paddingLeft = "0"; }}>
                  → {s}
                </a>
              ))}
            </div>

            {/* Contact + Newsletter col */}
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 24, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Contact Info</div>

              {[
                { icon: "✉️", text: "fozlulhoqueinfo@gmail.com", href: "mailto:fozlulhoqueinfo@gmail.com" },
                { icon: "📍", text: "Gazipur Sodor, Gazipur 1702, Bangladesh", href: "#" },
                { icon: "📞", text: "+880 1939-828993", href: `tel:+8801939828993` },
                { icon: "💬", text: "WhatsApp: +880 1939-828993", href: waLink("Hi!") },
              ].map((c, i) => (
                <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer"
                  style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16, textDecoration: "none", transition: "all 0.3s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
                  <span style={{ color: "#555", fontSize: 13, lineHeight: 1.6 }}>{c.text}</span>
                </a>
              ))}

              {/* Newsletter */}
              <div style={{ marginTop: 28, padding: "20px", background: "rgba(232,25,44,0.05)", borderRadius: 12, border: "1px solid rgba(232,25,44,0.1)" }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>📬 Stay Updated</div>
                <div style={{ color: "#555", fontSize: 12, marginBottom: 12 }}>Get updates on new services & offers</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                    placeholder="your@email.com"
                    style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "8px 12px", borderRadius: 6, fontSize: 12, outline: "none" }}
                  />
                  <button onClick={handleSubscribe} disabled={subscribing}
                    style={{ background: "#E8192C", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 6, cursor: subscribing ? "not-allowed" : "pointer", fontSize: 14, transition: "all 0.3s", fontWeight: 700 }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#c0001e"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#E8192C"}>
                    {sent ? "✓" : subscribing ? "…" : "→"}
                  </button>
                </div>
                {sent && <div style={{ color: "#E8192C", fontSize: 11, marginTop: 8 }}>✓ Thanks! We&apos;ll be in touch.</div>}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ color: "#444", fontSize: 13 }}>
              © 2026 <span style={{ color: "#E8192C", fontWeight: 700 }}>SevenXP</span> · All Rights Reserved · Made with ❤️ by FozlulHoque
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Service", "Refund Policy"].map((t, i) => (
                <a key={i} href="#"
                  style={{ color: "#444", fontSize: 12, textDecoration: "none", transition: "color 0.3s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#E8192C"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#444"}>
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed", bottom: 32, right: 32, width: 48, height: 48,
          background: "#E8192C", color: "#fff", border: "none", borderRadius: 12,
          cursor: "pointer", fontSize: 18, fontWeight: 700, zIndex: 999,
          boxShadow: "0 8px 24px rgba(232,25,44,0.4)",
          opacity: scrollTop ? 1 : 0,
          transform: scrollTop ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.3s ease",
          pointerEvents: scrollTop ? "all" : "none",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 40px rgba(232,25,44,0.6)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(232,25,44,0.4)"; }}>
        ↑
      </button>
    </>
  );
}
export default function Hero() {
  return (
    <section style={{ background: "#111", minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 40, flexWrap: "wrap" }}>
        
        {/* Left Content */}
        <div style={{ flex: 1, minWidth: 300, maxWidth: 600 }}>
          <h1 style={{ color: "#fff", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 24 }}>
            👋 Hello, I&apos;m <span style={{ color: "#E8192C" }}>FozlulHoque</span>
          </h1>
          <p style={{ color: "#ccc", fontSize: 16, lineHeight: 1.8, marginBottom: 12 }}>
            Creative digital specialist behind <strong style={{ color: "#fff" }}>SEVEN</strong> — delivering premium Graphic Design, modern Web Development, and cinematic Video Editing solutions.
          </p>
          <p style={{ color: "#ccc", fontSize: 16, lineHeight: 1.8, marginBottom: 8 }}>
            I transform ideas into high-converting visuals and powerful digital experiences that help brands grow, sell, and stand out.
          </p>
          <p style={{ color: "#ccc", fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
            Let&apos;s build something unforgettable.
          </p>

          {/* Social + Skills */}
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#888", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>FIND WITH ME</div>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { href: "https://twitter.com", icon: "𝕏" },
                  { href: "https://instagram.com", icon: "📷" },
                  { href: "https://wa.me/8801939828993", icon: "💬" },
                ].map(({ href, icon }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#fff", fontSize: 20, textDecoration: "none", width: 40, height: 40, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: "#888", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>BEST SKILL ON</div>
              <div style={{ display: "flex", gap: 16 }}>
                {["</> ", "⬡", "◇"].map((icon, i) => (
                  <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#E8192C", fontSize: 16 }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Profile Image */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 280 }}>
          <div style={{ width: 340, height: 420, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", overflow: "hidden", background: "#1a1a1a", border: "3px solid #222", position: "relative" }}>
            {/* Placeholder - replace with your actual image */}
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "#555" }}>
                <div style={{ fontSize: 80, marginBottom: 16 }}>👤</div>
                <div style={{ fontSize: 13 }}>Add your photo to<br/>/public/profile.jpg</div>
              </div>
            </div>
            {/* Uncomment when you add your photo:
            <img src="/profile.jpg" alt="FozlulHoque" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            */}
          </div>
        </div>
      </div>
    </section>
  );
}

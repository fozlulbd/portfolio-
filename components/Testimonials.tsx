export default function Testimonials() {
  return (
    <section style={{ padding: "100px 24px", background: "#f8f8f8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 80, alignItems: "center", flexWrap: "wrap" }}>
        
        {/* Left images collage */}
        <div style={{ flex: 1, minWidth: 280, position: "relative", height: 420 }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "65%", height: "70%", background: "#ddd", borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 40 }}>👥</span>
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "55%", height: "55%", background: "#ccc", borderRadius: 8, overflow: "hidden", border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 36 }}>👩‍💼</span>
          </div>
        </div>

        {/* Right content */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ color: "#888", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Testimonials</div>
          <div style={{ width: 40, height: 2, background: "#E8192C", marginBottom: 20 }}></div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 32 }}>
            Customer Voices Hear What They Say!
          </h2>

          <div style={{ color: "#E8192C", fontSize: 40, marginBottom: 16 }}>&ldquo;&rdquo;</div>
          
          <p style={{ fontSize: 18, lineHeight: 1.7, fontWeight: 500, color: "#111", marginBottom: 16 }}>
            Working with FozlulHoque was an incredible experience. The designs were premium, delivered on time, and exceeded every expectation.
          </p>
          <p style={{ color: "#666", fontSize: 14, lineHeight: 1.8, marginBottom: 32 }}>
            The attention to detail and creative vision brought our brand to a completely new level. We saw a 40% increase in engagement within the first month of launching the new website and branding materials.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Savannah Nguyen</div>
              <div style={{ color: "#888", fontSize: 13 }}>Executive CEO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

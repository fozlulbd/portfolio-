const stats = [
  { value: "04", label: "Award winner" },
  { value: "753", label: "Worldwide client" },
  { value: "2k", label: "Job done successfully" },
];

const skills = [
  "High-impact brand visuals",
  "Conversion-focused website design",
  "Cinematic video editing & motion graphics",
  "Social media content that grabs attention",
  "Clean UI/UX with modern aesthetics",
];

export default function About() {
  return (
    <section id="about" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 80, alignItems: "center", flexWrap: "wrap" }}>
        
        {/* Left image */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ background: "#1a1a1a", borderRadius: 8, overflow: "hidden", aspectRatio: "4/5", display: "flex", alignItems: "center", justifyContent: "center", maxWidth: 480 }}>
            <div style={{ textAlign: "center", color: "#555" }}>
              <div style={{ fontSize: 60 }}>💻</div>
              <div style={{ fontSize: 12, marginTop: 12 }}>Add /public/about.jpg</div>
            </div>
            {/* <img src="/about.jpg" alt="About" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> */}
          </div>
        </div>

        {/* Right content */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ color: "#888", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>About Me</div>
          <div style={{ width: 40, height: 2, background: "#E8192C", marginBottom: 20 }}></div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 24 }}>
            I can develop that help people
          </h2>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 16 }}>
            I develop creative solutions that help people and businesses stand out — combining premium design, smart web development, and powerful video editing to create brands that truly make an impact.
          </p>
          
          <ul style={{ listStyle: "none", marginBottom: 32 }}>
            {skills.map((s, i) => (
              <li key={i} style={{ color: "#555", padding: "6px 0", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#E8192C" }}>◆</span> {s}
              </li>
            ))}
          </ul>

          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 8 }}>My goal is simple:</p>
          <p style={{ color: "#444", lineHeight: 1.8, marginBottom: 32 }}>
            To make your brand look premium, powerful, and unforgettable. Whether you&apos;re a startup, entrepreneur, content creator, or established brand — I help turn your vision into scroll-stopping designs and engaging digital experiences.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 48, marginBottom: 40, flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 36, fontWeight: 800, color: i === 0 ? "#E8192C" : "#111" }}>{s.value}</div>
                <div style={{ color: "#888", fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <a href="/resume.pdf" download
            style={{ display: "inline-block", background: "#E8192C", color: "#fff", padding: "14px 32px", fontWeight: 600, fontSize: 14, textDecoration: "none", borderRadius: 4, letterSpacing: 1 }}>
            Download My Resume
          </a>
        </div>
      </div>
    </section>
  );
}

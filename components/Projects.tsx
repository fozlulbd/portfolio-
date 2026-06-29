"use client";
const projects = [
  { title: "Mobile Application", category: "PACKAGE", bg: "#2a2a2a" },
  { title: "Website", category: "BRANDING", bg: "#333" },
  { title: "Grid Mockup", category: "BRANDING", bg: "#222" },
  { title: "Video Editing", category: "BRANDING", bg: "#1a1a1a" },
  { title: "Flyer Design", category: "BRANDING", bg: "#2d2d2d" },
];

export default function Projects() {
  return (
    <section id="projects" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ color: "#888", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Recent Projects</div>
          <div style={{ width: 40, height: 2, background: "#E8192C", marginBottom: 20 }}></div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, lineHeight: 1.2 }}>
            Bring to better disruptive view<br />of innovation.
          </h2>
        </div>

        {/* Big 2-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          {projects.slice(0, 2).map((p, i) => (
            <ProjectCard key={i} {...p} large />
          ))}
        </div>

        {/* 3-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {projects.slice(2).map((p, i) => (
            <ProjectCard key={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ title, category, bg, large = false }: { title: string; category: string; bg: string; large?: boolean }) {
  return (
    <div style={{ background: bg, borderRadius: 8, overflow: "hidden", cursor: "pointer", position: "relative", minHeight: large ? 360 : 240, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24, transition: "transform 0.2s" }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7))" }}></div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{title}</div>
        <div style={{ color: "#E8192C", fontSize: 11, letterSpacing: 2, fontWeight: 600 }}>{category}</div>
      </div>
    </div>
  );
}

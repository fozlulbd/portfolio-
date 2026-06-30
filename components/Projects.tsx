"use client";
import { useState, useEffect, useRef } from "react";

const projects = [
  { title: "Mobile Application", category: "PACKAGE", tags: ["UI/UX", "Mobile"], span: "col" },
  { title: "Website Branding", category: "BRANDING", tags: ["Web", "Design"], span: "col" },
  { title: "Grid Mockup", category: "BRANDING", tags: ["Print", "Brand"], span: "" },
  { title: "Video Editing", category: "BRANDING", tags: ["Motion", "Video"], span: "" },
  { title: "Flyer Design", category: "BRANDING", tags: ["Print", "Design"], span: "" },
];

const bgColors = ["#1a1a2e", "#16213e", "#0f3460", "#1a1a1a", "#2d2d2d"];

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("ALL");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const filters = ["ALL", "BRANDING", "PACKAGE", "WEB", "VIDEO"];

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered = filter === "ALL" ? projects : projects.filter(p => p.category === filter || p.tags.some(t => t.toUpperCase() === filter));

  return (
    <section id="projects" ref={sectionRef} style={{ padding: "120px 32px", background: "#0d0d0d", position: "relative" }}>
      {/* BG text */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(60px,10vw,150px)", fontWeight: 900, color: "rgba(255,255,255,0.02)", whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: 8 }}>PROJECTS</div>

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 60, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 2, background: "#E8192C" }}></div>
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Recent Projects</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 40 }}>
            Bring to better disruptive<br />view of innovation.
          </h2>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "#E8192C" : "transparent",
                  color: filter === f ? "#fff" : "#666",
                  border: `1px solid ${filter === f ? "#E8192C" : "#2a2a2a"}`,
                  padding: "8px 20px", borderRadius: 6, cursor: "pointer",
                  fontSize: 12, fontWeight: 600, letterSpacing: 1.5,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => { if (filter !== f) (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8192C"; }}
                onMouseLeave={e => { if (filter !== f) (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a"; }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {/* Large cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, gridColumn: "1 / -1" }}>
            {filtered.slice(0, 2).map((p, i) => (
              <ProjectCard key={i} p={p} i={i} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} bg={bgColors[i]} visible={visible} height={380} />
            ))}
          </div>
          {/* Small cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, gridColumn: "1 / -1" }}>
            {filtered.slice(2).map((p, i) => (
              <ProjectCard key={i + 2} p={p} i={i + 2} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} bg={bgColors[i + 2]} visible={visible} height={260} />
            ))}
          </div>
        </div>

        {/* View all */}
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <button style={{ background: "transparent", color: "#fff", border: "1px solid #333", padding: "14px 48px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, letterSpacing: 1, transition: "all 0.3s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8192C"; (e.currentTarget as HTMLButtonElement).style.color = "#E8192C"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#333"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}>
            View All Projects →
          </button>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, i, hoveredIndex, setHoveredIndex, bg, visible, height }: {
  p: { title: string; category: string; tags: string[] };
  i: number; hoveredIndex: number | null;
  setHoveredIndex: (n: number | null) => void;
  bg: string; visible: boolean; height: number;
}) {
  const isHovered = hoveredIndex === i;
  return (
    <div
      onMouseEnter={() => setHoveredIndex(i)}
      onMouseLeave={() => setHoveredIndex(null)}
      style={{
        background: bg, borderRadius: 16, overflow: "hidden",
        cursor: "pointer", position: "relative", height,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: 28, transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        transform: visible ? (isHovered ? "scale(1.02) translateY(-4px)" : "scale(1)") : "scale(0.95)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${i * 0.06}s`,
        boxShadow: isHovered ? "0 24px 60px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.3)",
        border: isHovered ? "1px solid rgba(232,25,44,0.3)" : "1px solid transparent",
      }}>
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: isHovered ? "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.85))" : "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))", transition: "all 0.4s" }}></div>
      
      {/* Red line on hover */}
      <div style={{ position: "absolute", top: 0, left: 0, width: isHovered ? "100%" : "0%", height: 3, background: "#E8192C", transition: "width 0.4s ease" }}></div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {p.tags.map(tag => (
            <span key={tag} style={{ background: "rgba(255,255,255,0.1)", color: "#ccc", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 500, backdropFilter: "blur(4px)" }}>{tag}</span>
          ))}
        </div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{p.title}</div>
        <div style={{ color: "#E8192C", fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>{p.category}</div>
      </div>

      {/* Arrow */}
      <div style={{ position: "absolute", top: 24, right: 24, width: 36, height: 36, borderRadius: "50%", background: isHovered ? "#E8192C" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, transition: "all 0.3s", transform: isHovered ? "rotate(-45deg)" : "rotate(0deg)" }}>↗</div>
    </div>
  );
}

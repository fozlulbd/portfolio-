"use client";
import { useEffect, useRef, useState } from "react";

const clients = [
  { name: "TechCorp", tagline: "Technology Solutions" },
  { name: "CreativeHub", tagline: "Design Agency" },
  { name: "BrandForce", tagline: "Marketing Platform" },
  { name: "DigitalX", tagline: "Digital Media" },
  { name: "StartupLab", tagline: "Innovation Center" },
  { name: "MediaPro", tagline: "Content Studio" },
  { name: "GrowthCo", tagline: "Business Growth" },
  { name: "WebWave", tagline: "Web Solutions" },
];

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "120px 32px", background: "#f7f7f7" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 2, background: "#E8192C" }}></div>
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Trusted By</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.2 }}>
            This list of brands aren&apos;t just<br />our clients.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, background: "#e5e5e5" }}>
          {clients.map((c, i) => (
            <div key={i}
              style={{
                background: "#fff", padding: "44px 28px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.3s ease",
                opacity: visible ? 1 : 0,
                transitionDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#0d0d0d"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontSize: 18, color: "#E8192C" }}>◇</div>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: "#333", textAlign: "center", textTransform: "uppercase" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{c.tagline}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

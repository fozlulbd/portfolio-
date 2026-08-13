"use client";
import { useEffect, useRef, useState } from "react";

const services = [
  { icon: "📱", title: "Mobile Apps Design", desc: "Beautiful, intuitive mobile interfaces that users love and businesses trust." },
  { icon: "🖥️", title: "UI/UX Design", desc: "User-centered designs that convert visitors into loyal customers." },
  { icon: "🌐", title: "Website Design", desc: "Stunning, responsive websites built for performance and impact." },
  { icon: "{}", title: "Web Development", desc: "Clean, scalable code with modern frameworks for fast, reliable sites." },
  { icon: "✏️", title: "Brand Identity", desc: "Logos and visual identities that make your brand unforgettable." },
  { icon: "🎬", title: "Video Editing", desc: "Cinematic edits and motion graphics that captivate your audience." },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} style={{ padding: isMobile ? "64px 20px" : "120px 32px", background: "#f7f7f7", position: "relative", overflow: "hidden" }}>
      {/* Background text */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(80px,12vw,180px)", fontWeight: 900, color: "rgba(0,0,0,0.025)", whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: 10, zIndex: 0 }}>
        SERVICES
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: isMobile ? 20 : 32, marginBottom: isMobile ? 40 : 72, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 2, background: "#E8192C" }}></div>
              <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Services</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 7vw, 52px)", fontWeight: 900, lineHeight: 1.15 }}>
              Unique Ideas for<br />Your Business
            </h2>
          </div>
          <p style={{ color: "#666", fontSize: isMobile ? 14 : 16, lineHeight: 1.85, maxWidth: 440 }}>
            We Envision, Design & Develop Digital Experiences that create possibilities in an ever-changing world. Every solution is crafted with purpose.
          </p>
        </div>

        {/* Grid — auto-fit/minmax already collapses to a single column safely
            on any phone width, no JS needed for the column count itself */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: isMobile ? 16 : 24 }}>
          {services.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                background: hoveredIndex === i ? "#E8192C" : "#fff",
                padding: isMobile ? "32px 24px" : "44px 36px",
                borderRadius: 16,
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                transform: visible ? (hoveredIndex === i && !isMobile ? "translateY(-12px) scale(1.02)" : "translateY(0)") : "translateY(40px)",
                opacity: visible ? 1 : 0,
                transitionDelay: `${i * 0.08}s`,
                boxShadow: hoveredIndex === i ? "0 24px 60px rgba(232,25,44,0.35)" : "0 4px 24px rgba(0,0,0,0.06)",
                position: "relative", overflow: "hidden",
              }}>
              {/* Icon */}
              <div style={{ fontSize: isMobile ? 34 : 42, marginBottom: isMobile ? 14 : 20, transition: "transform 0.3s ease", transform: hoveredIndex === i ? "scale(1.2) rotate(5deg)" : "scale(1)" }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 800, color: hoveredIndex === i ? "#fff" : "#111", marginBottom: isMobile ? 8 : 12, transition: "color 0.3s" }}>
                {s.title}
              </h3>
              <p style={{ color: hoveredIndex === i ? "rgba(255,255,255,0.85)" : "#888", fontSize: 14, lineHeight: 1.7, transition: "color 0.3s" }}>
                {s.desc}
              </p>

              {/* Arrow on hover — desktop only, no hover state exists on touch */}
              {!isMobile && (
                <div style={{
                  position: "absolute", bottom: 24, right: 24,
                  color: hoveredIndex === i ? "#fff" : "#E8192C",
                  fontSize: 20, fontWeight: 700,
                  opacity: hoveredIndex === i ? 1 : 0,
                  transform: hoveredIndex === i ? "translateX(0)" : "translateX(-10px)",
                  transition: "all 0.3s ease",
                }}>→</div>
              )}

              {/* Corner decoration */}
              <div style={{
                position: "absolute", top: -20, right: -20, width: 80, height: 80,
                borderRadius: "50%",
                background: hoveredIndex === i ? "rgba(255,255,255,0.1)" : "rgba(232,25,44,0.05)",
                transition: "all 0.4s",
              }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
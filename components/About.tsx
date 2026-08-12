"use client";
import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "Graphic Design", level: 95, icon: "🎨" },
  { name: "Web Development", level: 88, icon: "💻" },
  { name: "UI/UX Design", level: 92, icon: "✏️" },
  { name: "Video Editing", level: 85, icon: "🎬" },
  { name: "Brand Identity", level: 90, icon: "◇" },
];

const stats = [
  { value: "5+", label: "Years Exp." },
  { value: "753+", label: "Happy Clients" },
  { value: "200+", label: "Projects Done" },
  { value: "02", label: "Awards" },
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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); setTimeout(() => setSkillsVisible(true), 600); }
    }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: isMobile ? "64px 20px" : "120px 32px",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden", // required so the floating badges' negative offsets never cause a horizontal scrollbar
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 15% 50%, rgba(232,25,44,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: isMobile ? 56 : 80, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              minWidth: isMobile ? "100%" : 300,
              maxWidth: isMobile ? 360 : 500,
              width: isMobile ? "100%" : "auto",
              margin: isMobile ? "0 auto" : 0,
              boxSizing: "border-box",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-50px)",
              transition: "all 1s ease",
            }}
          >
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: isMobile ? -16 : -30, borderRadius: 40, background: "radial-gradient(circle, rgba(232,25,44,0.12) 0%, transparent 70%)", filter: "blur(30px)", zIndex: 0 }} />
              <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", aspectRatio: "4/5", border: "1px solid rgba(232,25,44,0.15)", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", zIndex: 1 }}>
                <img src="/about.jpg" alt="FozlulHoque" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.9))" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "20px" : "28px", zIndex: 2 }}>
                  <div style={{ color: "#fff", fontWeight: 900, fontSize: isMobile ? 18 : 22 }}>FozlulHoque</div>
                  <div style={{ color: "#E8192C", fontSize: isMobile ? 11 : 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>Creative Digital Specialist</div>
                </div>
                <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 60, borderTop: "3px solid #E8192C", borderLeft: "3px solid #E8192C", borderRadius: "28px 0 0 0", zIndex: 3 }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 60, height: 60, borderBottom: "3px solid #E8192C", borderRight: "3px solid #E8192C", borderRadius: "0 0 28px 0", zIndex: 3 }} />
              </div>

              {/* Floating badges — pulled in on mobile (instead of negative-offset
                  overhang) so they stay fully visible and never trigger overflow */}
              <div
                style={{
                  position: "absolute",
                  top: isMobile ? 16 : 32,
                  right: isMobile ? 8 : -32,
                  background: "rgba(10,10,10,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(232,25,44,0.25)",
                  borderRadius: 16,
                  padding: isMobile ? "10px 14px" : "16px 20px",
                  zIndex: 4,
                  animation: "float 4s ease-in-out infinite",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ color: "#E8192C", fontSize: isMobile ? 20 : 28, fontWeight: 900, lineHeight: 1 }}>5+</div>
                <div style={{ color: "#666", fontSize: isMobile ? 9 : 11, letterSpacing: 1, marginTop: 4 }}>YEARS EXP.</div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: isMobile ? 76 : 100,
                  left: isMobile ? 8 : -32,
                  background: "rgba(10,10,10,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: 16,
                  padding: isMobile ? "10px 14px" : "16px 20px",
                  zIndex: 4,
                  animation: "float 5s ease-in-out infinite reverse",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ color: "#3b82f6", fontSize: isMobile ? 20 : 28, fontWeight: 900, lineHeight: 1 }}>753+</div>
                <div style={{ color: "#666", fontSize: isMobile ? 9 : 11, letterSpacing: 1, marginTop: 4 }}>CLIENTS</div>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: isMobile ? -10 : -16,
                  left: isMobile ? 16 : 32,
                  background: "rgba(10,10,10,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: 50,
                  padding: isMobile ? "6px 14px" : "8px 18px",
                  zIndex: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ color: "#10b981", fontSize: isMobile ? 10 : 12, fontWeight: 700 }}>Available for Work</span>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1.2,
              minWidth: isMobile ? "100%" : 320,
              width: "100%",
              boxSizing: "border-box",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(50px)",
              transition: "all 1s ease 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 2, background: "#E8192C" }} />
              <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>About Me</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 7vw, 48px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 24, color: "#fff" }}>
              I can develop that<br /><span style={{ color: "#E8192C" }}>help people</span>
            </h2>
            <p style={{ color: "#666", lineHeight: 1.9, marginBottom: 28, fontSize: isMobile ? 14 : 15 }}>
              I develop creative solutions that help people and businesses stand out — combining premium design, smart web development, and powerful video editing to create brands that truly make an impact.
            </p>
            <div style={{ marginBottom: 32 }}>
              {["High-impact brand visuals", "Conversion-focused website design", "Cinematic video editing & motion graphics", "Social media content that grabs attention", "Clean UI/UX with modern aesthetics"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", color: "#aaa", fontSize: isMobile ? 13 : 14, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(232,25,44,0.12)", border: "1px solid rgba(232,25,44,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E8192C", fontSize: 11, flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ color: "#444", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>EXPERTISE LEVEL</div>
              {skills.map((skill, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>{skill.icon} {skill.name}</span>
                    <span style={{ fontSize: 13, color: "#E8192C", fontWeight: 800 }}>{skill.level}%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #E8192C, #ff6b6b)", width: skillsVisible ? skill.level + "%" : "0%", transition: "width 1.4s ease " + (i * 0.12) + "s", boxShadow: "0 0 12px rgba(232,25,44,0.5)" }} />
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                gap: isMobile ? 20 : 16,
                marginBottom: 36,
                background: "rgba(255,255,255,0.02)",
                borderRadius: 16,
                padding: isMobile ? "20px" : "24px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {stats.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: isMobile ? 26 : 32, fontWeight: 900, color: "#E8192C", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: "#555", fontSize: 11, letterSpacing: 1, marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href="/resume.pdf"
                download
                style={{
                  flex: isMobile ? "1 1 auto" : "0 0 auto",
                  justifyContent: "center",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#E8192C",
                  color: "#fff",
                  padding: isMobile ? "13px 24px" : "14px 32px",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  borderRadius: 10,
                  boxShadow: "0 8px 30px rgba(232,25,44,0.4)",
                }}
              >
                ↓ Download Resume
              </a>
              <a
                href="https://wa.me/8801939828993?text=Hi%20FozlulHoque!%20I%20want%20to%20hire%20you."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: isMobile ? "1 1 auto" : "0 0 auto",
                  justifyContent: "center",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  color: "#fff",
                  padding: isMobile ? "13px 24px" : "14px 32px",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                💬 Hire Me →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </section>
  );
}
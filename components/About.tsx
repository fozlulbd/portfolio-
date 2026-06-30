"use client";
import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "Graphic Design", level: 95 },
  { name: "Web Development", level: 88 },
  { name: "UI/UX Design", level: 92 },
  { name: "Video Editing", level: 85 },
  { name: "Brand Identity", level: 90 },
];

const stats = [
  { value: "04", label: "Award Winner", suffix: "" },
  { value: "753", label: "Happy Clients", suffix: "+" },
  { value: "2", label: "Jobs Done", suffix: "k+" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        setTimeout(() => setSkillsVisible(true), 600);
      }
    }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{ padding: "120px 32px", background: "#fff", position: "relative", overflow: "hidden" }}>
      {/* BG text */}
      <div style={{ position: "absolute", top: "50%", right: -80, transform: "translateY(-50%)", fontSize: 200, fontWeight: 900, color: "rgba(0,0,0,0.02)", pointerEvents: "none", letterSpacing: -10 }}>ABOUT</div>

      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 80, alignItems: "flex-start", flexWrap: "wrap" }}>
        
        {/* LEFT - Image */}
        <div style={{ flex: 1, minWidth: 280, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-40px)", transition: "all 1s ease" }}>
          <div style={{ position: "relative", maxWidth: 460 }}>
            {/* Main image box */}
            <div style={{
              background: "linear-gradient(135deg, #111 0%, #1d1d1d 100%)",
              borderRadius: 24, overflow: "hidden", aspectRatio: "4/5",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
              border: "1px solid #222",
            }}>
              <div style={{ textAlign: "center", color: "#444" }}>
                <div style={{ fontSize: 80 }}>💻</div>
                <div style={{ fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
                  Upload: <span style={{ color: "#E8192C" }}>/public/about.jpg</span>
                </div>
              </div>
              {/* <img src="/about.jpg" alt="FozlulHoque working" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> */}
            </div>

            {/* Experience badge */}
            <div style={{
              position: "absolute", bottom: -20, right: -20,
              background: "#E8192C", borderRadius: 16, padding: "20px 24px",
              boxShadow: "0 16px 40px rgba(232,25,44,0.4)",
              textAlign: "center",
            }}>
              <div style={{ color: "#fff", fontSize: 32, fontWeight: 900, lineHeight: 1 }}>5+</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>Years Exp.</div>
            </div>

            {/* Decoration ring */}
            <div style={{
              position: "absolute", top: -16, left: -16, width: 80, height: 80,
              border: "3px solid rgba(232,25,44,0.3)", borderRadius: "50%",
              animation: "float 4s ease-in-out infinite",
            }}></div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, minWidth: 300, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(40px)", transition: "all 1s ease 0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 2, background: "#E8192C" }}></div>
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>About Me</span>
          </div>

          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 24 }}>
            I can develop that<br /><span style={{ color: "#E8192C" }}>help people</span>
          </h2>

          <p style={{ color: "#555", lineHeight: 1.9, marginBottom: 16, fontSize: 15 }}>
            I develop creative solutions that help people and businesses stand out — combining premium design, smart web development, and powerful video editing to create brands that truly make an impact.
          </p>

          <ul style={{ listStyle: "none", marginBottom: 28 }}>
            {["High-impact brand visuals", "Conversion-focused website design", "Cinematic video editing & motion graphics", "Social media content that grabs attention", "Clean UI/UX with modern aesthetics"].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", color: "#444", fontSize: 14, opacity: visible ? 1 : 0, transition: `all 0.5s ease ${0.4 + i * 0.08}s`, transform: visible ? "translateX(0)" : "translateX(20px)" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E8192C", fontSize: 10, flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Skill bars */}
          <div style={{ marginBottom: 40 }}>
            {skills.map((skill, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{skill.name}</span>
                  <span style={{ fontSize: 13, color: "#E8192C", fontWeight: 700 }}>{skill.level}%</span>
                </div>
                <div style={{ height: 5, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    background: "linear-gradient(90deg, #E8192C, #ff6b6b)",
                    width: skillsVisible ? `${skill.level}%` : "0%",
                    transition: `width 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) ${i * 0.1}s`,
                    boxShadow: "0 2px 8px rgba(232,25,44,0.4)",
                  }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, marginBottom: 40, flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${0.6 + i * 0.1}s` }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: "#E8192C", lineHeight: 1 }}>{s.value}<span style={{ fontSize: 20 }}>{s.suffix}</span></div>
                <div style={{ color: "#888", fontSize: 12, letterSpacing: 1, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <a href="/resume.pdf" download
            style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#E8192C", color: "#fff", padding: "14px 32px", fontWeight: 700, fontSize: 14, textDecoration: "none", borderRadius: 10, boxShadow: "0 8px 30px rgba(232,25,44,0.35)", transition: "all 0.3s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}>
            ↓ Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}

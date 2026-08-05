"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const skills = [
  { name: "Graphic Design", level: 95, icon: "🎨", color: "#E8192C" },
  { name: "Web Development", level: 88, icon: "💻", color: "#3b82f6" },
  { name: "UI/UX Design", level: 92, icon: "✏️", color: "#8b5cf6" },
  { name: "Video Editing", level: 85, icon: "🎬", color: "#f59e0b" },
  { name: "Brand Identity", level: 90, icon: "◇", color: "#10b981" },
];

const tools = [
  { name: "Figma", color: "#F24E1E" },
  { name: "Photoshop", color: "#31A8FF" },
  { name: "Illustrator", color: "#FF9A00" },
  { name: "Premiere Pro", color: "#9999FF" },
  { name: "After Effects", color: "#9999FF" },
  { name: "Next.js", color: "#fff" },
  { name: "React", color: "#61DAFB" },
  { name: "Tailwind", color: "#38BDF8" },
];

const stats = [
  { value: "5+", label: "Years Exp." },
  { value: "753+", label: "Happy Clients" },
  { value: "2k+", label: "Projects Done" },
  { value: "04", label: "Awards" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        setTimeout(() => setSkillsVisible(true), 600);
      }
    }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{ padding: "120px 32px", background: "#0a0a0a", position: "relative", overflow: "hidden" }}>

      {/* BG effects */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 15% 50%, rgba(232,25,44,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: -100, transform: "translateY(-50%)", fontSize: 200, fontWeight: 900, color: "rgba(255,255,255,0.012)", pointerEvents: "none", letterSpacing: -10 }}>ABOUT</div>

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 80, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* ===== LEFT — Image ===== */}
          <div style={{ flex: 1, minWidth: 300, maxWidth: 500, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-50px)", transition: "all 1s ease" }}>
            <div style={{ position: "relative" }}>

              {/* Glow */}
              <div style={{ position: "absolute", inset: -30, borderRadius: 40, background: "radial-gradient(circle, rgba(232,25,44,0.12) 0%, transparent 70%)", filter: "blur(30px)", zIndex: 0 }} />

              {/* Main photo card */}
              <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", aspectRatio: "3/4", border: "1px solid rgba(232,25,44,0.15)", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", zIndex: 1 }}>
                <Image
                  src="/about.jpg"
                  alt="FozlulHoque - Creative Digital Specialist"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  priority
                />

                {/* Bottom gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.9))" }} />

                {/* Name caption at bottom */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px", zIndex: 2 }}>
                  <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 0.5 }}>FozlulHoque</div>
                  <div style={{ color: "#E8192C", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>Creative Digital Specialist</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {["Design", "Web", "Video"].map(tag => (
                      <span key={tag} style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", color: "#ccc", padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Animated corner accent */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 60, borderTop: "3px solid #E8192C", borderLeft: "3px solid #E8192C", borderRadius: "28px 0 0 0", zIndex: 3 }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 60, height: 60, borderBottom: "3px solid #E8192C", borderRight: "3px solid #E8192C", borderRadius: "0 0 28px 0", zIndex: 3 }} />
              </div>

              {/* Floating stat cards */}
              <div style={{ position: "absolute", top: 32, right: -32, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(232,25,44,0.25)", borderRadius: 16, padding: "16px 20px", zIndex: 4, animation: "float 4s ease-in-out infinite", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <div style={{ color: "#E8192C", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>5+</div>
                <div style={{ color: "#666", fontSize: 11, letterSpacing: 1, marginTop: 4 }}>YEARS EXP.</div>
              </div>

              <div style={{ position: "absolute", bottom: 100, left: -32, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 16, padding: "16px 20px", zIndex: 4, animation: "float 5s ease-in-out infinite reverse", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <div style={{ color: "#3b82f6", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>753+</div>
                <div style={{ color: "#666", fontSize: 11, letterSpacing: 1, marginTop: 4 }}>CLIENTS</div>
              </div>

              {/* Available badge */}
              <div style={{ position: "absolute", top: -16, left: 32, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 50, padding: "8px 18px", zIndex: 4, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 0 rgba(16,185,129,0.7)", animation: "pulse-ring 2s ease-out infinite" }} />
                <span style={{ color: "#10b981", fontSize: 12, fontWeight: 700 }}>Available for Work</span>
              </div>

              {/* Decorative ring */}
              <div style={{ position: "absolute", top: -30, left: -30, width: 100, height: 100, border: "1px solid rgba(232,25,44,0.12)", borderRadius: "50%", animation: "float 6s ease-in-out infinite", zIndex: 0 }} />
            </div>
          </div>

          {/* ===== RIGHT — Content ===== */}
          <div style={{ flex: 1.2, minWidth: 320, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(50px)", transition: "all 1s ease 0.2s" }}>

            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 2, background: "#E8192C" }} />
              <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>About Me</span>
            </div>

            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 24, color: "#fff" }}>
              I can develop that<br />
              <span style={{ color: "#E8192C" }}>help people</span>
            </h2>

            <p style={{ color: "#666", lineHeight: 1.9, marginBottom: 28, fontSize: 15 }}>
              I develop creative solutions that help people and businesses stand out — combining premium design, smart web development, and powerful video editing to create brands that truly make an impact.
            </p>

            {/* Checklist */}
            <div style={{ marginBottom: 32 }}>
              {["High-impact brand visuals", "Conversion-focused website design", "Cinematic video editing & motion graphics", "Social media content that grabs attention", "Clean UI/UX with modern aesthetics"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", color: "#aaa", fontSize: 14, opacity: visible ? 1 : 0, transition: `all 0.5s ease ${0.4 + i * 0.08}s`, transform: visible ? "translateX(0)" : "translateX(20px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(232,25,44,0.12)", border: "1px solid rgba(232,25,44,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E8192C", fontSize: 11, flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            {/* Skill bars */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ color: "#444", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>EXPERTISE LEVEL</div>
              {skills.map((skill, i) => (
                <div key={i}
                  onMouseEnter={() => setActiveSkill(i)}
                  onMouseLeave={() => setActiveSkill(null)}
                  style={{ marginBottom: 14, cursor: "default" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: activeSkill === i ? "#fff" : "#888", display: "flex", alignItems: "center", gap: 8, transition: "color 0.3s" }}>
                      <span>{skill.icon}</span>{skill.name}
                    </span>
                    <span style={{ fontSize: 13, color: skill.color, fontWeight: 800 }}>{skill.level}%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                      width: skillsVisible ? `${skill.level}%` : "0%",
                      transition: `width 1.4s cubic-bezier(0.25, 0.8, 0.25, 1) ${i * 0.12}s`,
                      boxShadow: `0 0 12px ${skill.color}66`,
                      position: "relative",
                    }}>
                      <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: "#fff", boxShadow: `0 0 8px ${skill.color}` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ color: "#444", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>TOOLS & TECHNOLOGIES</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tools.map((tool, i) => (
                  <div key={i}
                    onMouseEnter={() => setHoveredTool(tool.name)}
                    onMouseLeave={() => setHoveredTool(null)}
                    style={{
                      padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                      background: hoveredTool === tool.name ? `${tool.color}18` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${hoveredTool === tool.name ? tool.color + "66" : "rgba(255,255,255,0.06)"}`,
                      color: hoveredTool === tool.name ? tool.color : "#555",
                      cursor: "default", transition: "all 0.3s ease",
                      transform: hoveredTool === tool.name ? "translateY(-3px)" : "translateY(0)",
                      opacity: visible ? 1 : 0,
                      transitionDelay: `${0.6 + i * 0.05}s`,
                      boxShadow: hoveredTool === tool.name ? `0 8px 20px ${tool.color}22` : "none",
                    }}>
                    {tool.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36, background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
              {stats.map((s, i) => (
                <div key={i} style={{ textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${0.6 + i * 0.1}s` }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#E8192C", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: "#555", fontSize: 11, letterSpacing: 1, marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="/resume.pdf" download
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#E8192C", color: "#fff", padding: "14px 32px", fontWeight: 700, fontSize: 14, textDecoration: "none", borderRadius: 10, boxShadow: "0 8px 30px rgba(232,25,44,0.4)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 16px 40px rgba(232,25,44,0.6)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 8px 30px rgba(232,25,44,0.4)"; }}>
                ↓ Download Resume
              </a>
              <a href={`https://wa.me/8801939828993?text=${encodeURIComponent("Hi FozlulHoque! I want to hire you for a project.")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: "#fff", padding: "14px 32px", fontWeight: 700, fontSize: 14, textDecoration: "none", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#E8192C"; el.style.color = "#E8192C"; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.color = "#fff"; el.style.transform = "translateY(0)"; }}>
                💬 Hire Me →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

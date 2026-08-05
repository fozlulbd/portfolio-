"use client";
import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Savannah Nguyen",
    role: "Executive CEO",
    country: "🇺🇸 United States",
    platform: "Fiverr",
    rating: 5,
    date: "March 2026",
    avatar: "SN",
    color: "#E8192C",
    text: "Working with FozlulHoque completely transformed our brand. The designs are premium, delivery was fast, and attention to detail is unmatched. We saw 40% more engagement within the first month of launching!",
    service: "Brand Identity Package",
    verified: true,
  },
  {
    name: "James Whitfield",
    role: "Marketing Director",
    country: "🇬🇧 United Kingdom",
    platform: "Upwork",
    rating: 5,
    date: "February 2026",
    avatar: "JW",
    color: "#3b82f6",
    text: "Absolutely incredible work! FozlulHoque built our website from scratch — it looks like a million-dollar production. Our clients constantly compliment us on the design quality. 100% recommend!",
    service: "Web Development",
    verified: true,
  },
  {
    name: "Priya Sharma",
    role: "Startup Founder",
    country: "🇮🇳 India",
    platform: "Fiverr",
    rating: 5,
    date: "January 2026",
    avatar: "PS",
    color: "#8b5cf6",
    text: "From logo to full website, every element was crafted with care. I felt heard throughout the process. FozlulHoque is the real deal — highly recommend to anyone serious about their brand image.",
    service: "Complete Brand Package",
    verified: true,
  },
  {
    name: "Ahmed Al-Rashid",
    role: "E-Commerce Owner",
    country: "🇦🇪 UAE",
    platform: "Freelancer",
    rating: 5,
    date: "December 2025",
    avatar: "AA",
    color: "#f59e0b",
    text: "Best freelancer I've ever worked with! The video editing was cinematic quality, fast delivery, and the communication was always professional. My product videos now get 3x more views. Truly exceptional!",
    service: "Video Editing",
    verified: true,
  },
  {
    name: "Maria Garcia",
    role: "Brand Manager",
    country: "🇪🇸 Spain",
    platform: "Fiverr",
    rating: 5,
    date: "November 2025",
    avatar: "MG",
    color: "#10b981",
    text: "FozlulHoque designed our complete UI/UX in Figma and it was beyond perfect. Clean, modern, and exactly what our users needed. The prototype was so good our investors were impressed. Will hire again!",
    service: "UI/UX Design",
    verified: true,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo("right"), 6000);
    return () => clearInterval(t);
  }, [current]);

  const goTo = (dir: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimDir(dir);
    setTimeout(() => {
      setCurrent(c => dir === "right" ? (c + 1) % testimonials.length : (c - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 350);
  };

  const t = testimonials[current];

  return (
    <section ref={sectionRef} style={{ padding: "120px 32px", background: "#f5f5f5", position: "relative", overflow: "hidden" }}>
      {/* BG decoration */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 300, fontWeight: 900, color: "rgba(232,25,44,0.03)", lineHeight: 1, pointerEvents: "none" }}>&ldquo;</div>

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 2, background: "#E8192C" }} />
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Testimonials</span>
            <div style={{ width: 40, height: 2, background: "#E8192C" }} />
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.2, color: "#111" }}>
            Customer Voices<br />
            <span style={{ color: "#E8192C" }}>Hear What They Say!</span>
          </h2>

          {/* Overall rating bar */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32, marginTop: 32, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#111", lineHeight: 1 }}>5.0</div>
              <div style={{ display: "flex", gap: 3, justifyContent: "center", margin: "6px 0" }}>
                {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#E8192C", fontSize: 20 }}>{s}</span>)}
              </div>
              <div style={{ color: "#888", fontSize: 12 }}>Overall Rating</div>
            </div>
            <div style={{ width: 1, height: 60, background: "#ddd" }} />
            {[{ val: "753+", label: "Reviews" }, { val: "100%", label: "Positive" }, { val: "5★", label: "Fiverr Score" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#E8192C" }}>{s.val}</div>
                <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main review card */}
        <div style={{ display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>

          {/* Left — stacked mini cards */}
          <div style={{ flex: 1, minWidth: 280, position: "relative", height: 460, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-40px)", transition: "all 1s ease" }}>
            {testimonials.map((tc, i) => {
              const offset = (i - current + testimonials.length) % testimonials.length;
              const isActive = offset === 0;
              const isNext = offset === 1;
              const isPrev = offset === testimonials.length - 1;
              if (!isActive && !isNext && !isPrev) return null;
              return (
                <div key={i} style={{
                  position: "absolute",
                  width: isActive ? "85%" : "75%",
                  left: isActive ? "0" : isNext ? "15%" : "5%",
                  top: isActive ? "0" : isNext ? "60px" : "30px",
                  background: isActive ? "#111" : "#fff",
                  borderRadius: 20,
                  padding: "28px",
                  boxShadow: isActive ? "0 24px 60px rgba(0,0,0,0.25)" : "0 8px 30px rgba(0,0,0,0.08)",
                  border: isActive ? `1px solid rgba(232,25,44,0.3)` : "1px solid #eee",
                  transition: "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  zIndex: isActive ? 3 : isNext ? 1 : 2,
                  opacity: isActive ? 1 : 0.6,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: tc.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16, flexShrink: 0 }}>{tc.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: isActive ? "#fff" : "#111" }}>{tc.name}</div>
                      <div style={{ color: isActive ? "#888" : "#aaa", fontSize: 12 }}>{tc.role}</div>
                    </div>
                    <div style={{ marginLeft: "auto", background: isActive ? "rgba(232,25,44,0.15)" : "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: isActive ? "#E8192C" : "#888" }}>{tc.platform}</div>
                  </div>
                  <p style={{ color: isActive ? "#bbb" : "#888", fontSize: 13, lineHeight: 1.7 }}>{tc.text.slice(0, 100)}...</p>
                  <div style={{ display: "flex", gap: 2, marginTop: 12 }}>
                    {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#E8192C", fontSize: 14 }}>{s}</span>)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right — Featured review */}
          <div style={{ flex: 1, minWidth: 320, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(40px)", transition: "all 1s ease 0.2s" }}>

            {/* Platform badge */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <span style={{ background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.2)", color: "#E8192C", padding: "5px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>🟢 {t.platform} Verified</span>
              <span style={{ background: "rgba(0,0,0,0.05)", color: "#888", padding: "5px 14px", borderRadius: 50, fontSize: 12 }}>{t.date}</span>
              <span style={{ background: "rgba(0,0,0,0.05)", color: "#888", padding: "5px 14px", borderRadius: 50, fontSize: 12 }}>{t.country}</span>
            </div>

            {/* Big quote card */}
            <div style={{
              background: "#fff", borderRadius: 24, padding: "40px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              border: "1px solid rgba(232,25,44,0.08)",
              position: "relative", overflow: "hidden",
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? `translateX(${animDir === "right" ? "30px" : "-30px"})` : "translateX(0)",
              transition: "all 0.35s ease",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, #E8192C, ${t.color})` }} />

              {/* Service tag */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,25,44,0.06)", border: "1px solid rgba(232,25,44,0.12)", padding: "4px 12px", borderRadius: 50, marginBottom: 20 }}>
                <span style={{ color: "#E8192C", fontSize: 10 }}>●</span>
                <span style={{ color: "#E8192C", fontSize: 11, fontWeight: 700 }}>{t.service}</span>
              </div>

              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#E8192C", fontSize: 22 }}>{s}</span>)}
              </div>

              <div style={{ color: "#E8192C", fontSize: 56, lineHeight: 0.8, marginBottom: 20, fontFamily: "Georgia, serif" }}>&ldquo;</div>

              <p style={{ fontSize: 17, lineHeight: 1.85, color: "#333", fontWeight: 500, marginBottom: 32 }}>
                {t.text}
              </p>

              {/* Reviewer */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: `linear-gradient(135deg, ${t.color}, ${t.color}aa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18, boxShadow: `0 8px 20px ${t.color}44`, flexShrink: 0 }}>
                  {t.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#111", display: "flex", alignItems: "center", gap: 8 }}>
                    {t.name}
                    {t.verified && <span style={{ background: "#E8192C", color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>✓ VERIFIED</span>}
                  </div>
                  <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>{t.role} · {t.country}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#E8192C", fontWeight: 800, fontSize: 13 }}>{t.platform}</div>
                  <div style={{ color: "#bbb", fontSize: 11, marginTop: 2 }}>{t.date}</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28 }}>
              {/* Dots */}
              <div style={{ display: "flex", gap: 6 }}>
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => { setAnimDir(i > current ? "right" : "left"); setCurrent(i); }}
                    style={{ width: i === current ? 28 : 8, height: 8, borderRadius: 4, background: i === current ? "#E8192C" : "#ddd", border: "none", cursor: "pointer", transition: "all 0.4s ease", padding: 0 }} />
                ))}
              </div>

              <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                <button onClick={() => goTo("left")}
                  style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid #eee", background: "#fff", cursor: "pointer", fontSize: 16, transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E8192C"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8192C"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.color = "#111"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#eee"; }}>
                  ←
                </button>
                <button onClick={() => goTo("right")}
                  style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: "#E8192C", color: "#fff", cursor: "pointer", fontSize: 16, transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(232,25,44,0.3)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
                  →
                </button>
              </div>

              {/* Counter */}
              <div style={{ color: "#aaa", fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: "#E8192C", fontWeight: 800 }}>{current + 1}</span>/{testimonials.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
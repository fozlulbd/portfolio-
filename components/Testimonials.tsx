"use client";
import { useState, useEffect, useRef } from "react";

const testimonials = [
  { name: "Savannah Nguyen", role: "Executive CEO", text: "Working with FozlulHoque completely transformed our brand. The designs are premium, the delivery was fast, and the attention to detail is unmatched. We saw 40% more engagement within the first month!", avatar: "👩‍💼" },
  { name: "James Whitfield", role: "Marketing Director", text: "Absolutely incredible work! FozlulHoque built our website from scratch and it looks like a million-dollar production. Our clients constantly compliment us on the design quality.", avatar: "👨‍💼" },
  { name: "Priya Sharma", role: "Startup Founder", text: "From logo to full website, every single element was crafted with care. I felt heard throughout the process. FozlulHoque is the real deal — highly recommend to anyone serious about their brand.", avatar: "👩‍🚀" },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[current];

  return (
    <section ref={sectionRef} style={{ padding: "120px 32px", background: "#f7f7f7", position: "relative", overflow: "hidden" }}>
      {/* Big quote bg */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 400, fontWeight: 900, color: "rgba(232,25,44,0.03)", lineHeight: 1, pointerEvents: "none", zIndex: 0 }}>&ldquo;</div>

      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 80, alignItems: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        
        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 280, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-40px)", transition: "all 1s ease" }}>
          <div style={{ position: "relative", height: 420 }}>
            {/* Photo collage */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "60%", height: "65%", background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              👥
              {/* <img src="/testimonial-1.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> */}
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "55%", background: "linear-gradient(135deg, #222, #333)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: "4px solid #f7f7f7", overflow: "hidden" }}>
              👩‍💼
              {/* <img src="/testimonial-2.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> */}
            </div>
            {/* Red accent */}
            <div style={{ position: "absolute", top: "30%", right: "35%", width: 60, height: 60, borderRadius: "50%", background: "#E8192C", boxShadow: "0 8px 24px rgba(232,25,44,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 900 }}>★</div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, minWidth: 300, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(40px)", transition: "all 1s ease 0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 2, background: "#E8192C" }}></div>
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Testimonials</span>
          </div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 40 }}>
            Customer Voices<br />Hear What They Say!
          </h2>

          {/* Quote card */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 40px", boxShadow: "0 16px 60px rgba(0,0,0,0.08)", border: "1px solid rgba(232,25,44,0.1)", position: "relative", overflow: "hidden", transition: "all 0.5s ease" }}>
            {/* Top red line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #E8192C, transparent)" }}></div>
            
            <div style={{ color: "#E8192C", fontSize: 64, lineHeight: 1, marginBottom: 16, fontFamily: "Georgia, serif" }}>&ldquo;</div>
            
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "#333", fontWeight: 500, marginBottom: 28, fontStyle: "italic" }}>
              {t.text}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #E8192C, #ff6b6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 16px rgba(232,25,44,0.3)" }}>{t.avatar}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{t.name}</div>
                <div style={{ color: "#888", fontSize: 13 }}>{t.role}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#E8192C", fontSize: 16 }}>★</span>)}
              </div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", gap: 8, marginTop: 24, alignItems: "center" }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                style={{ width: i === current ? 28 : 8, height: 8, borderRadius: 4, background: i === current ? "#E8192C" : "#ddd", border: "none", cursor: "pointer", transition: "all 0.4s ease" }} />
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
              <button onClick={() => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length)}
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 16, transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E8192C"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8192C"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.color = "#111"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#ddd"; }}>
                ←
              </button>
              <button onClick={() => setCurrent(c => (c + 1) % testimonials.length)}
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid #E8192C", background: "#E8192C", color: "#fff", cursor: "pointer", fontSize: 16, transition: "all 0.3s" }}>
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";

const plans = [
  {
    icon: "🌐",
    title: "Web Development",
    price: 69,
    desc: "Perfect for businesses needing a fast, modern website",
    features: ["Premium UI/UX Design", "Responsive & Mobile-First", "SEO Optimized Code", "5 Pages Included", "Free Revision Round", "Fast 7-Day Delivery"],
    dark: false, popular: false,
  },
  {
    icon: "◇",
    title: "Static Frontend Design",
    price: 99,
    desc: "Complete branding + web solution for serious brands",
    features: ["Everything in Web Dev", "Custom Brand Identity", "Logo Design Included", "10 Pages + Blog", "Priority Support", "Express 5-Day Delivery"],
    dark: true, popular: true,
  },
  {
    icon: "🎬",
    title: "Brand Package",
    price: 149,
    desc: "Full-service creative package for maximum impact",
    features: ["Everything in Frontend", "Video Editing (2 videos)", "Social Media Kit", "Unlimited Revisions", "1 Month Support", "Rush 3-Day Delivery"],
    dark: false, popular: false,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} style={{ padding: "120px 32px", background: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(60px,10vw,150px)", fontWeight: 900, color: "rgba(0,0,0,0.02)", whiteSpace: "nowrap", pointerEvents: "none" }}>PRICING</div>

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 2, background: "#E8192C" }}></div>
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Pricing</span>
            <div style={{ width: 40, height: 2, background: "#E8192C" }}></div>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, marginBottom: 16 }}>
            Stay chill and pick your plan
          </h2>
          <p style={{ color: "#888", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
            Choose the package that fits your vision. Every plan includes professional communication and timely delivery.
          </p>

          {/* Ratings */}
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 36, flexWrap: "wrap" }}>
            {[{ label: "Communication", val: 4.3 }, { label: "Recommend", val: 5.0 }, { label: "On-time Delivery", val: 4.8 }].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#E8192C", fontSize: 14 }}>★</span>)}
                </div>
                <span style={{ color: "#888", fontSize: 13 }}>{r.label}: <strong style={{ color: "#111" }}>{r.val}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "start" }}>
          {plans.map((plan, i) => (
            <div key={i}
              style={{
                background: plan.dark ? "#0d0d0d" : "#f8f8f8",
                borderRadius: 20, padding: "44px 36px",
                position: "relative", overflow: "hidden",
                border: plan.popular ? "2px solid #E8192C" : "1px solid transparent",
                transform: visible ? (plan.popular ? "scale(1.05) translateY(-8px)" : "scale(1)") : "scale(0.95)",
                opacity: visible ? 1 : 0,
                transition: `all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) ${i * 0.1}s`,
                boxShadow: plan.popular ? "0 24px 80px rgba(232,25,44,0.2)" : "none",
              }}>
              
              {plan.popular && (
                <div style={{ position: "absolute", top: 20, right: 20, background: "#E8192C", color: "#fff", padding: "4px 14px", borderRadius: 50, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>POPULAR</div>
              )}

              <div style={{ fontSize: 40, marginBottom: 20 }}>{plan.icon}</div>
              <h3 style={{ color: plan.dark ? "#fff" : "#111", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{plan.title}</h3>
              <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>{plan.desc}</p>

              <div style={{ marginBottom: 28 }}>
                <span style={{ color: "#E8192C", fontSize: 16, fontWeight: 700 }}>$</span>
                <span style={{ color: plan.dark ? "#fff" : "#111", fontSize: 48, fontWeight: 900 }}>{plan.price}</span>
                <span style={{ color: "#888", fontSize: 14 }}>/project</span>
              </div>

              <ul style={{ listStyle: "none", marginBottom: 36 }}>
                {plan.features.map((f, fi) => (
                  <li key={fi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", color: plan.dark ? "#bbb" : "#555", fontSize: 14, borderBottom: `1px solid ${plan.dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    <span style={{ color: "#E8192C", fontSize: 14, flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              <button
                style={{ width: "100%", padding: "14px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14, letterSpacing: 1, transition: "all 0.3s ease", background: plan.popular ? "#E8192C" : "transparent", color: plan.popular ? "#fff" : "#E8192C", border: "2px solid #E8192C", boxShadow: plan.popular ? "0 8px 30px rgba(232,25,44,0.35)" : "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E8192C"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { if (!plan.popular) { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#E8192C"; } (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
                Order Now →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

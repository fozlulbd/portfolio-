"use client";
import { useEffect, useRef, useState } from "react";

const categories = [
  { id: "design", label: "🎨 Graphic Design" },
  { id: "web", label: "💻 Web Development" },
  { id: "video", label: "🎬 Video Editing" },
  { id: "brand", label: "◇ Brand Identity" },
  { id: "uiux", label: "✏️ UI/UX Design" },
];

const allPlans: Record<string, {
  title: string; price: number; desc: string;
  features: string[]; popular: boolean; delivery: string; revision: string;
}[]> = {
  design: [
    {
      title: "Basic Design",
      price: 25,
      desc: "Perfect for small businesses & startups",
      delivery: "3 Days",
      revision: "2 Revisions",
      popular: false,
      features: ["Social Media Post (5)", "Business Card Design", "Basic Logo", "PNG + PDF Files", "Source File Included"],
    },
    {
      title: "Standard Design",
      price: 55,
      desc: "Complete graphic design package",
      delivery: "5 Days",
      revision: "5 Revisions",
      popular: true,
      features: ["Social Media Kit (15 posts)", "Flyer + Poster Design", "Professional Logo", "All File Formats", "Brand Color Palette", "Fast Communication"],
    },
    {
      title: "Premium Design",
      price: 99,
      desc: "Full branding & design domination",
      delivery: "7 Days",
      revision: "Unlimited",
      popular: false,
      features: ["Complete Social Media Kit", "Full Branding Package", "Logo + Variations", "Business Card + Letterhead", "Brand Style Guide", "Priority Support", "All Source Files"],
    },
  ],
  web: [
    {
      title: "Basic Website",
      price: 49,
      desc: "Simple & clean website",
      delivery: "5 Days",
      revision: "3 Revisions",
      popular: false,
      features: ["3 Page Website", "Mobile Responsive", "Contact Form", "Basic SEO", "Fast Loading"],
    },
    {
      title: "Standard Website",
      price: 99,
      desc: "Professional business website",
      delivery: "7 Days",
      revision: "5 Revisions",
      popular: true,
      features: ["7 Page Website", "Mobile Responsive", "Admin Dashboard", "SEO Optimized", "Google Analytics", "Contact + WhatsApp Button", "1 Month Support"],
    },
    {
      title: "Premium Website",
      price: 199,
      desc: "Full-stack custom web solution",
      delivery: "14 Days",
      revision: "Unlimited",
      popular: false,
      features: ["Unlimited Pages", "Custom Design", "E-commerce Ready", "Payment Integration", "Advanced SEO", "Speed Optimized", "3 Months Support", "Free Domain Setup"],
    },
  ],
  video: [
    {
      title: "Basic Edit",
      price: 20,
      desc: "Simple video editing",
      delivery: "2 Days",
      revision: "2 Revisions",
      popular: false,
      features: ["Up to 3 Min Video", "Basic Cuts & Transitions", "Background Music", "Color Correction", "MP4 Export"],
    },
    {
      title: "Standard Edit",
      price: 45,
      desc: "Cinematic video production",
      delivery: "4 Days",
      revision: "4 Revisions",
      popular: true,
      features: ["Up to 8 Min Video", "Professional Transitions", "Motion Graphics", "Color Grading", "Sound Design", "Subtitles Included", "HD Export"],
    },
    {
      title: "Premium Edit",
      price: 89,
      desc: "Hollywood-style production",
      delivery: "7 Days",
      revision: "Unlimited",
      popular: false,
      features: ["Up to 20 Min Video", "Advanced Motion Graphics", "Visual Effects (VFX)", "Pro Color Grading", "Custom Intro/Outro", "Multiple Formats", "4K Export"],
    },
  ],
  brand: [
    {
      title: "Basic Brand",
      price: 35,
      desc: "Logo & basic identity",
      delivery: "3 Days",
      revision: "3 Revisions",
      popular: false,
      features: ["Logo Design (2 Concepts)", "PNG + Vector Files", "Color Palette", "Basic Style Guide", "Commercial Rights"],
    },
    {
      title: "Standard Brand",
      price: 75,
      desc: "Complete brand identity package",
      delivery: "6 Days",
      revision: "5 Revisions",
      popular: true,
      features: ["Logo + 3 Variations", "Full Color System", "Typography Guide", "Business Card", "Letterhead Design", "Brand Guidelines PDF", "All Source Files"],
    },
    {
      title: "Premium Brand",
      price: 149,
      desc: "Million-dollar brand transformation",
      delivery: "10 Days",
      revision: "Unlimited",
      popular: false,
      features: ["Complete Brand System", "Logo + All Variations", "Full Brand Guidelines", "Business Card + Stationery", "Social Media Templates", "Email Signature", "Brand Strategy Included"],
    },
  ],
  uiux: [
    {
      title: "Basic UI",
      price: 40,
      desc: "Clean UI design for your app",
      delivery: "4 Days",
      revision: "2 Revisions",
      popular: false,
      features: ["Up to 5 Screens", "Mobile or Web", "Figma File", "Basic Prototype", "Design System"],
    },
    {
      title: "Standard UI/UX",
      price: 89,
      desc: "Full UI/UX design experience",
      delivery: "7 Days",
      revision: "5 Revisions",
      popular: true,
      features: ["Up to 15 Screens", "Mobile + Web", "Interactive Prototype", "User Flow Diagram", "Figma + Source Files", "Component Library", "Handoff Ready"],
    },
    {
      title: "Premium UI/UX",
      price: 169,
      desc: "Complete product design system",
      delivery: "14 Days",
      revision: "Unlimited",
      popular: false,
      features: ["Unlimited Screens", "Full Design System", "Advanced Prototype", "User Research", "Wireframes Included", "Animation Specs", "Developer Handoff", "1 Month Support"],
    },
  ],
};

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

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("design");
  const [animating, setAnimating] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const switchCategory = (id: string) => {
    setAnimating(true);
    setTimeout(() => {
      setActiveCategory(id);
      setAnimating(false);
    }, 300);
  };

  const plans = allPlans[activeCategory];
  const waNumber = "8801939828993";

  const getWALink = (plan: { title: string; price: number }) => {
    const msg = encodeURIComponent(`Hi! I want to order the "${plan.title}" package ($${plan.price}). Please share more details.`);
    return `https://wa.me/${waNumber}?text=${msg}`;
  };

  return (
    <section id="pricing" ref={sectionRef} style={{ padding: isMobile ? "64px 20px" : "120px 32px", background: "#0a0a0a", position: "relative", overflow: "hidden" }}>
      {/* BG */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(60px,10vw,160px)", fontWeight: 900, color: "rgba(255,255,255,0.015)", whiteSpace: "nowrap", pointerEvents: "none" }}>PRICING</div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(232,25,44,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 60, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 2, background: "#E8192C" }} />
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Pricing</span>
            <div style={{ width: 40, height: 2, background: "#E8192C" }} />
          </div>
          <h2 style={{ fontSize: "clamp(26px, 6.5vw, 52px)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
            Stay chill and pick your plan
          </h2>
          <p style={{ color: "#666", fontSize: isMobile ? 14 : 15, maxWidth: 500, margin: "0 auto 36px" }}>
            Choose the package that fits your vision. Every plan includes professional communication and fast delivery.
          </p>

          {/* Ratings */}
          <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 16 : 32, flexWrap: "wrap", marginBottom: isMobile ? 32 : 48 }}>
            {[{ label: "Communication", val: "4.3" }, { label: "Recommend", val: "5.0" }, { label: "On-time Delivery", val: "4.8" }].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex" }}>{"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#E8192C", fontSize: 14 }}>{s}</span>)}</div>
                <span style={{ color: "#888", fontSize: 13 }}>{r.label}: <strong style={{ color: "#fff" }}>{r.val}</strong></span>
              </div>
            ))}
          </div>

          {/* Category Tabs — horizontally scrollable on mobile instead of
              wrapping into many rows, which was eating a lot of vertical space */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: isMobile ? "flex-start" : "center",
              flexWrap: isMobile ? "nowrap" : "wrap",
              overflowX: isMobile ? "auto" : "visible",
              WebkitOverflowScrolling: "touch",
              paddingBottom: isMobile ? 4 : 0,
              margin: isMobile ? "0 -20px" : 0,
              paddingLeft: isMobile ? 20 : 0,
              paddingRight: isMobile ? 20 : 0,
            }}
          >
            {categories.map(cat => (
              <button key={cat.id} onClick={() => switchCategory(cat.id)}
                style={{
                  background: activeCategory === cat.id ? "#E8192C" : "rgba(255,255,255,0.04)",
                  color: activeCategory === cat.id ? "#fff" : "#888",
                  border: `1px solid ${activeCategory === cat.id ? "#E8192C" : "rgba(255,255,255,0.08)"}`,
                  padding: "10px 22px", borderRadius: 8, cursor: "pointer",
                  fontSize: 13, fontWeight: 600, transition: "all 0.3s ease",
                  transform: activeCategory === cat.id && !isMobile ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: activeCategory === cat.id ? "0 8px 24px rgba(232,25,44,0.3)" : "none",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plans — single column on mobile. minmax(280px,1fr) was borderline
            overflowing on very small phones (320px screens), so mobile now
            uses a guaranteed-fluid 1fr instead. */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: isMobile ? 20 : 24, alignItems: "center",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(20px)" : "translateY(0)",
          transition: "all 0.3s ease",
        }}>
          {plans.map((plan, i) => (
            <div key={i}
              style={{
                background: plan.popular ? "#0d0d0d" : "rgba(255,255,255,0.02)",
                borderRadius: 20, padding: isMobile ? "32px 24px" : "40px 32px",
                position: "relative", overflow: "hidden",
                border: plan.popular ? "1px solid rgba(232,25,44,0.4)" : "1px solid rgba(255,255,255,0.06)",
                // The scale-up for the "popular" card looked great in a multi-column
                // desktop grid, but on a single-column mobile layout it made the
                // card visually spill past its neighbors — disabled on mobile.
                transform: visible ? (plan.popular && !isMobile ? "scale(1.05) translateY(-8px)" : "scale(1)") : "scale(0.95)",
                opacity: visible ? 1 : 0,
                transition: `all 0.7s ease ${i * 0.1}s`,
                boxShadow: plan.popular ? "0 24px 80px rgba(232,25,44,0.15)" : "none",
              }}>

              {/* Top glow line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: plan.popular ? "linear-gradient(90deg, transparent, #E8192C, transparent)" : "transparent" }} />

              {plan.popular && (
                <div style={{ position: "absolute", top: 20, right: 20, background: "#E8192C", color: "#fff", padding: "4px 14px", borderRadius: 50, fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>POPULAR</div>
              )}

              {/* Delivery & Revision badges */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.2)", color: "#E8192C", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>⚡ {plan.delivery}</span>
                <span style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>🔄 {plan.revision}</span>
              </div>

              <h3 style={{ color: "#fff", fontSize: isMobile ? 20 : 22, fontWeight: 800, marginBottom: 8 }}>{plan.title}</h3>
              <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6, marginBottom: isMobile ? 20 : 24 }}>{plan.desc}</p>

              <div style={{ marginBottom: isMobile ? 22 : 28 }}>
                <span style={{ color: "#E8192C", fontSize: 18, fontWeight: 700 }}>$</span>
                <span style={{ color: "#fff", fontSize: isMobile ? 42 : 52, fontWeight: 900, lineHeight: 1 }}>{plan.price}</span>
                <span style={{ color: "#555", fontSize: 14 }}>/project</span>
              </div>

              <ul style={{ listStyle: "none", marginBottom: isMobile ? 28 : 36, padding: 0 }}>
                {plan.features.map((f, fi) => (
                  <li key={fi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", color: "#bbb", fontSize: 14, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: "#E8192C", fontSize: 14, flexShrink: 0, fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              {/* WhatsApp Order Button */}
              <a href={getWALink(plan)} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  width: "100%", padding: "15px",
                  background: plan.popular ? "#E8192C" : "transparent",
                  color: plan.popular ? "#fff" : "#E8192C",
                  border: "2px solid #E8192C",
                  borderRadius: 12, fontWeight: 700, fontSize: 15,
                  textDecoration: "none", letterSpacing: 0.5,
                  transition: "all 0.3s ease",
                  boxShadow: plan.popular ? "0 8px 30px rgba(232,25,44,0.4)" : "none",
                  position: "relative", overflow: "hidden",
                  boxSizing: "border-box",
                }}>
                <span style={{ fontSize: 18 }}>💬</span> Order on WhatsApp →
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: isMobile ? 48 : 64, opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.5s" }}>
          <p style={{ color: "#555", fontSize: 14, marginBottom: 20 }}>
            Need a custom package? Let&apos;s talk directly!
          </p>
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Hi! I need a custom package. Can we discuss?")}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: "#E8192C", border: "1px solid rgba(232,25,44,0.3)", padding: "12px 32px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none", transition: "all 0.3s ease" }}>
            💬 Get Custom Quote →
          </a>
        </div>
      </div>
    </section>
  );
}
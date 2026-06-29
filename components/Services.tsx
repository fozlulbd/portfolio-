"use client";
const services = [
  { icon: "📱", title: "Mobile Apps Design" },
  { icon: "🖥️", title: "UI/UX Design" },
  { icon: "🌐", title: "Website Design" },
  { icon: "{}", title: "Web Development" },
  { icon: "✏️", title: "Brand Identity" },
  { icon: "🖐️", title: "Interaction Design" },
];

export default function Services() {
  return (
    <section id="services" style={{ padding: "100px 24px", background: "#f8f8f8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 60 }}>
          <div>
            <div style={{ color: "#888", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Services</div>
            <div style={{ width: 40, height: 2, background: "#E8192C", marginBottom: 20 }}></div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, lineHeight: 1.2, maxWidth: 360 }}>
              Unique Ideas for Your Business
            </h2>
          </div>
          <p style={{ color: "#666", fontSize: 15, lineHeight: 1.8, maxWidth: 440 }}>
            We Envision Design & Develop Digital Experience that create possibility in an ever changing world.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, background: "#e5e5e5" }}>
          {services.map((s, i) => (
            <div key={i} style={{ background: "#fff", padding: "48px 32px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#E8192C"; (e.currentTarget as HTMLDivElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "#fff"; (e.currentTarget as HTMLDivElement).style.color = "#111"; }}>
              <div style={{ fontSize: 36, marginBottom: 20, color: "#E8192C" }}>{s.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>{s.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

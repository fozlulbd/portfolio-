"use client";
const features = [
  "Premium UI/UX Design",
  "Responsive Development",
  "SEO Optimized Code",
  "Fast Delivery",
  "Revision rounds included",
];

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
          
          {/* Left */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ color: "#888", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Pricing</div>
            <div style={{ width: 40, height: 2, background: "#E8192C", marginBottom: 20 }}></div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, marginBottom: 40 }}>
              Stay chill and pick your plan
            </h2>

            {[
              { label: "Seller communication level", rating: 4.3 },
              { label: "Recommend to a friend", rating: 5 },
              { label: "Deliver on time", rating: 4.8 },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px dashed #ddd" }}>
                <span style={{ color: "#555", fontSize: 14 }}>{r.label}</span>
                <span style={{ color: "#E8192C", fontWeight: 700, fontSize: 14 }}>★ {r.rating}</span>
              </div>
            ))}
          </div>

          {/* Cards */}
          <div style={{ flex: 2, display: "flex", gap: 24, minWidth: 300, flexWrap: "wrap" }}>
            <PricingCard title="Web Development" price={69} features={features} dark={false} />
            <PricingCard title="Static Frontend Design" price={69} features={features} dark={true} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ title, price, features, dark }: { title: string; price: number; features: string[]; dark: boolean }) {
  return (
    <div style={{ flex: 1, minWidth: 220, background: dark ? "#111" : "#f8f8f8", padding: "40px 32px", borderRadius: 8, border: dark ? "none" : "1px solid #eee" }}>
      <div style={{ fontSize: 32, marginBottom: 16, color: "#E8192C" }}>🌐</div>
      <h3 style={{ color: dark ? "#fff" : "#111", fontSize: 20, fontWeight: 700, marginBottom: 24 }}>{title}</h3>
      <ul style={{ listStyle: "none", marginBottom: 32 }}>
        {features.map((f, i) => (
          <li key={i} style={{ color: dark ? "#bbb" : "#555", padding: "6px 0", fontSize: 14 }}>
            ✓ {f}
          </li>
        ))}
      </ul>
      <div style={{ fontSize: 36, fontWeight: 800, color: dark ? "#fff" : "#111", marginBottom: 24 }}>${price}</div>
      <button style={{ width: "100%", padding: "12px", border: "1px solid #E8192C", background: "transparent", color: "#E8192C", fontWeight: 600, cursor: "pointer", borderRadius: 4, fontSize: 14, transition: "all 0.2s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E8192C"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#E8192C"; }}>
        Order Now
      </button>
    </div>
  );
}

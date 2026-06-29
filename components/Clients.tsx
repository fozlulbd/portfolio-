const clients = Array(8).fill(null).map((_, i) => ({ id: i + 1 }));

export default function Clients() {
  return (
    <section style={{ padding: "100px 24px", background: "#f8f8f8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ color: "#888", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Recent Projects</div>
          <div style={{ width: 40, height: 2, background: "#E8192C", marginBottom: 20 }}></div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, lineHeight: 1.2 }}>
            This list of brands aren&apos;t just our clients.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#e5e5e5" }}>
          {clients.map((c) => (
            <div key={c.id} style={{ background: "#fff", padding: "40px 24px", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "2/1" }}>
              <div style={{ textAlign: "center", color: "#888" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>◇</div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>COMPANY NAME</div>
                <div style={{ fontSize: 10, color: "#bbb" }}>Tagline Goes here</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

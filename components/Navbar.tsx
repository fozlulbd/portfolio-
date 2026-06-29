"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ background: "#111", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        <Link href="/" style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: 2, textDecoration: "none" }}>SEVENXP</Link>
        
        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
          {["Home","About","Services","Blog","Contact"].map(item => (
            <Link key={item} href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
              style={{ color: item === "Home" ? "#E8192C" : "#ccc", textDecoration: "none", fontSize: 14, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>
              {item}
            </Link>
          ))}
        </div>

        {/* Email */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="desktop-nav">
          <span style={{ fontSize: 24 }}>✉️</span>
          <div>
            <div style={{ color: "#888", fontSize: 11 }}>Have any Questions?</div>
            <div style={{ color: "#fff", fontSize: 13 }}>fozlulhoqueinfo@gmail.com</div>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", display: "none" }} className="mobile-menu-btn">
          ☰
        </button>
      </div>

      {open && (
        <div style={{ background: "#1a1a1a", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {["Home","About","Services","Blog","Contact"].map(item => (
            <Link key={item} href={item === "Home" ? "/" : `#${item.toLowerCase()}`} onClick={() => setOpen(false)}
              style={{ color: "#ccc", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
              {item}
            </Link>
          ))}
          <div style={{ color: "#aaa", fontSize: 13 }}>fozlulhoqueinfo@gmail.com</div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

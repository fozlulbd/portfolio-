"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["home","services","about","projects","pricing","contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", id: "home" },
    { label: "About", href: "#about", id: "about" },
    { label: "Services", href: "#services", id: "services" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Blog", href: "#blog", id: "blog" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(13,13,13,0.97)" : "#0d0d0d",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(232,25,44,0.15)" : "1px solid rgba(255,255,255,0.05)",
        transition: "all 0.4s ease",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          
          {/* Logo */}
          <Link href="#home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 32, background: "#E8192C", borderRadius: 2, marginRight: 4 }}></div>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: 3, textTransform: "uppercase" }}>SEVENXP</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="hide-mobile">
            {navLinks.map(link => (
              <Link key={link.id} href={link.href}
                style={{
                  color: activeSection === link.id ? "#E8192C" : "#aaa",
                  textDecoration: "none", fontSize: 13, fontWeight: 600,
                  letterSpacing: 1.5, textTransform: "uppercase",
                  padding: "8px 14px", borderRadius: 6,
                  background: activeSection === link.id ? "rgba(232,25,44,0.1)" : "transparent",
                  transition: "all 0.3s ease",
                  position: "relative",
                }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Email contact */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hide-mobile">
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(232,25,44,0.15)", border: "1px solid rgba(232,25,44,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
            }}>✉️</div>
            <div>
              <div style={{ color: "#666", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>Have any Questions?</div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>fozlulhoqueinfo@gmail.com</div>
            </div>
          </div>

          {/* Mobile menu btn */}
          <button onClick={() => setOpen(!open)}
            style={{ background: "none", border: "1px solid #333", color: "#fff", width: 40, height: 40, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "none", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}
            className="show-mobile">
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ background: "#111", borderTop: "1px solid #222", padding: "20px 32px 24px" }}>
            {navLinks.map(link => (
              <Link key={link.id} href={link.href} onClick={() => setOpen(false)}
                style={{ display: "block", color: "#ccc", textDecoration: "none", fontSize: 15, fontWeight: 500, padding: "12px 0", borderBottom: "1px solid #1a1a1a" }}>
                {link.label}
              </Link>
            ))}
            <div style={{ color: "#E8192C", fontSize: 13, marginTop: 16 }}>fozlulhoqueinfo@gmail.com</div>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div style={{ height: 72 }}></div>
    </>
  );
}

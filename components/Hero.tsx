"use client";
import { useEffect, useRef, useState } from "react";

const roles = ["Graphic Designer", "Web Developer", "Video Editor", "Brand Specialist", "Softweare Engineer", "UI/UX Designer"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D tilt state for the profile card
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovering, setHovering] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = tiltRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 26; // rotateY
    const rx = (0.5 - py) * 18; // rotateX
    setTilt({ rx, ry });
  };
  const handleTiltEnter = () => setHovering(true);
  const handleTiltLeave = () => {
    setHovering(false);
    setTilt({ rx: 0, ry: 0 });
  };

  // Stage transform: JS-controlled tilt while hovering, CSS idle-float animation otherwise
  const stageStyle: React.CSSProperties = hovering
    ? {
        transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 0.1s ease-out",
        animation: "none",
      }
    : {
        animation: "heroIdleFloat 7s ease-in-out infinite",
        transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      };

  // Typewriter effect
  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  // Fade in on mount
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,25,44,${p.alpha})`;
        ctx.fill();
      });
      // Draw connecting lines
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(232,25,44,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="home" style={{ background: "#0d0d0d", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      {/* Gradient orbs */}
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,25,44,0.12) 0%, transparent 70%)", zIndex: 0, animation: "float 6s ease-in-out infinite" }}></div>
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,25,44,0.06) 0%, transparent 70%)", zIndex: 0, animation: "float 8s ease-in-out infinite reverse" }}></div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 60, position: "relative", zIndex: 1, flexWrap: "wrap" }}>
        
        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 300, maxWidth: 620, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 1s ease" }}>
          
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.3)", borderRadius: 50, padding: "6px 16px", marginBottom: 28 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8192C", animation: "pulse-ring 2s ease-out infinite", boxShadow: "0 0 0 0 rgba(232,25,44,0.7)" }}></div>
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Available for Work</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: "clamp(36px, 5.5vw, 68px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
            👋 Hello, I&apos;m<br />
            <span style={{
              background: "linear-gradient(135deg, #E8192C 0%, #ff6b6b 50%, #E8192C 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientShift 3s ease infinite",
            }}>FozlulHoque</span>
          </h1>

          {/* Typewriter */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <span style={{ color: "#666", fontSize: 18, fontWeight: 400 }}>I&apos;m a </span>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700, borderRight: "2px solid #E8192C", paddingRight: 4, minWidth: 220, animation: "blink 1s step-end infinite" }}>{displayed}</span>
          </div>

          <p style={{ color: "#888", fontSize: 16, lineHeight: 1.9, marginBottom: 40, maxWidth: 520 }}>
            Creative digital specialist behind <strong style={{ color: "#fff" }}>SEVEN</strong> — delivering premium Graphic Design, modern Web Development, and cinematic Video Editing. I transform ideas into high-converting visuals that help brands <strong style={{ color: "#E8192C" }}>grow, sell & stand out.</strong>
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
            <a href="#contact" className="btn-glow"
              style={{ background: "#E8192C", color: "#fff", padding: "14px 36px", fontWeight: 700, fontSize: 14, textDecoration: "none", borderRadius: 8, letterSpacing: 1, boxShadow: "0 8px 30px rgba(232,25,44,0.4)", transition: "all 0.3s ease", display: "inline-block" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 15px 40px rgba(232,25,44,0.6)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 30px rgba(232,25,44,0.4)"; }}>
              Let&apos;s Work Together →
            </a>
            <a href="#projects"
              style={{ background: "transparent", color: "#fff", padding: "14px 36px", fontWeight: 700, fontSize: 14, textDecoration: "none", borderRadius: 8, letterSpacing: 1, border: "1px solid #333", transition: "all 0.3s ease", display: "inline-block" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8192C"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8192C"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#333"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}>
              View My Work
            </a>
          </div>

          {/* Social + Skills */}
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>FIND WITH ME</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { href: "https://twitter.com/fozlulbd", label: "𝕏", title: "Twitter" },
                  { href: "https://facebook.com/fozlulbdx", label: "f", title: "Instagram" },
                  { href: "https://wa.me/8801939828993", label: "⬡", title: "WhatsApp" },
                ].map(s => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title}
                    style={{ color: "#fff", fontSize: 16, textDecoration: "none", width: 40, height: 40, borderRadius: 8, border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8192C"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(232,25,44,0.1)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>BEST SKILL ON</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { icon: "</>", title: "Web Dev" },
                  { icon: "◇", title: "Design" },
                  { icon: "▶", title: "Video" },
                ].map((s, i) => (
                  <div key={i} title={s.title}
                    style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", color: "#E8192C", fontSize: 13, fontWeight: 700, cursor: "default" }}>
                    {s.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Profile Image (fixed size + unique 3D tilt/parallax + orbit particles) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            minWidth: 280,
            perspective: 1400,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0) rotateY(0deg) scale(1)" : "translateX(50px) rotateY(-22deg) scale(0.88)",
            transition: "all 1.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            ref={tiltRef}
            onMouseMove={handleTiltMove}
            onMouseEnter={handleTiltEnter}
            onMouseLeave={handleTiltLeave}
            style={{
              position: "relative",
              width: "clamp(340px, 42vw, 600px)",
              perspective: 1600,
            }}
          >
            {/* 3D stage — JS tilt on hover, gentle auto-rotation when idle */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "0.8",
                transformStyle: "preserve-3d",
                ...stageStyle,
              }}
            >
              {/* Orbiting glow particles — sit behind, in 3D space */}
              <div style={{ position: "absolute", inset: -50, transform: "translateZ(10px)", zIndex: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", inset: 0, animation: "heroOrbit 9s linear infinite" }}>
                  <div style={{ position: "absolute", top: 0, left: "50%", width: 10, height: 10, marginLeft: -5, borderRadius: "50%", background: "#E8192C", boxShadow: "0 0 16px 5px rgba(232,25,44,0.55)" }}></div>
                </div>
                <div style={{ position: "absolute", inset: 30, animation: "heroOrbitReverse 13s linear infinite" }}>
                  <div style={{ position: "absolute", bottom: 0, left: "28%", width: 7, height: 7, marginLeft: -3.5, borderRadius: "50%", background: "#ff6b6b", boxShadow: "0 0 12px 4px rgba(255,107,107,0.5)" }}></div>
                </div>
                <div style={{ position: "absolute", inset: -20, animation: "heroOrbit 17s linear infinite" }}>
                  <div style={{ position: "absolute", top: "55%", right: 0, width: 6, height: 6, marginTop: -3, borderRadius: "50%", background: "#E8192C", boxShadow: "0 0 10px 3px rgba(232,25,44,0.45)" }}></div>
                </div>
              </div>

              {/* Rotating gradient glow — sits behind in 3D space */}
              <div style={{
                position: "absolute", inset: -20,
                borderRadius: 40,
                background: "conic-gradient(from 0deg, #E8192C, transparent, #E8192C, transparent)",
                animation: "gradientShift 4s linear infinite",
                transform: "translateZ(-90px)",
                zIndex: 0,
              }}></div>

              {/* Profile card — the base plane */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: 28,
                overflow: "hidden",
                background: "linear-gradient(135deg, #1a1a1a, #222)",
                border: "3px solid #1a1a1a",
                zIndex: 1,
                boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(232,25,44,0.15)",
              }}>
                <img src="/profile.jpg" alt="FozlulHoque" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
                {/* glass sheen */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(255,255,255,0.05), transparent 45%)", pointerEvents: "none" }}></div>
              </div>

              {/* Floating stat card — popped forward in Z */}
              <div style={{ position: "absolute", top: 24, left: -70, transform: "translateZ(100px)", zIndex: 2 }}>
                <div style={{
                  background: "rgba(13,13,13,0.95)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(232,25,44,0.2)", borderRadius: 12,
                  padding: "12px 18px", animation: "float 4s ease-in-out infinite",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>
                  <div style={{ color: "#E8192C", fontSize: 22, fontWeight: 900 }}>200</div>
                  <div style={{ color: "#888", fontSize: 11, letterSpacing: 1 }}>Jobs Done</div>
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 50, right: -70, transform: "translateZ(100px)", zIndex: 2 }}>
                <div style={{
                  background: "rgba(13,13,13,0.95)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(232,25,44,0.2)", borderRadius: 12,
                  padding: "12px 18px", animation: "float 5s ease-in-out infinite reverse",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>
                  <div style={{ color: "#E8192C", fontSize: 22, fontWeight: 900 }}>753</div>
                  <div style={{ color: "#888", fontSize: 11, letterSpacing: 1 }}>Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 1 }}>
        <div style={{ color: "#444", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Scroll Down</div>
        <div style={{ width: 24, height: 40, border: "2px solid #333", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
          <div style={{ width: 4, height: 8, background: "#E8192C", borderRadius: 2, animation: "scrollIndicator 1.5s ease-in-out infinite" }}></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes heroIdleFloat {
          0%, 100% { transform: rotateX(0deg) rotateY(0deg) translateY(0px); }
          25% { transform: rotateX(4deg) rotateY(-7deg) translateY(-8px); }
          50% { transform: rotateX(-3deg) rotateY(6deg) translateY(0px); }
          75% { transform: rotateX(3deg) rotateY(5deg) translateY(8px); }
        }
        @keyframes heroOrbit {
          to { transform: rotate(360deg); }
        }
        @keyframes heroOrbitReverse {
          to { transform: rotate(-360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="heroIdleFloat"],
          [style*="heroOrbit"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
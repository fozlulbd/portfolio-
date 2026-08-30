"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const roles = ["Graphic Designer", "Web Developer", "Video Editor", "Brand Specialist", "Software Engineer", "UI/UX Designer"];

// Detects mobile/tablet viewports so we can swap fixed pixel values for
// responsive ones. Inline styles can't use @media queries, so this is the
// reliable way to make a JS-styled component truly responsive.
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

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [jobsCount, setJobsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

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

  // Counter animation for stats
  useEffect(() => {
    if (!visible) return;
    const duration = 1800;
    const jobsTarget = 200;
    const clientsTarget = 753;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setJobsCount(Math.floor(eased * jobsTarget));
      setClientsCount(Math.floor(eased * clientsTarget));
      if (progress < 1) requestAnimationFrame(tick);
      else {
        setJobsCount(jobsTarget);
        setClientsCount(clientsTarget);
      }
    };
    requestAnimationFrame(tick);
  }, [visible]);

  // Mouse glow tracking (desktop only — no real cursor on touch devices)
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;
    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    section.addEventListener("mousemove", handleMove);
    return () => section.removeEventListener("mousemove", handleMove);
  }, [isMobile]);

  // Particle canvas — fewer particles and no connecting-line calculations on
  // mobile, since that O(n^2) line-distance check is the most expensive part
  // per frame and drains battery / drops frame rate on phones. Also delayed
  // until after the page has finished its initial load so it never competes
  // with the hero image/text for the main thread during LCP/FCP.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let cleanupResize: () => void = () => {};

    const start = () => {
      const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      resize();
      window.addEventListener("resize", resize);
      cleanupResize = () => window.removeEventListener("resize", resize);

      const particleCount = isMobile ? 16 : 70;
      const drawConnections = !isMobile;

      const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.4,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232,25,44,${p.alpha})`;
          ctx.fill();
        });
        if (drawConnections) {
          particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach((p2) => {
              const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(232,25,44,${0.07 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            });
          });
        }
        animId = requestAnimationFrame(draw);
      };
      draw();
    };

    // Wait for the browser to be idle (or fall back to a short timeout) so this
    // purely decorative animation never delays the hero's first paint / LCP.
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
    const idleId = w.requestIdleCallback ? w.requestIdleCallback(start) : window.setTimeout(start, 200);

    return () => {
      cancelAnimationFrame(animId);
      cleanupResize();
      if (w.requestIdleCallback) {
        (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId as number);
      } else {
        clearTimeout(idleId as number);
      }
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{
        background: "#0a0a0a",
        minHeight: isMobile ? "auto" : "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden", // clips any child overflow so mobile never gets a horizontal scrollbar
        width: "100%",
      }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />

      {/* Mouse follow glow — desktop only */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            left: mouse.x - 300,
            top: mouse.y - 300,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,25,44,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
            transition: "left 0.15s ease-out, top 0.15s ease-out",
          }}
        />
      )}

      {/* Gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "3%",
          width: isMobile ? 220 : 450,
          height: isMobile ? 220 : 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,25,44,0.14) 0%, transparent 70%)",
          zIndex: 0,
          animation: "float 6s ease-in-out infinite",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "3%",
          width: isMobile ? 160 : 320,
          height: isMobile ? 160 : 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,25,44,0.07) 0%, transparent 70%)",
          zIndex: 0,
          animation: "float 8s ease-in-out infinite reverse",
          filter: "blur(10px)",
        }}
      />

      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: isMobile ? "56px 20px" : "80px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: isMobile ? 40 : 60,
          position: "relative",
          zIndex: 1,
          flexWrap: "wrap",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            flex: 1,
            minWidth: isMobile ? "100%" : 300,
            maxWidth: isMobile ? "100%" : 600,
            width: "100%",
            boxSizing: "border-box",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(232,25,44,0.1)",
              border: "1px solid rgba(232,25,44,0.3)",
              borderRadius: 50,
              padding: "6px 16px",
              marginBottom: isMobile ? 20 : 28,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#E8192C",
                animation: "pulse-ring 2s ease-out infinite",
                boxShadow: "0 0 0 0 rgba(232,25,44,0.7)",
              }}
            />
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
              Available for Work
            </span>
          </div>

          <h1 style={{ color: "#fff", fontSize: "clamp(32px, 8vw, 68px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
            👋 Hello, I&apos;m
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #E8192C 0%, #ff6b6b 50%, #E8192C 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradientShift 3s ease infinite",
              }}
            >
              FozlulHoque
            </span>
          </h1>

          {/* Typewriter */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: isMobile ? 20 : 28 }}>
            <span style={{ color: "#666", fontSize: isMobile ? 15 : 18, fontWeight: 400 }}>I&apos;m a </span>
            <span
              style={{
                color: "#fff",
                fontSize: isMobile ? 16 : 20,
                fontWeight: 700,
                borderRight: "2px solid #E8192C",
                paddingRight: 4,
                minWidth: isMobile ? 160 : 220,
                animation: "blink 1s step-end infinite",
              }}
            >
              {displayed}
            </span>
          </div>

          <p style={{ color: "#888", fontSize: isMobile ? 14 : 16, lineHeight: 1.85, marginBottom: isMobile ? 28 : 40, maxWidth: 520 }}>
            Creative digital specialist behind <strong style={{ color: "#fff" }}>VENUZEN</strong> — delivering premium
            Graphic Design, modern Web Development, and cinematic Video Editing. I transform ideas into
            high-converting visuals that help brands{" "}
            <strong style={{ color: "#E8192C" }}>grow, sell & stand out.</strong>
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: isMobile ? 32 : 48 }}>
            <a
              href="#contact"
              style={{
                flex: isMobile ? "1 1 auto" : "0 0 auto",
                textAlign: "center",
                background: "#E8192C",
                color: "#fff",
                padding: isMobile ? "13px 24px" : "14px 36px",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                borderRadius: 8,
                letterSpacing: 1,
                boxShadow: "0 8px 30px rgba(232,25,44,0.4)",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
            >
              Let&apos;s Work Together →
            </a>
            <a
              href="#projects"
              style={{
                flex: isMobile ? "1 1 auto" : "0 0 auto",
                textAlign: "center",
                background: "rgba(255,255,255,0.03)",
                color: "#fff",
                padding: isMobile ? "13px 24px" : "14px 36px",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                borderRadius: 8,
                letterSpacing: 1,
                border: "1px solid #333",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
            >
              View My Work
            </a>
          </div>

          {/* Social + Skills */}
          <div style={{ display: "flex", gap: isMobile ? 32 : 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>
                FIND WITH ME
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { href: "https://twitter.com/fozlulbd", label: "𝕏", title: "Twitter" },
                  { href: "https://facebook.com/fozlulbdx", label: "f", title: "Facebook" },
                  { href: "https://wa.me/8801939828993", label: "⬡", title: "WhatsApp" },
                ].map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.title}
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      textDecoration: "none",
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      border: "1px solid #2a2a2a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s",
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>
                BEST SKILL ON
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { icon: "</>", title: "Web Dev" },
                  { icon: "◇", title: "Design" },
                  { icon: "▶", title: "Video" },
                ].map((s, i) => (
                  <div
                    key={i}
                    title={s.title}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      border: "1px solid #2a2a2a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#E8192C",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "default",
                    }}
                  >
                    {s.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Profile Image */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            minWidth: isMobile ? "100%" : 320,
            width: "100%",
            boxSizing: "border-box",
            marginTop: isMobile ? 12 : 0,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(40px)",
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: isMobile ? "78%" : 560,
              maxWidth: isMobile ? 320 : "100%",
            }}
          >
            {/* Rotating gradient glow ring */}
            <div
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: "40% 60% 60% 40% / 50% 45% 55% 50%",
                background: "conic-gradient(from 0deg, #E8192C, transparent 30%, transparent 70%, #E8192C)",
                animation: "gradientShift 5s linear infinite",
                zIndex: 0,
                filter: "blur(1px)",
              }}
            />
            {/* Soft outer glow */}
            <div
              style={{
                position: "absolute",
                inset: isMobile ? -20 : -40,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(232,25,44,0.18) 0%, transparent 65%)",
                zIndex: 0,
                animation: "pulseGlow 4s ease-in-out infinite",
              }}
            />

            {/* Glassmorphism profile card — aspect-ratio keeps it proportional
                at any width instead of a fixed height, so it never looks
                stretched on narrow screens */}
            <div
              style={{
                width: "100%",
                aspectRatio: "0.933",
                borderRadius: "40% 60% 60% 40% / 50% 45% 55% 50%",
                overflow: "hidden",
                background: "linear-gradient(135deg, rgba(26,26,26,0.9), rgba(20,20,20,0.9))",
                border: "1px solid rgba(255,255,255,0.08)",
                position: "relative",
                zIndex: 1,
                animation: "float 5s ease-in-out infinite",
                boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(232,25,44,0.15), inset 0 0 40px rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* next/image: automatically serves a resized, compressed
                  WebP/AVIF version and preloads it (priority) instead of the
                  raw 260KB jpg — this is the LCP element on this page, so
                  this single change is what moves the mobile score most. */}
              <Image
                src="/profile.jpg"
                alt="FozlulHoque"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 78vw, 560px"
                style={{ objectFit: "cover", objectPosition: "top center" }}
              />
            </div>

            {/* Floating glass stat card - Jobs (pulled in closer on mobile so it stays fully visible) */}
            <div
              style={{
                position: "absolute",
                top: isMobile ? 12 : 40,
                left: isMobile ? -14 : -70,
                background: "rgba(13,13,13,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(232,25,44,0.25)",
                borderRadius: isMobile ? 10 : 14,
                padding: isMobile ? "10px 14px" : "16px 22px",
                animation: "float 4s ease-in-out infinite",
                boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                zIndex: 2,
              }}
            >
              <div style={{ color: "#E8192C", fontSize: isMobile ? 18 : 26, fontWeight: 900, lineHeight: 1 }}>{jobsCount}+</div>
              <div style={{ color: "#999", fontSize: isMobile ? 9 : 11, letterSpacing: 1, marginTop: 4 }}>Jobs Done</div>
            </div>

            {/* Floating glass stat card - Clients */}
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? 24 : 60,
                right: isMobile ? -14 : -60,
                background: "rgba(13,13,13,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(232,25,44,0.25)",
                borderRadius: isMobile ? 10 : 14,
                padding: isMobile ? "10px 14px" : "16px 22px",
                animation: "float 5s ease-in-out infinite reverse",
                boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                zIndex: 2,
              }}
            >
              <div style={{ color: "#E8192C", fontSize: isMobile ? 18 : 26, fontWeight: 900, lineHeight: 1 }}>{clientsCount}+</div>
              <div style={{ color: "#999", fontSize: isMobile ? 9 : 11, letterSpacing: 1, marginTop: 4 }}>Happy Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — hidden on mobile, not useful with touch scrolling and saves space */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 1,
          }}
        >
          <div style={{ color: "#444", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Scroll Down</div>
          <div style={{ width: 24, height: 40, border: "2px solid #333", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: "#E8192C", borderRadius: 2, animation: "scrollIndicator 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; transform: rotate(0deg); }
          100% { background-position: 100% 50%; transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes blink {
          0%, 50% { border-color: #E8192C; }
          51%, 100% { border-color: transparent; }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(232,25,44,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(232,25,44,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,25,44,0); }
        }
        @keyframes scrollIndicator {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(16px); }
        }
      `}</style>
    </section>
  );
}
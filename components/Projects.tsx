"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  category_id: string | null;
  category_name?: string;
  thumbnail_url: string;
  gallery_images: string[];
  client_name: string;
  completion_date: string;
  technologies: string[];
  live_demo_url: string;
  behance_url: string;
  github_url: string;
  figma_url: string;
  dribbble_url: string;
  created_at: string;
};

type CategoryRow = { id: string; name: string };

// cycling color palette for cards (since data is now dynamic, not hardcoded per-project)
const PALETTE = [
  { bg: "#1a1a2e", accent: "#E8192C" },
  { bg: "#16213e", accent: "#ff6b35" },
  { bg: "#0f3460", accent: "#f59e0b" },
  { bg: "#1a1a1a", accent: "#10b981" },
  { bg: "#2d1b4e", accent: "#8b5cf6" },
  { bg: "#0a192f", accent: "#64ffda" },
  { bg: "#0d1117", accent: "#3b82f6" },
  { bg: "#001a2e", accent: "#3b82f6" },
  { bg: "#1a0500", accent: "#ff6b35" },
  { bg: "#001428", accent: "#f59e0b" },
];

function getLink(p: ProjectRow) {
  return p.live_demo_url || p.github_url || p.behance_url || p.dribbble_url || p.figma_url || "";
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [lightboxProject, setLightboxProject] = useState<ProjectRow | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const [{ data: cats, error: catErr }, { data: projs, error: projErr }] = await Promise.all([
        supabase.from("project_categories").select("id, name").order("name"),
        supabase
          .from("projects")
          .select("id, title, slug, short_description, category_id, thumbnail_url, gallery_images, client_name, completion_date, technologies, live_demo_url, behance_url, github_url, figma_url, dribbble_url, created_at")
          .eq("status", "published")
          .order("created_at", { ascending: false }),
      ]);
      if (catErr || projErr) throw catErr || projErr;
      if (cats) setCategories(cats);
      if (projs) setProjects(projs as ProjectRow[]);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Re-attach observer once loading finishes, since sectionRef only exists
  // on the final (non-loading) render — this is what was causing cards to
  // stay invisible (opacity: 0) forever even though data loaded fine.
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    else setVisible(true); // failsafe: if ref somehow still missing, just show content
    return () => obs.disconnect();
  }, [loading]);

  const switchFilter = (id: string) => {
    setAnimating(true);
    setVisibleCount(6);
    setTimeout(() => { setFilter(id); setAnimating(false); }, 300);
  };

  const filtered = filter === "ALL" ? projects : projects.filter(p => p.category_id === filter);
  const shown = filtered.slice(0, visibleCount);

  const categoryTabs = [
    { id: "ALL", label: "All Work", count: projects.length },
    ...categories.map(c => ({ id: c.id, label: c.name, count: projects.filter(p => p.category_id === c.id).length })),
  ].filter(c => c.id === "ALL" || c.count > 0);

  function handleCardClick(p: ProjectRow) {
    const link = getLink(p);
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      setLightboxProject(p);
      setLightboxIndex(0);
    }
  }

  const lightboxImages = lightboxProject
    ? [lightboxProject.thumbnail_url, ...(lightboxProject.gallery_images || [])].filter(Boolean)
    : [];

  if (loading) {
    return (
      <section id="projects" style={{ padding: "120px 32px", background: "#0a0a0a", textAlign: "center" }}>
        <div style={{ color: "#555" }}>Loading projects...</div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section id="projects" style={{ padding: "120px 32px", background: "#0a0a0a", textAlign: "center" }}>
        <div style={{ color: "#E8192C", marginBottom: 16 }}>Projects load করতে সমস্যা হয়েছে। Internet connection check করে আবার try করো।</div>
        <button onClick={fetchData} style={{ background: "#E8192C", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Retry</button>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="projects" style={{ padding: "120px 32px", background: "#0a0a0a", textAlign: "center" }}>
        <div style={{ color: "#555" }}>No projects published yet.</div>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef} style={{ padding: "120px 32px", background: "#0a0a0a", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(60px,10vw,150px)", fontWeight: 900, color: "rgba(255,255,255,0.015)", whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: 8 }}>PROJECTS</div>

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 2, background: "#E8192C" }} />
            <span style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Recent Projects</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>
              Bring to better disruptive<br />view of innovation.
            </h2>
            <div style={{ color: "#555", fontSize: 14 }}>
              Showing <span style={{ color: "#E8192C", fontWeight: 700 }}>{shown.length}</span> of <span style={{ color: "#fff" }}>{filtered.length}</span> projects
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48, opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.2s" }}>
          {categoryTabs.map(cat => (
            <button key={cat.id} onClick={() => switchFilter(cat.id)}
              style={{
                background: filter === cat.id ? "#E8192C" : "rgba(255,255,255,0.04)",
                color: filter === cat.id ? "#fff" : "#666",
                border: `1px solid ${filter === cat.id ? "#E8192C" : "rgba(255,255,255,0.08)"}`,
                padding: "9px 20px", borderRadius: 8, cursor: "pointer",
                fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
                transition: "all 0.3s ease",
                transform: filter === cat.id ? "translateY(-2px)" : "translateY(0)",
                boxShadow: filter === cat.id ? "0 8px 24px rgba(232,25,44,0.3)" : "none",
                display: "flex", alignItems: "center", gap: 6,
              }}>
              {cat.label}
              <span style={{ background: filter === cat.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)", padding: "1px 7px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 20,
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(20px)" : "translateY(0)",
          transition: "all 0.3s ease",
        }}>
          {shown.map((p, i) => {
            const palette = PALETTE[i % PALETTE.length];
            const link = getLink(p);
            const year = p.completion_date ? new Date(p.completion_date).getFullYear() : new Date(p.created_at).getFullYear();
            const catName = categories.find(c => c.id === p.category_id)?.name || "PROJECT";
            const bgImage = p.thumbnail_url;

            return (
              <div key={p.id}
                onClick={() => handleCardClick(p)}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: bgImage ? `${palette.bg} url(${bgImage}) center/cover no-repeat` : palette.bg,
                  borderRadius: 24,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  height: 280,
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  padding: 20,
                  transition: `clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s, transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s, box-shadow 0.3s`,
                  transform: hoveredId === p.id ? "translateY(-8px) scale(1.02)" : "translateY(0)",
                  clipPath: visible
                    ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                    : "polygon(0 0, 15% 0, -15% 100%, 0 100%)",
                  border: hoveredId === p.id ? `1px solid ${palette.accent}44` : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: hoveredId === p.id ? `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${palette.accent}22` : "0 4px 20px rgba(0,0,0,0.3)",
                }}>

                <div style={{ position: "absolute", inset: 0, background: hoveredId === p.id ? "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.92) 100%)" : "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.88) 100%)", transition: "all 0.4s" }} />

                {/* Top row: number badge + tag chips */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "#fff", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.technologies && p.technologies.slice(0, 3).map(tag => (
                    <span key={tag} style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "#eee", padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 600 }}>{tag}</span>
                  ))}
                  <span style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "#eee", padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 600 }}>{year}</span>
                </div>

                {/* Bottom: title, description, circular arrow button */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 4, lineHeight: 1.25 }}>{p.title}</div>
                    <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.4, marginBottom: 8 }}>{p.short_description}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: palette.accent }} />
                      <span style={{ color: palette.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{catName.toUpperCase()}</span>
                      {p.client_name && <span style={{ color: "#666", fontSize: 11, marginLeft: 6 }}>· {p.client_name}</span>}
                    </div>
                  </div>
                  <div
                    onClick={e => { e.stopPropagation(); handleCardClick(p); }}
                    style={{
                      width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                      background: palette.accent,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 15,
                      transition: "transform 0.3s",
                      transform: hoveredId === p.id ? "rotate(-45deg) scale(1.08)" : "rotate(0deg)",
                      boxShadow: `0 6px 20px ${palette.accent}55`,
                    }}>{link ? "↗" : "🔍"}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div style={{ textAlign: "center", marginTop: 56, opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.5s" }}>
            <button onClick={() => setVisibleCount(v => v + 6)}
              style={{ background: "rgba(255,255,255,0.04)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", padding: "14px 40px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.3s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8192C"; (e.currentTarget as HTMLButtonElement).style.color = "#E8192C"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}>
              Load More Projects ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Lightbox for graphics-only projects (no live link) */}
      {lightboxProject && (
        <div onClick={() => setLightboxProject(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)",
            zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
            animation: "sevenxpFadeIn 0.25s ease",
          }}>
          <div onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 900, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", gap: 16,
              animation: "sevenxpScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
            {/* Branded header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 4, height: 22, background: "#E8192C", borderRadius: 2 }} />
                <div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{lightboxProject.title}</div>
                  <div style={{ color: "#888", fontSize: 12.5, marginTop: 1 }}>{lightboxProject.short_description}</div>
                </div>
              </div>
              <button onClick={() => setLightboxProject(null)}
                style={{ background: "rgba(232,25,44,0.12)", border: "1px solid rgba(232,25,44,0.3)", color: "#E8192C", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 15, flexShrink: 0, transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E8192C"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(232,25,44,0.12)"; (e.currentTarget as HTMLButtonElement).style.color = "#E8192C"; }}>✕</button>
            </div>

            {lightboxImages.length > 0 && (
              <>
                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <img src={lightboxImages[lightboxIndex]} alt={lightboxProject.title}
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                    onDragStart={e => e.preventDefault()}
                    style={{ width: "100%", maxHeight: "62vh", objectFit: "contain", display: "block", userSelect: "none", WebkitUserSelect: "none", pointerEvents: "none" }} />
                  {/* transparent overlay blocks right-click/drag/save on the image itself */}
                  <div onContextMenu={e => e.preventDefault()} style={{ position: "absolute", inset: 0 }} />
                </div>
                {lightboxImages.length > 1 && (
                  <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                    {lightboxImages.map((img, idx) => (
                      <img key={idx} src={img} alt="" draggable={false} onContextMenu={e => e.preventDefault()} onClick={() => setLightboxIndex(idx)}
                        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, cursor: "pointer", opacity: idx === lightboxIndex ? 1 : 0.5, border: idx === lightboxIndex ? "2px solid #E8192C" : "2px solid transparent", userSelect: "none" }} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes sevenxpFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sevenxpScaleIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </section>
  );
}
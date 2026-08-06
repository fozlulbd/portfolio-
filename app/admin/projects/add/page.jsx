"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  "Basic Info", "SEO", "Media", "Gallery", "Video",
  "Client", "Technology", "Links", "Publish",
];

const TECH_SUGGESTIONS = [
  "React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS",
  "Photoshop", "Illustrator", "Figma", "Supabase", "TypeScript",
];

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const EMPTY_FORM = {
  title: "", slug: "", short_description: "", full_description: "",
  category_id: "", service: "", is_featured: false, completion_date: "",
  meta_title: "", meta_description: "", meta_keywords: "", og_image_url: "",
  thumbnail_url: "", cover_image_url: "", gallery_images: [], video_url: "",
  pdf_url: "", zip_url: "", client_name: "", client_company: "", client_country: "",
  client_industry: "", client_website: "", client_logo_url: "", client_budget: "",
  client_duration: "", technologies: [], live_demo_url: "", behance_url: "",
  github_url: "", figma_url: "", dribbble_url: "",
};

// Default export: wraps the actual page content in a Suspense boundary,
// because useSearchParams() requires one during static generation.
export default function AddProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <AddProjectPageInner />
    </Suspense>
  );
}

function AddProjectPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit"); // <-- null if adding new, project id if editing

  const [activeTab, setActiveTab] = useState("Basic Info");
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(!!editId);
  const [techInput, setTechInput] = useState("");
  const [form, setForm] = useState({ ...EMPTY_FORM });

  // Load categories always
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("project_categories")
        .select("id, name")
        .order("name");
      if (!error) setCategories(data || []);
    }
    loadCategories();
  }, []);

  // If editing, load the existing project's data
  useEffect(() => {
    if (!editId) return;
    async function loadProject() {
      setLoadingProject(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", editId)
        .single();

      if (error || !data) {
        alert("Project khuje pawa jayni: " + (error?.message || ""));
        setLoadingProject(false);
        return;
      }

      setForm({
        ...EMPTY_FORM,
        ...data,
        category_id: data.category_id || "",
        completion_date: data.completion_date || "",
        gallery_images: data.gallery_images || [],
        technologies: data.technologies || [],
      });
      setLoadingProject(false);
    }
    loadProject();
  }, [editId]);

  // Auto slug ONLY when adding a new project (don't overwrite slug while editing)
  useEffect(() => {
    if (editId) return;
    setForm((f) => ({ ...f, slug: slugify(f.title) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, editId]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function uploadFile(file, folder) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("projects").upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("projects").getPublicUrl(path);
      return data.publicUrl;
    } catch (err) {
      alert("Upload failed: " + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSingleUpload(e, field) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, field);
    if (url) update(field, url);
  }

  async function handleGalleryUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const url = await uploadFile(file, "gallery");
      if (url) urls.push(url);
    }
    update("gallery_images", [...form.gallery_images, ...urls]);
    setUploading(false);
  }

  function removeGalleryImage(idx) {
    update("gallery_images", form.gallery_images.filter((_, i) => i !== idx));
  }

  function addTech(tech) {
    const t = tech.trim();
    if (!t || form.technologies.includes(t)) return;
    update("technologies", [...form.technologies, t]);
    setTechInput("");
  }

  function removeTech(t) {
    update("technologies", form.technologies.filter((x) => x !== t));
  }

  async function handleSubmit(status) {
    if (!form.title.trim()) {
      alert("Project title dao age");
      setActiveTab("Basic Info");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        category_id: form.category_id || null,
        completion_date: form.completion_date || null,
        status,
      };
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;

      let error;
      if (editId) {
        ({ error } = await supabase.from("projects").update(payload).eq("id", editId));
      } else {
        ({ error } = await supabase.from("projects").insert(payload));
      }
      if (error) throw error;

      alert(
        editId
          ? "Project update hoye geche!"
          : status === "published"
          ? "Project publish hoye geche!"
          : "Draft hisebe save hoyeche."
      );
      router.push("/admin");
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading project...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editId ? "Edit Project ✏️" : "Add New Project 📁"}
      </h1>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-800 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab ? "bg-[#e0263a] text-white" : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {activeTab === "Basic Info" && (
          <div className="space-y-4">
            <Field label="Project Title">
              <input className="input" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. E-commerce Admin Dashboard" />
            </Field>
            <Field label="Slug">
              <input className="input" value={form.slug} onChange={(e) => update("slug", e.target.value)} />
            </Field>
            <Field label="Short Description">
              <textarea className="input" rows={2} value={form.short_description} onChange={(e) => update("short_description", e.target.value)} />
            </Field>
            <Field label="Full Description">
              <textarea className="input" rows={6} value={form.full_description} onChange={(e) => update("full_description", e.target.value)} />
            </Field>
            <Field label="Category">
              <select className="input" value={form.category_id} onChange={(e) => update("category_id", e.target.value)}>
                <option value="">Select category</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </Field>
            <Field label="Service">
              <input className="input" value={form.service} onChange={(e) => update("service", e.target.value)} placeholder="e.g. Web Development" />
            </Field>
            <Field label="Completion Date">
              <input type="date" className="input" value={form.completion_date} onChange={(e) => update("completion_date", e.target.value)} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => update("is_featured", e.target.checked)} />
              Featured Project
            </label>
          </div>
        )}

        {activeTab === "SEO" && (
          <div className="space-y-4">
            <Field label="Meta Title"><input className="input" value={form.meta_title} onChange={(e) => update("meta_title", e.target.value)} /></Field>
            <Field label="Meta Description"><textarea className="input" rows={3} value={form.meta_description} onChange={(e) => update("meta_description", e.target.value)} /></Field>
            <Field label="Keywords (comma separated)"><input className="input" value={form.meta_keywords} onChange={(e) => update("meta_keywords", e.target.value)} /></Field>
            <Field label="OG Image"><FileInput onChange={(e) => handleSingleUpload(e, "og_image_url")} url={form.og_image_url} /></Field>
          </div>
        )}

        {activeTab === "Media" && (
          <div className="space-y-4">
            <Field label="Thumbnail"><FileInput onChange={(e) => handleSingleUpload(e, "thumbnail_url")} url={form.thumbnail_url} /></Field>
            <Field label="Cover Image"><FileInput onChange={(e) => handleSingleUpload(e, "cover_image_url")} url={form.cover_image_url} /></Field>
            <Field label="PDF"><FileInput onChange={(e) => handleSingleUpload(e, "pdf_url")} url={form.pdf_url} accept=".pdf" /></Field>
            <Field label="ZIP"><FileInput onChange={(e) => handleSingleUpload(e, "zip_url")} url={form.zip_url} accept=".zip" /></Field>
          </div>
        )}

        {activeTab === "Gallery" && (
          <div className="space-y-4">
            <Field label="Gallery Images (multiple)">
              <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="text-sm" />
            </Field>
            <div className="grid grid-cols-4 gap-3">
              {form.gallery_images.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt="" className="w-full h-24 object-cover rounded-md border border-neutral-800" />
                  <button onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Video" && (
          <div className="space-y-4">
            <Field label="Video URL (YouTube/Vimeo link or uploaded file URL)">
              <input className="input" value={form.video_url} onChange={(e) => update("video_url", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Or upload a video file">
              <FileInput onChange={(e) => handleSingleUpload(e, "video_url")} url={form.video_url} accept="video/*" />
            </Field>
          </div>
        )}

        {activeTab === "Client" && (
          <div className="space-y-4">
            <Field label="Client Name"><input className="input" value={form.client_name} onChange={(e) => update("client_name", e.target.value)} /></Field>
            <Field label="Company"><input className="input" value={form.client_company} onChange={(e) => update("client_company", e.target.value)} /></Field>
            <Field label="Country"><input className="input" value={form.client_country} onChange={(e) => update("client_country", e.target.value)} /></Field>
            <Field label="Industry"><input className="input" value={form.client_industry} onChange={(e) => update("client_industry", e.target.value)} /></Field>
            <Field label="Website"><input className="input" value={form.client_website} onChange={(e) => update("client_website", e.target.value)} /></Field>
            <Field label="Logo"><FileInput onChange={(e) => handleSingleUpload(e, "client_logo_url")} url={form.client_logo_url} /></Field>
            <Field label="Budget"><input className="input" value={form.client_budget} onChange={(e) => update("client_budget", e.target.value)} placeholder="e.g. $500 - $1000" /></Field>
            <Field label="Duration"><input className="input" value={form.client_duration} onChange={(e) => update("client_duration", e.target.value)} placeholder="e.g. 3 weeks" /></Field>
          </div>
        )}

        {activeTab === "Technology" && (
          <div className="space-y-4">
            <Field label="Add Technology">
              <div className="flex gap-2">
                <input className="input" value={techInput} onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(techInput); } }}
                  placeholder="Type and press Enter" />
                <button onClick={() => addTech(techInput)} className="px-4 bg-neutral-800 rounded-md text-sm">Add</button>
              </div>
            </Field>
            <div className="flex flex-wrap gap-2">
              {TECH_SUGGESTIONS.filter((t) => !form.technologies.includes(t)).map((t) => (
                <button key={t} onClick={() => addTech(t)} className="px-3 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded-full hover:border-[#e0263a]">+ {t}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {form.technologies.map((t) => (
                <span key={t} className="px-3 py-1 text-xs bg-[#e0263a]/20 text-[#e0263a] border border-[#e0263a]/40 rounded-full flex items-center gap-2">
                  {t}<button onClick={() => removeTech(t)}>✕</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Links" && (
          <div className="space-y-4">
            <Field label="Live Demo"><input className="input" value={form.live_demo_url} onChange={(e) => update("live_demo_url", e.target.value)} /></Field>
            <Field label="Behance"><input className="input" value={form.behance_url} onChange={(e) => update("behance_url", e.target.value)} /></Field>
            <Field label="Github"><input className="input" value={form.github_url} onChange={(e) => update("github_url", e.target.value)} /></Field>
            <Field label="Figma"><input className="input" value={form.figma_url} onChange={(e) => update("figma_url", e.target.value)} /></Field>
            <Field label="Dribbble"><input className="input" value={form.dribbble_url} onChange={(e) => update("dribbble_url", e.target.value)} /></Field>
          </div>
        )}

        {activeTab === "Publish" && (
          <div className="space-y-4">
            <p className="text-neutral-400 text-sm">
              {editId
                ? "Change korle niche theke Update kore dao."
                : "Review hoye gele niche theke Draft hisebe save koro ba shorashori Publish koro."}
            </p>
            <div className="flex gap-3">
              {editId ? (
                <button disabled={saving || uploading} onClick={() => handleSubmit(form.status || "published")}
                  className="px-6 py-3 bg-[#e0263a] rounded-md font-medium disabled:opacity-50">
                  {saving ? "Updating..." : "Update Project"}
                </button>
              ) : (
                <>
                  <button disabled={saving || uploading} onClick={() => handleSubmit("draft")}
                    className="px-6 py-3 bg-neutral-800 rounded-md font-medium disabled:opacity-50">
                    Save as Draft
                  </button>
                  <button disabled={saving || uploading} onClick={() => handleSubmit("published")}
                    className="px-6 py-3 bg-[#e0263a] rounded-md font-medium disabled:opacity-50">
                    {saving ? "Saving..." : "Publish"}
                  </button>
                </>
              )}
            </div>
            {uploading && <p className="text-yellow-500 text-sm">File upload hocche, ektu wait koro...</p>}
          </div>
        )}
      </div>

      <style jsx global>{`
        .input { width: 100%; background: #0a0a0a; border: 1px solid #262626; border-radius: 8px; padding: 10px 12px; color: white; font-size: 14px; }
        .input:focus { outline: none; border-color: #e0263a; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-neutral-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

function FileInput({ onChange, url, accept = "image/*" }) {
  return (
    <div className="flex items-center gap-3">
      <input type="file" accept={accept} onChange={onChange} className="text-sm" />
      {url && <a href={url} target="_blank" rel="noreferrer" className="text-xs text-[#e0263a] underline">uploaded ✓ view</a>}
    </div>
  );
}
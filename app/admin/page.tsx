"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const ADMIN_PASSWORD = "sevenxp2026";

type Product = {
  id?: string;
  name: string;
  category: string;
  price: number;
  old_price: number;
  sales: number;
  tag: string;
  description: string;
  format: string;
  image_url: string;
  file_url: string;
  file_name: string;
  file_size: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  status: string;
};

type Order = {
  id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string;
  category_id: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
};

type CategoryRow = { id: string; name: string };

type ClientRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  project: string;
  status: string;
  notes: string;
  created_at: string;
};

type MessageRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  reply?: string;
  replied_at?: string;
  created_at: string;
};

const emptyClient = {
  name: "", email: "", phone: "", company: "", project: "", status: "active", notes: "",
};

const emptyProduct: Product = {
  name: "", category: "Website Templates", price: 0, old_price: 0,
  sales: 0, tag: "NEW", description: "", format: "",
  image_url: "", file_url: "", file_name: "", file_size: "",
  seo_title: "", seo_description: "", seo_keywords: "", status: "active",
};

const categories = [
  "Website Templates","Templates & Graphics","Graphic Design Assets",
  "App & Software","Video Assets","Audio","3D Assets","UI/UX Design",
  "E-books & Courses","Fonts","Printables","AI Products","Productivity",
];
const tags = ["NEW","BESTSELLER","HOT","PREMIUM","SALE","FEATURED"];

// Detects whether a media URL is an image, video, or audio file based on its extension
const getMediaType = (url: string): "image" | "video" | "audio" | "unknown" => {
  const ext = url.split(".").pop()?.toLowerCase().split("?")[0] || "";
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "audio";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  return "unknown";
};

type NavSub = { id: string; label: string; href?: string };
type NavItem = { id: string; icon: string; label: string; badgeKey?: "products" | "orders"; submenu?: NavSub[] };

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  {
    id: "projects", icon: "📁", label: "Projects",
    submenu: [
      { id: "projects-all", label: "All Projects" },
      { id: "projects-add", label: "Add Project", href: "/admin/projects/add" },
      { id: "projects-draft", label: "Draft" },
      { id: "projects-published", label: "Published" },
      { id: "projects-categories", label: "Categories" },
      { id: "projects-featured", label: "Featured" },
    ],
  },
  {
    id: "clients", icon: "👥", label: "Clients",
    submenu: [
      { id: "clients-all", label: "All Clients" },
      { id: "clients-add", label: "Add Client" },
      { id: "clients-active", label: "Active" },
      { id: "clients-messages", label: "Messages" },
    ],
  },
  {
    id: "products", icon: "🛍️", label: "Products", badgeKey: "products",
    submenu: [
      { id: "products", label: "All Products" },
      { id: "add", label: "Add Product" },
      { id: "products-categories", label: "Categories" },
      { id: "products-coupons", label: "Coupons" },
      { id: "products-downloads", label: "Downloads" },
    ],
  },
  {
    id: "orders", icon: "📦", label: "Orders", badgeKey: "orders",
    submenu: [
      { id: "orders", label: "All Orders" },
      { id: "orders-pending", label: "Pending" },
    ],
  },
  {
    id: "reviews", icon: "⭐", label: "Reviews",
    submenu: [
      { id: "reviews-product", label: "Product Reviews" },
      { id: "reviews-project", label: "Project Reviews" },
      { id: "reviews-testimonials", label: "Testimonials" },
      { id: "reviews-pending", label: "Pending" },
      { id: "reviews-spam", label: "Spam" },
    ],
  },
  {
    id: "messages", icon: "💬", label: "Messages",
    submenu: [
      { id: "messages-contact", label: "Contact Form" },
      { id: "messages-quotes", label: "Quote Requests" },
      { id: "messages-chat", label: "Client Chat" },
      { id: "messages-support", label: "Support" },
      { id: "messages-newsletter", label: "Newsletter" },
    ],
  },
  {
    id: "media", icon: "🖼", label: "Media Library",
    submenu: [
      { id: "media-images", label: "Images" },
      { id: "media-videos", label: "Videos" },
      { id: "media-icons", label: "Icons" },
      { id: "media-documents", label: "Documents" },
      { id: "media-pdf", label: "PDF" },
      { id: "media-zip", label: "ZIP" },
    ],
  },
  {
    id: "seo", icon: "🔍", label: "SEO",
    submenu: [
      { id: "seo-meta", label: "Meta Settings" },
      { id: "seo-sitemap", label: "Sitemap" },
      { id: "seo-redirects", label: "Redirects" },
      { id: "seo-schema", label: "Schema" },
    ],
  },
  {
    id: "analytics", icon: "📈", label: "Analytics",
    submenu: [
      { id: "analytics-visitors", label: "Visitors" },
      { id: "analytics-sales", label: "Product Sales" },
      { id: "analytics-downloads", label: "Downloads" },
      { id: "analytics-traffic", label: "Traffic Sources" },
    ],
  },
  {
    id: "settings", icon: "⚙", label: "Settings",
    submenu: [
      { id: "settings-general", label: "General" },
      { id: "settings-branding", label: "Branding" },
      { id: "settings-payment", label: "Payment" },
      { id: "settings-social", label: "Social Links" },
      { id: "settings-security", label: "Security" },
    ],
  },
];

const IMPLEMENTED_TABS = new Set([
  "dashboard", "products", "add", "orders",
  "projects-all", "projects-draft", "projects-published", "projects-featured", "projects-categories",
  "clients-all", "clients-add", "clients-active", "clients-completed", "clients-pending", "clients-messages",
]);

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Product>({ ...emptyProduct });
  const [editId, setEditId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{msg: string; type: "success"|"error"|"info"} | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [projectsList, setProjectsList] = useState<ProjectRow[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState<CategoryRow[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [clientsList, setClientsList] = useState<ClientRow[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientForm, setClientForm] = useState({ ...emptyClient });
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [clientDeleteConfirm, setClientDeleteConfirm] = useState<string | null>(null);
  const [messagesList, setMessagesList] = useState<MessageRow[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const notify = (msg: string, type: "success"|"error"|"info" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const getSupabase = async () => {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const sb = await getSupabase();
    const { data } = await sb.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }, []);

  const fetchOrders = useCallback(async () => {
    const sb = await getSupabase();
    const { data } = await sb.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  }, []);

  const fetchProjectsList = useCallback(async () => {
    setProjectsLoading(true);
    const sb = await getSupabase();
    const { data } = await sb
      .from("projects")
      .select("id, title, slug, thumbnail_url, category_id, status, is_featured, created_at")
      .order("created_at", { ascending: false });
    if (data) setProjectsList(data);
    setProjectsLoading(false);
  }, []);

  const fetchCategoriesList = useCallback(async () => {
    setCatLoading(true);
    const sb = await getSupabase();
    const { data } = await sb.from("project_categories").select("id, name").order("name");
    if (data) setCategoriesList(data);
    setCatLoading(false);
  }, []);

  const fetchClientsList = useCallback(async () => {
    setClientsLoading(true);
    const sb = await getSupabase();
    const { data } = await sb.from("clients").select("*").order("created_at", { ascending: false });
    if (data) setClientsList(data);
    setClientsLoading(false);
  }, []);

  const handleSaveClient = async () => {
    if (!clientForm.name) return notify("Client name required!", "error");
    setClientsLoading(true);
    const sb = await getSupabase();
    if (editClientId) {
      await sb.from("clients").update({ ...clientForm }).eq("id", editClientId);
      notify("Client updated!");
      setEditClientId(null);
    } else {
      await sb.from("clients").insert([{ ...clientForm }]);
      notify("Client added!");
    }
    setClientForm({ ...emptyClient });
    setActiveTab("clients-all");
    await fetchClientsList();
    setClientsLoading(false);
  };

  const handleDeleteClient = async (id: string) => {
    const sb = await getSupabase();
    await sb.from("clients").delete().eq("id", id);
    setClientDeleteConfirm(null);
    notify("Client deleted.");
    await fetchClientsList();
  };

  const fetchMessagesList = useCallback(async () => {
    setMessagesLoading(true);
    const sb = await getSupabase();
    const { data } = await sb.from("messages").select("*").order("created_at", { ascending: false });
    if (data) setMessagesList(data);
    setMessagesLoading(false);
  }, []);

  const handleSendReply = async (id: string) => {
    const replyText = replyDrafts[id];
    if (!replyText || !replyText.trim()) return;
    const sb = await getSupabase();
    await sb.from("messages").update({ reply: replyText.trim(), status: "replied", replied_at: new Date().toISOString() }).eq("id", id);
    notify("Reply sent!");
    setReplyDrafts(prev => ({ ...prev, [id]: "" }));
    await fetchMessagesList();
  };

  const handleDeleteMessage = async (id: string) => {
    const sb = await getSupabase();
    await sb.from("messages").delete().eq("id", id);
    notify("Message deleted.");
    await fetchMessagesList();
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const sb = await getSupabase();
    const slug = newCatName.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
    const { error } = await sb.from("project_categories").insert({ name: newCatName.trim(), slug });
    if (error) { notify("Category add failed: " + error.message, "error"); return; }
    notify("Category added!");
    setNewCatName("");
    await fetchCategoriesList();
  };

  const handleDeleteCategory = async (id: string) => {
    const sb = await getSupabase();
    await sb.from("project_categories").delete().eq("id", id);
    notify("Category deleted.");
    await fetchCategoriesList();
  };

  useEffect(() => {
    if (loggedIn) { fetchProducts(); fetchOrders(); }
  }, [loggedIn, fetchProducts, fetchOrders]);

  useEffect(() => {
    if (loggedIn && ["projects-all", "projects-draft", "projects-published", "projects-featured"].includes(activeTab)) {
      fetchProjectsList();
    }
  }, [loggedIn, activeTab, fetchProjectsList]);

  useEffect(() => {
    if (loggedIn && activeTab === "projects-categories") fetchCategoriesList();
  }, [loggedIn, activeTab, fetchCategoriesList]);

  useEffect(() => {
    if (loggedIn && ["clients-all", "clients-active", "clients-completed", "clients-pending"].includes(activeTab)) {
      fetchClientsList();
    }
  }, [loggedIn, activeTab, fetchClientsList]);

  useEffect(() => {
    if (loggedIn && activeTab === "clients-messages") fetchMessagesList();
  }, [loggedIn, activeTab, fetchMessagesList]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setLoggedIn(true); setLoginError(false); }
    else setLoginError(true);
  };

  // Uploads directly from the browser to Supabase Storage, bypassing the Next.js
  // server entirely. This avoids serverless function payload limits (~4.5MB on
  // Vercel) that were causing large files to fail with an HTML error page
  // instead of JSON (the "Unexpected token '<'" error).
  const uploadToSupabase = async (file: File, bucket: string): Promise<string> => {
    const sb = await getSupabase();
    const fileExt = file.name.split(".").pop() || "bin";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

    const { error } = await sb.storage.from(bucket).upload(safeName, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw new Error(error.message);

    const { data } = sb.storage.from(bucket).getPublicUrl(safeName);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) return notify("Max 500MB!", "error");
    setUploadingImage(true);
    notify("Uploading media...", "info");
    try {
      const url = await uploadToSupabase(file, "product-images");
      setForm(f => ({ ...f, image_url: url }));
      notify("Media uploaded!");
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Upload failed", "error");
    }
    setUploadingImage(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) return notify("Max 500MB!", "error");
    setUploadingFile(true);
    notify("Uploading file... please wait", "info");
    try {
      const url = await uploadToSupabase(file, "product-file");
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      setForm(f => ({ ...f, file_url: url, file_name: file.name, file_size: `${sizeMB} MB` }));
      notify("File uploaded!");
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Upload failed", "error");
    }
    setUploadingFile(false);
  };

  const generateSEO = async () => {
    if (!form.name) return notify("Enter product name first!", "error");
    setAiGenerating(true);
    notify("AI generating SEO...", "info");
    try {
      const res = await fetch("/api/admin/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.name,
          category: form.category,
          description: form.description,
          techStack: form.format,
          price: form.price,
        }),
      });
      const parsed = await res.json();
      if (parsed.error) throw new Error(parsed.error);
      setForm(f => ({
        ...f,
        seo_title: parsed.seo_title || "",
        seo_description: parsed.seo_description || "",
        seo_keywords: parsed.seo_keywords || "",
        description: parsed.enhanced_description || f.description,
      }));
      notify("SEO generated!");
    } catch { notify("AI failed", "error"); }
    setAiGenerating(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return notify("Name and price required!", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? { id: editId, ...form } : { ...form, sales: 0 }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");
      notify(editId ? "Product updated!" : "Product published!");
      setEditId(null);
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Save failed", "error");
      setLoading(false);
      return;
    }
    setForm({ ...emptyProduct });
    setActiveTab("products");
    await fetchProducts();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Delete failed");
      }
      notify("Deleted.");
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Delete failed", "error");
    }
    setDeleteConfirm(null);
    await fetchProducts();
  };

  const handleOrderStatus = async (id: string, status: string) => {
    const sb = await getSupabase();
    await sb.from("orders").update({ status }).eq("id", id);

    if (status === "approved") {
      const order = orders.find(o => o.id === id);
      const product = products.find(p => p.name === order?.product_name);

      if (order && product?.file_url) {
        try {
          const res = await fetch("/api/admin/send-order-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: order.customer_email,
              customerName: order.customer_name,
              productName: order.product_name,
              downloadUrl: product.file_url,
            }),
          });
          if (!res.ok) throw new Error("Email send failed");
          notify(`Approved! Email sent to ${order.customer_email}`);
        } catch {
          notify("Order approved, but email failed to send", "error");
        }
      } else {
        notify("Order approved (no matching product file found)", "error");
      }
    } else {
      notify(`Order marked as ${status}`);
    }

    await fetchOrders();
  };

  const handleProjectStatus = async (id: string, status: string) => {
    const sb = await getSupabase();
    await sb.from("projects").update({ status }).eq("id", id);
    notify(`Project marked as ${status}`);
    await fetchProjectsList();
  };

  const handleProjectFeature = async (id: string, current: boolean) => {
    const sb = await getSupabase();
    await sb.from("projects").update({ is_featured: !current }).eq("id", id);
    notify(!current ? "Marked as Featured" : "Removed from Featured");
    await fetchProjectsList();
  };

  const handleProjectDelete = async (id: string) => {
    const sb = await getSupabase();
    await sb.from("projects").delete().eq("id", id);
    notify("Project deleted.");
    await fetchProjectsList();
  };

  const totalRevenue = orders.filter(o => o.status === "approved").reduce((s, o) => s + o.amount, 0);
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const statusColor: Record<string, string> = { active: "#10b981", draft: "#888", pending: "#f59e0b", approved: "#10b981", rejected: "#E8192C", completed: "#3b82f6" };
  const notifColor: Record<string, string> = { success: "#10b981", error: "#E8192C", info: "#3b82f6" };

  const handleSectionClick = (item: NavItem) => {
    if (!item.submenu) {
      setActiveTab(item.id);
      setOpenSection(null);
      if (item.id !== "add") { setEditId(null); setForm({ ...emptyProduct }); }
      return;
    }
    setOpenSection(openSection === item.id ? null : item.id);
  };

  const handleSubClick = (sub: NavSub) => {
    if (sub.href) { window.location.href = sub.href; return; }
    setActiveTab(sub.id);
    if (sub.id !== "add") { setEditId(null); setForm({ ...emptyProduct }); }
    if (sub.id !== "clients-add") { setEditClientId(null); setClientForm({ ...emptyClient }); }
  };

  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 6, height: 32, background: "#E8192C", borderRadius: 2 }} />
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 24, letterSpacing: 3 }}>SEVENXP</span>
            <span style={{ color: "#E8192C", fontSize: 11, fontWeight: 700, background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.3)", padding: "2px 8px", borderRadius: 4 }}>ADMIN</span>
          </div>
          <div style={{ color: "#555", fontSize: 14 }}>Secure Admin Panel</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40 }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Welcome back 👋</div>
          <div style={{ color: "#555", fontSize: 14, marginBottom: 32 }}>Enter admin password</div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>PASSWORD</div>
            <input type="password" value={password}
              onChange={e => { setPassword(e.target.value); setLoginError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter password"
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${loginError ? "#E8192C" : "rgba(255,255,255,0.1)"}`, color: "#fff", padding: "14px 16px", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
            {loginError && <div style={{ color: "#E8192C", fontSize: 12, marginTop: 8 }}>❌ Wrong password!</div>}
          </div>
          <button onClick={handleLogin}
            style={{ width: "100%", background: "#E8192C", color: "#fff", padding: "14px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 24px rgba(232,25,44,0.4)" }}>
            🔐 Login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex" }}>
      {notification && (
        <div style={{ position: "fixed", top: 24, right: 24, background: notifColor[notification.type], color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, zIndex: 9999, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
          {notification.msg}
        </div>
      )}

      <aside style={{ width: 240, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "24px 16px", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, padding: "0 8px" }}>
          <div style={{ width: 4, height: 24, background: "#E8192C", borderRadius: 2 }} />
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>SEVENXP</span>
          <span style={{ color: "#E8192C", fontSize: 9, fontWeight: 700, background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.3)", padding: "1px 6px", borderRadius: 3 }}>ADMIN</span>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const badge = item.badgeKey === "products" ? products.length
              : item.badgeKey === "orders" ? (orders.filter(o => o.status === "pending").length || undefined)
              : undefined;
            const isOpen = openSection === item.id;
            const isActiveParent = activeTab === item.id || (item.submenu?.some(s => s.id === activeTab) ?? false);

            return (
              <div key={item.id} style={{ marginBottom: 2 }}>
                <button onClick={() => handleSectionClick(item)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, background: isActiveParent ? "rgba(232,25,44,0.12)" : "transparent", color: isActiveParent ? "#E8192C" : "#666", fontSize: 14, fontWeight: isActiveParent ? 700 : 500, transition: "all 0.2s", textAlign: "left" }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {badge ? <span style={{ background: item.id === "orders" ? "#E8192C" : "rgba(255,255,255,0.08)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 50 }}>{badge}</span> : null}
                  {item.submenu && (
                    <span style={{ fontSize: 10, color: isActiveParent ? "#E8192C" : "#555", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▾</span>
                  )}
                </button>

                {item.submenu && isOpen && (
                  <div style={{ display: "flex", flexDirection: "column", paddingLeft: 30, marginBottom: 6 }}>
                    {item.submenu.map(sub => {
                      const isActiveSub = activeTab === sub.id;
                      return (
                        <button key={sub.id} onClick={() => handleSubClick(sub)}
                          style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "8px 10px", borderRadius: 8, fontSize: 13, marginBottom: 1, color: isActiveSub ? "#E8192C" : "#555", fontWeight: isActiveSub ? 700 : 400 }}>
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
          <a href="/product" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, color: "#555", textDecoration: "none", padding: "10px 16px", borderRadius: 8, fontSize: 13 }}>🌐 View Store</a>
          <button onClick={() => setLoggedIn(false)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, color: "#555", padding: "10px 16px", borderRadius: 8, fontSize: 13, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>🚪 Logout</button>
        </div>
      </aside>

      <main style={{ marginLeft: 240, flex: 1, padding: "32px" }}>

        {activeTab === "dashboard" && (
          <div>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Dashboard 📊</h1>
            <div style={{ color: "#555", fontSize: 14, marginBottom: 32 }}>Welcome back, FozlulHoque!</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
              {[
                { label: "Total Products", value: products.length, icon: "🛍️", color: "#E8192C" },
                { label: "Pending Orders", value: orders.filter(o => o.status === "pending").length, icon: "📦", color: "#f59e0b" },
                { label: "Approved Orders", value: orders.filter(o => o.status === "approved").length, icon: "✅", color: "#10b981" },
                { label: "Revenue (approved)", value: `$${totalRevenue}`, icon: "💰", color: "#3b82f6" },
              ].map((stat, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${stat.color}12` }} />
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{stat.icon}</div>
                  <div style={{ color: stat.color, fontSize: 32, fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ color: "#888", fontSize: 13 }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Recent Products</div>
                <button onClick={() => { setEditId(null); setForm({ ...emptyProduct }); setActiveTab("add"); }} style={{ background: "#E8192C", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>+ Add New</button>
              </div>
              {products.slice(0, 5).map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", background: "rgba(232,25,44,0.1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    {p.image_url && getMediaType(p.image_url) === "image" ? <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.image_url && getMediaType(p.image_url) === "video" ? "🎬" : p.image_url && getMediaType(p.image_url) === "audio" ? "🎵" : "🛍"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ color: "#555", fontSize: 11 }}>{p.category} · {p.sales || 0} sales</div>
                  </div>
                  <div style={{ color: "#E8192C", fontWeight: 800 }}>${p.price}</div>
                  <div style={{ background: `${statusColor[p.status] || "#888"}18`, color: statusColor[p.status] || "#888", padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>{(p.status || "active").toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Products 🛍️</h1>
                <div style={{ color: "#555", fontSize: 14 }}>{products.length} products in store</div>
              </div>
              <button onClick={() => { setEditId(null); setForm({ ...emptyProduct }); setActiveTab("add"); }}
                style={{ background: "#E8192C", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 16px rgba(232,25,44,0.3)" }}>
                ➕ Add Product
              </button>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search products..."
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "12px 16px", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 20 }}
            />
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "56px 2fr 1fr 80px 80px 100px 140px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                {["IMG","Product","Category","Price","Sales","Status","Actions"].map(h => (
                  <div key={h} style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{h}</div>
                ))}
              </div>
              {loading ? <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading...</div> : filtered.map(product => (
                <div key={product.id} style={{ display: "grid", gridTemplateColumns: "56px 2fr 1fr 80px 80px 100px 140px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", background: "rgba(232,25,44,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                    {product.image_url && getMediaType(product.image_url) === "image" ? <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : product.image_url && getMediaType(product.image_url) === "video" ? "🎬" : product.image_url && getMediaType(product.image_url) === "audio" ? "🎵" : "🛍"}
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{product.name}</div>
                    <div style={{ color: "#555", fontSize: 11 }}>{product.format} {product.file_size && `· ${product.file_size}`}</div>
                  </div>
                  <div style={{ color: "#888", fontSize: 12 }}>{product.category}</div>
                  <div style={{ color: "#E8192C", fontWeight: 700 }}>${product.price}</div>
                  <div style={{ color: "#888", fontSize: 13 }}>{product.sales || 0}</div>
                  <div style={{ background: `${statusColor[product.status] || "#888"}18`, color: statusColor[product.status] || "#888", padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700, display: "inline-block" }}>{(product.status || "active").toUpperCase()}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setForm({ ...product }); setEditId(product.id || null); setActiveTab("add"); }}
                      style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Edit</button>
                    <button onClick={() => setDeleteConfirm(product.id!)}
                      style={{ background: "rgba(232,25,44,0.08)", color: "#E8192C", border: "1px solid rgba(232,25,44,0.15)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{editId ? "Edit Product ✏️" : "Add New Product ➕"}</h1>
              <div style={{ color: "#555", fontSize: 14 }}>Fill details, upload files, generate SEO with AI</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📝 Basic Info</div>
                  {[
                    { label: "Product Title *", key: "name", placeholder: "e.g. Social Media Template Pack" },
                    { label: "Format / Tech Stack", key: "format", placeholder: "e.g. PSD, Canva, Next.js" },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 16 }}>
                      <div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>{f.label.toUpperCase()}</div>
                      <input value={(form as Record<string, unknown>)[f.key] as string} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "11px 14px", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    {[{ label: "Price ($) *", key: "price" }, { label: "Old Price ($)", key: "old_price" }].map(f => (
                      <div key={f.key}>
                        <div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>{f.label.toUpperCase()}</div>
                        <input type="number" value={(form as Record<string, unknown>)[f.key] as number} onChange={e => setForm(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "11px 14px", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>CATEGORY</div>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "11px 14px", borderRadius: 8, fontSize: 14, outline: "none" }}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>TAG</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {tags.map(tag => (
                        <button key={tag} onClick={() => setForm(p => ({ ...p, tag }))}
                          style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${form.tag === tag ? "#E8192C" : "rgba(255,255,255,0.08)"}`, background: form.tag === tag ? "rgba(232,25,44,0.15)" : "transparent", color: form.tag === tag ? "#E8192C" : "#555", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📄 Description</div>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your product..." rows={6}
                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "12px 14px", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>⚙️ Status</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {(["active", "draft"] as const).map(s => (
                      <button key={s} onClick={() => setForm(p => ({ ...p, status: s }))}
                        style={{ flex: 1, padding: "12px", borderRadius: 8, border: `1px solid ${form.status === s ? "#10b981" : "rgba(255,255,255,0.08)"}`, background: form.status === s ? "rgba(16,185,129,0.12)" : "transparent", color: form.status === s ? "#10b981" : "#666", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                        {s === "active" ? "✓ Active (Live)" : "◯ Draft (Hidden)"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🖼️ Product Media</div>
                  <div onClick={() => !uploadingImage && imageRef.current?.click()}
                    style={{ border: "2px dashed rgba(232,25,44,0.3)", borderRadius: 12, padding: form.image_url ? 0 : "32px", textAlign: "center", cursor: uploadingImage ? "wait" : "pointer", overflow: "hidden", minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {uploadingImage ? (
                      <div style={{ color: "#E8192C", fontWeight: 600 }}>⏳ Uploading...</div>
                    ) : form.image_url ? (
                      (() => {
                        const mediaType = getMediaType(form.image_url);
                        if (mediaType === "video") {
                          return <video src={form.image_url} controls style={{ width: "100%", maxHeight: 220, borderRadius: 10 }} />;
                        }
                        if (mediaType === "audio") {
                          return (
                            <div style={{ padding: "20px 12px", width: "100%" }}>
                              <div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div>
                              <audio src={form.image_url} controls style={{ width: "100%" }} />
                            </div>
                          );
                        }
                        return <img src={form.image_url} alt="preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 10 }} />;
                      })()
                    ) : (
                      <div>
                        <div style={{ fontSize: 40, marginBottom: 8 }}>🖼️</div>
                        <div style={{ color: "#E8192C", fontWeight: 600, fontSize: 14 }}>Click to upload image, video, or audio</div>
                        <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>PNG, JPG, MP4, MP3 · Max 500MB</div>
                      </div>
                    )}
                  </div>
                  {form.image_url && <button onClick={() => setForm(p => ({ ...p, image_url: "" }))} style={{ marginTop: 8, background: "none", border: "none", color: "#E8192C", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✕ Remove</button>}
                  <input ref={imageRef} type="file" accept="image/*,video/*,audio/*" onChange={handleImageUpload} style={{ display: "none" }} />
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>📁 Product File</div>
                  <div style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>ZIP, PDF, PSD, AI, MP4 · Max 500MB</div>
                  <div onClick={() => !uploadingFile && fileRef.current?.click()}
                    style={{ border: "2px dashed rgba(59,130,246,0.3)", borderRadius: 12, padding: "24px", textAlign: "center", cursor: uploadingFile ? "wait" : "pointer" }}>
                    {uploadingFile ? (
                      <div style={{ color: "#3b82f6", fontWeight: 600 }}>⏳ Uploading file...</div>
                    ) : form.file_url ? (
                      <div>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                        <div style={{ color: "#10b981", fontWeight: 700, fontSize: 14 }}>{form.file_name}</div>
                        <div style={{ color: "#555", fontSize: 12 }}>{form.file_size}</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 40, marginBottom: 8 }}>📁</div>
                        <div style={{ color: "#3b82f6", fontWeight: 600, fontSize: 14 }}>Click to upload file</div>
                        <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>Any format · Up to 500MB</div>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" onChange={handleFileUpload} style={{ display: "none" }} />
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 16, padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>🤖 AI SEO Generator</div>
                      <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>ThemeForest style auto SEO</div>
                    </div>
                    <button onClick={generateSEO} disabled={aiGenerating}
                      style={{ background: "rgba(139,92,246,0.15)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", padding: "10px 18px", borderRadius: 8, cursor: aiGenerating ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700 }}>
                      {aiGenerating ? "⏳ Generating..." : "✨ Generate SEO"}
                    </button>
                  </div>
                  {[
                    { label: "SEO Title (60 chars)", key: "seo_title" },
                    { label: "Meta Description (155 chars)", key: "seo_description" },
                    { label: "Keywords", key: "seo_keywords" },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 12 }}>
                      <div style={{ color: "#888", fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 5 }}>{f.label.toUpperCase()}</div>
                      <input value={(form as Record<string, unknown>)[f.key] as string} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder="Auto-generated..."
                        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", padding: "10px 12px", borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>

                <button onClick={handleSave} disabled={loading}
                  style={{ background: loading ? "#333" : "#E8192C", color: "#fff", padding: "18px", borderRadius: 12, border: "none", fontWeight: 800, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 8px 24px rgba(232,25,44,0.4)" }}>
                  {loading ? "⏳ Saving..." : editId ? "💾 Update Product" : "🚀 Publish Product"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Orders 📦</h1>
            <div style={{ color: "#555", fontSize: 14, marginBottom: 32 }}>{orders.length} total orders</div>
            {orders.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 60, textAlign: "center" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No orders yet</div>
                <div style={{ color: "#555", fontSize: 14 }}>Orders will appear here when clients purchase via WhatsApp</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {orders.map(order => (
                  <div key={order.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px 120px 160px", alignItems: "center", gap: 16 }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{order.customer_name}</div>
                      <div style={{ color: "#555", fontSize: 11 }}>{order.customer_email}</div>
                    </div>
                    <div style={{ color: "#ccc", fontSize: 13 }}>{order.product_name}</div>
                    <div style={{ color: "#555", fontSize: 12 }}>{order.payment_method} · {new Date(order.created_at).toLocaleDateString()}</div>
                    <div style={{ color: "#E8192C", fontWeight: 900, fontSize: 18 }}>${order.amount}</div>
                    <div style={{ background: `${statusColor[order.status] || "#888"}18`, color: statusColor[order.status] || "#888", padding: "6px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700, textAlign: "center" }}>{order.status.toUpperCase()}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {order.status === "pending" && (
                        <button onClick={() => handleOrderStatus(order.id, "approved")}
                          style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>✓ Approve</button>
                      )}
                      {order.status !== "rejected" && (
                        <button onClick={() => handleOrderStatus(order.id, "rejected")}
                          style={{ background: "rgba(232,25,44,0.08)", color: "#E8192C", border: "1px solid rgba(232,25,44,0.15)", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {["projects-all", "projects-draft", "projects-published", "projects-featured"].includes(activeTab) && (
          <div>
            {(() => {
              const filteredProjects =
                activeTab === "projects-draft" ? projectsList.filter(p => p.status === "draft") :
                activeTab === "projects-published" ? projectsList.filter(p => p.status === "published") :
                activeTab === "projects-featured" ? projectsList.filter(p => p.is_featured) :
                projectsList;

              const heading =
                activeTab === "projects-draft" ? "Draft Projects 📝" :
                activeTab === "projects-published" ? "Published Projects ✅" :
                activeTab === "projects-featured" ? "Featured Projects ⭐" :
                "Projects 📁";

              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                      <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{heading}</h1>
                      <div style={{ color: "#555", fontSize: 14 }}>{filteredProjects.length} projects</div>
                    </div>
                    <button onClick={() => { window.location.href = "/admin/projects/add"; }}
                      style={{ background: "#E8192C", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 16px rgba(232,25,44,0.3)" }}>
                      ➕ Add Project
                    </button>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "56px 2fr 100px 100px 180px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                      {["IMG", "Title", "Status", "Featured", "Actions"].map(h => (
                        <div key={h} style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{h}</div>
                      ))}
                    </div>

                    {projectsLoading ? (
                      <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading...</div>
                    ) : filteredProjects.length === 0 ? (
                      <div style={{ padding: 60, textAlign: "center" }}>
                        <div style={{ fontSize: 50, marginBottom: 16 }}>📁</div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No projects here</div>
                      </div>
                    ) : (
                      filteredProjects.map(project => (
                        <div key={project.id} style={{ display: "grid", gridTemplateColumns: "56px 2fr 100px 100px 180px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", background: "rgba(232,25,44,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                            {project.thumbnail_url ? <img src={project.thumbnail_url} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📁"}
                          </div>
                          <div>
                            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{project.title}</div>
                            <div style={{ color: "#555", fontSize: 11 }}>/{project.slug}</div>
                          </div>
                          <div>
                            <span style={{
                              background: project.status === "published" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.08)",
                              color: project.status === "published" ? "#10b981" : "#888",
                              padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700,
                            }}>
                              {project.status.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <button onClick={() => handleProjectFeature(project.id, project.is_featured)}
                              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>
                              {project.is_featured ? "⭐" : "☆"}
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => { window.location.href = `/admin/projects/add?edit=${project.id}`; }}
                              style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Edit</button>
                            <button onClick={() => handleProjectStatus(project.id, project.status === "published" ? "draft" : "published")}
                              style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                              {project.status === "published" ? "Unpublish" : "Publish"}
                            </button>
                            <button onClick={() => handleProjectDelete(project.id)}
                              style={{ background: "rgba(232,25,44,0.08)", color: "#E8192C", border: "1px solid rgba(232,25,44,0.15)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Del</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {activeTab === "projects-categories" && (
          <div>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Categories 🏷️</h1>
            <div style={{ color: "#555", fontSize: 14, marginBottom: 24 }}>{categoriesList.length} categories</div>

            <div style={{ display: "flex", gap: 10, marginBottom: 24, maxWidth: 420 }}>
              <input value={newCatName} onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddCategory()}
                placeholder="e.g. Mobile App Design"
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "11px 14px", borderRadius: 8, fontSize: 14, outline: "none" }} />
              <button onClick={handleAddCategory}
                style={{ background: "#E8192C", color: "#fff", border: "none", padding: "11px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                + Add
              </button>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden", maxWidth: 500 }}>
              {catLoading ? (
                <div style={{ padding: 30, textAlign: "center", color: "#555" }}>Loading...</div>
              ) : categoriesList.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "#555" }}>No categories yet.</div>
              ) : (
                categoriesList.map(c => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: "#fff", fontSize: 14 }}>{c.name}</span>
                    <button onClick={() => handleDeleteCategory(c.id)}
                      style={{ background: "rgba(232,25,44,0.08)", color: "#E8192C", border: "1px solid rgba(232,25,44,0.15)", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Del</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {["clients-all", "clients-active", "clients-completed", "clients-pending"].includes(activeTab) && (
          <div>
            {(() => {
              const filteredClients =
                activeTab === "clients-active" ? clientsList.filter(c => c.status === "active") :
                activeTab === "clients-completed" ? clientsList.filter(c => c.status === "completed") :
                activeTab === "clients-pending" ? clientsList.filter(c => c.status === "pending") :
                clientsList;

              const heading =
                activeTab === "clients-active" ? "Active Clients 🟢" :
                activeTab === "clients-completed" ? "Completed Clients ✅" :
                activeTab === "clients-pending" ? "Pending Clients ⏳" :
                "Clients 👥";

              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                      <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{heading}</h1>
                      <div style={{ color: "#555", fontSize: 14 }}>{filteredClients.length} clients</div>
                    </div>
                    <button onClick={() => { setEditClientId(null); setClientForm({ ...emptyClient }); setActiveTab("clients-add"); }}
                      style={{ background: "#E8192C", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 16px rgba(232,25,44,0.3)" }}>
                      ➕ Add Client
                    </button>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 100px 160px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                      {["Name", "Email / Phone", "Company", "Project", "Status", "Actions"].map(h => (
                        <div key={h} style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{h}</div>
                      ))}
                    </div>

                    {clientsLoading ? (
                      <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading...</div>
                    ) : filteredClients.length === 0 ? (
                      <div style={{ padding: 60, textAlign: "center" }}>
                        <div style={{ fontSize: 50, marginBottom: 16 }}>👥</div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No clients here</div>
                      </div>
                    ) : (
                      filteredClients.map(client => (
                        <div key={client.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 100px 160px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                          <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{client.name}</div>
                          <div>
                            <div style={{ color: "#ccc", fontSize: 12 }}>{client.email}</div>
                            <div style={{ color: "#555", fontSize: 11 }}>{client.phone}</div>
                          </div>
                          <div style={{ color: "#888", fontSize: 12 }}>{client.company}</div>
                          <div style={{ color: "#888", fontSize: 12 }}>{client.project}</div>
                          <div>
                            <span style={{ background: `${statusColor[client.status] || "#888"}18`, color: statusColor[client.status] || "#888", padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>
                              {client.status.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => { setClientForm({ ...client }); setEditClientId(client.id); setActiveTab("clients-add"); }}
                              style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Edit</button>
                            <button onClick={() => setClientDeleteConfirm(client.id)}
                              style={{ background: "rgba(232,25,44,0.08)", color: "#E8192C", border: "1px solid rgba(232,25,44,0.15)", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Del</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {activeTab === "clients-add" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{editClientId ? "Edit Client ✏️" : "Add New Client ➕"}</h1>
              <div style={{ color: "#555", fontSize: 14 }}>Client details</div>
            </div>
            <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
                {[
                  { label: "Name *", key: "name", placeholder: "e.g. John Doe" },
                  { label: "Email", key: "email", placeholder: "client@example.com" },
                  { label: "Phone", key: "phone", placeholder: "+880..." },
                  { label: "Company", key: "company", placeholder: "e.g. Fashion Brand" },
                  { label: "Project", key: "project", placeholder: "e.g. E-Commerce Store" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 16 }}>
                    <div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>{f.label.toUpperCase()}</div>
                    <input
                      value={(clientForm as Record<string, unknown>)[f.key] as string}
                      onChange={e => setClientForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "11px 14px", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>STATUS</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["active", "completed", "pending"].map(s => (
                      <button key={s} onClick={() => setClientForm(p => ({ ...p, status: s }))}
                        style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${clientForm.status === s ? "#E8192C" : "rgba(255,255,255,0.08)"}`, background: clientForm.status === s ? "rgba(232,25,44,0.12)" : "transparent", color: clientForm.status === s ? "#E8192C" : "#666", cursor: "pointer", fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>NOTES</div>
                  <textarea value={clientForm.notes} onChange={e => setClientForm(p => ({ ...p, notes: e.target.value }))} rows={4}
                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "11px 14px", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <button onClick={handleSaveClient} disabled={clientsLoading}
                style={{ background: clientsLoading ? "#333" : "#E8192C", color: "#fff", padding: "16px", borderRadius: 12, border: "none", fontWeight: 800, fontSize: 15, cursor: clientsLoading ? "not-allowed" : "pointer" }}>
                {clientsLoading ? "⏳ Saving..." : editClientId ? "💾 Update Client" : "🚀 Add Client"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "clients-messages" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Client Messages 💬</h1>
              <div style={{ color: "#555", fontSize: 14 }}>{messagesList.length} messages</div>
            </div>

            {messagesLoading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#555" }}>Loading...</div>
            ) : messagesList.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 60, textAlign: "center" }}>
                <div style={{ fontSize: 50, marginBottom: 16 }}>💬</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>No messages yet</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {messagesList.map(m => (
                  <div key={m.id} style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${m.status === "new" ? "rgba(232,25,44,0.3)" : "rgba(16,185,129,0.2)"}`,
                    borderRadius: 14, padding: 20
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{m.name}</span>{" "}
                        <span style={{ color: "#555", fontSize: 12 }}>({m.email})</span>
                      </div>
                      <span style={{ color: "#555", fontSize: 11 }}>{new Date(m.created_at).toLocaleString("en-GB")}</span>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, fontSize: 13, color: "#ccc", marginBottom: 10 }}>
                      {m.message}
                    </div>

                    {m.status === "replied" && m.reply && (
                      <div style={{ background: "rgba(16,185,129,0.08)", color: "#10b981", padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 10 }}>
                        <strong>আপনার রিপ্লাই:</strong> {m.reply}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        placeholder="রিপ্লাই লিখুন..."
                        value={replyDrafts[m.id] ?? ""}
                        onChange={e => setReplyDrafts(prev => ({ ...prev, [m.id]: e.target.value }))}
                        style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "9px 12px", borderRadius: 8, fontSize: 13, outline: "none" }}
                      />
                      <button onClick={() => handleSendReply(m.id)}
                        style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)", padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                        Reply
                      </button>
                      <button onClick={() => handleDeleteMessage(m.id)}
                        style={{ background: "rgba(232,25,44,0.08)", color: "#E8192C", border: "1px solid rgba(232,25,44,0.15)", padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!IMPLEMENTED_TABS.has(activeTab) && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 50, marginBottom: 16 }}>🚧</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Coming soon</div>
            <div style={{ color: "#555", fontSize: 14 }}>এই section এখনো বানানো হয় নাই — শীঘ্রই যোগ হবে।</div>
          </div>
        )}
      </main>

      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#111", border: "1px solid rgba(232,25,44,0.2)", borderRadius: 20, padding: 40, textAlign: "center", maxWidth: 380, width: "90%" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Delete Product?</div>
            <div style={{ color: "#555", fontSize: 14, marginBottom: 32 }}>এটা ফিরিয়ে আনা যাবে না।</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, background: "#E8192C", color: "#fff", padding: "12px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer" }}>Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "#fff", padding: "12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {clientDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#111", border: "1px solid rgba(232,25,44,0.2)", borderRadius: 20, padding: 40, textAlign: "center", maxWidth: 380, width: "90%" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Delete Client?</div>
            <div style={{ color: "#555", fontSize: 14, marginBottom: 32 }}>এটা ফিরিয়ে আনা যাবে না।</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => handleDeleteClient(clientDeleteConfirm)} style={{ flex: 1, background: "#E8192C", color: "#fff", padding: "12px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer" }}>Delete</button>
              <button onClick={() => setClientDeleteConfirm(null)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "#fff", padding: "12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
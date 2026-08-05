"use client";
import { useState, useEffect, DragEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

// ===== TYPES =====
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  format: string;
  sales: number;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
  preview_url: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: "active" | "draft";
};

type Order = {
  id: string;
  product_name: string;
  customer_email: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const categories = [
  "Fonts", "Templates & Graphics", "Source Code", "Website Templates",
  "E-books & Courses", "Printables", "Productivity", "AI Products",
  "Audio", "Video Assets", "3D Assets", "UI/UX Design",
  "Graphic Design Assets", "App & Software",
];

const emptyForm = {
  name: "", category: categories[0], price: "", format: "",
  description: "", features: "", previewUrl: "",
  metaTitle: "", metaDescription: "", status: "active" as "active" | "draft",
};

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`;
}

// Uploads a file directly to Supabase Storage using a signed URL,
// so large files (up to the bucket's configured limit) don't pass through
// our Next.js API route (which would otherwise hit body-size limits).
async function uploadViaSignedUrl(
  file: File,
  bucket: "images" | "files",
  onProgress: (pct: number) => void
) {
  const res = await fetch("/api/admin/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, bucket }),
  });
  if (!res.ok) throw new Error("Upload URL তৈরি করা যায়নি");
  const { token, path, publicUrl, bucket: targetBucket } = await res.json();

  // Approximate progress: Supabase's signed-upload helper doesn't expose
  // byte-level progress, so we animate up to 90% while the request is in
  // flight and jump to 100% on completion.
  let pct = 0;
  const tick = setInterval(() => {
    pct = Math.min(pct + Math.random() * 12, 90);
    onProgress(pct);
  }, 300);

  const { error } = await supabase.storage
    .from(targetBucket)
    .uploadToSignedUrl(path, token, file);

  clearInterval(tick);
  if (error) throw error;
  onProgress(100);

  return { publicUrl, fileName: file.name, fileSize: file.size };
}

// ===== Auto-thumbnail helpers =====

// Capture a frame from a video file and return it as a Blob (JPEG)
function generateVideoThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      // Seek to 1s in (or middle of very short clips) for a more meaningful frame
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context না পাওয়া গেল"));
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(video.src);
          if (blob) resolve(blob);
          else reject(new Error("Thumbnail বানানো যায়নি"));
        },
        "image/jpeg",
        0.85
      );
    };

    video.onerror = () => reject(new Error("Video load করা যায়নি"));
  });
}

// Uploads an auto-generated thumbnail (Blob) to the images bucket
async function uploadThumbnail(blob: Blob, baseName: string) {
  const thumbFile = new File([blob], `${baseName}-thumb.jpg`, { type: "image/jpeg" });
  const res = await fetch("/api/admin/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: thumbFile.name, bucket: "images" }),
  });
  if (!res.ok) throw new Error("Thumbnail upload URL তৈরি করা যায়নি");
  const { token, path, publicUrl, bucket: targetBucket } = await res.json();

  const { error } = await supabase.storage
    .from(targetBucket)
    .uploadToSignedUrl(path, token, thumbFile);

  if (error) throw error;
  return publicUrl;
}

function DropZone({
  label, accept, maxLabel, currentName, onFile,
}: {
  label: string;
  accept: string;
  maxLabel: string;
  currentName?: string | null;
  onFile: (file: File) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputId = `drop-${label.replace(/\s/g, "")}`;

  return (
    <div>
      <div style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>
        {label.toUpperCase()}
      </div>
      <div
        onDragOver={(e: DragEvent) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
        onClick={() => document.getElementById(inputId)?.click()}
        style={{
          border: `2px dashed ${dragOver ? "#E8192C" : "rgba(232,25,44,0.3)"}`,
          background: dragOver ? "rgba(232,25,44,0.06)" : "transparent",
          borderRadius: 10, padding: "24px", textAlign: "center", cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        {currentName ? (
          <div style={{ color: "#ccc", fontSize: 13 }}>📎 {currentName}</div>
        ) : (
          <div style={{ color: "#555", fontSize: 13 }}>
            Drag & drop করুন, বা ক্লিক করে বেছে নিন
            <div style={{ fontSize: 11, marginTop: 4, color: "#444" }}>{maxLabel}</div>
          </div>
        )}
      </div>
      <input
        id={inputId}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </div>
  );
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "add" | "orders">("dashboard");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<{ file: File; progress: number } | null>(null);
  const [deliverableFile, setDeliverableFile] = useState<{ file: File; progress: number } | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string; size: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoadingProducts(false);
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (loggedIn) { loadProducts(); loadOrders(); }
  }, [loggedIn]);

  const handleOrderAction = async (id: string, action: "approve" | "reject") => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) {
      notify(action === "approve" ? "✓ Approved, email পাঠানো হয়েছে" : "Order reject করা হয়েছে");
      loadOrders();
    } else {
      notify("কিছু ভুল হয়েছে", "error");
    }
  };

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setLoggedIn(true); setLoginError(false); }
    else setLoginError(true);
  };

  const handleImagePick = async (file: File) => {
    setImageFile({ file, progress: 0 });
    try {
      const result = await uploadViaSignedUrl(file, "images", (pct) =>
        setImageFile({ file, progress: pct })
      );
      setUploadedImageUrl(result.publicUrl);
      notify("✓ Image uploaded");
    } catch (err) {
      notify("Image upload ব্যর্থ হয়েছে", "error");
      setImageFile(null);
    }
  };

  const handleFilePick = async (file: File) => {
    if (file.size > 500 * 1024 * 1024) {
      notify("Max file size 500MB", "error");
      return;
    }
    setDeliverableFile({ file, progress: 0 });
    try {
      const result = await uploadViaSignedUrl(file, "files", (pct) =>
        setDeliverableFile({ file, progress: pct })
      );
      setUploadedFile({ url: result.publicUrl, name: result.fileName, size: result.fileSize });
      notify("✓ Product file uploaded");

      // ===== Auto-generate thumbnail (only if user hasn't manually uploaded one) =====
      if (!uploadedImageUrl) {
        if (file.type.startsWith("video/")) {
          try {
            notify("Preview thumbnail বানানো হচ্ছে...");
            const thumbBlob = await generateVideoThumbnail(file);
            const thumbUrl = await uploadThumbnail(thumbBlob, file.name.replace(/\.[^/.]+$/, ""));
            setUploadedImageUrl(thumbUrl);
            notify("✓ Auto thumbnail তৈরি হয়েছে");
          } catch (thumbErr) {
            console.error("Thumbnail generation failed:", thumbErr);
            // Silent fail — user can still upload thumbnail manually
          }
        } else if (file.type.startsWith("image/")) {
          // Image file itself can serve as its own preview
          setUploadedImageUrl(result.publicUrl);
        }
      }
    } catch (err) {
      notify("File upload ব্যর্থ হয়েছে", "error");
      setDeliverableFile(null);
    }
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price) return notify("Name and price required!", "error");
    setSubmitting(true);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        format: form.format,
        description: form.description,
        features: form.features ? form.features.split("\n").map((f) => f.trim()).filter(Boolean) : [],
        previewUrl: form.previewUrl,
        image_url: uploadedImageUrl,
        file_url: uploadedFile?.url,
        file_name: uploadedFile?.name,
        file_size: uploadedFile?.size,
        meta_title: form.metaTitle,
        meta_description: form.metaDescription,
        status: form.status,
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      setForm(emptyForm);
      setImageFile(null);
      setDeliverableFile(null);
      setUploadedImageUrl("");
      setUploadedFile(null);
      setActiveTab("products");
      loadProducts();
      notify("✓ Product added successfully!");
    } else {
      const data = await res.json();
      notify(`Error: ${data.error}`, "error");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingProduct.id,
        name: editingProduct.name,
        price: editingProduct.price,
        format: editingProduct.format,
        description: editingProduct.description,
        category: editingProduct.category,
        status: editingProduct.status,
      }),
    });
    if (res.ok) {
      setEditingProduct(null);
      loadProducts();
      notify("✓ Product updated!");
    } else {
      notify("Update failed", "error");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setShowDeleteConfirm(null);
    if (res.ok) {
      loadProducts();
      notify("Product deleted.");
    } else {
      notify("Delete failed", "error");
    }
  };

  const activeProducts = products.filter((p) => p.status === "active").length;
  const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // ===== LOGIN PAGE =====
  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40, width: 340 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Admin Login</div>
        <div style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>SEVENXP Dashboard</div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
        />
        {loginError && <div style={{ color: "#E8192C", fontSize: 12, marginBottom: 12 }}>ভুল password, আবার চেষ্টা করুন।</div>}
        <button onClick={handleLogin} style={{ width: "100%", background: "#E8192C", color: "#fff", padding: 13, borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer" }}>
          Login
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
      {/* Header + Tabs */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: 1 }}>SEVENXP <span style={{ color: "#E8192C" }}>ADMIN</span></div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["dashboard", "products", "orders", "add"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "#E8192C" : "transparent",
                color: activeTab === tab ? "#fff" : "#888",
                border: "1px solid " + (activeTab === tab ? "#E8192C" : "rgba(255,255,255,0.1)"),
                padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, textTransform: "capitalize",
              }}>
              {tab === "add" ? "+ Add Product" : tab}
            </button>
          ))}
        </div>
      </div>

      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 2000,
          background: notification.type === "success" ? "#111" : "#2a0f0f",
          border: `1px solid ${notification.type === "success" ? "#10b981" : "#E8192C"}`,
          color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 13,
        }}>
          {notification.msg}
        </div>
      )}

      <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total Products", value: products.length },
                { label: "Pending Orders", value: orders.filter((o) => o.status === "pending").length },
                { label: "Approved Orders", value: orders.filter((o) => o.status === "approved").length },
                {
                  label: "Revenue (approved)",
                  value: `$${orders.filter((o) => o.status === "approved").reduce((s, o) => s + Number(o.amount), 0)}`,
                },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20 }}>
                  <div style={{ color: "#888", fontSize: 12, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{s.value}</div>
                </div>
              ))}
            </div>
            {orders.filter((o) => o.status === "pending").length > 0 && (
              <div
                onClick={() => setActiveTab("orders")}
                style={{ background: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)", borderRadius: 12, padding: 16, cursor: "pointer", fontSize: 13, color: "#ff8a94" }}
              >
                🔔 {orders.filter((o) => o.status === "pending").length} টা order pending — payment check করে approve করুন →
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS LIST */}
        {activeTab === "products" && (
          <div>
            <input
              placeholder="Search products..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 20 }}
            />
            {loadingProducts ? (
              <div style={{ color: "#666" }}>লোড হচ্ছে...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredProducts.map((p) => (
                  <div key={p.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: 8, background: "rgba(232,25,44,0.08)" }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                      <div style={{ color: "#666", fontSize: 12 }}>{p.category} · ${p.price} · {p.sales} sales</div>
                      {p.file_name && <div style={{ color: "#444", fontSize: 11 }}>📎 {p.file_name} ({formatBytes(p.file_size)})</div>}
                    </div>
                    <div style={{ background: p.status === "active" ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)", color: p.status === "active" ? "#10b981" : "#888", padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700 }}>
                      {(p.status || "active").toUpperCase()}
                    </div>
                    <button onClick={() => setEditingProduct(p)} style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>Edit</button>
                    <button onClick={() => setShowDeleteConfirm(p.id)} style={{ background: "rgba(232,25,44,0.1)", color: "#E8192C", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                <button key={f} onClick={() => setOrderFilter(f)}
                  style={{
                    background: orderFilter === f ? "#E8192C" : "rgba(255,255,255,0.05)",
                    color: orderFilter === f ? "#fff" : "#888",
                    border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                    fontSize: 12, fontWeight: 600, textTransform: "capitalize",
                  }}>
                  {f}
                </button>
              ))}
            </div>

            {loadingOrders ? (
              <div style={{ color: "#666" }}>লোড হচ্ছে...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {orders
                  .filter((o) => orderFilter === "all" || o.status === orderFilter)
                  .map((o) => (
                    <div key={o.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{o.product_name}</div>
                        <div style={{
                          background: o.status === "approved" ? "rgba(16,185,129,0.12)" : o.status === "rejected" ? "rgba(232,25,44,0.1)" : "rgba(234,179,8,0.12)",
                          color: o.status === "approved" ? "#10b981" : o.status === "rejected" ? "#E8192C" : "#eab308",
                          padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700,
                        }}>
                          {o.status.toUpperCase()}
                        </div>
                      </div>
                      <div style={{ color: "#888", fontSize: 12.5, marginBottom: 4 }}>
                        {o.customer_email} · ${o.amount} · {o.payment_method}
                      </div>
                      <div style={{ color: "#555", fontSize: 12 }}>
                        Txn ID: <span style={{ color: "#aaa" }}>{o.transaction_id}</span>
                      </div>
                      <div style={{ color: "#444", fontSize: 11, marginTop: 4 }}>
                        {new Date(o.created_at).toLocaleString()}
                      </div>
                      {o.status === "pending" && (
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button onClick={() => handleOrderAction(o.id, "approve")}
                            style={{ background: "#10b981", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                            ✓ Approve & Send Email
                          </button>
                          <button onClick={() => handleOrderAction(o.id, "reject")}
                            style={{ background: "rgba(232,25,44,0.1)", color: "#E8192C", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                {orders.filter((o) => orderFilter === "all" || o.status === orderFilter).length === 0 && (
                  <div style={{ color: "#555", fontSize: 13 }}>কোনো order নেই।</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ADD PRODUCT */}
        {activeTab === "add" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
            <div>
              <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>PRODUCT NAME</div>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>PRICE ($)</div>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>FORMAT</div>
                <input value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} placeholder="e.g. PSD, Figma"
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div>
              <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>CATEGORY</div>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, fontSize: 14, outline: "none" }}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>DESCRIPTION</div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>

            <div>
              <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>FEATURES (প্রতি লাইনে একটা)</div>
              <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={3}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>

            {/* SEO Fields */}
            <div style={{ border: "1px solid rgba(232,25,44,0.15)", borderRadius: 12, padding: 16 }}>
              <div style={{ color: "#E8192C", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>SEO (ThemeForest style)</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: "#888", fontSize: 11, marginBottom: 6 }}>META TITLE</div>
                <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="খালি রাখলে product name ব্যবহার হবে"
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 10, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ color: "#888", fontSize: 11, marginBottom: 6 }}>META DESCRIPTION</div>
                <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={2}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 10, borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
            </div>

            <DropZone
              label="Thumbnail Image"
              accept="image/*"
              maxLabel="JPG/PNG, ~5MB সুপারিশকৃত (Product File দিলে auto-generate হয়ে যাবে)"
              currentName={imageFile?.file.name}
              onFile={handleImagePick}
            />
            {imageFile && imageFile.progress < 100 && (
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                <div style={{ width: `${imageFile.progress}%`, height: "100%", background: "#E8192C", borderRadius: 4, transition: "width 0.3s" }} />
              </div>
            )}
            {uploadedImageUrl && (
              <img src={uploadedImageUrl} alt="Thumbnail preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }} />
            )}

            <DropZone
              label="Product File (deliverable)"
              accept="*"
              maxLabel="Max 500MB — ZIP, PSD, MP4, যেকোনো ফরম্যাট। Video/Image দিলে preview thumbnail auto বানাবে।"
              currentName={deliverableFile?.file.name}
              onFile={handleFilePick}
            />
            {deliverableFile && deliverableFile.progress < 100 && (
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                <div style={{ width: `${deliverableFile.progress}%`, height: "100%", background: "#E8192C", borderRadius: 4, transition: "width 0.3s" }} />
              </div>
            )}

            <div>
              <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>LIVE PREVIEW URL (optional)</div>
              <input value={form.previewUrl} onChange={(e) => setForm({ ...form, previewUrl: e.target.value })}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>

            <button onClick={handleAddProduct} disabled={submitting}
              style={{ background: "#E8192C", color: "#fff", padding: 14, borderRadius: 10, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {submitting ? "যোগ হচ্ছে..." : "Publish Product"}
            </button>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 32 }}>
          <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 40, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Edit Product</div>
              <button onClick={() => setEditingProduct(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 8, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} placeholder="Name"
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, boxSizing: "border-box" }} />
              <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} placeholder="Price"
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, boxSizing: "border-box" }} />
              <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8 }}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={3}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8, boxSizing: "border-box" }} />
              <select value={editingProduct.status} onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as "active" | "draft" })}
                style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: 12, borderRadius: 8 }}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
              <button onClick={handleSaveEdit} style={{ background: "#E8192C", color: "#fff", padding: 13, borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer" }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#111", border: "1px solid rgba(232,25,44,0.2)", borderRadius: 20, padding: 32, textAlign: "center", maxWidth: 360 }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Delete Product?</div>
            <div style={{ color: "#666", fontSize: 13, marginBottom: 24 }}>এটা ফিরিয়ে আনা যাবে না।</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => handleDeleteProduct(showDeleteConfirm)} style={{ flex: 1, background: "#E8192C", color: "#fff", padding: 12, borderRadius: 10, border: "none", cursor: "pointer" }}>Delete</button>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "#fff", padding: 12, borderRadius: 10, border: "none", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
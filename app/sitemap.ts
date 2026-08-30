import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BASE_URL = "https://venuzen.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/product`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  const { data: products, error: productsError } = await supabaseAdmin
    .from("products")
    .select("slug, created_at");

  if (productsError) console.error("Sitemap products error:", productsError.message);

  const productPages: MetadataRoute.Sitemap = (products || [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const { data: projects, error: projectsError } = await supabaseAdmin
    .from("projects")
    .select("slug, created_at");

  if (projectsError) console.error("Sitemap projects error:", projectsError.message);

  const projectPages: MetadataRoute.Sitemap = (projects || [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // ✅ নতুন: Admin panel এর SEO Meta Settings থেকে extra pages (যেগুলো উপরের static list এ নাই)
  const { data: extraSeoPages, error: seoError } = await supabaseAdmin
    .from("seo_meta")
    .select("page_slug, updated_at, no_index")
    .eq("no_index", false);

  if (seoError) console.error("Sitemap seo_meta error:", seoError.message);

  const knownSlugs = new Set(["", "product", "services", "projects"]);
  const seoPages: MetadataRoute.Sitemap = (extraSeoPages || [])
    .filter((p) => p.page_slug && p.page_slug !== "home" && !knownSlugs.has(p.page_slug))
    .map((p) => ({
      url: `${BASE_URL}/${p.page_slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticPages, ...productPages, ...projectPages, ...seoPages];
}
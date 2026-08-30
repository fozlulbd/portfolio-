import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client. Uses the same public URL/key as the admin
// panel — fine here because seo_meta / seo_schema are public, read-only-in-
// practice data protected by RLS policies that allow anon select.
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export type SeoMeta = {
  id?: string;
  page_slug: string;
  title: string;
  description: string;
  keywords: string;
  og_image: string;
  canonical_url: string;
  no_index: boolean;
};

export type SeoSchemaRow = {
  id?: string;
  page_slug: string;
  schema_json: string;
};

/**
 * Fetches the seo_meta row for a given page path, e.g. "/", "/product",
 * "/product/social-media-pack". Returns null if nothing is configured for
 * that page (caller should fall back to its own default metadata).
 */
export async function getSeoMeta(pageSlug: string): Promise<SeoMeta | null> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("seo_meta")
    .select("*")
    .eq("page_slug", pageSlug)
    .maybeSingle();

  if (error || !data) return null;
  return data as SeoMeta;
}

/**
 * Fetches every JSON-LD schema block configured for a given page path.
 * A page can have more than one (e.g. Product + BreadcrumbList), so this
 * always returns an array — empty if nothing is configured.
 */
export async function getSeoSchema(pageSlug: string): Promise<SeoSchemaRow[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("seo_schema")
    .select("*")
    .eq("page_slug", pageSlug);

  if (error || !data) return [];
  return data as SeoSchemaRow[];
}

/**
 * Convenience helper for generateMetadata(): turns a SeoMeta row (or null)
 * into a Next.js Metadata object, filling in sensible fallbacks when no
 * row exists for that page yet.
 */
export function seoMetaToMetadata(meta: SeoMeta | null, fallback: { title: string; description: string }) {
  if (!meta) {
    return {
      title: fallback.title,
      description: fallback.description,
    };
  }
  return {
    title: meta.title || fallback.title,
    description: meta.description || fallback.description,
    keywords: meta.keywords || undefined,
    alternates: meta.canonical_url ? { canonical: meta.canonical_url } : undefined,
    robots: meta.no_index ? { index: false, follow: false } : undefined,
    openGraph: meta.og_image ? { images: [{ url: meta.og_image }] } : undefined,
  };
}

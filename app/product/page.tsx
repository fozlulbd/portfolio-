import { supabase } from "@/lib/supabase";
import ProductsClient from "@/components/ProductsClient";

export const revalidate = 0; // always fetch fresh

export default async function ProductPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products:", error.message);
  }

  return <ProductsClient products={products ?? []} />;
}

import { createClient } from "@supabase/supabase-js";

/**
 * Herkese açık sayfalar için Supabase istemcisi.
 *
 * Çerez kullanmaz; bu sayede galeri sayfası statik üretilebiliyor ve her
 * ziyarette sunucuya gitmiyor. Yalnızca RLS'te `anon` rolüne açılmış veriyi
 * okuyabilir (şu an sadece `galeri` tablosu).
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your_supabase")) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

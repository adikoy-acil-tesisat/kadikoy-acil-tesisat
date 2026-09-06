import { createBrowserClient } from "@supabase/ssr";

function isPlaceholder(value: string | undefined): boolean {
  return !value || value.includes("your_supabase");
}

export function isSupabaseConfigured(): boolean {
  return (
    !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase yapılandırılmamışsa bile uygulama çökmesin.
  // Dummy client - veri döndürmez ama hata da vermez.
  if (!isSupabaseConfigured()) {
    return createBrowserClient("https://placeholder.supabase.co", "placeholder-key");
  }

  return createBrowserClient(url!, key!);
}

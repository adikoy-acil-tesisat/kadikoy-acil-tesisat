import { createPublicClient } from "@/lib/supabase/public";

export interface GaleriKaydi {
  id: string;
  url: string;
  baslik: string;
  mahalle: string | null;
  kategori: string | null;
}

/**
 * Yayınlanmış iş fotoğrafları.
 *
 * Galeri sayfası, ana sayfa ve mahalle sayfaları aynı kaynaktan okur.
 * Veritabanına ulaşılamazsa boş döner; sayfa yine açılır, sadece fotoğraf
 * bölümü görünmez.
 *
 * Mahalle adı birden fazla biçimde yazılmış olabilir: panelde resmî ad
 * ("Eğitim") kaydedilirken sayfa halk arasındaki adı ("Eğitim Mahallesi")
 * kullanıyor. Bu yüzden tek ad değil, eşdeğer adlar listesi alıyor.
 *
 * @param mahalle verilirse yalnızca bu adlarla kaydedilmiş fotoğraflar döner
 */
export async function galeriGetir(
  { mahalle, limit = 60 }: { mahalle?: string | string[]; limit?: number } = {}
): Promise<GaleriKaydi[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  let sorgu = supabase
    .from("galeri")
    .select("id, url, baslik, mahalle, kategori")
    .order("siralama", { ascending: true })
    .order("olusturma_tarihi", { ascending: false })
    .limit(limit);

  if (mahalle) {
    const adlar = (Array.isArray(mahalle) ? mahalle : [mahalle]).filter(Boolean);
    if (adlar.length > 0) sorgu = sorgu.in("mahalle", adlar);
  }

  const { data, error } = await sorgu;
  if (error) return [];
  return (data as GaleriKaydi[]) ?? [];
}

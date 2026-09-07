/**
 * Adresten navigasyon bağlantısı üretir.
 *
 * `geo:` veya platforma özel şemalar yerine Google Haritalar'ın evrensel
 * bağlantısını kullanıyoruz: iPhone'da Haritalar/Google Haritalar uygulamasını,
 * Android'de Google Haritalar'ı, masaüstünde tarayıcıyı açar.
 */

const SEHIR = "Kadıköy, İstanbul";

/** Adres parçalarını birleştirir; boş olanları atar. */
export function tamAdres(parcalar: (string | null | undefined)[]): string {
  const temiz = parcalar.map((p) => p?.trim()).filter(Boolean) as string[];
  if (temiz.length === 0) return "";
  // Mahalle/adres zaten Kadıköy içinde; şehri sona ekleyerek aramayı daraltıyoruz
  return [...temiz, SEHIR].join(", ");
}

/** Navigasyonu başlatan bağlantı. Adres boşsa null döner. */
export function yolTarifiLinki(parcalar: (string | null | undefined)[]): string | null {
  const adres = tamAdres(parcalar);
  if (!adres) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adres)}`;
}

/** Adresi haritada gösteren (navigasyon başlatmayan) bağlantı. */
export function haritadaGosterLinki(parcalar: (string | null | undefined)[]): string | null {
  const adres = tamAdres(parcalar);
  if (!adres) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adres)}`;
}

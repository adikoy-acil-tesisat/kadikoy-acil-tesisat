/** Para birimi ve tarih biçimlendirme yardımcıları. */

/** 1500 -> "1.500 ₺" */
export function para(deger: number | string | null | undefined): string {
  const n = Number(deger);
  if (!Number.isFinite(n)) return "—";
  return `${n.toLocaleString("tr-TR")} ₺`;
}

/** "2026-09-07" -> "7 Eylül 2026" */
export function tarihUzun(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "2026-09-07" -> "7 Eyl" */
export function tarihKisa(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

/** "2026-09-07" -> "Pazartesi" */
export function gunAdi(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { weekday: "long" });
}

/** "2026-09" -> "Eylül 2026" */
export function ayAdi(ayIso: string): string {
  return new Date(`${ayIso}-01`).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
}

/** "14:30:00" -> "14:30" */
export function saatKisa(saat: string | null | undefined): string {
  return saat ? saat.slice(0, 5) : "";
}

/**
 * İki zaman damgası arasındaki süreyi okunur hâle getirir: "1 sa 25 dk".
 * Bitiş yoksa (iş devam ediyorsa) şu ana kadar geçen süreyi verir.
 */
export function sureMetni(baslangic: string, bitis?: string | null): string {
  const bas = new Date(baslangic).getTime();
  const son = bitis ? new Date(bitis).getTime() : Date.now();
  const dakika = Math.max(0, Math.round((son - bas) / 60000));
  if (dakika < 60) return `${dakika} dk`;
  const saat = Math.floor(dakika / 60);
  const kalan = dakika % 60;
  return kalan === 0 ? `${saat} sa` : `${saat} sa ${kalan} dk`;
}

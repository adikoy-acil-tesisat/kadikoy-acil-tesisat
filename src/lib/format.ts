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

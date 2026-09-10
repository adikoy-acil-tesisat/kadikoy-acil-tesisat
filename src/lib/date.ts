/**
 * Tarih yardımcıları.
 *
 * `new Date().toISOString()` UTC'ye göre çalışır. Türkiye UTC+3 olduğu için
 * gece 00:00 - 03:00 arasında bir önceki günü döndürür ve "bugünün işleri",
 * "bu ayın geliri" gibi sorgular yanlış sonuç verir. Bu yüzden tarihleri
 * her zaman kullanıcının yerel saatine göre üretiyoruz.
 */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Yerel saate göre bugünün tarihi: "YYYY-MM-DD" */
export function todayISO(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Yerel saate göre içinde bulunulan ayın ilk günü: "YYYY-MM-01" */
export function monthStartISO(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-01`;
}

/**
 * Türkiye formatında telefon numarasını uluslararası biçime çevirir.
 * "0531 865 38 02" -> "905318653802"
 */
export function toIntlPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  return "90" + digits.replace(/^0+/, "");
}

/** Yerel saate göre bir önceki ayın ilk günü: "YYYY-MM-01" */
export function oncekiAyBasiISO(date: Date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return monthStartISO(d);
}

/** n gün önce/sonranın yerel tarihi. */
export function gunEkleISO(gun: number, date: Date = new Date()): string {
  const d = new Date(date);
  d.setDate(d.getDate() + gun);
  return todayISO(d);
}

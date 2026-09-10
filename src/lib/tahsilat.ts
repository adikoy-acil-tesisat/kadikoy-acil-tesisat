import type { Odeme } from "@/lib/types";

/**
 * Para hesapları için tek kaynak: `odemeler` tablosu.
 *
 * Panelde iki ayrı yol vardı — tahsilat kaydı eklemek ve ödeme durumunu elle
 * "Ödendi" yapmak. İkincisi ödeme satırı oluşturmadığı için gösterge paneli,
 * finans ekranı ve alacaklar ekranı aynı işi farklı sayıyordu. Artık her iki
 * yol da bir tahsilat satırı yazıyor; buradaki fonksiyonlar da yalnızca o
 * satırlara bakıyor.
 */

/** İş kimliğinden tahsil edilen toplama harita. */
export function odemeToplamlari(odemeler: Pick<Odeme, "is_id" | "tutar">[]): Map<string, number> {
  const harita = new Map<string, number>();
  for (const o of odemeler) {
    harita.set(o.is_id, (harita.get(o.is_id) ?? 0) + (Number(o.tutar) || 0));
  }
  return harita;
}

/** İşin kalan bakiyesi. Fazla tahsilat girilse bile negatife düşmez. */
export function kalanBakiye(tutar: number | null | undefined, tahsilEdilen: number): number {
  return Math.max(0, (Number(tutar) || 0) - tahsilEdilen);
}

/** Tahsilata göre ödeme durumu. */
export function odemeDurumu(tutar: number | null | undefined, tahsilEdilen: number): string {
  if (tahsilEdilen <= 0) return "odenmedi";
  const t = Number(tutar) || 0;
  if (t > 0 && tahsilEdilen >= t) return "odendi";
  return "kismi";
}

/**
 * Google ölçüm kimlikleri ve dönüşüm bildirimi.
 *
 * Bunlar gizli değildir; sayfa kaynağında zaten görünürler. Netlify'da ayrı
 * ortam değişkeni kurmaya gerek kalmasın diye kodda duruyorlar.
 */

/** Google Ads hesabının ölçüm etiketi. */
export const GOOGLE_ADS_ID = "AW-18442854096";

/**
 * "Randevu rezervasyonu" dönüşümünün etiketi.
 *
 * Bu işte dönüşüm, sitede gezinmek değil iletişime geçmektir: telefona
 * basmak, WhatsApp'a yazmak ya da formu göndermek. Üçü de buraya düşer.
 */
export const GOOGLE_ADS_DONUSUM = `${GOOGLE_ADS_ID}/DPCvCJqB4JQdENC9ntpE`;

type Gtag = (...a: unknown[]) => void;

/**
 * Google Ads'e dönüşüm bildirir.
 *
 * Etiket yüklenmemişse (ölçüm kapalı, betik engellenmiş) sessizce geçer —
 * ölçüm müşteriyi engellememeli.
 */
export function donusumBildir(): void {
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  g?.("event", "conversion", { send_to: GOOGLE_ADS_DONUSUM });
}

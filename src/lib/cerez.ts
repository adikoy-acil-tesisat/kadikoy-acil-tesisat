/** Çerez onayının tarayıcıda saklandığı anahtar. */
export const CEREZ_ANAHTARI = "cookie-consent";

/**
 * Google'a ölçüm izninin verildiğini bildirir (Consent Mode v2).
 *
 * Analytics, izin verilene kadar `denied` durumunda yükleniyor; o hâldeyken
 * çerez yazmıyor, yalnızca kimliksiz sinyal gönderiyor. Ziyaretçi "Kabul Et"e
 * bastığında burası çağrılıp izin yükseltiliyor.
 */
export function analitikOnayiBildir(): void {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  g?.("consent", "update", { analytics_storage: "granted" });
}

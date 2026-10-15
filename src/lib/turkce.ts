/** Türkçe ek üretimi. Özel adlara ek kesme işaretiyle gelir. */

const ARKA_UNLULER = "aıou";
const ONDE_UNLULER = "eiöü";
const SERT_SESSIZLER = "fstkçşhp";

/**
 * Üçüncü tekil iyelik ekiyle biten adlar. Bunlarda bulunma eki araya "n"
 * alır: "Mahallesi" → "Mahallesi'nde", "Kozyatağı" → "Kozyatağı'nda".
 * Otomatik tespiti güvenilir değil (Bostancı iyelik değildir ama -ı ile
 * biter), bu yüzden elle listeleniyor.
 */
const IYELIKLE_BITENLER = [/mahallesi$/i, /yatağı$/i, /bağı$/i, /deresi$/i, /köyü$/i];

/** Sondaki son ünlüyü bulur. */
function sonUnlu(ad: string): string {
  const harfler = [...ad.toLocaleLowerCase("tr")];
  for (let i = harfler.length - 1; i >= 0; i--) {
    if (ARKA_UNLULER.includes(harfler[i]) || ONDE_UNLULER.includes(harfler[i])) {
      return harfler[i];
    }
  }
  return "a";
}

/**
 * Özel ada bulunma hâli eki getirir: "Moda" → "Moda'da",
 * "Göztepe" → "Göztepe'de", "Eğitim Mahallesi" → "Eğitim Mahallesi'nde".
 *
 * Ek, son ünlüye göre kalın/ince (a/e), son sessize göre yumuşak/sert
 * (d/t) seçilir. Sabit "'de" yazmak "Moda'de" gibi hatalar üretiyordu.
 */
export function bulunmaEki(ad: string): string {
  const unlu = sonUnlu(ad);
  const kalin = ARKA_UNLULER.includes(unlu);
  const sonHarf = [...ad.toLocaleLowerCase("tr")].pop() ?? "";

  const iyelik = IYELIKLE_BITENLER.some((k) => k.test(ad));
  const kaynastirma = iyelik ? "n" : "";
  // İyelikten sonra ek hep yumuşak gelir ("Mahallesi'nde", "Mahallesi'nte" değil)
  const sessiz = !iyelik && SERT_SESSIZLER.includes(sonHarf) ? "t" : "d";

  return `${ad}'${kaynastirma}${sessiz}${kalin ? "a" : "e"}`;
}

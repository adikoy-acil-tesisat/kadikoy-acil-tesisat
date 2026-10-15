import { KADIKOY_MAHALLELERI } from "@/lib/mahalleler";

export interface Musteri {
  id: string;
  ad: string;
  telefon: string;
  telefon2?: string | null;
  ilce?: string | null;
  mahalle?: string | null;
  adres?: string | null;
  adres_tarifi?: string | null;
  notlar?: string | null;
  kaynak?: string | null;
  /** Geri kazanım için en son ne zaman ulaşıldığı. */
  son_iletisim?: string | null;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface Is {
  id: string;
  musteri_id?: string | null;
  hizmet_turu: string;
  durum: string;
  aciklama?: string | null;
  tarih: string;
  saat?: string | null;
  tutar?: number | null;
  /** Keşifte verilen teklif. Kabul edilirse tutar olur, edilmezse kayıtta kalır. */
  teklif_tutari?: number | null;
  /** İşe fiilen başlanan an — süre buradan hesaplanır. */
  baslama_saati?: string | null;
  bitis_saati?: string | null;
  odeme_durumu: string;
  odeme_yontemi?: string | null;
  notlar?: string | null;
  fotograflar?: string[] | null;
  ilce?: string | null;
  adres?: string | null;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  // Joined fields
  musteri?: Musteri | null;
}

export interface Odeme {
  id: string;
  is_id: string;
  tutar: number;
  tarih: string;
  yontem: string;
  notlar?: string | null;
  olusturma_tarihi: string;
}

export interface Gider {
  id: string;
  is_id?: string | null;
  kategori: string;
  aciklama: string;
  tutar: number;
  tarih: string;
  /** Fiş fotoğrafının adresi — muhasebe ve gider ispatı için. */
  fis_url?: string | null;
  olusturma_tarihi: string;
}

export const HIZMET_TURLERI: Record<string, string> = {
  tikaniklik_acma: "Tıkanıklık Açma",
  su_kacagi: "Su Kaçağı Tespiti",
  genel_tesisat: "Genel Tesisat",
  tamir_montaj: "Tamir & Montaj",
  diger: "Diğer",
};

export const DURUM_MAP: Record<string, { label: string; color: string; bg: string }> = {
  kesif: { label: "Keşif/Teklif", color: "text-purple-700", bg: "bg-purple-100" },
  beklemede: { label: "Beklemede", color: "text-amber-700", bg: "bg-amber-100" },
  devam_ediyor: { label: "Devam Ediyor", color: "text-blue-700", bg: "bg-blue-100" },
  tamamlandi: { label: "Tamamlandı", color: "text-green-700", bg: "bg-green-100" },
  iptal: { label: "İptal", color: "text-red-700", bg: "bg-red-100" },
};

export const ODEME_DURUM_MAP: Record<string, { label: string; color: string; bg: string }> = {
  odendi: { label: "Ödendi", color: "text-green-700", bg: "bg-green-100" },
  odenmedi: { label: "Ödenmedi", color: "text-red-700", bg: "bg-red-100" },
  kismi: { label: "Kısmi", color: "text-orange-700", bg: "bg-orange-100" },
};

export const ODEME_YONTEMLERI: Record<string, string> = {
  nakit: "Nakit",
  havale: "Havale/EFT",
  kredi_karti: "Kredi Kartı",
};

export const GIDER_KATEGORILERI: Record<string, string> = {
  malzeme: "Malzeme",
  yakit: "Yakıt",
  ekipman: "Ekipman",
  arac: "Araç",
  telefon: "Telefon",
  diger: "Diğer",
};

// Admin panelindeki bölge seçimi — Kadıköy mahalleleri
/**
 * Panelde adres alanında seçilen mahalleler.
 *
 * Hizmet bölgesi yalnızca Kadıköy olduğu için burada ilçe değil mahalle
 * seçiliyor. Liste sitedeki mahalle sayfalarıyla aynı kaynaktan gelir ki
 * ikisi birbirinden ayrı düşmesin. Veritabanındaki sütun adı tarihsel
 * sebeple "ilce" kaldı; taşıdığı değer mahalledir.
 */
export const MAHALLELER = [
  // "Moda" resmî bir mahalle değil, Caferağa'nın içinde kalıyor; ama müşteri
  // telefonda "Moda'dayım" diyor. Kayıt müşterinin kullandığı adla tutulmalı.
  ...[...KADIKOY_MAHALLELERI, "Moda"].sort((a, b) => a.localeCompare(b, "tr")),
  "Diğer",
];

/**
 * Müşteri bizi nereden buldu?
 *
 * Eskiden "Telefon" ve "WhatsApp" vardı; bunlar kaynak değil, iletişim
 * kanalı. Müşteri telefonla arıyor ama numarayı Google reklamından mı,
 * haritadan mı, komşusundan mı buldu — para harcanan yeri bilmek için
 * ayırmak gerekiyor.
 *
 * Eski kayıtlarla uyum için "telefon" ve "whatsapp" anahtarları korundu.
 */
export const KAYNAKLAR: Record<string, string> = {
  google_reklam: "Google Reklam",
  google_arama: "Google Arama",
  google_harita: "Google Haritalar",
  tavsiye: "Tavsiye",
  website: "Site Formu",
  armut: "Armut.com",
  arac_tabela: "Araç / Tabela",
  diger: "Diğer",
  // Eski kayıtlar — yeni kayıtlarda seçilmez
  telefon: "Belirtilmemiş",
  whatsapp: "Belirtilmemiş",
};

/** Yeni kayıtlarda gösterilecek kaynaklar (eski anahtarlar hariç). */
export const SECILEBILIR_KAYNAKLAR = [
  "google_reklam",
  "google_arama",
  "google_harita",
  "tavsiye",
  "website",
  "armut",
  "arac_tabela",
  "diger",
] as const;

/**
 * Tahsilat satırı + bağlı işin özeti.
 * Finans ekranı gelirleri işlerden değil tahsilatlardan listeler; müşteri adı
 * ve hizmet türü için işin birkaç alanı da birlikte çekilir.
 */
export interface Tahsilat extends Odeme {
  is?: {
    hizmet_turu: string;
    ilce?: string | null;
    musteri?: { ad: string; kaynak?: string | null } | null;
  } | null;
}

/** Trend/dağılım hesapları için tahsilatın yalnızca gereken alanları. */
export type TahsilatOzet = Pick<Odeme, "tarih" | "tutar"> & Pick<Tahsilat, "is">;

/** Site iletişim formundan gelen talep. */
export interface Talep {
  id: string;
  ad: string;
  telefon: string;
  mesaj?: string | null;
  /** Talebin bırakıldığı sayfa yolu. */
  sayfa?: string | null;
  /** yeni | arandi | ise_donustu | kapandi */
  durum: string;
  notlar?: string | null;
  olusturma_tarihi: string;
}

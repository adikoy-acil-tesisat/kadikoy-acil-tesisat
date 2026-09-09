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
export const ILCELER = [
  "Acıbadem", "Bostancı", "Caddebostan", "Caferağa", "Dumlupınar", "Eğitim",
  "Erenköy", "Fenerbahçe", "Feneryolu", "Fikirtepe", "Göztepe", "Hasanpaşa",
  "Koşuyolu", "Kozyatağı", "Merdivenköy", "Moda", "Ondokuzmayıs", "Osmanağa",
  "Rasimpaşa", "Sahrayıcedit", "Suadiye", "Zühtüpaşa", "Diğer",
];

export const KAYNAKLAR: Record<string, string> = {
  telefon: "Telefon",
  whatsapp: "WhatsApp",
  tavsiye: "Tavsiye",
  armut: "Armut.com",
  website: "Web Sitesi",
  diger: "Diğer",
};

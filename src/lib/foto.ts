import { createClient } from "@/lib/supabase/client";

/** Fotoğrafların tutulduğu Supabase Storage kovası. */
export const KOVA = "is-fotograflari";

/** Yüklemeden önce indirileceği en uzun kenar (piksel). */
const MAX_KENAR = 1400;
/** JPEG kalitesi — 0.8 gözle fark edilmeyen ama dosyayı çok küçülten değer. */
const KALITE = 0.8;

/**
 * Telefon fotoğrafını yüklemeden önce küçültür.
 *
 * Telefon kameraları 3-6 MB dosya üretiyor. Bunları olduğu gibi yüklemek hem
 * ücretsiz 1 GB depolamayı hızla doldurur hem de site galerisini yavaşlatır.
 * Tarayıcıda canvas ile ölçekleyip JPEG'e çeviriyoruz — tipik olarak 150-300 KB.
 */
export function fotografiKucult(dosya: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(dosya);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      const oran = Math.min(1, MAX_KENAR / Math.max(img.width, img.height));
      const g = Math.round(img.width * oran);
      const y = Math.round(img.height * oran);

      const canvas = document.createElement("canvas");
      canvas.width = g;
      canvas.height = y;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Görsel işlenemedi."));
        return;
      }
      ctx.drawImage(img, 0, 0, g, y);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Görsel dönüştürülemedi."))),
        "image/jpeg",
        KALITE
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Dosya bir görsel değil."));
    };

    img.src = url;
  });
}

/**
 * Fotoğrafı yükler ve herkese açık URL'ini döndürür.
 * Dosya adı rastgeledir; tahmin edilemesin diye.
 */
export async function fotografYukle(dosya: File): Promise<string> {
  const kucuk = await fotografiKucult(dosya);
  const ad = `${crypto.randomUUID()}.jpg`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(KOVA).upload(ad, kucuk, {
    contentType: "image/jpeg",
    cacheControl: "31536000", // fotoğraf değişmez, uzun süre önbelleklensin
  });
  if (error) throw error;

  const { data } = supabase.storage.from(KOVA).getPublicUrl(ad);
  return data.publicUrl;
}

/** URL'den dosya adını çıkarıp depodan siler. */
export async function fotografSil(url: string): Promise<void> {
  const ad = url.split("/").pop();
  if (!ad) return;
  const supabase = createClient();
  const { error } = await supabase.storage.from(KOVA).remove([ad]);
  if (error) throw error;
}

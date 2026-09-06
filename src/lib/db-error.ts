import { isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Supabase/ağ hatalarını kullanıcının anlayacağı Türkçe mesaja çevirir.
 *
 * Ham hatalar ("TypeError: Failed to fetch", "JWT expired" gibi) kullanıcıya
 * hiçbir şey anlatmıyordu; en sık karşılaşılan durum ise veritabanının hiç
 * yapılandırılmamış olması.
 */
export function dbHataMesaji(error: unknown): string {
  if (!isSupabaseConfigured()) {
    return "Veritabanı bağlı değil. Kayıt yapabilmek için .env.local dosyasına Supabase bilgilerini girip sunucuyu yeniden başlatın.";
  }

  const mesaj =
    error instanceof Error
      ? error.message
      : String((error as { message?: string } | null)?.message ?? error ?? "");

  if (/failed to fetch|networkerror|load failed|fetch failed/i.test(mesaj)) {
    return "Veritabanına ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.";
  }
  if (/jwt|token|unauthorized|not authenticated/i.test(mesaj)) {
    return "Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.";
  }
  if (/row-level security|permission denied|policy/i.test(mesaj)) {
    return "Bu kayıt için yetkiniz yok. Giriş yaptığınızdan emin olun.";
  }
  if (/duplicate key|unique constraint/i.test(mesaj)) {
    return "Bu kayıt zaten mevcut.";
  }

  return mesaj || "Bilinmeyen bir hata oluştu.";
}

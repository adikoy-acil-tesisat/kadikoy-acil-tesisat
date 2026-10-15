-- ===========================================================================
-- İş kârlılığı, süre takibi ve keşif aşaması
-- Supabase > SQL Editor > yapıştır > Run. Tekrar çalıştırmak zararsızdır.
-- ===========================================================================

-- 1) Süre takibi
-- Fiyatlandırmanın temel iddiası "süre fiyatı belirler" ama panel süreyi hiç
-- tutmuyordu. Başla/bitir damgasıyla gerçek süre birikecek.
alter table isler add column if not exists baslama_saati timestamptz;
alter table isler add column if not exists bitis_saati timestamptz;

-- 2) Keşif / teklif aşaması
-- Keşfe gidilip teklif verilen ama kabul edilmeyen işler "iptal" olarak
-- kayboluyordu. Teklif tutarı ayrı tutulursa kaç keşiften kaç iş çıktığı
-- görülebilir.
alter table isler add column if not exists teklif_tutari numeric;

-- 3) Geri kazanım (önceki adımdan kalan)
alter table musteriler add column if not exists son_iletisim date;

-- 4) İşe bağlı giderler hızlı sorgulansın
-- giderler.is_id sütunu zaten vardı ama hiç kullanılmıyordu; artık iş
-- detayından malzeme gideri girilecek.
create index if not exists idx_giderler_is on giderler(is_id);

-- ===========================================================================
-- Geçmiş kayıtları düzelt — Supabase > SQL Editor > yapıştır > Run
-- Tekrar çalıştırmak zararsızdır: zaten tahsilatı olan işe ikinci kayıt açmaz.
-- ===========================================================================
-- "Ödendi" işaretlenmiş ama tahsilat satırı olmayan işler için satır oluşturur.
-- Böylece gelir, kâr ve alacak hesapları tek kaynaktan (odemeler) çalışır.
insert into odemeler (is_id, tutar, tarih, yontem, notlar)
select
  i.id,
  i.tutar,
  i.tarih,
  coalesce(nullif(i.odeme_yontemi, ''), 'nakit'),
  'Geçmiş kayıttan aktarıldı'
from isler i
where i.odeme_durumu = 'odendi'
  and i.tutar is not null
  and i.tutar > 0
  and not exists (select 1 from odemeler o where o.is_id = i.id);

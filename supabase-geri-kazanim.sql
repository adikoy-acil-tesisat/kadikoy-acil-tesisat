-- ===========================================================================
-- Geri kazanım: son iletişim tarihi
-- Supabase > SQL Editor > yapıştır > Run. Tekrar çalıştırmak zararsızdır.
-- ===========================================================================
-- Uzun süredir uğramayan müşterilere ulaştığınızda tarihi işaretlersiniz;
-- böylece aynı kişiye üst üste yazılmaz.
alter table musteriler add column if not exists son_iletisim date;

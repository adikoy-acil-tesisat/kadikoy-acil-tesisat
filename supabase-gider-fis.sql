-- Gider fişi fotoğrafı — Supabase SQL Editor'de çalıştırın.
-- (supabase-schema.sql ve supabase-galeri.sql'i daha önce çalıştırmış
--  olmanız gerekir; fişler galeri ile aynı depolama kovasını kullanıyor.)

alter table giderler
  add column if not exists fis_url text;

comment on column giderler.fis_url is
  'Market/nalbur fişinin fotoğrafı. Muhasebe ve gider ispatı için.';

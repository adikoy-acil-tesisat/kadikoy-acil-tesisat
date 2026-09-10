-- ===========================================================================
-- TEK SEFERDE ÇALIŞTIRIN — Supabase > SQL Editor > yapıştır > Run
-- Tekrar çalıştırmak zararsızdır; var olanı bozmaz.
-- ===========================================================================

-- 1) Fotoğraf kovası: yoksa oluştur, varsa herkese açık olduğundan emin ol
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'is-fotograflari', 'is-fotograflari', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- 2) Depolama izinleri: önce varsa kaldır, sonra kur
--    (Politikaların bir kısmı eksik kaldıysa hata vermeden düzelsin diye.)
drop policy if exists "giris yapan yukleyebilir"  on storage.objects;
drop policy if exists "giris yapan guncelleyebilir" on storage.objects;
drop policy if exists "giris yapan silebilir"     on storage.objects;
drop policy if exists "herkes goruntuleyebilir"   on storage.objects;

create policy "giris yapan yukleyebilir"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'is-fotograflari');

create policy "giris yapan guncelleyebilir"
  on storage.objects for update to authenticated
  using (bucket_id = 'is-fotograflari')
  with check (bucket_id = 'is-fotograflari');

create policy "giris yapan silebilir"
  on storage.objects for delete to authenticated
  using (bucket_id = 'is-fotograflari');

create policy "herkes goruntuleyebilir"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'is-fotograflari');

-- 3) Gider fişi kolonu (panelde fiş fotoğrafı için gerekli)
alter table giderler add column if not exists fis_url text;

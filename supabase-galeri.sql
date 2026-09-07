-- Fotoğraf desteği — Supabase SQL Editor'de çalıştırın.
-- (supabase-schema.sql'i daha önce çalıştırmış olmanız gerekir.)

-- ---------------------------------------------------------------------------
-- 1) Depolama alanı
-- ---------------------------------------------------------------------------
-- Fotoğraflar herkese açık bir kovada tutulur; dosya adları rastgele UUID
-- olduğu için tahmin edilemez. Müşteri adresi ve telefonu gibi hassas veriler
-- veritabanında kalır ve RLS ile korunur — fotoğrafın kendisi (boru, gider)
-- hassas veri değildir.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'is-fotograflari',
  'is-fotograflari',
  true,
  5242880, -- 5 MB; panel yüklemeden önce zaten küçültüyor
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Yükleme, güncelleme ve silme yalnızca giriş yapmış kullanıcıya açık
create policy "giris yapan yukleyebilir"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'is-fotograflari');

create policy "giris yapan silebilir"
  on storage.objects for delete to authenticated
  using (bucket_id = 'is-fotograflari');

create policy "herkes goruntuleyebilir"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'is-fotograflari');

-- ---------------------------------------------------------------------------
-- 2) Site galerisi
-- ---------------------------------------------------------------------------
-- İş fotoğrafları özeldir (isler.fotograflar). Siteye çıkacaklar buraya
-- ayrıca eklenir; böylece hangi fotoğrafın yayınlandığına siz karar verirsiniz.
create table if not exists galeri (
  id uuid primary key default gen_random_uuid(),
  is_id uuid references isler(id) on delete set null,
  url text not null,
  baslik text not null,
  mahalle text,
  kategori text,
  siralama int default 0,
  olusturma_tarihi timestamptz default now()
);

create index if not exists idx_galeri_siralama on galeri(siralama, olusturma_tarihi desc);

alter table galeri enable row level security;

-- Site ziyaretçileri okuyabilmeli (giriş yapmadan)
create policy "herkes okuyabilir"
  on galeri for select to anon, authenticated using (true);

-- Yazma yalnızca panelden
create policy "giris yapan yonetebilir"
  on galeri for insert to authenticated with check (true);

create policy "giris yapan guncelleyebilir"
  on galeri for update to authenticated using (true) with check (true);

create policy "giris yapan silebilir"
  on galeri for delete to authenticated using (true);

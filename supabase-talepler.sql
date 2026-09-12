-- ===========================================================================
-- Site iletişim formundan gelen talepler
-- Supabase > SQL Editor > yapıştır > Run. Tekrar çalıştırmak zararsızdır.
-- ===========================================================================
-- Form şimdiye kadar yalnızca WhatsApp penceresi açıyordu. Pencere açılmazsa
-- (açılır pencere engeli, WhatsApp kurulu olmayan bilgisayar, müşterinin
-- vazgeçmesi) talep hiçbir yere yazılmıyor ve kayboluyordu. Artık önce buraya
-- kaydediliyor, sonra WhatsApp açılıyor.

create table if not exists talepler (
  id uuid primary key default gen_random_uuid(),
  ad text not null,
  telefon text not null,
  mesaj text,
  /** Talebin bırakıldığı sayfa — hangi sayfanın iş getirdiğini gösterir. */
  sayfa text,
  /** yeni | arandi | ise_donustu | kapandi */
  durum text not null default 'yeni',
  notlar text,
  olusturma_tarihi timestamptz default now()
);

create index if not exists idx_talepler_tarih on talepler(olusturma_tarihi desc);
create index if not exists idx_talepler_durum on talepler(durum);

alter table talepler enable row level security;

-- Politikalar tekrar çalıştırmaya dayansın
drop policy if exists "herkes talep birakabilir" on talepler;
drop policy if exists "giris yapan okuyabilir"   on talepler;
drop policy if exists "giris yapan guncelleyebilir" on talepler;
drop policy if exists "giris yapan silebilir"    on talepler;

-- Site ziyaretçisi yalnızca kayıt BIRAKABİLİR. Okuyamaz; yoksa herkes
-- diğer müşterilerin adını ve telefonunu görebilirdi.
create policy "herkes talep birakabilir"
  on talepler for insert to anon, authenticated
  with check (true);

create policy "giris yapan okuyabilir"
  on talepler for select to authenticated using (true);

create policy "giris yapan guncelleyebilir"
  on talepler for update to authenticated using (true) with check (true);

create policy "giris yapan silebilir"
  on talepler for delete to authenticated using (true);

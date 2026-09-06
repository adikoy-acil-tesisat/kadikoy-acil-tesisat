-- TesisatçıBiziz Admin Panel - Veritabanı Şeması
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

-- Müşteriler tablosu
CREATE TABLE musteriler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad TEXT NOT NULL,
  telefon TEXT NOT NULL,
  telefon2 TEXT,
  ilce TEXT,
  mahalle TEXT,
  adres TEXT,
  adres_tarifi TEXT,
  notlar TEXT,
  kaynak TEXT DEFAULT 'telefon',
  olusturma_tarihi TIMESTAMPTZ DEFAULT now(),
  guncelleme_tarihi TIMESTAMPTZ DEFAULT now()
);

-- İşler tablosu
CREATE TABLE isler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  musteri_id UUID REFERENCES musteriler(id) ON DELETE SET NULL,
  hizmet_turu TEXT NOT NULL DEFAULT 'genel_tesisat',
  durum TEXT NOT NULL DEFAULT 'beklemede',
  aciklama TEXT,
  tarih DATE NOT NULL DEFAULT CURRENT_DATE,
  saat TIME,
  tutar DECIMAL(10,2),
  odeme_durumu TEXT DEFAULT 'odenmedi',
  odeme_yontemi TEXT,
  notlar TEXT,
  fotograflar TEXT[],
  ilce TEXT,
  adres TEXT,
  olusturma_tarihi TIMESTAMPTZ DEFAULT now(),
  guncelleme_tarihi TIMESTAMPTZ DEFAULT now()
);

-- Ödemeler tablosu
CREATE TABLE odemeler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_id UUID REFERENCES isler(id) ON DELETE CASCADE,
  tutar DECIMAL(10,2) NOT NULL,
  tarih DATE NOT NULL DEFAULT CURRENT_DATE,
  yontem TEXT NOT NULL DEFAULT 'nakit',
  notlar TEXT,
  olusturma_tarihi TIMESTAMPTZ DEFAULT now()
);

-- Giderler tablosu
CREATE TABLE giderler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_id UUID REFERENCES isler(id) ON DELETE SET NULL,
  kategori TEXT NOT NULL DEFAULT 'malzeme',
  aciklama TEXT NOT NULL,
  tutar DECIMAL(10,2) NOT NULL,
  tarih DATE NOT NULL DEFAULT CURRENT_DATE,
  olusturma_tarihi TIMESTAMPTZ DEFAULT now()
);

-- İndeksler
CREATE INDEX idx_isler_musteri ON isler(musteri_id);
CREATE INDEX idx_isler_tarih ON isler(tarih);
CREATE INDEX idx_isler_durum ON isler(durum);
CREATE INDEX idx_odemeler_is ON odemeler(is_id);
CREATE INDEX idx_giderler_tarih ON giderler(tarih);
CREATE INDEX idx_musteriler_telefon ON musteriler(telefon);

-- Güncelleme tarihi otomatik ayarlama
CREATE OR REPLACE FUNCTION update_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
  NEW.guncelleme_tarihi = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER musteriler_guncelleme
  BEFORE UPDATE ON musteriler
  FOR EACH ROW EXECUTE FUNCTION update_guncelleme_tarihi();

CREATE TRIGGER isler_guncelleme
  BEFORE UPDATE ON isler
  FOR EACH ROW EXECUTE FUNCTION update_guncelleme_tarihi();

-- Row Level Security (RLS) - Sadece giriş yapmış kullanıcı erişebilir
ALTER TABLE musteriler ENABLE ROW LEVEL SECURITY;
ALTER TABLE isler ENABLE ROW LEVEL SECURITY;
ALTER TABLE odemeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE giderler ENABLE ROW LEVEL SECURITY;

-- Not: `auth.role()` Supabase'de deprecate edildi. Güncel yöntem, politikayı
-- doğrudan `authenticated` rolüne bağlamak. `WITH CHECK` olmadan INSERT/UPDATE
-- yazma kontrolü belirsiz kalıyordu; her ikisi de açıkça yazıldı.
CREATE POLICY "Authenticated users full access" ON musteriler
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access" ON isler
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access" ON odemeler
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access" ON giderler
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

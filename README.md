# Kadıköy Acil Tesisat

Kadıköy'de 7/24 tesisat hizmeti veren işletmenin web sitesi ve yönetim paneli.

- **Site:** https://kadikoyaciltesisat.com
- **Yönetim paneli:** https://kadikoyaciltesisat.com/admin

## Teknolojiler

| Ne | Neden |
|---|---|
| Next.js 16 (App Router) | Sayfalar statik üretiliyor, SEO için hızlı |
| Tailwind CSS 4 | Stil |
| Supabase | Veritabanı ve admin girişi |

## Kurulum

Node.js 20 veya üzeri gerekiyor.

```bash
npm install
```

### Supabase bağlantısı

Panel olmadan site çalışır, ancak iş/müşteri kaydı yapılamaz.

1. [supabase.com](https://supabase.com) üzerinde yeni bir proje aç
2. **SQL Editor**'de `supabase-schema.sql` dosyasını çalıştır — tabloları ve güvenlik kurallarını kurar
3. **Settings → API** sayfasındaki değerleri `.env.local` dosyasına yaz:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

4. **Authentication → Users** bölümünden panele girecek kullanıcıyı oluştur

`.env.local` git'e gönderilmez. Vercel'de aynı iki değişkeni proje ayarlarından tanımla.

### Geliştirme

```bash
npm run dev
```

http://localhost:3000

Ortam değişkenleri yalnızca sunucu başlarken okunur — `.env.local` değişirse sunucuyu yeniden başlat.

### Kontroller

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Proje yapısı

```
src/
  app/
    admin/            Yönetim paneli (proxy.ts ile korunuyor, noindex)
    hizmet-bolgeleri/ Kadıköy mahalleleri — [mahalle] dinamik rota
    hizmetlerimiz/    Hizmet sayfaları
    blog/             Blog — içerik src/lib/blog-data.ts içinde
  components/
  lib/
    constants.ts      Site ayarları, hizmetler, yorumlar, SSS
    mahalleler.ts     Kadıköy mahalleleri ve bölge sayfası içerikleri
    date.ts           Yerel saate göre tarih (UTC kayması olmasın diye)
    db-error.ts       Supabase hatalarını Türkçeye çevirir
  proxy.ts            Admin erişim kontrolü
```

## Bilinmesi gerekenler

**Telefon, e-posta, adres** `src/lib/constants.ts` içindeki `SITE_CONFIG`'de. Tek yerden değişir.

**Domain** aynı dosyadaki `SITE_URL`'de. Değiştirilirse sitemap, robots.txt, canonical URL'ler ve schema.org işaretlemesi birlikte güncellenir.

**Mahalle sayfaları** `src/lib/mahalleler.ts` içinden üretilir. `ONE_CIKAN_MAHALLELER` dizisine yeni kayıt eklemek sayfayı, sitemap girdisini ve menü bağlantılarını otomatik oluşturur. Sayfaların birbirinin kopyası olmaması önemli — Google bunu "doorway page" sayıp cezalandırıyor, bu yüzden her mahalleye o bölgeye özgü içerik yazılmalı.

**Admin paneli** Supabase yapılandırılmamışsa production'da 503 döner (`src/lib/supabase/middleware.ts`). Bu bilinçli: aksi hâlde ortam değişkenleri unutulduğunda panel herkese açılırdı. Geliştirme ortamında serbesttir.

**Tarihler** her zaman `src/lib/date.ts` üzerinden. `new Date().toISOString()` UTC verir; Türkiye UTC+3 olduğu için gece 00:00–03:00 arası bir önceki günü döndürür ve "bugünün işleri" yanlış çıkar.

**Panel telefona kurulabilir** — Safari'de `/admin` açılıp "Ana Ekrana Ekle" denince tam ekran uygulama gibi çalışır.

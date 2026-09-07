import type { Metadata } from "next";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Galeri | İş Fotoğraflarımız",
  description:
    "Kadıköy Acil Tesisat iş fotoğrafları. Tıkanıklık açma, su kaçağı tespiti ve tesisat işlerinden gerçek görüntüler.",
  alternates: { canonical: "/galeri" },
};

// Panelden yeni fotoğraf eklendiğinde sayfa en geç 5 dakikada tazelenir.
export const revalidate = 300;

interface GaleriKaydi {
  id: string;
  url: string;
  baslik: string;
  mahalle: string | null;
  kategori: string | null;
}

async function galeriGetir(): Promise<GaleriKaydi[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("galeri")
    .select("id, url, baslik, mahalle, kategori")
    .order("siralama", { ascending: true })
    .order("olusturma_tarihi", { ascending: false })
    .limit(60);
  // Veritabanı erişilemezse sayfa yine açılsın, boş görünsün
  if (error) return [];
  return (data as GaleriKaydi[]) ?? [];
}

export default async function GaleriPage() {
  const kayitlar = await galeriGetir();

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Galeri</h1>
          <p className="text-lg text-blue-100">
            Kadıköy&apos;de yaptığımız işlerden gerçek fotoğraflar.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {kayitlar.length === 0 ? (
            <div className="max-w-xl mx-auto text-center">
              <span className="text-5xl block mb-4">📷</span>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Fotoğraflar yakında</h2>
              <p className="text-gray-600 mb-8">
                Sahadaki işlerimizden fotoğrafları buraya ekliyoruz. Bu arada tesisat sorununuz
                için bizi arayabilirsiniz.
              </p>
              <a
                href={`tel:${SITE_CONFIG.phoneIntl}`}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
              >
                Hemen Ara: {SITE_CONFIG.phoneFormatted}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kayitlar.map((k) => (
                <figure
                  key={k.id}
                  className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-50"
                >
                  <Image
                    src={k.url}
                    alt={k.mahalle ? `${k.baslik} — ${k.mahalle}` : k.baslik}
                    width={800}
                    height={600}
                    unoptimized
                    className="w-full h-56 object-cover"
                  />
                  <figcaption className="p-4">
                    {k.kategori && (
                      <span className="text-xs font-medium text-primary bg-blue-50 px-2 py-1 rounded-full">
                        {k.kategori}
                      </span>
                    )}
                    <h2 className="font-bold text-gray-900 mt-2">{k.baslik}</h2>
                    {k.mahalle && <p className="text-gray-500 text-sm">📍 {k.mahalle}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sizin İşinizi de Yapalım</h2>
          <p className="text-xl text-blue-100 mb-8">Kadıköy&apos;ün her mahallesine 7/24 hizmet.</p>
          <a
            href={`tel:${SITE_CONFIG.phoneIntl}`}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors"
          >
            Hemen Ara: {SITE_CONFIG.phoneFormatted}
          </a>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, SERVICES } from "@/lib/constants";
import { KADIKOY_MAHALLELERI, ONE_CIKAN_MAHALLELER } from "@/lib/mahalleler";

export const metadata: Metadata = {
  title: "Kadıköy Hizmet Bölgeleri",
  description:
    "Kadıköy'ün 21 mahallesinin tamamına 7/24 tesisat hizmeti. Moda, Caddebostan, Bostancı, Göztepe, Kozyatağı, Suadiye ve tüm Kadıköy. Hemen arayın: 0531 865 38 02",
  alternates: { canonical: "/hizmet-bolgeleri" },
};

export default function HizmetBolgeleriPage() {
  // Ayrı sayfası olan mahalleler ayrı gösteriliyor; kalanlar düz liste.
  // Eşleştirmede resmî ad kullanılıyor, yoksa mahalle iki kez listelenir.
  const oneCikanAdlari = new Set(ONE_CIKAN_MAHALLELER.map((m) => m.resmiAd ?? m.name));
  const digerMahalleler = KADIKOY_MAHALLELERI.filter((m) => !oneCikanAdlari.has(m));

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Kadıköy Hizmet Bölgelerimiz</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Kadıköy&apos;ün <strong>{KADIKOY_MAHALLELERI.length} mahallesinin tamamına</strong> 7/24
            profesyonel tesisat hizmeti veriyoruz. Tıkanıklık açma, su kaçağı tespiti ve tüm tesisat
            işleriniz için ortalama 15-30 dakikada kapınızdayız.
          </p>
        </div>
      </section>

      {/* Öne çıkan mahalleler — kendi sayfaları var */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">En Çok Hizmet Verdiğimiz Bölgeler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Her bölgenin yapı stoğu ve tesisat sorunları farklı. Aşağıdaki sayfalarda o bölgede
              nelerle karşılaştığımızı ayrıntılı anlattık.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ONE_CIKAN_MAHALLELER.map((m) => (
              <Link
                key={m.id}
                href={m.slug}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-r from-primary to-blue-700 p-5 text-white group-hover:from-blue-700 group-hover:to-blue-900 transition-all">
                  <h3 className="text-2xl font-bold flex items-center gap-2">📍 {m.name}</h3>
                  <p className="text-blue-100 text-sm mt-1">Varış: {m.varisSuresi}</p>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{m.intro}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      {SERVICES.slice(0, 3).map((s) => (
                        <span key={s.id} className="text-lg" title={s.title}>
                          {s.icon}
                        </span>
                      ))}
                    </div>
                    <span className="text-primary font-semibold text-sm group-hover:underline">
                      Detay &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tüm mahalleler */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Kadıköy&apos;ün Tüm Mahalleleri</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Aşağıdaki mahallelerin hepsine hizmet veriyoruz. Bölgenizi listede göremiyorsanız yine de
            arayın — Kadıköy sınırları içindeki her adrese gidiyoruz.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {ONE_CIKAN_MAHALLELER.map((m) => (
              <Link
                key={m.id}
                href={m.slug}
                className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
              >
                📍 {m.name}
              </Link>
            ))}
            {digerMahalleler.map((m) => (
              <span
                key={m}
                className="bg-white text-gray-700 text-sm px-4 py-2 rounded-full shadow-sm"
              >
                {m}
              </span>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500">
            Mavi olanların ayrıntılı bölge sayfası var.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Kadıköy&apos;de Tesisatçı mı Arıyorsunuz?</h2>
          <p className="text-xl text-blue-100 mb-8">
            {SITE_CONFIG.experience} yıllık tecrübemiz ile <strong>30 dakikada kapınızdayız!</strong>
          </p>
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

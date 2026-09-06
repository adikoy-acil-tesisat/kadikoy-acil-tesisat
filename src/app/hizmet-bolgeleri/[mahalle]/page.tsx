import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_CONFIG, SERVICES } from "@/lib/constants";
import { ONE_CIKAN_MAHALLELER, getMahalle } from "@/lib/mahalleler";

export function generateStaticParams() {
  return ONE_CIKAN_MAHALLELER.map((m) => ({ mahalle: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mahalle: string }>;
}): Promise<Metadata> {
  const { mahalle } = await params;
  const m = getMahalle(mahalle);
  if (!m) return { title: "Bölge Bulunamadı" };
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    alternates: { canonical: m.slug },
  };
}

export default async function MahallePage({
  params,
}: {
  params: Promise<{ mahalle: string }>;
}) {
  const { mahalle } = await params;
  const m = getMahalle(mahalle);
  if (!m) notFound();

  const digerleri = ONE_CIKAN_MAHALLELER.filter((x) => x.id !== m.id);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-blue-200 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            {" / "}
            <Link href="/hizmet-bolgeleri" className="hover:text-white">Hizmet Bölgeleri</Link>
            {" / "}
            <span className="text-white">{m.name}</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              {m.name} <span className="text-secondary">Tesisatçı</span>
            </h1>
            <p className="text-lg text-blue-100 mb-6">{m.intro}</p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 text-sm">
              <span className="bg-green-400 rounded-full w-2 h-2 animate-pulse" />
              {m.name}&apos;e ortalama varış: {m.varisSuresi}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${SITE_CONFIG.phoneIntl}`}
                className="flex items-center justify-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
              >
                Hemen Ara: {SITE_CONFIG.phoneFormatted}
              </a>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                  `Merhaba, ${m.name}'de tesisat hizmeti almak istiyorum.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-full transition-colors"
              >
                WhatsApp ile Yazın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Yapı stoğu — sayfaları birbirinden ayıran içerik */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {m.name}&apos;de Tesisat: Neyle Karşılaşıyoruz?
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">{m.yapiStogu}</p>
        </div>
      </section>

      {/* Bu mahallede sık görülen sorunlar */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {m.name}&apos;de Sık Karşılaştığımız Sorunlar
          </h2>
          <div className="space-y-5">
            {m.sikSorunlar.map((s) => (
              <div key={s.baslik} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-primary mb-2">{s.baslik}</h3>
                <p className="text-gray-600 leading-relaxed">{s.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hizmetler */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {m.name}&apos;de Verdiğimiz Hizmetler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => (
              <Link
                key={s.id}
                href={s.slug}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all group"
              >
                <span className="text-4xl mb-4 block">{s.icon}</span>
                <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-secondary transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{s.shortDesc}</p>
                <span className="text-primary font-semibold text-sm group-hover:underline">
                  Detaylı Bilgi &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Civar */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{m.name} ve Çevresi</h2>
          <p className="text-gray-600 mb-8">
            {m.name} ve yakın çevresindeki tüm sokak ve caddelere hizmet veriyoruz.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {m.civar.map((c) => (
              <span key={c} className="bg-white text-gray-700 text-sm px-4 py-2 rounded-full shadow-sm">
                📍 {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Diğer mahalleler */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Kadıköy&apos;ün Diğer Bölgeleri</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {digerleri.map((d) => (
              <Link
                key={d.id}
                href={d.slug}
                className="bg-gray-50 hover:bg-primary rounded-xl p-4 text-center transition-all group"
              >
                <span className="font-semibold text-gray-900 group-hover:text-white transition-colors text-sm">
                  {d.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/hizmet-bolgeleri" className="text-primary font-semibold hover:underline">
              Tüm Kadıköy mahallelerini gör &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {m.name}&apos;de Tesisatçı mı Arıyorsunuz?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Ortalama <strong>{m.varisSuresi}</strong> içinde kapınızdayız.
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

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Genel Tesisat | Banyo ve Mutfak",
  description:
    "Kadıköy'de genel tesisat hizmetleri. Banyo tesisatı, mutfak tesisatı, boru değişimi, sıhhi tesisat, tadilat tesisatı. 7/24 acil servis.",
};

export default function GenelTesisatPage() {
  const services = [
    { title: "Banyo Tesisatı", desc: "Banyo tadilat ve yenileme tesisatı, duş kabini, küvet montajı.", icon: "🚿" },
    { title: "Mutfak Tesisatı", desc: "Mutfak tesisat döşeme, lavabo ve bulaşık makinesi bağlantısı.", icon: "🍳" },
    { title: "Boru Değişimi", desc: "Eski ve yıpranmış boruların PPR veya bakır boru ile değişimi.", icon: "🔩" },
    { title: "Sıhhi Tesisat", desc: "Klozet, lavabo, batarya montajı ve tamiri.", icon: "🚽" },
    { title: "Petek Döşeme", desc: "Petek montajı, petek değişimi ve petek temizliği.", icon: "♨️" },
    { title: "Tadilat Tesisatı", desc: "Ev ve iş yeri tadilat projelerinde komple tesisat çözümleri.", icon: "🏗️" },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-amber-600 to-amber-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-amber-200 mb-6">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> {" / "}
            <span className="text-white">Genel Tesisat</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Genel <span className="text-yellow-200">Tesisat Hizmetleri</span>
            </h1>
            <p className="text-lg text-amber-100 mb-8">
              Banyo, mutfak, boru değişimi ve tüm tesisat tamir-tadilat işlerinizi {SITE_CONFIG.experience} yıllık
              tecrübemiz ile profesyonelce yapıyoruz.
            </p>
            <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="inline-flex items-center gap-2 bg-white text-amber-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-full transition-colors">
              Hemen Ara: {SITE_CONFIG.phoneFormatted}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tesisat Hizmetlerimiz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <span className="text-3xl mb-3 block">{s.icon}</span>
                <h3 className="font-bold text-lg mb-2 text-amber-700">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Tesisat İşiniz İçin Bize Ulaşın</h2>
          <p className="text-xl text-amber-100 mb-8">Ücretsiz keşif ve fiyat teklifi için hemen arayın!</p>
          <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="inline-flex items-center gap-2 bg-white text-amber-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-colors">
            {SITE_CONFIG.phoneFormatted}
          </a>
        </div>
      </section>
    </>
  );
}

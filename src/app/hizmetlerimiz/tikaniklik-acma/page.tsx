import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tıkanıklık Açma | Rothenberger",
  description:
    "Kadıköy'de Rothenberger profesyonel makine ile tıkanıklık açma hizmeti. Lavabo, tuvalet, gider, kanal tıkanıklığı açma. 7/24 acil servis. Hemen arayın: 0531 865 38 02",
};

export default function TikaniklikAcmaPage() {
  const steps = [
    { num: "1", title: "Bizi Arayın", desc: "Telefon veya WhatsApp ile tıkanıklık sorununuzu bildirin." },
    { num: "2", title: "Hızlı Varış", desc: "30 dakika içinde adresinize geliyoruz." },
    { num: "3", title: "Tespit & Çözüm", desc: "Rothenberger makine ile tıkanıklığı profesyonelce açıyoruz." },
    { num: "4", title: "Temiz Teslim", desc: "İş bitiminde alanı temizleyip teslim ediyoruz." },
  ];

  const services = [
    { title: "Lavabo Tıkanıklığı Açma", desc: "Mutfak ve banyo lavaboları için profesyonel çözüm." },
    { title: "Tuvalet Tıkanıklığı Açma", desc: "Her türlü tuvalet tıkanıklığını güvenli şekilde açıyoruz." },
    { title: "Gider & Kanal Açma", desc: "Ana gider hatları ve kanalizasyon tıkanıklıkları." },
    { title: "Pis Su Borusu Açma", desc: "Pis su hattındaki tıkanıklıkları robot makine ile açıyoruz." },
    { title: "Banyo Gideri Açma", desc: "Duş ve küvet giderlerindeki tıkanıklıkları gideriyoruz." },
    { title: "Mutfak Gideri Açma", desc: "Yağ ve atıktan kaynaklı mutfak tıkanıklıkları." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> {" / "}
            <span className="text-white">Tıkanıklık Açma</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Rothenberger Makine ile <span className="text-secondary">Tıkanıklık Açma</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Alman menşeli Rothenberger profesyonel tıkanıklık açma makinemiz ile lavabo, tuvalet, gider ve kanal
              tıkanıklıklarını hızla ve kalıcı olarak açıyoruz. En zorlu tıkanıklıklarda bile etkili çözüm!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="flex items-center justify-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                Hemen Ara: {SITE_CONFIG.phoneFormatted}
              </a>
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-full transition-colors">
                WhatsApp ile Yazın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışıyoruz?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">{s.num}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tıkanıklık Açma Hizmetlerimiz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-primary mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rothenberger detail */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Rothenberger Makine Nedir?</h2>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
            <p>
              <strong>Rothenberger</strong>, 1949 yılında Almanya&apos;da kurulan ve dünyaca ünlü bir tesisat ekipmanı markasıdır.
              Profesyonel tıkanıklık açma makineleri, endüstriyel seviye güç ve dayanıklılık sunar.
            </p>
            <p>
              Geleneksel yöntemlerin (pompa, tel, kimyasal) çözemediği zorlu tıkanıklıklarda bile Rothenberger makine etkili sonuç verir.
              Farklı çaplardaki boruya uygun spiral uçları sayesinde boruya zarar vermeden tıkanıklığı açar.
            </p>
            <p>
              <strong>Kadıköy Acil Tesisat</strong> olarak Rothenberger profesyonel tıkanıklık açma
              makinemiz ile Kadıköy&apos;ün 21 mahallesinin tamamında hizmet veriyoruz. Hızlı, temiz
              ve kalıcı çözüm.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Tıkanıklık Sorununuz mu Var?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Hemen bizi arayın, Rothenberger makine ile <strong>30 dakikada kapınızdayız!</strong>
          </p>
          <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="inline-flex items-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors">
            Hemen Ara: {SITE_CONFIG.phoneFormatted}
          </a>
        </div>
      </section>
    </>
  );
}

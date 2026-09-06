import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tamir & Montaj | Sifon, Batarya",
  description:
    "Kadıköy'de tuvalet sifonu tamiri, batarya değişimi, taharet musluğu montajı, çamaşır makinası ve bulaşık makinası kurulumu. 7/24 hizmet. Hemen arayın: 0531 865 38 02",
};

export default function TamirMontajPage() {
  const services = [
    {
      title: "Tuvalet Sifonu Tamir & Değişim",
      desc: "Her marka ve model tuvalet sifonunun tamiri ve komple değişimi. Kaçıran, akmayan veya bozulan sifonlarınızı hızlıca onarıyoruz.",
      icon: "🚽",
      features: [
        "Gömme rezervuar sifon tamiri",
        "Üstten basmalı sifon değişimi",
        "Sifon iç takım değişimi",
        "Su tasarruflu sifon montajı",
      ],
    },
    {
      title: "Taharet Musluğu Montajı",
      desc: "Taharet musluğu montajı ve değişimi. Mevcut tesisata uygun, kaliteli taharet musluğu takıyoruz.",
      icon: "🚿",
      features: [
        "Yeni taharet musluğu montajı",
        "Arızalı taharet musluğu değişimi",
        "Hortum ve bağlantı yenileme",
        "Kaçak kontrolü ve test",
      ],
    },
    {
      title: "Mutfak Bataryası Değişim",
      desc: "Mutfak bataryanızı profesyonelce söküp yenisini takıyoruz. Spiralli, çıkmalı ve standart tüm modeller.",
      icon: "🍳",
      features: [
        "Eski batarya sökümü",
        "Yeni batarya montajı",
        "Esnek hortum bağlantısı",
        "Kaçak testi ve kontrol",
      ],
    },
    {
      title: "Banyo Bataryası Değişim",
      desc: "Lavabo bataryası, duş bataryası ve küvet bataryası değişimi. Tüm marka ve modellere uygun montaj.",
      icon: "🛁",
      features: [
        "Lavabo bataryası değişimi",
        "Duş bataryası montajı",
        "Küvet bataryası değişimi",
        "Termostatik batarya montajı",
      ],
    },
    {
      title: "Çamaşır Makinası Kurulum",
      desc: "Yeni çamaşır makinanızın su giriş, gider çıkış ve elektrik bağlantılarını profesyonelce yapıyoruz.",
      icon: "👕",
      features: [
        "Su bağlantısı yapma",
        "Gider hortumu bağlantısı",
        "Dengeleme ve test",
        "Musluk montajı (gerekirse)",
      ],
    },
    {
      title: "Bulaşık Makinası Kurulum",
      desc: "Bulaşık makinanızın tesisat bağlantılarını eksiksiz yapıyor, çalışma testini gerçekleştiriyoruz.",
      icon: "🍽️",
      features: [
        "Su giriş bağlantısı",
        "Gider bağlantısı",
        "Sifon altı bağlantı düzeni",
        "Kaçak kontrolü ve test çalıştırma",
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-indigo-200 mb-6">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> {" / "}
            <span className="text-white">Tamir & Montaj</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Tamir & <span className="text-secondary">Montaj Hizmetleri</span>
            </h1>
            <p className="text-lg text-indigo-100 mb-8">
              Tuvalet sifonu tamiri, batarya değişimi, taharet musluğu montajı, çamaşır ve bulaşık makinası kurulumu...
              Evinizin tüm küçük tesisat işlerini {SITE_CONFIG.experience} yıllık tecrübemiz ile profesyonelce yapıyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="flex items-center justify-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                Hemen Ara: {SITE_CONFIG.phoneFormatted}
              </a>
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Merhaba, tamir/montaj hizmeti almak istiyorum.")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-full transition-colors">
                WhatsApp ile Yazın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Tamir & Montaj Hizmetlerimiz</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Evinizin veya iş yerinizin tüm küçük ve orta ölçekli tesisat işlerini hızlı ve temiz şekilde yapıyoruz.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => (
              <div key={s.title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-4 block">{s.icon}</span>
                <h3 className="font-bold text-xl text-indigo-700 mb-3">{s.title}</h3>
                <p className="text-gray-600 mb-4">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışıyoruz?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "1", title: "İletişim", desc: "Telefon veya WhatsApp ile ihtiyacınızı bildirin." },
              { num: "2", title: "Bilgi & Fiyat", desc: "Size ön bilgi ve tahmini fiyat verelim." },
              { num: "3", title: "Randevu", desc: "Size uygun saatte adresinize gelelim." },
              { num: "4", title: "Montaj & Test", desc: "İşi yapalım, test edelim, temiz teslim edelim." },
            ].map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 bg-indigo-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">{s.num}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Neden Bizi Tercih Etmelisiniz?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Tecrübeli Usta", desc: "16 yıllık deneyim ile her marka ve modele hakimiz." },
              { title: "Garantili İşçilik", desc: "Yaptığımız tüm montaj ve tamirlere iş garantisi veriyoruz." },
              { title: "Temiz Çalışma", desc: "İş bitiminde alanı tertemiz teslim ediyoruz." },
              { title: "Uygun Fiyat", desc: "Piyasanın altında fiyatlarla kaliteli hizmet sunuyoruz." },
              { title: "Hızlı Servis", desc: "Aynı gün randevu, hızlı müdahale." },
              { title: "Malzeme Desteği", desc: "Gerekli malzemeleri biz temin edebiliyoruz." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sifon, Batarya veya Makina Kurulumu mu Gerekiyor?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Hemen bizi arayın, <strong>aynı gün randevu</strong> ile kapınıza gelelim!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors">
              Hemen Ara: {SITE_CONFIG.phoneFormatted}
            </a>
            <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-full text-lg transition-colors">
              WhatsApp ile Yazın
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

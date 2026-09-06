import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Su Kaçağı Tespiti | Kırmadan",
  description:
    "Kadıköy'de termal kamera ile kırmadan su kaçağı tespiti. Duvar ve zemin kırmadan kaçak noktasını hassas şekilde belirliyoruz. 7/24 hizmet. Hemen arayın: 0531 865 38 02",
};

export default function SuKacagiTespitiPage() {
  const advantages = [
    { title: "Kırmadan Tespit", desc: "Duvar ve zemini kırmadan su kaçağının tam yerini belirliyoruz.", icon: "🎯" },
    { title: "Termal Kamera Teknolojisi", desc: "Isı farkı ile gizli kaçakları görüntülüyoruz.", icon: "📷" },
    { title: "Milimetrik Hassasiyet", desc: "Kaçak noktasını santimetrik hassasiyetle tespit ediyoruz.", icon: "📐" },
    { title: "Hızlı Sonuç", desc: "Yerinde tespit, anlık sonuç ve rapor sunuyoruz.", icon: "⚡" },
    { title: "Maliyet Tasarrufu", desc: "Gereksiz kırım olmadığı için tamir maliyeti minimuma iner.", icon: "💰" },
    { title: "7/24 Hizmet", desc: "Acil su kaçağı durumlarında gece-gündüz hizmetinizdeyiz.", icon: "🕐" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-teal-200 mb-6">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> {" / "}
            <span className="text-white">Su Kaçağı Tespiti</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Termal Kamera ile <span className="text-secondary">Kırmadan Su Kaçağı Tespiti</span>
            </h1>
            <p className="text-lg text-teal-100 mb-8">
              Profesyonel termal kamera cihazımız ile duvarları ve zemini kırmadan su kaçağının tam yerini tespit ediyoruz.
              Gereksiz kırım ve masraftan kurtulun!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="flex items-center justify-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
                Hemen Ara: {SITE_CONFIG.phoneFormatted}
              </a>
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-full transition-colors">
                WhatsApp ile Yazın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Termal Kamera ile Su Kaçağı Tespiti Avantajları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((a) => (
              <div key={a.title} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <span className="text-3xl mb-3 block">{a.icon}</span>
                <h3 className="font-bold text-lg mb-2 text-teal-700">{a.title}</h3>
                <p className="text-gray-600">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Termal Kamera Nasıl Çalışır?</h2>
          <div className="space-y-6 text-gray-600">
            <p className="text-lg">
              Termal kamera, yüzeylerdeki <strong>ısı farklılıklarını</strong> algılayarak görüntüler.
              Su kaçağı olan bölgelerde suyun ısı taşıması nedeniyle çevresinden farklı bir sıcaklık oluşur.
            </p>
            <p className="text-lg">
              Bu ısı farkı, termal kamera ekranında renkli görüntü olarak belirlenir. Böylece duvar veya zemini
              kırmadan kaçağın <strong>tam yerini santimetrik hassasiyetle</strong> tespit ederiz.
            </p>
            <p className="text-lg">
              <strong>Geleneksel yöntemlerde</strong> kaçak bulmak için birçok noktanın kırılması gerekirken,
              termal kamera ile sadece kaçağın olduğu noktaya müdahale edilir. Bu da hem <strong>zamandan</strong>
              hem de <strong>paradan</strong> büyük tasarruf sağlar.
            </p>
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Hangi Kaçakları Tespit Ediyoruz?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Tesisat borusu kaçakları",
              "Yerden ısıtma sistemi kaçakları",
              "Kombi ve radyatör kaçakları",
              "Çatı ve teras su sızıntıları",
              "Banyo ve mutfak gizli kaçakları",
              "Apartman ortak alan kaçakları",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                <span className="font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-700 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Su Kaçağından mı Şüpheleniyorsunuz?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Termal kamera ile <strong>kırmadan, dökmeden</strong> su kaçağınızı tespit edelim. Ücretsiz keşif!
          </p>
          <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="inline-flex items-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors">
            Hemen Ara: {SITE_CONFIG.phoneFormatted}
          </a>
        </div>
      </section>
    </>
  );
}

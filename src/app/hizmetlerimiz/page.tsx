import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description: "Kadıköy Acil Tesisat tesisat hizmetleri: Tıkanıklık açma, su kaçağı tespiti, genel tesisat, tamir ve montaj. Rothenberger makine ve termal kamera ile profesyonel çözüm.",
};

const allServices = [
  {
    title: "Tıkanıklık Açma",
    slug: "/hizmetlerimiz/tikaniklik-acma",
    icon: "🔧",
    color: "from-blue-600 to-blue-800",
    desc: "Rothenberger profesyonel makine ile her türlü tıkanıklık açma hizmeti.",
    items: ["Lavabo Tıkanıklığı", "Tuvalet Tıkanıklığı", "Gider & Kanal Açma", "Pis Su Borusu Açma", "Banyo Gideri Açma", "Mutfak Gideri Açma"],
    price: "500 ₺'den başlayan",
  },
  {
    title: "Su Kaçağı Tespiti",
    slug: "/hizmetlerimiz/su-kacagi-tespiti",
    icon: "🔍",
    color: "from-teal-600 to-teal-800",
    desc: "Termal kamera ile kırmadan su kaçağı tespit hizmeti.",
    items: ["Boru Kaçağı Tespiti", "Yerden Isıtma Kaçağı", "Kombi/Radyatör Kaçağı", "Çatı Sızıntısı", "Gizli Kaçak Tespiti", "Apartman Kaçağı"],
    price: "750 ₺'den başlayan",
  },
  {
    title: "Genel Tesisat",
    slug: "/hizmetlerimiz/genel-tesisat",
    icon: "🛠️",
    color: "from-amber-600 to-amber-800",
    desc: "Banyo, mutfak ve tüm tesisat tamir-tadilat işleri.",
    items: ["Banyo Tesisatı", "Mutfak Tesisatı", "Boru Değişimi", "Sıhhi Tesisat", "Petek Döşeme", "Tadilat Tesisatı"],
    price: "Keşfe göre",
  },
  {
    title: "Tamir & Montaj",
    slug: "/hizmetlerimiz/tamir-montaj",
    icon: "⚙️",
    color: "from-indigo-600 to-indigo-800",
    desc: "Sifon, batarya, taharet musluğu ve beyaz eşya kurulum hizmeti.",
    items: ["Sifon Tamir/Değişim", "Taharet Musluğu", "Mutfak Bataryası", "Banyo Bataryası", "Çamaşır Makinası Kurma", "Bulaşık Makinası Kurma"],
    price: "300 ₺'den başlayan",
  },
];

export default function HizmetlerimizPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Hizmetlerimiz</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            {SITE_CONFIG.experience} yıllık tecrübemiz ve profesyonel ekipmanlarımız ile Kadıköy&apos;de
            tüm tesisat ihtiyaçlarınıza çözüm sunuyoruz.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          {allServices.map((s) => (
            <div key={s.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
              <div className={`bg-gradient-to-r ${s.color} p-6 md:p-8 text-white`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{s.icon}</span>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold">{s.title}</h2>
                      <p className="text-white/80 mt-1">{s.desc}</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                    <p className="text-sm opacity-80">Fiyat</p>
                    <p className="font-bold text-lg">{s.price}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {s.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                      {item}
                    </div>
                  ))}
                </div>
                <Link href={s.slug} className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-5 rounded-xl transition-colors text-sm">
                  Detaylı Bilgi
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Hangi Hizmeti Arıyorsunuz?</h2>
          <p className="text-xl text-blue-100 mb-8">Bize anlatın, en uygun çözümü birlikte belirleyelim. <strong>Ücretsiz keşif!</strong></p>
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

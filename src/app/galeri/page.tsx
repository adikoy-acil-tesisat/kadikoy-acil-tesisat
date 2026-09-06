import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Galeri | İş Fotoğraflarımız",
  description: "Kadıköy Acil Tesisat iş fotoğrafları. Tıkanıklık açma, su kaçağı tespiti ve tesisat işlerinden öncesi-sonrası görüntüler.",
};

export default function GaleriPage() {
  const gallery = [
    { title: "Lavabo Tıkanıklığı Açma", district: "Moda", category: "Tıkanıklık Açma", color: "bg-blue-100" },
    { title: "Termal Kamera ile Kaçak Tespiti", district: "Kozyatağı", category: "Su Kaçağı Tespiti", color: "bg-teal-100" },
    { title: "Banyo Tesisatı Yenileme", district: "Caddebostan", category: "Genel Tesisat", color: "bg-amber-100" },
    { title: "Ana Gider Hattı Açma", district: "Göztepe", category: "Tıkanıklık Açma", color: "bg-blue-100" },
    { title: "Mutfak Gider Tıkanıklığı", district: "Bostancı", category: "Tıkanıklık Açma", color: "bg-blue-100" },
    { title: "Yerden Isıtma Kaçak Tespiti", district: "Moda", category: "Su Kaçağı Tespiti", color: "bg-teal-100" },
    { title: "Boru Değişimi İşlemi", district: "Kozyatağı", category: "Genel Tesisat", color: "bg-amber-100" },
    { title: "Tuvalet Tıkanıklığı Açma", district: "Caddebostan", category: "Tıkanıklık Açma", color: "bg-blue-100" },
    { title: "Petek Tesisatı Döşeme", district: "Göztepe", category: "Genel Tesisat", color: "bg-amber-100" },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Galeri</h1>
          <p className="text-lg text-blue-100">Yaptığımız işlerden fotoğraflar ve öncesi-sonrası görüntüler.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Aşağıda gerçekleştirdiğimiz bazı işlerin detaylarını görebilirsiniz.
            Gerçek iş fotoğraflarımız ekipmanlarımızı aldıktan sonra eklenecektir.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`${item.color} h-48 flex items-center justify-center`}>
                  <div className="text-center">
                    <span className="text-4xl block mb-2">
                      {item.category === "Tıkanıklık Açma" ? "🔧" : item.category === "Su Kaçağı Tespiti" ? "🔍" : "🛠️"}
                    </span>
                    <span className="text-sm font-medium text-gray-500">Fotoğraf Eklenecek</span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-primary bg-blue-50 px-2 py-1 rounded-full">{item.category}</span>
                  <h3 className="font-bold text-gray-900 mt-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">📍 {item.district}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Profesyonel Tesisat Hizmeti İçin Bizi Arayın</h2>
          <p className="text-xl text-blue-100 mb-8">Sizin için de kaliteli işçilik yapalım!</p>
          <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="inline-flex items-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors">
            Hemen Ara: {SITE_CONFIG.phoneFormatted}
          </a>
        </div>
      </section>
    </>
  );
}

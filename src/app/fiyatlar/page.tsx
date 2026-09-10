import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Fiyatlar | Nasıl Belirleniyor?",
  description:
    "Kadıköy tesisatçı fiyatları nasıl belirlenir? Ücretsiz keşif, işe başlamadan net fiyat, sürpriz masraf yok. Tıkanıklık açma ve su kaçağı tespiti fiyatlandırması.",
  alternates: { canonical: "/fiyatlar" },
};

const belirleyenler = [
  {
    baslik: "İşin gerçek kapsamı",
    metin:
      "Aynı isimli iki iş aynı iş olmayabilir. Lavabo tıkanıklığı sifonda basit bir birikinti de olabilir, ortak kolon hattındaki bir sorun da. Birincisi 15 dakika, ikincisi iki saat sürer. Telefonda hangisi olduğunu bilemem — yerinde bakınca bilirim.",
  },
  {
    baslik: "Kullanılacak malzeme",
    metin:
      "Bazı işler sadece işçiliktir; makineyle açılır, malzeme girmez. Bazılarında batarya, sifon, boru ya da rakor değişir. Malzeme gerekiyorsa hangi marka ve ne kadar tuttuğunu ayrı ayrı söylerim.",
  },
  {
    baslik: "Süre",
    metin:
      "Yarım saatlik işle yarım günlük iş aynı fiyat olmaz. Yerinde baktığımda ne kadar süreceğini yaklaşık olarak söyleyebilirim.",
  },
];

const adimlar = [
  { no: "1", baslik: "Ararsınız", metin: "Sorunu anlatırsınız. Telefonda tahmini bir aralık verebilirim ama kesin fiyat vermem — görmeden söylenen rakam güvenilir olmaz." },
  { no: "2", baslik: "Ücretsiz gelirim", metin: "Keşif için ayrıca ücret almıyorum. Bakarım, sorunun ne olduğunu anlarım." },
  { no: "3", baslik: "Fiyatı söylerim", metin: "Ne yapılacağını ve ne tutacağını baştan söylerim. Malzeme varsa ayrı kalem olarak belirtirim." },
  { no: "4", baslik: "Siz karar verirsiniz", metin: "Onay vermezseniz iş yapılmaz, keşif için de bir şey ödemezsiniz. Onay verirseniz başlarım." },
  { no: "5", baslik: "Fiyat değişmez", metin: "İş bitince konuştuğumuz rakamı ödersiniz. Sonradan çıkan ek kalem olmaz." },
];

export default function FiyatlarPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-blue-200 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            {" / "}
            <span className="text-white">Fiyatlar</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Fiyatlar Nasıl Belirleniyor?</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Sabit fiyat listesi vermiyorum — ve bunun sebebini açıkça anlatmak istiyorum.
          </p>
        </div>
      </section>

      {/* Neden liste yok */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Neden hazır fiyat listesi yok?
          </h2>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            <p>
              İnternette &ldquo;tıkanıklık açma 500 TL&rdquo; diye rakam veren siteler var. Bu rakam
              genelde en basit ihtimale göre yazılıyor; iş yerinde farklı çıkınca fiyat da değişiyor.
              Müşteri kapıda pazarlık yapmak zorunda kalıyor.
            </p>
            <p>
              Ben bunu yapmak istemiyorum. <strong>Görmeden fiyat söylemem</strong>, ama gördükten sonra
              söylediğim fiyat da değişmez.
            </p>
          </div>
        </div>
      </section>

      {/* Fiyatı ne belirler */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
            Fiyatı Belirleyen Üç Şey
          </h2>
          <div className="space-y-5">
            {belirleyenler.map((b) => (
              <div key={b.baslik} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-primary mb-2">{b.baslik}</h3>
                <p className="text-gray-600 leading-relaxed">{b.metin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl işliyor */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
            Baştan Sona Nasıl İşliyor?
          </h2>
          <ol className="space-y-5">
            {adimlar.map((a) => (
              <li key={a.no} className="flex gap-4">
                <span className="bg-primary text-white font-bold w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                  {a.no}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{a.baslik}</h3>
                  <p className="text-gray-600 leading-relaxed">{a.metin}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Somut örnek */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Örnek: Aynı iş, iki farklı fiyat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border-l-4 border-green-500">
              <p className="text-sm font-semibold text-green-700 mb-2">Basit hâli</p>
              <p className="text-gray-600 leading-relaxed">
                Mutfak lavabosu yavaş akıyor. Sifonu sökünce içinde yağ ve atık birikintisi
                çıkıyor. Temizlenip takılıyor. <strong>15-20 dakika, malzeme yok.</strong>
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-l-4 border-amber-500">
              <p className="text-sm font-semibold text-amber-700 mb-2">Zor hâli</p>
              <p className="text-gray-600 leading-relaxed">
                Aynı şikâyet, ama sifon temiz. Sorun ortak kolon hattında. Rothenberger makineyle
                hattın açılması gerekiyor. <strong>1,5-2 saat, ekipman gerekiyor.</strong>
              </p>
            </div>
          </div>
          <p className="text-gray-600 mt-6 leading-relaxed">
            Telefonda ikisi de &ldquo;lavabo tıkalı&rdquo; diye anlatılır. Aradaki farkı ancak yerinde
            görünce anlarım — ve fiyatı ona göre söylerim.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Keşif Ücretsiz</h2>
          <p className="text-xl text-blue-100 mb-8">
            Gelir bakarım, fiyatı söylerim. Kabul etmezseniz hiçbir ücret ödemezsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${SITE_CONFIG.phoneIntl}`}
              className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors"
            >
              Hemen Ara: {SITE_CONFIG.phoneFormatted}
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                "Merhaba, bir tesisat işi için fiyat öğrenmek istiyorum."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-full text-lg transition-colors"
            >
              WhatsApp ile Sorun
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

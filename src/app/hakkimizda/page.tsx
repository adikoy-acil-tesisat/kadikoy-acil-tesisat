import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Kadıköy Acil Tesisat - 2010'dan bu yana Kadıköy'de profesyonel tesisat hizmeti. Rothenberger makine ve termal kamera ile kaliteli çözümler.",
};

export default function HakkimizdaPage() {
  const milestones = [
    { year: "2010", text: "Mesleğe babamın yanında başladım. Tesisatı sahada, iş üstünde öğrendim." },
    { year: "Bugün", text: "Kadıköy'de kendi işimi yürütüyorum. Aynı titizlik, aynı ustalık." },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Hakkımızda</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            2010 yılından bu yana Kadıköy&apos;de güvenilir ve profesyonel tesisat hizmeti sunuyoruz.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <p>
              Bu mesleğe <strong>2010 yılında babamın yanında</strong> başladım. Tesisatı okuldan değil,
              sahada öğrendim — açılmayan giderin başında, su akan dairede, komşusuna zarar vermeden
              çalışmak zorunda olduğun binalarda. {SITE_CONFIG.experience} yıl sonra bugün Kadıköy&apos;de
              kendi işimi yürütüyorum.
            </p>
            <p>
              Moda, Caddebostan, Bostancı, Göztepe, Kozyatağı ve Suadiye başta olmak üzere
              Kadıköy&apos;ün <strong>21 mahallesinin tamamına</strong> hizmet veriyorum. Her mahallenin
              yapı stoğu farklı; Moda&apos;daki 60 yıllık dökme demir hatla Kozyatağı&apos;ndaki sitenin
              yerden ısıtması aynı işi gerektirmiyor. Bunu bilmek işin yarısı.
            </p>
            <p>
              Yaptığım işi anlatırım, fiyatı önceden söylerim, iş bitince yeri temiz bırakırım.
              Karmaşık bir formülüm yok — sadece bu üçü.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 !mt-12 !mb-6">Ekipmanlarımız</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !my-8">
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-bold text-red-700 text-lg mb-2">Rothenberger Tıkanıklık Açma Makinası</h3>
                <p className="text-gray-600 text-base">
                  Almanya menşeli, dünyaca ünlü Rothenberger marka profesyonel tıkanıklık açma makinemiz ile
                  en zorlu tıkanıklıkları bile güvenli şekilde açıyoruz. Endüstriyel güç ve hassasiyet bir arada.
                </p>
              </div>
              <div className="bg-teal-50 rounded-xl p-6">
                <h3 className="font-bold text-teal-700 text-lg mb-2">Termal Kamera Kaçak Tespit Cihazı</h3>
                <p className="text-gray-600 text-base">
                  Profesyonel termal kamera cihazımız ile duvar ve zemini kırmadan su kaçağının tam yerini tespit ediyoruz.
                  Müşterilerimize gereksiz maliyet ve zahmetten kurtarıyoruz.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 !mt-12 !mb-6">Değerlerimiz</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 !my-8">
              {[
                { title: "Güvenilirlik", desc: "Söz verdiğimiz saatte gelir, söz verdiğimiz işi yaparız." },
                { title: "Profesyonellik", desc: "En son teknoloji ekipmanlar ve yılların tecrübesi." },
                { title: "Dürüstlük", desc: "Şeffaf fiyatlandırma, sürpriz masraf yok." },
                { title: "Müşteri Memnuniyeti", desc: "Her müşterimiz bizim referansımızdır." },
              ].map((v) => (
                <div key={v.title} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                  <div>
                    <h3 className="font-bold text-gray-900">{v.title}</h3>
                    <p className="text-gray-600 text-sm">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Yolculuğumuz</h2>
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-6 items-start">
                <div className="bg-primary text-white font-bold px-4 py-2 rounded-lg text-lg shrink-0">{m.year}</div>
                <p className="text-gray-600 pt-2">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-secondary">{SITE_CONFIG.experience}+</div>
              <div className="text-blue-200 mt-1">Yıllık Tecrübe</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">{SITE_CONFIG.completedJobs}</div>
              <div className="text-blue-200 mt-1">Başarılı İş</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">21</div>
              <div className="text-blue-200 mt-1">Mahalle Kapsama</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">7/24</div>
              <div className="text-blue-200 mt-1">Kesintisiz Hizmet</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

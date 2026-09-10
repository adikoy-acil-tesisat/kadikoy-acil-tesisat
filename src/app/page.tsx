import Link from "next/link";
import { SITE_CONFIG, SERVICES, FAQ_ITEMS } from "@/lib/constants";
import { ONE_CIKAN_MAHALLELER } from "@/lib/mahalleler";

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-blue-800 to-primary-dark text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
            <span className="bg-green-400 rounded-full w-2 h-2 animate-pulse" />
            7/24 Acil Tesisat Hizmeti
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Kadıköy&apos;de
            <span className="text-secondary"> Profesyonel </span>
            Tesisat Hizmeti
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
            2010&apos;dan bu yana <strong>Rothenberger profesyonel makine</strong> ile tıkanıklık açma
            ve <strong>termal kamera</strong> ile kırmadan su kaçağı tespiti hizmeti veriyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`tel:${SITE_CONFIG.phoneIntl}`}
              className="flex items-center justify-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              Hemen Ara: {SITE_CONFIG.phoneFormatted}
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L.05 23.5l5.793-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              WhatsApp ile Yazın
            </a>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-secondary">{SITE_CONFIG.experience}+</div>
              <div className="text-sm text-blue-100">Yıllık Tecrübe</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-secondary">{SITE_CONFIG.completedJobs}</div>
              <div className="text-sm text-blue-100">Başarılı İş</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-secondary">7/24</div>
              <div className="text-sm text-blue-100">Kesintisiz Hizmet</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-secondary">21</div>
              <div className="text-sm text-blue-100">Mahalle Kapsama</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const serviceDetails = [
    {
      ...SERVICES[0],
      longDesc: "Rothenberger profesyonel tıkanıklık açma makinemiz ile lavabo, tuvalet, banyo gideri, mutfak gideri ve ana kanal tıkanıklıklarını hızla açıyoruz. En zorlu tıkanıklıklarda bile etkili çözüm.",
      features: ["Lavabo & Tuvalet Tıkanıklığı", "Mutfak Gideri Açma", "Ana Kanal Temizliği", "Pis Su Borusu Açma"],
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-primary",
    },
    {
      ...SERVICES[1],
      longDesc: "Profesyonel termal kamera cihazımız ile duvarları ve zemini kırmadan su kaçağının tam yerini tespit ediyoruz. Gereksiz kırım ve masraftan kurtulun.",
      features: ["Kırmadan Tespit", "Termal Kamera Teknolojisi", "Hızlı & Hassas Sonuç", "Maliyet Tasarrufu"],
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-700",
    },
    {
      ...SERVICES[2],
      longDesc: "Banyo ve mutfak tesisatı, petek döşeme, sıhhi tesisat, boru değişimi ve tüm tesisat tamir-tadilat işlerinizi profesyonelce yapıyoruz.",
      features: ["Banyo & Mutfak Tesisatı", "Boru Değişimi & Tamiri", "Sıhhi Tesisat", "Tadilat Tesisatı"],
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      textColor: "text-amber-700",
    },
    {
      ...SERVICES[3],
      longDesc: "Tuvalet sifonu tamiri, batarya değişimi, taharet musluğu montajı, çamaşır ve bulaşık makinası kurulumu gibi tüm tamir ve montaj işleri.",
      features: ["Sifon Tamir & Değişim", "Batarya Değişimi", "Taharet Musluğu", "Beyaz Eşya Kurulum"],
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      textColor: "text-indigo-700",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hizmetlerimiz</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Profesyonel ekipmanlarımız ve 2010’dan gelen tecrübemizle tüm tesisat sorunlarınıza kalıcı çözüm sunuyoruz.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceDetails.map((service) => (
            <div key={service.id} className={`${service.bgColor} rounded-2xl p-8 hover:shadow-xl transition-shadow`}>
              <div className={`${service.iconBg} w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6`}>
                {service.icon}
              </div>
              <h3 className={`text-xl font-bold ${service.textColor} mb-3`}>{service.title}</h3>
              <p className="text-gray-600 mb-5">{service.longDesc}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${service.textColor} shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={service.slug} className={`inline-flex items-center gap-1 font-semibold ${service.textColor} hover:underline`}>
                Detaylı Bilgi
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EquipmentSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Profesyonel Ekipmanlarımız</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Almanya menşeli Rothenberger marka makineler ve ileri teknoloji termal kamera ile hizmet veriyoruz.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rothenberger */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Rothenberger Tıkanıklık Açma Makinası</h3>
              <p className="text-red-100">Alman mühendisliği ile profesyonel çözüm</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {[
                  "Endüstriyel seviye güç ve dayanıklılık",
                  "Her çaptaki boruya uygun uç seçenekleri",
                  "En zorlu tıkanıklıklarda bile etkili",
                  "Boruya zarar vermeden temizlik",
                  "Hızlı ve kalıcı çözüm",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Thermal Camera */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Termal Kamera Su Kaçağı Tespit Cihazı</h3>
              <p className="text-teal-100">Kırmadan, dökmeden hassas tespit</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {[
                  "Duvar ve zemin kırmadan kaçak tespiti",
                  "Milimetrik hassasiyette konum belirleme",
                  "Isı farkı ile gizli kaçakları görme",
                  "Zaman ve maliyet tasarrufu",
                  "Anlık sonuç ve rapor",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DistrictsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hizmet Bölgelerimiz</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kadıköy&apos;ün 21 mahallesinin tamamında 7/24 hizmetinizdeyiz.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ONE_CIKAN_MAHALLELER.map((d) => (
            <Link
              key={d.id}
              href={d.slug}
              className="group bg-gray-50 hover:bg-primary rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors">{d.name}</h3>
              <p className="text-sm text-gray-500 group-hover:text-blue-100 transition-colors mt-1">Tesisatçı</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Şablonla gelen uydurma müşteri yorumlarının yerini alan bölüm.
 * Gerçek yorumlar birikince buraya onlar konabilir.
 */
function SozVerdiklerimizSection() {
  const sozler = [
    {
      baslik: "İşe başlamadan fiyatı söylerim",
      metin:
        "Yerinde bakar, ne yapılacağını ve ne tutacağını baştan söylerim. Onay vermeden işe başlamam, iş bitince fiyat değişmez.",
    },
    {
      baslik: "Gereksiz iş çıkarmam",
      metin:
        "Boru değişmesi gerekmiyorsa değiştirmem. Açılabilecek bir tıkanıklık için kırım önermem. Gerekeni söyler, gerisini size bırakırım.",
    },
    {
      baslik: "Kırmadan bakarım",
      metin:
        "Su kaçağında önce termal kamerayla ararım. Kırım en son çare — ve gerekiyorsa sadece gereken yeri açarım.",
    },
    {
      baslik: "Yeri temiz bırakırım",
      metin:
        "İş bitince ortalığı toplarım. Tesisatçı gitti de arkasını siz mi temizlediniz, öyle bir şey olmaz.",
    },
    {
      baslik: "Yaptığım işin arkasındayım",
      metin:
        "Sonradan aynı yerde sorun çıkarsa ücretsiz tekrar gelirim. Kullandığım malzemeler garantili — kırılan, sızdıran parçayı ben değiştiririm.",
    },
    {
      baslik: "Başladığım işi bitiririm",
      metin:
        "Bugüne kadar hiçbir işi yarım bırakmadım. Beklenmedik bir sorun çıksa da çözene kadar peşini bırakmam.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Size Ne Söz Veriyorum?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tesisatçıyla ilgili en çok duyulan şikâyetler bunlar. Dördünü de baştan taahhüt ediyorum.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sozler.map((s) => (
            <div key={s.baslik} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{s.baslik}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.metin}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  const reasons = [
    { icon: "🏆", title: `${SITE_CONFIG.experience} Yıllık Tecrübe`, desc: `${SITE_CONFIG.since}'dan bu yana bu işin içindeyim` },
    { icon: "⚡", title: "Hızlı Müdahale", desc: "30 dakika içinde kapınızdayız" },
    { icon: "🛡️", title: "İş Garantisi", desc: "Sorun çıkarsa ücretsiz tekrar gelirim, malzemeler garantili" },
    { icon: "💰", title: "Şeffaf Fiyat", desc: "Fiyatı işe başlamadan söylerim, sonradan değişmez" },
    { icon: "🔧", title: "Profesyonel Ekipman", desc: "Rothenberger makine ve termal kamera" },
    { icon: "📞", title: "Ücretsiz Keşif", desc: "Ücretsiz yerinde tespit ve fiyat teklifi" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Neden Kadıköy Acil Tesisat?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Profesyonel ekipman, yılların tecrübesi ve müşteri memnuniyeti odaklı çalışma anlayışımızla fark yaratıyoruz.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="flex items-start gap-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-3xl">{r.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{r.title}</h3>
                <p className="text-gray-600 text-sm">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.slice(0, 4).map((item, i) => (
            <details key={i} className="bg-white rounded-xl shadow-sm group">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 hover:text-primary transition-colors">
                {item.question}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </summary>
              <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/sss" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            Tüm Soruları Gör
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-blue-800 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tesisat Sorununuz mu Var?</h2>
        <p className="text-xl text-blue-100 mb-8">
          Hemen bizi arayın, <strong>30 dakikada kapınızdayız!</strong> Ücretsiz keşif ve uygun fiyat garantisi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`tel:${SITE_CONFIG.phoneIntl}`}
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            {SITE_CONFIG.phoneFormatted}
          </a>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg"
          >
            WhatsApp ile Yazın
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <EquipmentSection />
      <DistrictsSection />
      <WhyUsSection />
      <SozVerdiklerimizSection />
      <FAQSection />
      <CTASection />
    </>
  );
}

export const SITE_URL = "https://kadikoyaciltesisat.com";

export const SITE_CONFIG = {
  name: "Kadıköy Acil Tesisat",
  url: SITE_URL,
  phone: "05318653802",
  phoneFormatted: "0531 865 38 02",
  phoneIntl: "+905318653802",
  whatsapp: "905318653802",
  whatsappMessage: "Merhaba, tesisat hizmeti almak istiyorum.",
  email: "info@kadikoyaciltesisat.com",
  address: "Kadıköy, İstanbul",
  since: 2010,
  experience: new Date().getFullYear() - 2010,
  completedJobs: "1000+",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96348.28548975!2d29.0!3d40.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac790b16a0e8d%3A0x4200ef6e2cc1b770!2sKad%C4%B1k%C3%B6y%2F%C4%B0stanbul!5e0!3m2!1str!2str",
  social: {
    instagram: "#",
    facebook: "#",
  },
  /**
   * Google Business Profile yorum bağlantısı.
   *
   * Profil doğrulandıktan sonra Google'ın verdiği kısa bağlantı buraya
   * yazılır: Business Profile > Yorum iste > bağlantıyı kopyala.
   * Boş bırakılırsa paneldeki "Yorum İste" düğmesi görünmez.
   */
  googleYorumLinki: "",
};

/** Google Search Console doğrulama etiketi (Settings > Ownership verification). */
export const GOOGLE_DOGRULAMA = "";

export const SERVICES = [
  {
    id: "tikaniklik-acma",
    title: "Tıkanıklık Açma",
    shortDesc: "Rothenberger profesyonel makine ile her türlü tıkanıklık açma hizmeti",
    icon: "🔧",
    slug: "/hizmetlerimiz/tikaniklik-acma",
  },
  {
    id: "su-kacagi-tespiti",
    title: "Su Kaçağı Tespiti",
    shortDesc: "Termal kamera ile kırmadan su kaçağı tespit hizmeti",
    icon: "🔍",
    slug: "/hizmetlerimiz/su-kacagi-tespiti",
  },
  {
    id: "genel-tesisat",
    title: "Genel Tesisat",
    shortDesc: "Banyo, mutfak ve tüm tesisat tamir & tadilat işleri",
    icon: "🛠️",
    slug: "/hizmetlerimiz/genel-tesisat",
  },
  {
    id: "tamir-montaj",
    title: "Tamir & Montaj",
    shortDesc: "Sifon, batarya, taharet musluğu ve beyaz eşya kurulum hizmetleri",
    icon: "⚙️",
    slug: "/hizmetlerimiz/tamir-montaj",
  },
];


export const FAQ_ITEMS = [
  {
    question: "7/24 hizmet veriyor musunuz?",
    answer: "Evet, Kadıköy'de 7 gün 24 saat acil tesisat hizmeti vermekteyiz. Gece, gündüz, hafta sonu veya bayramda bizi arayabilirsiniz.",
  },
  {
    question: "Kırmadan su kaçağı tespiti yapabiliyor musunuz?",
    answer: "Evet, profesyonel termal kamera cihazımız ile duvarları ve zemini kırmadan su kaçağının tam yerini tespit ediyoruz. Bu sayede gereksiz kırım ve maliyet önlenir.",
  },
  {
    question: "Hangi bölgelere hizmet veriyorsunuz?",
    answer: "Kadıköy ilçesinin 21 mahallesinin tamamına hizmet veriyoruz. Moda, Caddebostan, Bostancı, Göztepe, Kozyatağı, Suadiye, Caferağa, Erenköy, Acıbadem ve diğer tüm Kadıköy mahalleleri hizmet alanımızdadır.",
  },
  {
    question: "Tıkanıklık açma işlemi ne kadar sürer?",
    answer: "Tıkanıklığın türüne ve yerine göre değişmekle birlikte, Rothenberger profesyonel makinemiz ile çoğu tıkanıklık 30 dakika ile 1 saat arasında açılmaktadır.",
  },
  {
    question: "Ücretsiz keşif yapıyor musunuz?",
    answer: "Evet, tüm tesisat işleri için ücretsiz keşif ve fiyat teklifi sunuyoruz. Bizi arayarak veya WhatsApp'tan yazarak randevu alabilirsiniz.",
  },
  {
    question: "Fiyatlarınız ne kadar?",
    answer: "Sabit fiyat listesi vermiyoruz, çünkü aynı isimli iki iş aynı iş olmayabilir. Lavabo tıkanıklığı bazen sifonda basit bir birikintidir, bazen ortak kolon hattındaki bir sorundur; biri 15 dakika, diğeri iki saat sürer. Fiyatı belirleyen üç şey var: işin gerçek kapsamı, kullanılacak malzeme ve süre. Ücretsiz keşfe gelir, ne yapılacağını ve ne tutacağını baştan söyleriz. Onay vermezseniz keşif için de bir ücret ödemezsiniz, iş bitince de konuştuğumuz rakam değişmez.",
  },
  {
    question: "Yaptığınız işe garanti veriyor musunuz?",
    answer: "Evet. Yaptığımız işin arkasındayız: aynı yerde sonradan sorun çıkarsa ücretsiz olarak tekrar geliriz. Kullandığımız malzemeler de garantilidir, arızalanan parçayı biz değiştiririz. Bugüne kadar hiçbir işi yarım bırakmadık.",
  },
  {
    question: "Ne kadar sürede geliyorsunuz?",
    answer: "Kadıköy içindeki adreslere ortalama 30 dakikada ulaşıyoruz. Trafik ve saate göre bu süre değişebilir; aradığınızda size gerçekçi bir varış saati söyleriz.",
  },
  {
    question: "Rothenberger makine nedir?",
    answer: "Rothenberger, Almanya merkezli dünyaca ünlü bir tesisat ekipmanı markasıdır. Profesyonel tıkanıklık açma makineleri ile en zorlu gider, kanal ve boru tıkanıklıklarını güvenli şekilde açar.",
  },
  {
    question: "Çamaşır makinası ve bulaşık makinası kurulumu yapıyor musunuz?",
    answer: "Evet, çamaşır makinası ve bulaşık makinası kurulum hizmeti veriyoruz. Su ve gider bağlantılarını profesyonelce yaparak cihazınızın sorunsuz çalışmasını sağlıyoruz.",
  },
  {
    question: "Batarya ve sifon değişimi yapıyor musunuz?",
    answer: "Evet, mutfak bataryası, banyo bataryası, tuvalet sifonu tamiri/değişimi ve taharet musluğu montajı gibi tüm armatür işlerini yapıyoruz.",
  },
];

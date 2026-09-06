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
  address: "İstanbul, Anadolu Yakası",
  since: 2010,
  experience: new Date().getFullYear() - 2010,
  completedJobs: "5000+",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96348.28548975!2d29.0!3d40.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac790b16a0e8d%3A0x4200ef6e2cc1b770!2sKad%C4%B1k%C3%B6y%2F%C4%B0stanbul!5e0!3m2!1str!2str",
  social: {
    instagram: "#",
    facebook: "#",
  },
};

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

export const TESTIMONIALS = [
  {
    name: "Ahmet Y.",
    district: "Moda",
    text: "Gece yarısı tıkanan lavabomuz için aradık, 30 dakikada geldiler. Rothenberger makine ile anında çözdüler. Çok profesyonel bir hizmet!",
    rating: 5,
  },
  {
    name: "Fatma K.",
    district: "Caddebostan",
    text: "Su kaçağı tespiti için geldiler. Termal kamera ile duvarı kırmadan kaçağı buldular. Hem zamandan hem paradan tasarruf ettik.",
    rating: 5,
  },
  {
    name: "Mehmet B.",
    district: "Göztepe",
    text: "Banyo tesisatımızı komple yenilediler. İşçilik çok temiz ve düzenli. Fiyat da çok makuldü. Kesinlikle tavsiye ediyorum.",
    rating: 5,
  },
  {
    name: "Ayşe D.",
    district: "Bostancı",
    text: "Mutfak gideri tıkanmıştı, robot makine ile açtılar. Çok hızlı ve güler yüzlü hizmet. Teşekkür ederiz!",
    rating: 5,
  },
  {
    name: "Emre S.",
    district: "Suadiye",
    text: "Apartmanımızda su kaçağı vardı, kimse bulamıyordu. Termal kamera ile tam yerini tespit ettiler. Profesyonel ekip!",
    rating: 5,
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

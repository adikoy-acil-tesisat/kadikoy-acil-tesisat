/**
 * Kadıköy hizmet bölgeleri.
 *
 * Kadıköy'ün 21 resmî mahallesi var. Hepsine ayrı sayfa açmak Google'ın
 * "doorway pages" tanımına girer (birbirinin kopyası, tek farkı mahalle adı),
 * bu yüzden yalnızca en çok aranan 6 mahalleye kendine özgü içerikli sayfa
 * açıyoruz. Geri kalanlar ana hizmet bölgeleri sayfasında listeleniyor.
 */

/** Kadıköy Belediyesi'nin resmî mahalle listesi (21 adet). */
export const KADIKOY_MAHALLELERI = [
  "Acıbadem",
  "Bostancı",
  "Caddebostan",
  "Caferağa",
  "Dumlupınar",
  "Eğitim",
  "Erenköy",
  "Fenerbahçe",
  "Feneryolu",
  "Fikirtepe",
  "Göztepe",
  "Hasanpaşa",
  "Koşuyolu",
  "Kozyatağı",
  "Merdivenköy",
  "Ondokuzmayıs",
  "Osmanağa",
  "Rasimpaşa",
  "Sahrayıcedit",
  "Suadiye",
  "Zühtüpaşa",
];

export interface Mahalle {
  id: string;
  /** Sayfada ve menülerde görünen ad. */
  name: string;
  /**
   * Resmî mahalle listesindeki karşılığı. `name` listedekinden farklıysa
   * (ör. "Eğitim Mahallesi" ↔ "Eğitim") doldurulur; yoksa mahalle hem mavi
   * hem gri etiket olarak iki kez listelenir. Resmî bir mahalle değilse
   * (ör. Moda, Caferağa'nın içinde) boş bırakılır.
   */
  resmiAd?: string;
  slug: string;
  /** Sayfa başlığı — marka adı şablonla ekleniyor, kısa tut. */
  metaTitle: string;
  metaDescription: string;
  /** Hero altındaki tanıtım cümlesi. */
  intro: string;
  /** Bu mahallenin yapı stoğu — sayfaları birbirinden ayıran asıl içerik. */
  yapiStogu: string;
  /** Burada sık karşılaştığımız tesisat sorunları. */
  sikSorunlar: { baslik: string; aciklama: string }[];
  /** Bilinen cadde, park, site gibi yer adları. */
  civar: string[];
  varisSuresi: string;
}

/**
 * Ayrı sayfası olan mahalleler.
 *
 * Not: "Moda" resmî bir mahalle değil, Caferağa'nın içinde kalıyor. Ama
 * insanlar böyle arattığı için ayrı sayfa açıyoruz.
 */
export const ONE_CIKAN_MAHALLELER: Mahalle[] = [
  {
    id: "moda",
    name: "Moda",
    slug: "/hizmet-bolgeleri/moda",
    metaTitle: "Moda Tesisatçı",
    metaDescription:
      "Moda'da 7/24 tesisatçı. Eski bina tesisatı, dökme demir boru değişimi, tıkanıklık açma ve kırmadan su kaçağı tespiti. Hemen arayın: 0531 865 38 02",
    intro:
      "Moda, Kadıköy'ün en eski yerleşim alanlarından biri. Buradaki binaların çoğu 1930-1970 arası yapıldı ve tesisatları hâlâ dönemin dökme demir ya da galvanizli borularını taşıyor.",
    yapiStogu:
      "Moda'da apartmanların büyük kısmı 50-90 yıllık. Bu binalarda pis su hatları dökme demir, temiz su hatları ise galvanizli boru. İkisi de zamanla içeriden korozyona uğrayıp daralıyor; tıkanıklık ve sızıntı bu yüzden sık tekrarlıyor. Dar sokaklar ve asansörsüz binalar nedeniyle ekipmanı elle taşımamız gerekiyor — bunu randevu planlamasında hesaba katıyoruz.",
    sikSorunlar: [
      {
        baslik: "Korozyona uğramış dökme demir borular",
        aciklama:
          "İç yüzeyi pas ve kireçle daralan hatlarda tıkanıklık sürekli tekrar eder. Rothenberger makinemizle açıyor, borunun durumunu kamerayla değerlendirip değişim gerekiyorsa açıkça söylüyoruz.",
      },
      {
        baslik: "Katlar arası sızıntı",
        aciklama:
          "Eski binalarda alt komşuya su geçmesi en sık gelen şikâyet. Termal kamerayla kaçağın hangi daireden ve hangi hattan geldiğini duvarı kırmadan belirliyoruz.",
      },
      {
        baslik: "Eski tip sifon ve rezervuarlar",
        aciklama:
          "Yedek parçası bulunmayan eski sifonları modern muadilleriyle değiştiriyor, gerekirse tesisatı yeni bağlantıya uyarlıyoruz.",
      },
    ],
    civar: ["Moda Caddesi", "Bahariye", "Moda Sahili", "Damga Sokak", "Mühürdar", "Kadıköy İskele"],
    varisSuresi: "15-25 dakika",
  },
  {
    id: "caddebostan",
    name: "Caddebostan",
    slug: "/hizmet-bolgeleri/caddebostan",
    metaTitle: "Caddebostan Tesisatçı",
    metaDescription:
      "Caddebostan'da 7/24 tesisatçı. Site tesisatı, bahçe sulama hattı, kırmadan su kaçağı tespiti ve tıkanıklık açma. Hemen arayın: 0531 865 38 02",
    intro:
      "Caddebostan, Bağdat Caddesi hattında yer alan, büyük ölçüde yenilenmiş bir bölge. Burada iş genellikle eski boru değil; site altyapısı, bahçe hatları ve pahalı iç mekân kaplamaları üzerine dönüyor.",
    yapiStogu:
      "Caddebostan'daki binaların çoğu son 20-25 yılda yenilendi. Tesisat PPR ve pik boru; malzeme kalitesi iyi. Buna karşılık daireler mermer, parke ve özel kaplamalarla bitirilmiş durumda — bir kaçağı bulmak için zemini kırmak çok pahalıya patlıyor. Bu yüzden burada termal kamerayla kırmadan tespit neredeyse standart yöntemimiz.",
    sikSorunlar: [
      {
        baslik: "Yerden ısıtma hattında kaçak",
        aciklama:
          "Şap altındaki hatlarda oluşan kaçakları termal kamerayla santimetrik olarak işaretliyoruz. Böylece sadece o nokta açılıyor, tüm zemin kırılmıyor.",
      },
      {
        baslik: "Bahçe ve otopark sulama hatları",
        aciklama:
          "Site bahçelerindeki gizli kaçaklar su faturasına yansıyana kadar fark edilmiyor. Hattı basınç testi ve termal kamerayla tarayıp kaçak noktasını buluyoruz.",
      },
      {
        baslik: "Ortak kolon hatlarında tıkanıklık",
        aciklama:
          "Çok katlı sitelerde ana kolonun tıkanması birden fazla daireyi etkiliyor. Rothenberger makinemizle kolonu boydan boya açıyoruz.",
      },
    ],
    civar: ["Bağdat Caddesi", "Caddebostan Sahili", "Çiftehavuzlar", "Erenköy sınırı", "CKM çevresi"],
    varisSuresi: "20-30 dakika",
  },
  {
    id: "bostanci",
    name: "Bostancı",
    slug: "/hizmet-bolgeleri/bostanci",
    metaTitle: "Bostancı Tesisatçı",
    metaDescription:
      "Bostancı'da 7/24 tesisatçı. Ana gider hattı açma, bodrum su basması, tıkanıklık açma ve su kaçağı tespiti. Hemen arayın: 0531 865 38 02",
    intro:
      "Bostancı, sahil ile E-5 arasında uzanan, eski ve yeni yapının iç içe geçtiği yoğun bir bölge. Burada en çok ana gider hatları ve bodrum katlarıyla ilgili iş alıyoruz.",
    yapiStogu:
      "Bostancı'da 1980'ler yapısı apartmanlarla son yılların yüksek blokları yan yana. Bina yoğunluğu fazla olduğu için ana kanal hatları ağır yük taşıyor. Sahile yakın kesimlerde taban suyu yüksek; bodrum katlarda rutubet ve su basması sık görülüyor.",
    sikSorunlar: [
      {
        baslik: "Ana gider ve kanal tıkanıklığı",
        aciklama:
          "Yoğun kullanılan ana hatlarda yağ ve atık birikimi tekrar eden tıkanıklığa yol açıyor. Profesyonel makinemizle hattı komple temizliyoruz.",
      },
      {
        baslik: "Bodrum katta su basması",
        aciklama:
          "Geri tepen kanal suyu ve taban suyu kaynaklı su basmalarında hattı açıyor, çek valf gerekiyorsa öneriyoruz.",
      },
      {
        baslik: "Kolon hattı sızıntısı",
        aciklama:
          "Yaşlanmış kolon hatlarındaki sızıntıları kırmadan tespit edip, sadece sorunlu bölümü değiştiriyoruz.",
      },
    ],
    civar: ["Bostancı İskele", "Bostancı Sahili", "Emin Ali Paşa Caddesi", "Marina çevresi", "E-5 hattı"],
    varisSuresi: "20-30 dakika",
  },
  {
    id: "goztepe",
    name: "Göztepe",
    slug: "/hizmet-bolgeleri/goztepe",
    metaTitle: "Göztepe Tesisatçı",
    metaDescription:
      "Göztepe'de 7/24 tesisatçı. Müstakil ev ve apartman tesisatı, bahçe sulama, tıkanıklık açma, su kaçağı tespiti. Hemen arayın: 0531 865 38 02",
    intro:
      "Göztepe, bahçeli eski köşklerle yeni apartmanların bir arada bulunduğu bir bölge. Bu karışık yapı, tesisat işlerinin de çok çeşitli olmasına yol açıyor.",
    yapiStogu:
      "Göztepe'de bir sokakta 70 yıllık bahçeli bir ev, yanındaki sokakta 5 yıllık bir blok olabiliyor. Eski yapılarda bahçeden geçen gömülü hatlar ve tek katlı ısıtma tesisatı; yeni yapılarda ise standart PPR tesisat görüyoruz. Bahçeli evlerde kaçak çoğu zaman toprak altındaki hatta oluyor.",
    sikSorunlar: [
      {
        baslik: "Bahçe altındaki gömülü hatlarda kaçak",
        aciklama:
          "Toprak altındaki su hatlarında oluşan kaçaklar uzun süre fark edilmiyor. Termal kamera ve dinleme cihazıyla kazı yapmadan noktayı belirliyoruz.",
      },
      {
        baslik: "Eski petek ve ısıtma tesisatı",
        aciklama:
          "Yıllanmış petek hatlarını temizliyor, gerekiyorsa petek değişimi ve yeni hat döşeme yapıyoruz.",
      },
      {
        baslik: "Bahçe ve dış musluk hatları",
        aciklama:
          "Kışın donup patlayan dış musluk ve bahçe hatlarını onarıyor, yalıtım önerileri sunuyoruz.",
      },
    ],
    civar: ["Göztepe Parkı", "60. Ada", "Tütüncü Mehmet Efendi Caddesi", "Bağdat Caddesi hattı", "Göztepe İstasyonu"],
    varisSuresi: "15-25 dakika",
  },
  {
    id: "kozyatagi",
    name: "Kozyatağı",
    slug: "/hizmet-bolgeleri/kozyatagi",
    metaTitle: "Kozyatağı Tesisatçı",
    metaDescription:
      "Kozyatağı'nda 7/24 tesisatçı. Site ve ofis tesisatı, yerden ısıtma kaçağı, tıkanıklık açma, kırmadan kaçak tespiti. Hemen arayın: 0531 865 38 02",
    intro:
      "Kozyatağı, plazalar ve büyük konut siteleriyle Kadıköy'ün en modern yapı stoğuna sahip bölgelerinden. Burada iş genellikle site altyapısı ve ticari mekânlar üzerine.",
    yapiStogu:
      "Kozyatağı'nda yüksek katlı siteler ve ofis binaları ağırlıkta. Tesisat yeni ve kaliteli, ancak sistemler karmaşık: kat kaloriferi, yerden ısıtma, ortak hidrofor ve merkezî sıcak su hatları bir arada. Bu tür yapılarda sorun genelde tek dairede değil, sistemin bütününde oluyor — teşhis doğru yapılmazsa yanlış yer açılıyor.",
    sikSorunlar: [
      {
        baslik: "Yerden ısıtma kaçağı",
        aciklama:
          "Şap altındaki ısıtma hatlarındaki kaçakları termal kamerayla tespit ediyoruz; tüm zemini kırmadan sadece kaçak noktası açılıyor.",
      },
      {
        baslik: "Ofis ve dükkân tesisatı",
        aciklama:
          "Ticari mekânlarda mesai dışı çalışıyoruz; işinizi aksatmadan tıkanıklık açma, tadilat ve montaj yapıyoruz.",
      },
      {
        baslik: "Hidrofor ve basınç sorunları",
        aciklama:
          "Üst katlarda su basıncının düşmesi, hidrofor arızası ya da hat tıkanıklığından kaynaklanır. Sistemi kontrol edip kaynağı buluyoruz.",
      },
    ],
    civar: ["Kozyatağı Metro", "Buyaka çevresi", "Değirmen Sokak", "Şaşmaz Plaza hattı", "İnönü Caddesi"],
    varisSuresi: "20-30 dakika",
  },
  {
    id: "suadiye",
    name: "Suadiye",
    slug: "/hizmet-bolgeleri/suadiye",
    metaTitle: "Suadiye Tesisatçı",
    metaDescription:
      "Suadiye'de 7/24 tesisatçı. Villa ve lüks daire tesisatı, kırmadan su kaçağı tespiti, tıkanıklık açma. Hemen arayın: 0531 865 38 02",
    intro:
      "Suadiye, Bağdat Caddesi'nin sahil ucunda yer alan, villa ve lüks konut yoğunluklu bir bölge. Buradaki işlerde en kritik konu, pahalı iç mekânlara zarar vermeden çalışmak.",
    yapiStogu:
      "Suadiye'de müstakil villalar, az katlı butik apartmanlar ve yenilenmiş lüks daireler ağırlıkta. Doğal taş zeminler, özel ahşap parkeler ve ithal armatürler yaygın. Bu tür mekânlarda klasik yöntemle kaçak aramak, kaçağın kendisinden pahalıya mal oluyor — bu yüzden burada neredeyse her işe termal kamerayla başlıyoruz.",
    sikSorunlar: [
      {
        baslik: "Mermer ve doğal taş zeminde kaçak",
        aciklama:
          "Kaçağı termal kamerayla milimetrik olarak işaretliyoruz. Kaplamanın tamamı yerine yalnızca gereken parça sökülüyor.",
      },
      {
        baslik: "Villa bahçe ve havuz hatları",
        aciklama:
          "Bahçe sulama, havuz besleme ve tahliye hatlarındaki kaçakları kazı yapmadan tespit ediyoruz.",
      },
      {
        baslik: "İthal armatür tamir ve montajı",
        aciklama:
          "Özel marka batarya, duş sistemi ve gömme rezervuarlarda parça değişimi ve montaj yapıyoruz.",
      },
    ],
    civar: ["Bağdat Caddesi", "Suadiye Sahili", "Plajyolu", "Şaşkınbakkal", "Suadiye Camii çevresi"],
    varisSuresi: "20-30 dakika",
  },
  {
    id: "caferaga",
    name: "Caferağa",
    slug: "/hizmet-bolgeleri/caferaga",
    metaTitle: "Caferağa Tesisatçı",
    metaDescription:
      "Caferağa'da 7/24 tesisatçı. Kafe ve restoran mutfak gideri, yağ tıkanıklığı, eski bina tesisatı ve su kaçağı tespiti. Hemen arayın: 0531 865 38 02",
    intro:
      "Caferağa, Kadıköy çarşısını ve Bahariye hattını kapsayan ilçenin kalbi. Burada konutla iş yeri iç içe geçtiği için tesisat sorunları da ikiye ayrılıyor: yıpranmış apartman hatları ve yoğun kullanılan ticari mutfaklar.",
    yapiStogu:
      "Caferağa'da alt katları kafe, restoran ve dükkân olan apartmanlar çok yaygın. Ticari mutfaklardan gelen yağ, gider hattında soğuyup katılaşıyor ve zamanla boruyu tıkıyor — bu, konut binalarında görülmeyen bir sorun. Üst katlardaki daireler ise çoğunlukla 40-70 yıllık ve orijinal tesisatını taşıyor. Çarşı içindeki yaya sokaklarına araçla giremediğimiz için ekipmanı en yakın noktadan elle taşıyoruz.",
    sikSorunlar: [
      {
        baslik: "Ticari mutfak yağ tıkanıklığı",
        aciklama:
          "Restoran ve kafe giderlerinde biriken katı yağ, ev tipi yöntemlerle açılmıyor. Rothenberger makinemizle hattı boydan boya temizliyor, tekrar tıkanmaması için yağ tutucu önerisi sunuyoruz.",
      },
      {
        baslik: "İşletmeyi kapatmadan müdahale",
        aciklama:
          "Dükkân ve restoranlarda mesai dışı, sabah erken veya gece geç saatlerde çalışıyoruz. İşinizi aksatmadan sorunu çözüyoruz.",
      },
      {
        baslik: "Dükkân üstü dairelere su geçmesi",
        aciklama:
          "Ticari alanla konut arasındaki sızıntılarda kaynağı termal kamerayla belirliyor, kimin hattından geldiğini net şekilde raporluyoruz.",
      },
    ],
    civar: ["Kadıköy Çarşı", "Bahariye Caddesi", "Yeldeğirmeni", "Moda Caddesi", "Rıhtım", "Söğütlüçeşme"],
    varisSuresi: "15-25 dakika",
  },
  {
    id: "erenkoy",
    name: "Erenköy",
    slug: "/hizmet-bolgeleri/erenkoy",
    metaTitle: "Erenköy Tesisatçı",
    metaDescription:
      "Erenköy'de 7/24 tesisatçı. Kentsel dönüşüm tesisatı, eski galvanizli boru değişimi, tıkanıklık açma ve kaçak tespiti. Hemen arayın: 0531 865 38 02",
    intro:
      "Erenköy, Bağdat Caddesi hattının iç kesiminde kalan, kentsel dönüşümün en yoğun yaşandığı bölgelerden biri. Bir sokakta yeni bitmiş bir bina, yanında yıkımı bekleyen 50 yıllık bir apartman görebilirsiniz.",
    yapiStogu:
      "Erenköy'de yapı stoğu ikiye bölünmüş durumda. Henüz dönüşmemiş 1960-1980 yapısı apartmanlarda galvanizli su hatları hâlâ kullanımda; bu borular içeriden daralıp hem basınç düşürüyor hem de pas yapıyor. Yeni yapılan binalarda ise sorun farklı: inşaat sırasında yapılan hatalı bağlantılar ve tıkanmış hatlar teslimden kısa süre sonra ortaya çıkıyor.",
    sikSorunlar: [
      {
        baslik: "Galvanizli boru daralması ve düşük basınç",
        aciklama:
          "Yıllanmış galvanizli hatlarda su akışı gözle görülür şekilde azalır. Hattı kontrol ediyor, gerekiyorsa PPR boru ile değişim yapıyoruz.",
      },
      {
        baslik: "Yeni binada inşaat kaynaklı tıkanıklık",
        aciklama:
          "İnşaat artığı, harç ve moloz gider hattında kalabiliyor. Yeni taşınılan dairelerdeki bu tıkanıklıkları makineyle temizliyoruz.",
      },
      {
        baslik: "Komple daire tesisat yenileme",
        aciklama:
          "Tadilat sırasında banyo ve mutfak tesisatının tamamını yeniliyor, kolon bağlantılarını standarda uygun yapıyoruz.",
      },
    ],
    civar: ["Bağdat Caddesi", "Erenköy İstasyonu", "Ethem Efendi Caddesi", "Sahrayıcedit sınırı", "Şemsettin Günaltay Caddesi"],
    varisSuresi: "20-30 dakika",
  },
  {
    id: "acibadem",
    name: "Acıbadem",
    slug: "/hizmet-bolgeleri/acibadem",
    metaTitle: "Acıbadem Tesisatçı",
    metaDescription:
      "Acıbadem'de 7/24 tesisatçı. Su basıncı ve hidrofor sorunları, tıkanıklık açma, kiralık daire tesisat tamiri. Hemen arayın: 0531 865 38 02",
    intro:
      "Acıbadem, eğimli araziye kurulu, yoğun apartmanlaşmış bir bölge. Hastane çevresinde kiralık daire dolaşımı yüksek. Buradaki işlerin ayırt edici yanı, arazi eğiminden kaynaklanan su basıncı sorunları.",
    yapiStogu:
      "Acıbadem yamaç üzerine kurulu; üst kotlardaki binalarda şebeke basıncı tek başına yetmiyor, hidrofor sistemleri yaygın olarak kullanılıyor. Bina stoğu ağırlıklı olarak 1970-1990 arası. Hastane çevresindeki dairelerde kiracı değişimi sık olduğu için tesisat, sürekli kullanılan ama düzenli bakımı yapılmayan bir yapıda; küçük arızalar birikip büyüyor.",
    sikSorunlar: [
      {
        baslik: "Düşük su basıncı ve hidrofor arızası",
        aciklama:
          "Üst katlarda akmayan su çoğu zaman hidrofor arızası, basınç ayarı ya da hat tıkanıklığından kaynaklanır. Sistemi baştan sona kontrol edip asıl nedeni buluyoruz.",
      },
      {
        baslik: "Kiracı değişiminde hızlı tesisat tamiri",
        aciklama:
          "Daire teslimi öncesi batarya, sifon, gider ve musluk kontrolünü tek seferde yapıyor, aynı gün teslim ediyoruz.",
      },
      {
        baslik: "Bakımsız kalmış hatlarda tıkanıklık",
        aciklama:
          "Uzun süre bakım görmemiş gider hatlarındaki birikintileri profesyonel makineyle temizliyoruz.",
      },
    ],
    civar: ["Acıbadem Caddesi", "Acıbadem Hastanesi çevresi", "Koşuyolu sınırı", "Tekin Sokak", "Uzunçayır"],
    varisSuresi: "15-25 dakika",
  },
  {
    id: "egitim",
    name: "Eğitim Mahallesi",
    resmiAd: "Eğitim",
    slug: "/hizmet-bolgeleri/egitim",
    metaTitle: "Eğitim Mahallesi Tesisatçı",
    metaDescription:
      "Eğitim Mahallesi'nde 7/24 tesisatçı. Apartman kolon hattı tıkanıklığı, eski tesisat yenileme, su kaçağı tespiti. Hemen arayın: 0531 865 38 02",
    intro:
      "Eğitim Mahallesi, Söğütlüçeşme ile Fikirtepe arasında kalan, yoğun apartman dokusuna sahip bir bölge. Binaların birbirine yakınlığı ve ortak hatların çokluğu, buradaki tesisat işlerinin karakterini belirliyor.",
    yapiStogu:
      "Eğitim Mahallesi'ndeki binaların büyük bölümü 1970-1990 arası yapıldı ve çoğu hâlâ orijinal tesisatını kullanıyor. Bu dönemin apartmanlarında daireler tek bir kolon hattına bağlı; bir dairedeki tıkanıklık kısa sürede alt ve üst katları da etkiliyor. Bu yüzden burada müdahaleyi tek daireyle sınırlı tutmak yerine kolonun tamamını kontrol ediyoruz. Mahalle ayrıca Fikirtepe dönüşüm sahasına komşu; çevredeki inşaat çalışmaları sırasında yaşanan su kesintileri ve hat basıncı dalgalanmaları da sık karşılaştığımız durumlar.",
    sikSorunlar: [
      {
        baslik: "Ortak kolon hattı tıkanıklığı",
        aciklama:
          "Birden fazla daireyi aynı anda etkileyen kolon tıkanıklıklarında hattı boydan boya açıyoruz. Tek daireye müdahale çoğu zaman sorunu birkaç hafta sonra geri getiriyor.",
      },
      {
        baslik: "Orijinal tesisatın yaşlanması",
        aciklama:
          "40-50 yıllık hatlarda pas, kireç ve daralma birikiyor. Boruyu kontrol edip değişim gerekip gerekmediğini net şekilde söylüyoruz; gereksiz iş çıkarmıyoruz.",
      },
      {
        baslik: "Su kesintisi sonrası basınç ve tortu sorunu",
        aciklama:
          "Çevredeki inşaat kaynaklı kesintilerden sonra hatta giren tortu musluk ve süzgeçleri tıkayabiliyor. Temizlik ve filtre değişimini yerinde yapıyoruz.",
      },
    ],
    civar: ["Fahrettin Kerim Gökay Caddesi", "Söğütlüçeşme", "Uzunçayır", "Fikirtepe sınırı", "Hasanpaşa sınırı"],
    varisSuresi: "15-25 dakika",
  },
];

export function getMahalle(id: string): Mahalle | undefined {
  return ONE_CIKAN_MAHALLELER.find((m) => m.id === id);
}

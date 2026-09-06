import Link from "next/link";
import { SITE_CONFIG, SERVICES} from "@/lib/constants";
import { ONE_CIKAN_MAHALLELER } from "@/lib/mahalleler";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div>
            <Logo size={48} idPrefix="ftr" theme="dark" showTagline className="mb-4" />
            <p className="text-sm leading-relaxed mb-4">
              2010 yılından bu yana Kadıköy&apos;de profesyonel tesisat hizmeti vermekteyiz.
              Rothenberger makine ve termal kamera ile kaliteli çözümler sunuyoruz.
            </p>
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="hover:text-white transition-colors">{SITE_CONFIG.phoneFormatted}</a>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L.05 23.5l5.793-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.63-.5-5.145-1.377l-.365-.218-3.79.948.99-3.637-.24-.38A9.7 9.7 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp ile Yazın</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={s.slug} className="hover:text-white transition-colors text-sm">{s.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/sss" className="hover:text-white transition-colors text-sm">Sıkça Sorulan Sorular</Link>
              </li>
            </ul>
          </div>

          {/* Districts */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Hizmet Bölgeleri</h3>
            <ul className="space-y-2">
              {ONE_CIKAN_MAHALLELER.map((d) => (
                <li key={d.id}>
                  <Link href={d.slug} className="hover:text-white transition-colors text-sm">{d.name} Tesisatçı</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li><Link href="/hakkimizda" className="hover:text-white transition-colors text-sm">Hakkımızda</Link></li>
              <li><Link href="/galeri" className="hover:text-white transition-colors text-sm">Galeri</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition-colors text-sm">İletişim</Link></li>
            </ul>

            <h3 className="text-white font-bold text-lg mt-6 mb-3">Çalışma Saatleri</h3>
            <p className="text-sm">
              <span className="text-secondary font-bold">7/24 Açık</span><br />
              Hafta içi, hafta sonu ve resmi tatillerde hizmetinizdeyiz.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Kadıköy Acil Tesisat. Tüm hakları saklıdır.</p>
          <p className="mt-2 sm:mt-0">Kadıköy Tesisat Hizmetleri</p>
        </div>
      </div>
    </footer>
  );
}

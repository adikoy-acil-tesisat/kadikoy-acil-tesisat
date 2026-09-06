import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-lg mx-auto px-4 text-center py-20">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Sayfa Bulunamadı</h1>
        <p className="text-gray-600 mb-8">
          Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Tesisat hizmeti için bizi hemen arayabilirsiniz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors">
            Ana Sayfaya Dön
          </Link>
          <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
            Hemen Ara: {SITE_CONFIG.phoneFormatted}
          </a>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <Link href="/hizmetlerimiz/tikaniklik-acma" className="bg-white rounded-lg p-3 text-gray-700 hover:text-primary border hover:border-primary transition-colors">Tıkanıklık Açma</Link>
          <Link href="/hizmetlerimiz/su-kacagi-tespiti" className="bg-white rounded-lg p-3 text-gray-700 hover:text-primary border hover:border-primary transition-colors">Su Kaçağı Tespiti</Link>
          <Link href="/iletisim" className="bg-white rounded-lg p-3 text-gray-700 hover:text-primary border hover:border-primary transition-colors">İletişim</Link>
          <Link href="/blog" className="bg-white rounded-lg p-3 text-gray-700 hover:text-primary border hover:border-primary transition-colors">Blog</Link>
        </div>
      </div>
    </section>
  );
}

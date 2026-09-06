"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_CONFIG, SERVICES} from "@/lib/constants";
import { ONE_CIKAN_MAHALLELER } from "@/lib/mahalleler";
import Logo from "@/components/Logo";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [districtsOpen, setDistrictsOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="hidden sm:inline">7/24 Acil Tesisat Hizmeti | Kadıköy</span>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="flex items-center gap-1 hover:text-secondary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              {SITE_CONFIG.phoneFormatted}
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-green-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L.05 23.5l5.793-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.63-.5-5.145-1.377l-.365-.218-3.79.948.99-3.637-.24-.38A9.7 9.7 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" aria-label="Kadıköy Acil Tesisat ana sayfa">
              <Logo size={42} idPrefix="hdr" showTagline />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors">Ana Sayfa</Link>

              {/* Services dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center gap-1">
                  Hizmetlerimiz
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
                  {SERVICES.map((s) => (
                    <Link key={s.id} href={s.slug} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      {s.icon} {s.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Districts dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center gap-1">
                  Hizmet Bölgeleri
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
                  {ONE_CIKAN_MAHALLELER.map((d) => (
                    <Link key={d.id} href={d.slug} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors">
                      📍 {d.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/hakkimizda" className="text-gray-700 hover:text-primary font-medium transition-colors">Hakkımızda</Link>
              <Link href="/galeri" className="text-gray-700 hover:text-primary font-medium transition-colors">Galeri</Link>
              <Link href="/blog" className="text-gray-700 hover:text-primary font-medium transition-colors">Blog</Link>
              <Link href="/iletisim" className="text-gray-700 hover:text-primary font-medium transition-colors">İletişim</Link>
            </nav>

            {/* CTA Button */}
            <a
              href={`tel:${SITE_CONFIG.phoneIntl}`}
              className="hidden md:flex items-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-2 px-5 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              Hemen Ara
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-gray-700"
              aria-label="Menü"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-1">
              <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Ana Sayfa</Link>

              <button onClick={() => setServicesOpen(!servicesOpen)} className="flex justify-between items-center w-full py-2 text-gray-700 font-medium">
                Hizmetlerimiz
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {servicesOpen && (
                <div className="pl-4 space-y-1">
                  {SERVICES.map((s) => (
                    <Link key={s.id} href={s.slug} onClick={() => setMenuOpen(false)} className="block py-1.5 text-gray-600">{s.icon} {s.title}</Link>
                  ))}
                </div>
              )}

              <button onClick={() => setDistrictsOpen(!districtsOpen)} className="flex justify-between items-center w-full py-2 text-gray-700 font-medium">
                Hizmet Bölgeleri
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${districtsOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {districtsOpen && (
                <div className="pl-4 space-y-1">
                  {ONE_CIKAN_MAHALLELER.map((d) => (
                    <Link key={d.id} href={d.slug} onClick={() => setMenuOpen(false)} className="block py-1.5 text-gray-600">📍 {d.name}</Link>
                  ))}
                </div>
              )}

              <Link href="/hakkimizda" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Hakkımızda</Link>
              <Link href="/galeri" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Galeri</Link>
              <Link href="/blog" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">Blog</Link>
              <Link href="/iletisim" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-700 font-medium">İletişim</Link>

              <a
                href={`tel:${SITE_CONFIG.phoneIntl}`}
                className="flex items-center justify-center gap-2 bg-secondary text-white font-bold py-3 px-5 rounded-full mt-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                Hemen Ara
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

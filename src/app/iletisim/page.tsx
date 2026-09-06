"use client";

import { useState, type FormEvent } from "react";
import { SITE_CONFIG} from "@/lib/constants";
import { KADIKOY_MAHALLELERI } from "@/lib/mahalleler";

export default function IletisimPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    const whatsappText = `Merhaba, ben ${name}. Telefon: ${phone}. ${message}`;
    window.open(
      `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(whatsappText)}`,
      "_blank"
    );
    setSubmitted(true);
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">İletişim</h1>
          <p className="text-lg text-blue-100">Bize ulaşmak çok kolay. Telefon, WhatsApp veya form ile iletişime geçin.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-8">İletişim Bilgileri</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Telefon</h3>
                    <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="text-primary text-lg font-semibold hover:underline">
                      {SITE_CONFIG.phoneFormatted}
                    </a>
                    <p className="text-gray-500 text-sm">7/24 Arayabilirsiniz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L.05 23.5l5.793-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">WhatsApp</h3>
                    <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-lg font-semibold hover:underline">
                      {SITE_CONFIG.phoneFormatted}
                    </a>
                    <p className="text-gray-500 text-sm">Mesaj gönderin, hemen dönelim</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Hizmet Bölgeleri</h3>
                    <p className="text-gray-600">{KADIKOY_MAHALLELERI.join(", ")}</p>
                    <p className="text-gray-500 text-sm">Kadıköy, İstanbul</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Çalışma Saatleri</h3>
                    <p className="text-secondary font-bold text-lg">7/24 Açık</p>
                    <p className="text-gray-500 text-sm">Hafta sonu ve resmi tatiller dahil</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Bize Yazın</h2>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <span className="text-4xl mb-4 block">&#10003;</span>
                  <h3 className="text-xl font-bold text-green-700 mb-2">Mesajınız WhatsApp&apos;a Yönlendirildi!</h3>
                  <p className="text-gray-600">En kısa sürede size dönüş yapacağız.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                    <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors" placeholder="Adınız Soyadınız" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors" placeholder="05XX XXX XX XX" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                    <textarea id="message" name="message" rows={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none" placeholder="Tesisat sorununuzu kısaca açıklayın..." />
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    WhatsApp ile Gönder
                  </button>
                  <p className="text-sm text-gray-500 text-center">
                    Form, mesajınızı WhatsApp üzerinden bize iletir.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Hizmet Bölgemiz</h2>
          <div className="rounded-xl overflow-hidden shadow-md h-96">
            <iframe
              src={SITE_CONFIG.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kadıköy Acil Tesisat Hizmet Bölgesi"
            />
          </div>
        </div>
      </section>
    </>
  );
}

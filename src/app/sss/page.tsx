import type { Metadata } from "next";
import { SITE_CONFIG, FAQ_ITEMS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular (SSS)",
  description: "Kadıköy Acil Tesisat hakkında sıkça sorulan sorular. Tıkanıklık açma, su kaçağı tespiti, fiyatlar, hizmet bölgeleri ve daha fazlası.",
};

export default function SSSPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Sıkça Sorulan Sorular</h1>
          <p className="text-lg text-blue-100">Merak ettiğiniz tüm soruların yanıtları burada.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="bg-gray-50 rounded-xl group" open={i === 0}>
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900 hover:text-primary transition-colors">
                  {item.question}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Sorunuz mu Var?</h2>
          <p className="text-gray-600 mb-6">Burada yanıt bulamadıysanız bizi doğrudan arayabilirsiniz.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${SITE_CONFIG.phoneIntl}`} className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors">
              {SITE_CONFIG.phoneFormatted}
            </a>
            <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-full transition-colors">
              WhatsApp ile Sorun
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

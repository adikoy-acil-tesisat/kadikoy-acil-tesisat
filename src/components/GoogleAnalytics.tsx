"use client";

import Script from "next/script";
import { CEREZ_ANAHTARI } from "@/lib/cerez";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Google Analytics 4.
 *
 * NEXT_PUBLIC_GA_ID tanımlı değilse hiçbir şey yüklenmez; geliştirme
 * ortamında ve kimlik girilmeden önce site temiz kalır.
 *
 * İzin (Consent Mode v2): ölçüm varsayılan olarak `denied` başlar. O hâldeyken
 * Google çerez yazmaz, yalnızca kimliksiz sinyal gönderir. Ziyaretçi çerez
 * bildirimindeki "Kabul Et"e basınca izin `granted` olur. KVKK açısından
 * doğrusu bu: onay alınmadan çerezle takip yapılmıyor.
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });

          // Daha önce onay verdiyse sayfa açılışında izni yükselt
          try {
            if (localStorage.getItem('${CEREZ_ANAHTARI}') === 'accepted') {
              gtag('consent', 'update', { analytics_storage: 'granted' });
            }
          } catch (e) {}

          gtag('js', new Date());
          gtag('config', '${GA_ID}');

          /*
           * Asıl önemli ölçüm bu. Bu işte dönüşüm "sayfada geçirilen süre"
           * değil, telefonun çalması. Hangi sayfadan arandığını bilmek,
           * hangi sayfaya emek harcanacağını söyler.
           */
          document.addEventListener('click', function(e) {
            var link = e.target.closest('a');
            if (!link) return;
            var href = link.getAttribute('href') || '';
            if (href.startsWith('tel:')) {
              gtag('event', 'phone_call', {
                event_category: 'contact',
                event_label: location.pathname
              });
            }
            if (href.includes('wa.me')) {
              gtag('event', 'whatsapp_click', {
                event_category: 'contact',
                event_label: location.pathname
              });
            }
          });
        `}
      </Script>
    </>
  );
}

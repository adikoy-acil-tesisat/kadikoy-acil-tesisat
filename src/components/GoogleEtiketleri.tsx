"use client";

import Script from "next/script";
import { CEREZ_ANAHTARI, GOOGLE_ADS_ID } from "@/lib/cerez";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Google ölçüm etiketleri — Analytics ve Ads tek gtag üzerinden.
 *
 * Google her ürün için ayrı bir kod parçası veriyor; ikisini de sayfaya
 * yapıştırmak gtag'ı iki kez yükler ve her ziyaret çift sayılır. Doğrusu tek
 * yükleyip her kimliği ayrı `config` ile tanıtmak.
 *
 * İzin (Consent Mode v2): ölçüm `denied` başlar, o hâldeyken Google çerez
 * yazmaz. Ziyaretçi çerez bildiriminde "Kabul Et"e basınca izin yükselir.
 * KVKK ve AEA kuralları açısından doğrusu budur.
 */
export default function GoogleEtiketleri() {
  const kimlikler = [GA_ID, GOOGLE_ADS_ID].filter(Boolean) as string[];
  if (kimlikler.length === 0) return null;

  // gtag.js tek bir kimlikle yüklenir, diğerleri config ile eklenir
  const yukleyici = kimlikler[0];

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${yukleyici}`}
        strategy="afterInteractive"
      />
      <Script id="google-etiketleri" strategy="afterInteractive">
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

          try {
            if (localStorage.getItem('${CEREZ_ANAHTARI}') === 'accepted') {
              gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
            }
          } catch (e) {}

          gtag('js', new Date());
          ${kimlikler.map((k) => `gtag('config', '${k}');`).join("\n          ")}

          /*
           * Asıl ölçüm bu. Bu işte dönüşüm "sayfada geçirilen süre" değil,
           * telefonun çalması. Hangi sayfadan arandığını bilmek, hangi sayfaya
           * emek harcanacağını söyler.
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

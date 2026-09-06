"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
          gtag('js', new Date());
          gtag('config', '${GA_ID}');

          // Telefon tıklama takibi
          document.addEventListener('click', function(e) {
            var link = e.target.closest('a');
            if (!link) return;
            var href = link.getAttribute('href') || '';
            if (href.startsWith('tel:')) {
              gtag('event', 'phone_call', {
                event_category: 'contact',
                event_label: href
              });
            }
            if (href.includes('wa.me')) {
              gtag('event', 'whatsapp_click', {
                event_category: 'contact',
                event_label: href
              });
            }
          });
        `}
      </Script>
    </>
  );
}

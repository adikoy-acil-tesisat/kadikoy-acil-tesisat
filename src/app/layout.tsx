import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileBottomBar from "@/components/MobileBottomBar";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SITE_CONFIG, SITE_URL} from "@/lib/constants";
import { KADIKOY_MAHALLELERI } from "@/lib/mahalleler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kadıköy Acil Tesisat | 7/24 Tıkanıklık Açma ve Su Kaçağı Tespiti",
    template: "%s | Kadıköy Acil Tesisat",
  },
  description:
    "Kadıköy'de 7/24 profesyonel tesisat hizmeti. Rothenberger makine ile tıkanıklık açma, termal kamera ile kırmadan su kaçağı tespiti. Moda, Caddebostan, Bostancı, Göztepe, Kozyatağı, Suadiye ve tüm Kadıköy. Hemen arayın: 0531 865 38 02",
  keywords: [
    "tesisatçı istanbul",
    "tıkanıklık açma",
    "su kaçağı tespiti",
    "kırmadan su kaçağı tespiti",
    "tesisatçı kadıköy",
    "tesisatçı üsküdar",
    "tesisatçı ümraniye",
    "tesisatçı maltepe",
    "tesisatçı ataşehir",
    "acil tesisatçı anadolu yakası",
    "rothenberger tıkanıklık açma",
    "termal kamera su kaçağı",
    "kanal açma istanbul",
    "gider açma",
    "7/24 tesisatçı",
  ],
  openGraph: {
    title: "Kadıköy Acil Tesisat | 7/24 Tıkanıklık Açma ve Su Kaçağı Tespiti",
    description:
      "Rothenberger makine ile tıkanıklık açma, termal kamera ile su kaçağı tespiti. 16 yıllık tecrübe. Hemen arayın!",
    url: SITE_URL,
    locale: "tr_TR",
    type: "website",
    siteName: "Kadıköy Acil Tesisat",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  name: SITE_CONFIG.name,
  telephone: SITE_CONFIG.phoneIntl,
  url: SITE_URL,
  image: `${SITE_URL}/logo.svg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "İstanbul",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  areaServed: KADIKOY_MAHALLELERI.map((m) => ({ "@type": "Place", name: `${m}, Kadıköy, İstanbul` })),
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  priceRange: "$$",
  foundingDate: String(SITE_CONFIG.since),
  description:
    "Kadıköy'de 2010'dan bu yana profesyonel tesisat hizmeti. Rothenberger makine ile tıkanıklık açma, termal kamera ile su kaçağı tespiti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GoogleAnalytics />
        <SiteChrome>
          <Header />
        </SiteChrome>
        <main className="flex-1">{children}</main>
        <SiteChrome>
          <Footer />
          <WhatsAppButton />
          <MobileBottomBar />
          <ScrollToTop />
          <CookieBanner />
        </SiteChrome>
      </body>
    </html>
  );
}

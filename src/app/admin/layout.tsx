import type { Metadata, Viewport } from "next";
import AdminShell from "@/components/AdminShell";

/**
 * Admin paneli, iPhone/Android ana ekranına eklendiğinde tam ekran bir uygulama
 * gibi açılsın diye PWA olarak yapılandırıldı. Bu ayarlar yalnızca /admin
 * altındaki sayfalara uygulanır; herkese açık site normal tarayıcı davranışını
 * korur (WhatsApp gibi dış bağlantılar Safari'de düzgün açılsın diye).
 */
export const metadata: Metadata = {
  title: "Yönetim Paneli",
  manifest: "/admin.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Tesisat Panel",
    statusBarStyle: "default",
  },
  // Panelin arama motorlarına düşmesini istemiyoruz
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1e40af",
  // iPhone'da çentik/ana ekran çubuğu alanlarını kullanabilmek için
  viewportFit: "cover",
  initialScale: 1,
  width: "device-width",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

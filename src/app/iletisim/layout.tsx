import type { Metadata } from "next";

export const metadata: Metadata = {
  // Root layout zaten "%s | Kadıköy Acil Tesisat" şablonunu uyguluyor;
  // burada tekrar yazılırsa başlık "İletişim | Kadıköy Acil Tesisat | Kadıköy Acil Tesisat" oluyordu.
  title: "İletişim",
  description: "Kadıköy Acil Tesisat ile iletişime geçin. Telefon: 0531 865 38 02. WhatsApp, form veya harita üzerinden bize ulaşın. 7/24 hizmet.",
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

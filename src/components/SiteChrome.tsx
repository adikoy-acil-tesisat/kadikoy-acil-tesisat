"use client";

import { usePathname } from "next/navigation";

/**
 * Genel site kabuğunu (header, footer, WhatsApp butonu, mobil alt bar...)
 * yalnızca herkese açık sayfalarda gösterir.
 *
 * Admin paneli de root layout'un içinde render edildiği için, bu olmadan
 * panelin üstünde site menüsü, altında ise WhatsApp butonu ve mobil alt bar
 * admin navigasyonunun üzerine biniyordu.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return <>{children}</>;
}

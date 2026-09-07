"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import VeritabaniUyarisi from "@/components/VeritabaniUyarisi";
import { LogoMark } from "@/components/Logo";

const navItems = [
  { href: "/admin", label: "Panel", icon: "home" },
  { href: "/admin/isler", label: "İşler", icon: "clipboard" },
  { href: "/admin/hizli", label: "", icon: "plus" },
  { href: "/admin/musteriler", label: "Müşteri", icon: "users" },
  { href: "/admin/finans", label: "Finans", icon: "wallet" },
];

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const cls = `h-6 w-6 ${active ? "text-blue-600" : "text-gray-500"}`;
  switch (icon) {
    case "home":
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "clipboard":
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>;
    case "plus":
      return (
        <div className="bg-blue-600 rounded-full p-3 -mt-5 shadow-lg shadow-blue-600/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </div>
      );
    case "users":
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "wallet":
      return <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>;
    default:
      return null;
  }
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Giriş sayfasında layout gösterme
  if (pathname === "/admin/giris") {
    return <>{children}</>;
  }

  return (
    // pb: alt navigasyon + iPhone ana ekran çubuğu (home indicator) payı
    <div className="min-h-screen bg-gray-50 pb-[calc(5rem+env(safe-area-inset-bottom))]">
      {/* Top header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size={30} idPrefix="adm" />
            <span className="font-bold text-gray-900">Kadıköy Acil Tesisat</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <Link href="/admin/ayarlar" className="p-2 text-gray-500 hover:text-gray-700" aria-label="Ayarlar">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </Link>
        </div>
      </header>

      <VeritabaniUyarisi />

      {/* Page content */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-7xl mx-auto flex items-end justify-around py-2">
          {navItems.map((item) => {
            const isActive = item.icon === "plus"
              ? false
              : item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href) && item.href !== "/admin";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center min-w-[64px] ${
                  item.icon === "plus" ? "" : "py-1"
                }`}
              >
                <NavIcon icon={item.icon} active={isActive} />
                {item.label && (
                  <span className={`text-xs mt-1 ${isActive ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AyarlarPage() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/giris");
    router.refresh();
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Ayarlar</h1>

      <div className="space-y-2">
        <Link href="/" className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 active:bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌐</span>
            <span className="font-medium text-gray-900">Web Siteyi Görüntüle</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </Link>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <p className="font-medium text-gray-900">Veritabanı</p>
              <p className="text-sm text-gray-500">Supabase PostgreSQL</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-xl">📱</span>
            <div>
              <p className="font-medium text-gray-900">Versiyon</p>
              <p className="text-sm text-gray-500">Kadıköy Acil Tesisat Admin v1.0</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 font-medium py-3.5 rounded-xl border border-red-100 mt-8"
      >
        Çıkış Yap
      </button>
    </div>
  );
}

"use client";

import { isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Supabase yapılandırılmamışken admin panelinin üstünde görünen uyarı.
 *
 * Bu olmadan panel normal görünüyor ama hiçbir kayıt kaydedilmiyordu; kullanıcı
 * sebebini ancak "Failed to fetch" hatasından tahmin edebiliyordu.
 */
export default function VeritabaniUyarisi() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <span className="text-lg leading-none mt-0.5" aria-hidden="true">
          ⚠️
        </span>
        <div className="text-sm">
          <p className="font-semibold text-amber-900">Veritabanı bağlı değil</p>
          <p className="text-amber-800 mt-0.5">
            İş ve müşteri kaydı yapılamaz, veriler görüntülenemez.{" "}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">.env.local</code> dosyasına
            Supabase adresinizi ve anon anahtarınızı girip sunucuyu yeniden başlatın.
          </p>
        </div>
      </div>
    </div>
  );
}

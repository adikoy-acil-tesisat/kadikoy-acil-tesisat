"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { vcardOlustur, vcardIndir } from "@/lib/vcard";
import { todayISO } from "@/lib/date";
import type { Musteri } from "@/lib/types";

export default function AyarlarPage() {
  const router = useRouter();
  const [aktariliyor, setAktariliyor] = useState(false);
  const [sonuc, setSonuc] = useState("");

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/giris");
    router.refresh();
  }

  async function rehbereAktar() {
    setAktariliyor(true);
    setSonuc("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("musteriler")
        .select("*")
        .order("ad", { ascending: true });

      if (error) {
        setSonuc("Müşteriler alınamadı. " + dbHataMesaji(error));
        return;
      }
      const musteriler = (data as Musteri[]) || [];
      if (musteriler.length === 0) {
        setSonuc("Aktarılacak müşteri yok.");
        return;
      }

      vcardIndir(vcardOlustur(musteriler), `musteriler-${todayISO()}.vcf`);
      setSonuc(`${musteriler.length} müşteri hazırlandı. Açılan dosyadan "Tümünü Ekle" deyin.`);
    } catch (e) {
      setSonuc(dbHataMesaji(e));
    } finally {
      setAktariliyor(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Ayarlar</h1>

      {/* Rehbere aktarma */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-xl">📇</span>
          <div>
            <p className="font-medium text-gray-900">Müşterileri Telefon Rehberine Aktar</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Aktardıktan sonra bir müşteri aradığında telefonun ekranında adı ve mahallesi görünür.
            </p>
          </div>
        </div>

        <button
          onClick={rehbereAktar}
          disabled={aktariliyor}
          className="w-full bg-blue-600 disabled:bg-blue-400 text-white font-medium py-3 rounded-xl text-sm"
        >
          {aktariliyor ? "Hazırlanıyor..." : "Rehber Dosyasını İndir"}
        </button>

        {sonuc && <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{sonuc}</p>}

        <details className="text-sm">
          <summary className="cursor-pointer text-blue-600 font-medium">Nasıl kullanılır?</summary>
          <div className="mt-2 text-gray-600 space-y-1.5 pl-1">
            <p><strong>iPhone:</strong> Dosya inince açın → &ldquo;Tüm Kişileri Ekle&rdquo; → Ekle.</p>
            <p><strong>Android:</strong> İndirilenler&apos;den dosyaya dokunun → Kişiler uygulamasıyla açın → İçe aktar.</p>
            <p className="text-gray-400">
              Yeni müşteri ekledikçe tekrar aktarın. Aynı numara ikinci kez eklenmez, telefon eşleştirir.
            </p>
          </div>
        </details>
      </div>

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
              <p className="text-sm text-gray-500">Kadıköy Acil Tesisat Admin v1.1</p>
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

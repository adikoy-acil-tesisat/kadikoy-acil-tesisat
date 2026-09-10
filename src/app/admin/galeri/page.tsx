"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { fotografYukle, fotografSil, type YuklemeHatasi } from "@/lib/foto";
import { HIZMET_TURLERI } from "@/lib/types";
import { KADIKOY_MAHALLELERI } from "@/lib/mahalleler";

interface Kayit {
  id: string;
  url: string;
  baslik: string;
  mahalle: string | null;
  kategori: string | null;
  siralama: number | null;
}

/**
 * Site galerisi yönetimi.
 *
 * Fotoğraflar iş kaydının içinden de yayınlanabiliyor; ama ekipman, araç ya da
 * tanıtım fotoğrafı gibi bir işe bağlı olmayan görseller için giriş noktası
 * yoktu. Burada doğrudan yükleyip yayınlıyorsun.
 */
export default function AdminGaleriPage() {
  const [kayitlar, setKayitlar] = useState<Kayit[]>([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState<{ mesaj: string; ham?: string } | null>(null);

  const [dosya, setDosya] = useState<File | null>(null);
  const [onizleme, setOnizleme] = useState("");
  const [baslik, setBaslik] = useState("");
  const [kategori, setKategori] = useState("tikaniklik_acma");
  const [mahalle, setMahalle] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const yukle = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("galeri")
        .select("id, url, baslik, mahalle, kategori, siralama")
        .order("siralama", { ascending: true })
        .order("olusturma_tarihi", { ascending: false });
      if (error) throw error;
      setKayitlar((data as Kayit[]) ?? []);
    } catch (e) {
      setHata({ mesaj: dbHataMesaji(e) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    yukle();
  }, [yukle]);

  // Seçilen dosyanın önizlemesi; bileşen kapanınca nesne adresini serbest bırak
  useEffect(() => {
    if (!dosya) {
      setOnizleme("");
      return;
    }
    const url = URL.createObjectURL(dosya);
    setOnizleme(url);
    return () => URL.revokeObjectURL(url);
  }, [dosya]);

  async function ekle() {
    if (!dosya) {
      setHata({ mesaj: "Önce bir fotoğraf seçin." });
      return;
    }
    if (!baslik.trim()) {
      setHata({ mesaj: "Fotoğrafa bir başlık yazın. Bu yazı sitede fotoğrafın altında görünür." });
      return;
    }

    setKaydediliyor(true);
    setHata(null);
    try {
      const url = await fotografYukle(dosya);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("galeri")
        .insert({
          url,
          baslik: baslik.trim(),
          mahalle: mahalle || null,
          kategori: HIZMET_TURLERI[kategori] ?? null,
          siralama: 0,
        })
        .select("id, url, baslik, mahalle, kategori, siralama")
        .single();
      if (error) throw error;

      setKayitlar((prev) => [data as Kayit, ...prev]);
      setDosya(null);
      setBaslik("");
      setMahalle("");
    } catch (e) {
      setHata({ mesaj: dbHataMesaji(e), ham: (e as YuklemeHatasi)?.ham });
    } finally {
      setKaydediliyor(false);
    }
  }

  async function sil(k: Kayit) {
    if (!confirm(`"${k.baslik}" galeriden kaldırılsın mı?`)) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("galeri").delete().eq("id", k.id);
      if (error) throw error;
      setKayitlar((prev) => prev.filter((x) => x.id !== k.id));
      // Depodaki dosyayı da temizle; başarısız olsa da kayıt zaten silindi
      await fotografSil(k.url).catch(() => {});
    } catch (e) {
      setHata({ mesaj: "Silinemedi. " + dbHataMesaji(e) });
    }
  }

  /** Sıralama küçükse fotoğraf sitede önce çıkar. */
  async function sirala(k: Kayit, yon: -1 | 1) {
    const yeni = (k.siralama ?? 0) + yon;
    setKayitlar((prev) =>
      [...prev.map((x) => (x.id === k.id ? { ...x, siralama: yeni } : x))].sort(
        (a, b) => (a.siralama ?? 0) - (b.siralama ?? 0)
      )
    );
    const supabase = createClient();
    const { error } = await supabase.from("galeri").update({ siralama: yeni }).eq("id", k.id);
    if (error) setHata({ mesaj: "Sıra değiştirilemedi. " + dbHataMesaji(error) });
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Site Galerisi</h1>
        <Link href="/galeri" target="_blank" className="text-sm text-blue-600 font-medium">
          Sitede gör →
        </Link>
      </div>

      {hata && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-red-800 font-medium">{hata.mesaj}</p>
            <button onClick={() => setHata(null)} className="text-red-400 shrink-0 text-lg leading-none" aria-label="Kapat">
              ×
            </button>
          </div>
          {hata.ham && (
            <p className="mt-2 text-[11px] font-mono text-red-500 break-all select-all">{hata.ham}</p>
          )}
        </div>
      )}

      {/* Yeni fotoğraf */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
        <h2 className="font-bold text-gray-900">Fotoğraf Ekle</h2>

        <label className="block">
          <span className="sr-only">Fotoğraf seç</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setDosya(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-800 file:font-medium"
          />
        </label>

        {onizleme && (
          // Yerel önizleme; next/image gerekmiyor, blob adresi optimize edilemez
          // eslint-disable-next-line @next/next/no-img-element
          <img src={onizleme} alt="Seçilen fotoğraf" className="w-full h-44 object-cover rounded-lg bg-gray-100" />
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Başlık</label>
          <input
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            placeholder="Örn: Rothenberger makine ile kolon açma"
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Sitede fotoğrafın altında görünür. Ne yaptığınızı anlatan bir cümle yazın.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
            >
              {Object.entries(HIZMET_TURLERI).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mahalle</label>
            <select
              value={mahalle}
              onChange={(e) => setMahalle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
            >
              <option value="">Belirtme</option>
              {KADIKOY_MAHALLELERI.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={ekle}
          disabled={kaydediliyor}
          className="w-full bg-blue-600 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl"
        >
          {kaydediliyor ? "Yükleniyor..." : "Siteye Ekle"}
        </button>

        <p className="text-xs text-gray-400">
          Yalnızca kendi çektiğiniz fotoğrafları yükleyin. İnternetten veya ürün
          kataloğundan alınan görseller telif sorunu çıkarır.
        </p>
      </div>

      {/* Yayındakiler */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3">
          Yayındakiler {!loading && `(${kayitlar.length})`}
        </h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Yükleniyor...</p>
        ) : kayitlar.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <span className="text-4xl block mb-2">📷</span>
            <p className="text-gray-400 text-sm">Galeride henüz fotoğraf yok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {kayitlar.map((k) => (
              <div key={k.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden flex">
                <Image
                  src={k.url}
                  alt={k.baslik}
                  width={120}
                  height={120}
                  unoptimized
                  className="w-24 h-24 object-cover bg-gray-100 shrink-0"
                />
                <div className="p-3 flex-1 min-w-0 flex flex-col justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{k.baslik}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {k.kategori}
                      {k.mahalle ? ` • ${k.mahalle}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={() => sirala(k, -1)}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      aria-label="Yukarı taşı"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => sirala(k, 1)}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      aria-label="Aşağı taşı"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => sil(k)}
                      className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded ml-auto"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

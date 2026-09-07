"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { fotografYukle, fotografSil } from "@/lib/foto";
import { HIZMET_TURLERI } from "@/lib/types";

interface Props {
  isId: string;
  fotograflar: string[];
  hizmetTuru: string;
  mahalle: string | null;
  onDegisti: (yeni: string[]) => void;
}

/**
 * İş fotoğrafları: yükleme, silme ve siteye yayınlama.
 *
 * İş fotoğrafları özeldir (anlaşmazlıkta kanıt). Siteye çıkmasını istediklerin
 * ayrıca `galeri` tablosuna eklenir — hangisinin yayınlanacağına sen karar
 * verirsin.
 */
export default function IsFotograflari({ isId, fotograflar, hizmetTuru, mahalle, onDegisti }: Props) {
  const dosyaRef = useRef<HTMLInputElement>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [ilerleme, setIlerleme] = useState("");
  const [yayinlanan, setYayinlanan] = useState<Set<string>>(new Set());

  async function dosyaSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const dosyalar = Array.from(e.target.files ?? []);
    if (dosyalar.length === 0) return;

    setYukleniyor(true);
    const yeniUrller: string[] = [];

    try {
      for (let i = 0; i < dosyalar.length; i++) {
        setIlerleme(`${i + 1}/${dosyalar.length} yükleniyor...`);
        yeniUrller.push(await fotografYukle(dosyalar[i]));
      }

      const hepsi = [...fotograflar, ...yeniUrller];
      const supabase = createClient();
      const { error } = await supabase.from("isler").update({ fotograflar: hepsi }).eq("id", isId);
      if (error) throw error;

      onDegisti(hepsi);
    } catch (err) {
      alert("Fotoğraf yüklenemedi. " + dbHataMesaji(err));
    } finally {
      setYukleniyor(false);
      setIlerleme("");
      if (dosyaRef.current) dosyaRef.current.value = "";
    }
  }

  async function sil(url: string) {
    if (!confirm("Bu fotoğraf silinsin mi?")) return;
    const kalan = fotograflar.filter((f) => f !== url);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("isler").update({ fotograflar: kalan }).eq("id", isId);
      if (error) throw error;
      onDegisti(kalan);
      // Depodaki dosyayı da temizle; başarısız olursa kayıt yine de silinmiş olur
      await fotografSil(url).catch(() => {});
    } catch (err) {
      alert("Silinemedi. " + dbHataMesaji(err));
    }
  }

  async function siteyeEkle(url: string) {
    const varsayilan = HIZMET_TURLERI[hizmetTuru] ?? "Tesisat İşi";
    const baslik = prompt("Galeride görünecek başlık:", varsayilan);
    if (!baslik?.trim()) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("galeri").insert({
        is_id: isId,
        url,
        baslik: baslik.trim(),
        mahalle,
        kategori: varsayilan,
      });
      if (error) throw error;
      setYayinlanan((prev) => new Set(prev).add(url));
    } catch (err) {
      alert("Siteye eklenemedi. " + dbHataMesaji(err));
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Fotoğraflar</h2>
        <span className="text-xs text-gray-400">{fotograflar.length} adet</span>
      </div>

      {fotograflar.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {fotograflar.map((url) => (
            <div key={url} className="relative group">
              <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                <Image
                  src={url}
                  alt="İş fotoğrafı"
                  width={200}
                  height={200}
                  unoptimized
                  className="w-full h-24 object-cover rounded-lg bg-gray-100"
                />
              </a>
              <button
                onClick={() => sil(url)}
                className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full text-xs leading-none"
                aria-label="Fotoğrafı sil"
              >
                ×
              </button>
              <button
                onClick={() => siteyeEkle(url)}
                disabled={yayinlanan.has(url)}
                className="w-full mt-1 text-[11px] font-medium py-1 rounded bg-blue-50 text-blue-700 disabled:bg-green-50 disabled:text-green-700"
              >
                {yayinlanan.has(url) ? "✓ Sitede" : "Siteye ekle"}
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={dosyaRef}
        type="file"
        accept="image/*"
        multiple
        onChange={dosyaSecildi}
        className="hidden"
      />

      <button
        onClick={() => dosyaRef.current?.click()}
        disabled={yukleniyor}
        className="w-full bg-gray-100 disabled:opacity-60 text-gray-800 font-medium py-3 rounded-xl text-sm"
      >
        {yukleniyor ? ilerleme || "Yükleniyor..." : "📷 Fotoğraf Ekle"}
      </button>

      <p className="text-xs text-gray-400">
        Öncesi/sonrası fotoğrafı hem anlaşmazlıkta kanıt olur hem de siteye ekleyebilirsin.
      </p>
    </div>
  );
}

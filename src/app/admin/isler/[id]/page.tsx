"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { toIntlPhone } from "@/lib/date";
import { HIZMET_TURLERI, DURUM_MAP, ODEME_DURUM_MAP, ODEME_YONTEMLERI, type Is, type Musteri } from "@/lib/types";

export default function IsDetayPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Is | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("isler")
          .select("*, musteri:musteriler(*)")
          .eq("id", params.id)
          .single();
        if (!cancelled) setJob((data as Is) ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function updateJob(updates: Partial<Is>) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("isler").update(updates).eq("id", params.id);
    if (error) {
      alert("Güncellenemedi. " + dbHataMesaji(error));
    } else {
      setJob((prev) => prev ? { ...prev, ...updates } : prev);
    }
    setSaving(false);
  }

  async function deleteJob() {
    if (!confirm("Bu işi silmek istediğinize emin misiniz?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("isler").delete().eq("id", params.id);
    if (error) {
      alert("Silinemedi. " + dbHataMesaji(error));
      return;
    }
    router.push("/admin/isler");
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  if (!job) {
    return <div className="p-4 text-center text-gray-500">İş bulunamadı</div>;
  }

  const musteri = job.musteri as Musteri | null;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="text-blue-600 font-medium text-sm flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Geri
        </button>
        <button onClick={deleteJob} className="text-red-500 text-sm font-medium">Sil</button>
      </div>

      {/* Customer info */}
      {musteri && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-lg">{musteri.ad}</p>
              <p className="text-gray-500 text-sm">{musteri.ilce && `📍 ${musteri.ilce}`}</p>
            </div>
            <div className="flex gap-2">
              <a href={`tel:+${toIntlPhone(musteri.telefon)}`} className="bg-blue-600 text-white p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              </a>
              <a href={`https://wa.me/${toIntlPhone(musteri.telefon)}`} target="_blank" rel="noopener noreferrer" className="bg-[#25d366] text-white p-2.5 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L.05 23.5l5.793-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              </a>
            </div>
          </div>
          {musteri.adres && <p className="text-sm text-gray-500 mt-2">📍 {musteri.adres}</p>}
          <Link href={`/admin/musteriler/${musteri.id}`} className="text-blue-600 text-sm font-medium mt-2 inline-block">Müşteri Detayı &rarr;</Link>
        </div>
      )}

      {/* Job info */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            {HIZMET_TURLERI[job.hizmet_turu] || job.hizmet_turu}
          </span>
          <span className="text-gray-500 text-sm">
            {new Date(job.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            {job.saat && ` • ${job.saat.slice(0, 5)}`}
          </span>
        </div>

        {job.tutar && (
          <div className="text-3xl font-bold text-gray-900">{Number(job.tutar).toLocaleString("tr-TR")} ₺</div>
        )}

        {job.aciklama && <p className="text-gray-600">{job.aciklama}</p>}
        {job.adres && <p className="text-gray-500 text-sm">📍 {job.ilce && `${job.ilce} - `}{job.adres}</p>}
      </div>

      {/* Status update */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
        <label className="block text-sm font-semibold text-gray-700">İş Durumu</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(DURUM_MAP).map(([key, val]) => (
            <button
              key={key}
              onClick={() => updateJob({ durum: key })}
              disabled={saving}
              className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                job.durum === key ? `${val.bg} ${val.color} ring-2 ring-offset-1 ring-current` : "bg-gray-50 text-gray-600"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment update */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Ödeme Durumu</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(ODEME_DURUM_MAP).map(([key, val]) => (
            <button
              key={key}
              onClick={() => updateJob({ odeme_durumu: key })}
              disabled={saving}
              className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                job.odeme_durumu === key ? `${val.bg} ${val.color} ring-2 ring-offset-1 ring-current` : "bg-gray-50 text-gray-600"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        <label className="block text-sm font-semibold text-gray-700 mt-3">Ödeme Yöntemi</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(ODEME_YONTEMLERI).map(([key, label]) => (
            <button
              key={key}
              onClick={() => updateJob({ odeme_yontemi: key })}
              disabled={saving}
              className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                job.odeme_yontemi === key ? "bg-green-100 text-green-700 ring-2 ring-offset-1 ring-green-500" : "bg-gray-50 text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick complete */}
      {job.durum !== "tamamlandi" && (
        <button
          onClick={() => updateJob({ durum: "tamamlandi" })}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg transition-colors"
        >
          ✓ İşi Tamamla
        </button>
      )}
    </div>
  );
}

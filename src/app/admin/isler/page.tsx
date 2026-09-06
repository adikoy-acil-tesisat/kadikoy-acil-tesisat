"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { HIZMET_TURLERI, DURUM_MAP, ODEME_DURUM_MAP, type Is } from "@/lib/types";

const FILTERS = [
  { key: "tumu", label: "Tümü" },
  { key: "beklemede", label: "Beklemede" },
  { key: "devam_ediyor", label: "Devam" },
  { key: "tamamlandi", label: "Bitti" },
  { key: "iptal", label: "İptal" },
];

export default function IslerPage() {
  const [jobs, setJobs] = useState<Is[]>([]);
  const [filter, setFilter] = useState("tumu");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        let query = supabase
          .from("isler")
          .select("*, musteri:musteriler(ad, telefon, ilce)")
          .order("tarih", { ascending: false })
          .order("olusturma_tarihi", { ascending: false })
          .limit(100);

        if (filter !== "tumu") {
          query = query.eq("durum", filter);
        }

        const { data } = await query;
        if (!cancelled) setJobs((data as Is[]) || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const filtered = search
    ? jobs.filter((j) => {
        const musteri = j.musteri as { ad: string; telefon: string } | null;
        const text = `${musteri?.ad || ""} ${musteri?.telefon || ""} ${j.aciklama || ""}`.toLowerCase();
        return text.includes(search.toLowerCase());
      })
    : jobs;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">İşler</h1>
        <Link href="/admin/isler/yeni" className="bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl">
          + Yeni İş
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Müşteri adı veya telefon ara..."
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setLoading(true); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Jobs list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {search ? "Sonuç bulunamadı" : "Henüz iş kaydı yok"}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => {
            const durum = DURUM_MAP[job.durum] || DURUM_MAP.beklemede;
            const odeme = ODEME_DURUM_MAP[job.odeme_durumu] || ODEME_DURUM_MAP.odenmedi;
            const musteri = job.musteri as { ad: string; telefon: string; ilce?: string } | null;

            return (
              <Link key={job.id} href={`/admin/isler/${job.id}`} className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{musteri?.ad || "—"}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(job.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                      {musteri?.ilce && ` • ${musteri.ilce}`}
                      {job.saat && ` • ${job.saat.slice(0, 5)}`}
                    </p>
                  </div>
                  {job.tutar && (
                    <span className="font-bold text-gray-900">{Number(job.tutar).toLocaleString("tr-TR")} ₺</span>
                  )}
                </div>
                {job.aciklama && <p className="text-sm text-gray-500 mb-2 line-clamp-1">{job.aciklama}</p>}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {HIZMET_TURLERI[job.hizmet_turu] || job.hizmet_turu}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${durum.bg} ${durum.color}`}>{durum.label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${odeme.bg} ${odeme.color}`}>{odeme.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

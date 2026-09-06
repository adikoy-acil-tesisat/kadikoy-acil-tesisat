"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { todayISO } from "@/lib/date";
import { para, tarihKisa, gunAdi, saatKisa } from "@/lib/format";
import { HIZMET_TURLERI, DURUM_MAP, ODEME_DURUM_MAP, type Is } from "@/lib/types";

const FILTERS = [
  { key: "tumu", label: "Tümü" },
  { key: "beklemede", label: "Beklemede" },
  { key: "devam_ediyor", label: "Devam" },
  { key: "tamamlandi", label: "Bitti" },
  { key: "iptal", label: "İptal" },
];

type Gorunum = "liste" | "takvim";

function JobCard({ job }: { job: Is }) {
  const durum = DURUM_MAP[job.durum] || DURUM_MAP.beklemede;
  const odeme = ODEME_DURUM_MAP[job.odeme_durumu] || ODEME_DURUM_MAP.odenmedi;
  const musteri = job.musteri as { ad: string; telefon: string; ilce?: string } | null;

  return (
    <Link href={`/admin/isler/${job.id}`} className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50">
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{musteri?.ad || "—"}</p>
          <p className="text-sm text-gray-500">
            {tarihKisa(job.tarih)}
            {musteri?.ilce && ` • ${musteri.ilce}`}
            {job.saat && ` • ${saatKisa(job.saat)}`}
          </p>
        </div>
        {job.tutar != null && <span className="font-bold text-gray-900 shrink-0 ml-2">{para(job.tutar)}</span>}
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
}

export default function IslerPage() {
  const [jobs, setJobs] = useState<Is[]>([]);
  const [filter, setFilter] = useState("tumu");
  const [search, setSearch] = useState("");
  const [gorunum, setGorunum] = useState<Gorunum>("liste");
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
          .limit(200);

        if (filter !== "tumu") query = query.eq("durum", filter);

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

  const filtered = useMemo(() => {
    if (!search) return jobs;
    const q = search.toLowerCase();
    return jobs.filter((j) => {
      const m = j.musteri as { ad: string; telefon: string } | null;
      return `${m?.ad || ""} ${m?.telefon || ""} ${j.aciklama || ""}`.toLowerCase().includes(q);
    });
  }, [jobs, search]);

  /** Takvim: bugünden itibaren tarihe göre gruplu, yaklaşan işler */
  const takvimGruplari = useMemo(() => {
    const bugun = todayISO();
    const yaklasan = filtered
      .filter((j) => j.tarih >= bugun && j.durum !== "iptal")
      .sort((a, b) => (a.tarih === b.tarih ? (a.saat || "").localeCompare(b.saat || "") : a.tarih.localeCompare(b.tarih)));

    const gruplar = new Map<string, Is[]>();
    for (const j of yaklasan) {
      const liste = gruplar.get(j.tarih) ?? [];
      liste.push(j);
      gruplar.set(j.tarih, liste);
    }
    return [...gruplar.entries()];
  }, [filtered]);

  const bugun = todayISO();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">İşler</h1>
        <Link href="/admin/isler/yeni" className="bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl">
          + Yeni İş
        </Link>
      </div>

      {/* Görünüm değiştirici */}
      <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl">
        {(["liste", "takvim"] as Gorunum[]).map((g) => (
          <button
            key={g}
            onClick={() => setGorunum(g)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              gorunum === g ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
            }`}
          >
            {g === "liste" ? "Liste" : "Takvim"}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Müşteri adı veya telefon ara..."
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

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

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : gorunum === "takvim" ? (
        takvimGruplari.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Yaklaşan iş yok</div>
        ) : (
          <div className="space-y-5">
            {takvimGruplari.map(([tarih, gunIsleri]) => {
              const gunToplam = gunIsleri.reduce((s, j) => s + (Number(j.tutar) || 0), 0);
              return (
                <div key={tarih}>
                  <div className="flex items-center justify-between mb-2 sticky top-14 bg-gray-50 py-1.5 z-10">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-bold ${tarih === bugun ? "text-blue-600" : "text-gray-900"}`}>
                        {tarih === bugun ? "Bugün" : tarihKisa(tarih)}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{gunAdi(tarih)}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {gunIsleri.length} iş{gunToplam > 0 && ` • ${para(gunToplam)}`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {gunIsleri.map((job) => <JobCard key={job.id} job={job} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {search ? "Sonuç bulunamadı" : "Henüz iş kaydı yok"}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
}

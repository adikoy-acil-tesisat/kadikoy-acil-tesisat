"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { yolTarifiLinki } from "@/lib/harita";
import { todayISO, toIntlPhone } from "@/lib/date";
import AyTakvimi from "@/components/AyTakvimi";
import { para, tarihKisa, gunAdi, saatKisa } from "@/lib/format";
import { HIZMET_TURLERI, DURUM_MAP, ODEME_DURUM_MAP, type Is } from "@/lib/types";

/**
 * Filtreler. "odenmedi" bir durum değil, ödeme filtresi: tamamlanmış ama
 * parası alınmamış işleri getirir — listeye en çok bunun için bakılıyor.
 */
const FILTERS = [
  { key: "tumu", label: "Tümü" },
  { key: "beklemede", label: "Beklemede" },
  { key: "devam_ediyor", label: "Devam" },
  { key: "tamamlandi", label: "Bitti" },
  { key: "odenmedi", label: "Ödenmedi" },
  { key: "iptal", label: "İptal" },
];

/** Telefon aramasında biçim farkı olmasın: "0532 111" -> "0532111" */
function sadeceRakam(metin: string): string {
  return metin.replace(/\D/g, "");
}

type Gorunum = "liste" | "takvim";

function JobCard({ job, onDurum }: { job: Is; onDurum: (id: string, durum: string) => void }) {
  const durum = DURUM_MAP[job.durum] || DURUM_MAP.beklemede;
  const odeme = ODEME_DURUM_MAP[job.odeme_durumu] || ODEME_DURUM_MAP.odenmedi;
  const musteri = job.musteri as { ad: string; telefon: string; ilce?: string } | null;
  const yol = yolTarifiLinki([job.adres, job.ilce ?? musteri?.ilce]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <Link href={`/admin/isler/${job.id}`} className="block active:opacity-60">
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

      {/* Hızlı eylemler — işi açmadan */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        {musteri?.telefon && (
          <a
            href={`tel:+${toIntlPhone(musteri.telefon)}`}
            className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-semibold text-center"
          >
            Ara
          </a>
        )}
        {job.durum === "beklemede" && (
          <button
            onClick={() => onDurum(job.id, "devam_ediyor")}
            className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-xs font-semibold"
          >
            Başlat
          </button>
        )}
        {job.durum !== "tamamlandi" && job.durum !== "iptal" && (
          <button
            onClick={() => onDurum(job.id, "tamamlandi")}
            className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-semibold"
          >
            ✓ Tamamla
          </button>
        )}
        {yol && (
          <a
            href={yol}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-semibold text-center"
          >
            Yol Tarifi
          </a>
        )}
      </div>
    </div>
  );
}

export default function IslerPage() {
  const [jobs, setJobs] = useState<Is[]>([]);
  const [filter, setFilter] = useState("tumu");
  const [search, setSearch] = useState("");
  const [gorunum, setGorunum] = useState<Gorunum>("liste");
  const [ay, setAy] = useState(() => todayISO().slice(0, 7));
  const [seciliGun, setSeciliGun] = useState<string | null>(() => todayISO());
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

        if (filter === "odenmedi") {
          query = query.eq("durum", "tamamlandi").in("odeme_durumu", ["odenmedi", "kismi"]);
        } else if (filter !== "tumu") {
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

  /**
   * Listeden durum değiştirme. Önce ekranda güncelleyip sonra kaydediyoruz;
   * kaydetme başarısız olursa eski hâline döndürüyoruz ki ekranda yanlış
   * bilgi kalmasın.
   */
  async function durumDegistir(id: string, yeniDurum: string) {
    const oncekiler = jobs;
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, durum: yeniDurum } : j)));

    const supabase = createClient();
    const { error } = await supabase.from("isler").update({ durum: yeniDurum }).eq("id", id);
    if (error) {
      setJobs(oncekiler);
      alert("Durum değiştirilemedi. " + dbHataMesaji(error));
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("tr-TR");
    if (!q) return jobs;
    // Rakam girildiyse telefon aranıyordur; boşluk ve parantez farkını yok say.
    const rakam = sadeceRakam(q);

    return jobs.filter((j) => {
      const m = j.musteri as { ad: string; telefon: string; ilce?: string } | null;
      if (rakam.length >= 3 && sadeceRakam(m?.telefon || "").includes(rakam)) return true;
      const metin = `${m?.ad || ""} ${m?.ilce || ""} ${j.ilce || ""} ${j.adres || ""} ${j.aciklama || ""}`;
      return metin.toLocaleLowerCase("tr-TR").includes(q);
    });
  }, [jobs, search]);

  /** Liste görünümü: tarihe göre gruplu, yeniden eskiye. */
  const listeGruplari = useMemo(() => {
    const gruplar = new Map<string, Is[]>();
    for (const j of filtered) {
      const liste = gruplar.get(j.tarih) ?? [];
      liste.push(j);
      gruplar.set(j.tarih, liste);
    }
    for (const liste of gruplar.values()) {
      liste.sort((a, b) => (a.saat || "").localeCompare(b.saat || ""));
    }
    return [...gruplar.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  /** Takvimde seçili günün işleri. */
  const gununIsleri = useMemo(
    () =>
      filtered
        .filter((j) => j.tarih === seciliGun)
        .sort((a, b) => (a.saat || "").localeCompare(b.saat || "")),
    [filtered, seciliGun]
  );

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
            onClick={() => {
              setGorunum(g);
              if (g === "takvim") {
                setAy(todayISO().slice(0, 7));
                setSeciliGun(todayISO());
              }
            }}
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
        placeholder="Ad, telefon, mahalle veya açıklama ara..."
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
        <div className="space-y-4">
          <AyTakvimi
            ay={ay}
            isler={filtered}
            seciliGun={seciliGun}
            onAyDegisti={setAy}
            onGunSecildi={setSeciliGun}
          />

          {seciliGun && (
            <div>
              <div className="flex items-baseline justify-between mb-2.5">
                <div className="flex items-baseline gap-2">
                  <h2 className={`font-bold ${seciliGun === bugun ? "text-blue-600" : "text-gray-900"}`}>
                    {seciliGun === bugun ? "Bugün" : tarihKisa(seciliGun)}
                  </h2>
                  <span className="text-xs text-gray-400 capitalize">{gunAdi(seciliGun)}</span>
                </div>
                {gununIsleri.length > 0 && (
                  <span className="text-xs text-gray-500 tabular-nums">
                    {gununIsleri.length} iş • {para(gununIsleri.reduce((s, j) => s + (Number(j.tutar) || 0), 0))}
                  </span>
                )}
              </div>

              {gununIsleri.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
                  <p className="text-gray-400 text-sm mb-3">Bu güne kayıtlı iş yok</p>
                  <Link
                    href={`/admin/isler/yeni?tarih=${seciliGun}`}
                    className="inline-block bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl"
                  >
                    + Bu güne iş ekle
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {gununIsleri.map((job) => <JobCard key={job.id} job={job} onDurum={durumDegistir} />)}
                </div>
              )}
            </div>
          )}
        </div>
      ) : listeGruplari.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {search ? "Sonuç bulunamadı" : "Henüz iş kaydı yok"}
        </div>
      ) : (
        <div className="space-y-5">
          {listeGruplari.map(([tarih, gunIsleri]) => {
            const gunToplam = gunIsleri.reduce((s, j) => s + (Number(j.tutar) || 0), 0);
            return (
              <div key={tarih}>
                {/* Tarih başlığı kaydırırken üstte kalır; uzun listede hangi
                    günde olduğunu kaybetmemek için */}
                <div className="flex items-center justify-between mb-2 sticky top-14 bg-gray-50 py-1.5 z-10">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-bold ${tarih === bugun ? "text-blue-600" : "text-gray-900"}`}>
                      {tarih === bugun ? "Bugün" : tarihKisa(tarih)}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{gunAdi(tarih)}</span>
                  </div>
                  <span className="text-xs text-gray-500 tabular-nums">
                    {gunIsleri.length} iş{gunToplam > 0 && ` • ${para(gunToplam)}`}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {gunIsleri.map((job) => <JobCard key={job.id} job={job} onDurum={durumDegistir} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

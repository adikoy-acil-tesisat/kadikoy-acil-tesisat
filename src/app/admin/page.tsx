"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { todayISO, monthStartISO } from "@/lib/date";
import { para, saatKisa, tarihKisa } from "@/lib/format";
import { HIZMET_TURLERI, DURUM_MAP, ODEME_DURUM_MAP, type Is, type Odeme } from "@/lib/types";
import { odemeToplamlari, kalanBakiye } from "@/lib/tahsilat";

/** n gün sonrasının yerel tarihi. */
function gunEkle(gun: number): string {
  const d = new Date();
  d.setDate(d.getDate() + gun);
  return todayISO(d);
}

function JobRow({ job }: { job: Is }) {
  const durum = DURUM_MAP[job.durum] || DURUM_MAP.beklemede;
  const odeme = ODEME_DURUM_MAP[job.odeme_durumu] || ODEME_DURUM_MAP.odenmedi;
  const musteri = job.musteri as { ad: string; telefon: string; ilce?: string } | null;

  return (
    <Link href={`/admin/isler/${job.id}`} className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50">
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{musteri?.ad || "Müşteri Silinmiş"}</p>
          <p className="text-sm text-gray-500">
            {musteri?.ilce && `📍 ${musteri.ilce}`} {job.saat && `• ${saatKisa(job.saat)}`}
          </p>
        </div>
        {job.tutar != null && <span className="font-bold text-gray-900 shrink-0 ml-2">{para(job.tutar)}</span>}
      </div>
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

export default function AdminDashboard() {
  const [todayJobs, setTodayJobs] = useState<Is[]>([]);
  const [yarinJobs, setYarinJobs] = useState<Is[]>([]);
  const [haftaSayisi, setHaftaSayisi] = useState(0);
  const [stats, setStats] = useState({ aylikGelir: 0, alacak: 0, toplamMusteri: 0, aylikIs: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const today = todayISO();
        const yarin = gunEkle(1);
        const haftaSonu = gunEkle(7);
        const monthStart = monthStartISO();

        const [jobsRes, yarinRes, haftaRes, ayTahsilatRes, alacakRes, customerRes, monthCountRes] =
          await Promise.all([
            supabase.from("isler").select("*, musteri:musteriler(ad, telefon, ilce)").eq("tarih", today).order("saat", { ascending: true }),
            supabase.from("isler").select("*, musteri:musteriler(ad, telefon, ilce)").eq("tarih", yarin).order("saat", { ascending: true }),
            supabase.from("isler").select("id", { count: "exact", head: true }).gte("tarih", today).lte("tarih", haftaSonu).neq("durum", "iptal"),
            // Gelir = bu ay fiilen tahsil edilen para (işin tarihi değil, paranın
            // eline geçtiği tarih esas alınır).
            supabase.from("odemeler").select("tutar").gte("tarih", monthStart),
            supabase.from("isler").select("id, tutar").in("odeme_durumu", ["odenmedi", "kismi"]).eq("durum", "tamamlandi"),
            supabase.from("musteriler").select("id", { count: "exact", head: true }),
            supabase.from("isler").select("id", { count: "exact", head: true }).gte("tarih", monthStart),
          ]);

        if (cancelled) return;

        // Kısmi ödenen işlerde tamamı değil, yalnızca kalan bakiye alacaktır.
        const acikIsler = (alacakRes.data as Pick<Is, "id" | "tutar">[]) || [];
        const odenenler = acikIsler.length
          ? odemeToplamlari(
              ((
                await supabase
                  .from("odemeler")
                  .select("is_id, tutar")
                  .in("is_id", acikIsler.map((i) => i.id))
              ).data as Pick<Odeme, "is_id" | "tutar">[]) || []
            )
          : new Map<string, number>();

        if (cancelled) return;

        setTodayJobs((jobsRes.data as Is[]) || []);
        setYarinJobs((yarinRes.data as Is[]) || []);
        setHaftaSayisi(haftaRes.count || 0);
        setStats({
          aylikGelir: (ayTahsilatRes.data || []).reduce((s, o) => s + (Number(o.tutar) || 0), 0),
          alacak: acikIsler.reduce((s, i) => s + kalanBakiye(i.tutar, odenenler.get(i.id) ?? 0), 0),
          toplamMusteri: customerRes.count || 0,
          aylikIs: monthCountRes.count || 0,
        });
      } catch (e) {
        if (!cancelled) setError(dbHataMesaji(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Merhaba!</h1>
        <p className="text-gray-500 text-sm">
          {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {error && <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-xl">{error}</div>}

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Bu Ay Gelir</p>
          <p className="text-2xl font-bold text-green-600">{para(stats.aylikGelir)}</p>
        </div>
        <Link href="/admin/finans" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50">
          <p className="text-sm text-gray-500">Tahsil Edilecek</p>
          <p className="text-2xl font-bold text-red-600">{para(stats.alacak)}</p>
          <p className="text-xs text-gray-400">alacak</p>
        </Link>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Bu Ay İş</p>
          <p className="text-2xl font-bold text-blue-600">{stats.aylikIs}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Toplam Müşteri</p>
          <p className="text-2xl font-bold text-gray-900">{stats.toplamMusteri}</p>
        </div>
      </div>

      {/* Yaklaşan iş yükü */}
      <Link href="/admin/isler" className="flex items-center justify-between bg-blue-600 text-white rounded-xl p-4 active:bg-blue-700">
        <div>
          <p className="text-sm text-blue-100">Önümüzdeki 7 gün</p>
          <p className="text-xl font-bold">{haftaSayisi} planlı iş</p>
        </div>
        <span className="text-sm font-medium bg-white/15 px-3 py-1.5 rounded-lg">Takvim &rarr;</span>
      </Link>

      {/* Bugün */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Bugün ({todayJobs.length})</h2>
          <Link href="/admin/isler/yeni" className="text-blue-600 text-sm font-medium">+ Yeni İş</Link>
        </div>

        {todayJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
            <p className="text-gray-400 mb-3">Bugün için kayıtlı iş yok</p>
            <Link href="/admin/isler/yeni" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              Yeni İş Ekle
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {todayJobs.map((job) => <JobRow key={job.id} job={job} />)}
          </div>
        )}
      </div>

      {/* Yarın */}
      {yarinJobs.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Yarın ({yarinJobs.length}) <span className="text-sm font-normal text-gray-400">{tarihKisa(gunEkle(1))}</span>
          </h2>
          <div className="space-y-3">
            {yarinJobs.map((job) => <JobRow key={job.id} job={job} />)}
          </div>
        </div>
      )}

      {/* Hızlı işlemler */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/admin/isler/yeni" className="bg-blue-600 text-white rounded-xl p-4 text-center font-medium active:bg-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
            Yeni İş
          </Link>
          <Link href="/admin/musteriler/yeni" className="bg-green-600 text-white rounded-xl p-4 text-center font-medium active:bg-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            Yeni Müşteri
          </Link>
          <Link href="/admin/galeri" className="bg-white border border-gray-200 text-gray-800 rounded-xl p-4 text-center font-medium active:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            Galeri
          </Link>
          <Link href="/admin/alacaklar" className="bg-white border border-gray-200 text-gray-800 rounded-xl p-4 text-center font-medium active:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Alacaklar
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { todayISO, monthStartISO, oncekiAyBasiISO, gunEkleISO } from "@/lib/date";
import { para, tarihKisa } from "@/lib/format";
import { odemeToplamlari, kalanBakiye } from "@/lib/tahsilat";
import { type Is, type Odeme } from "@/lib/types";
import { selam, IsSatiri, OzetKart, HaftaGrafigi } from "@/components/PanelKartlari";

export default function AdminDashboard() {
  const [todayJobs, setTodayJobs] = useState<Is[]>([]);
  const [yarinJobs, setYarinJobs] = useState<Is[]>([]);
  const [haftaSayisi, setHaftaSayisi] = useState(0);
  const [tahsilatlar, setTahsilatlar] = useState<Pick<Odeme, "tarih" | "tutar">[]>([]);
  const [stats, setStats] = useState({ alacak: 0, toplamMusteri: 0, aylikIs: 0 });
  /** Henüz ilgilenilmemiş site talebi sayısı — rozette gösterilir. */
  const [yeniTalep, setYeniTalep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const today = todayISO();
        const yarin = gunEkleISO(1);
        const haftaSonu = gunEkleISO(7);
        const monthStart = monthStartISO();
        const oncekiAy = oncekiAyBasiISO();
        const isSecim = "*, musteri:musteriler(ad, telefon, ilce)";

        const [jobsRes, yarinRes, haftaRes, tahsilatRes, alacakRes, customerRes, monthCountRes, talepRes] =
          await Promise.all([
            supabase.from("isler").select(isSecim).eq("tarih", today).order("saat", { ascending: true }),
            supabase.from("isler").select(isSecim).eq("tarih", yarin).order("saat", { ascending: true }),
            supabase.from("isler").select("id", { count: "exact", head: true }).gte("tarih", today).lte("tarih", haftaSonu).neq("durum", "iptal"),
            // Önceki ay başından bugüne kadarki tahsilatlar; bu ay, geçen ay ve
            // son 7 gün hesapları hep bu tek sorgudan çıkıyor.
            supabase.from("odemeler").select("tarih, tutar").gte("tarih", oncekiAy),
            supabase.from("isler").select("id, tutar").in("odeme_durumu", ["odenmedi", "kismi"]).eq("durum", "tamamlandi"),
            supabase.from("musteriler").select("id", { count: "exact", head: true }),
            supabase.from("isler").select("id", { count: "exact", head: true }).gte("tarih", monthStart),
            supabase.from("talepler").select("id", { count: "exact", head: true }).eq("durum", "yeni"),
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
        setYeniTalep(talepRes.count || 0);
        setTahsilatlar((tahsilatRes.data as Pick<Odeme, "tarih" | "tutar">[]) || []);
        setStats({
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

  const { aylikGelir, gecenAyGelir, hafta } = useMemo(() => {
    const monthStart = monthStartISO();
    const oncekiAy = oncekiAyBasiISO();
    const topla = (filtre: (t: string) => boolean) =>
      tahsilatlar.filter((o) => filtre(o.tarih)).reduce((s, o) => s + (Number(o.tutar) || 0), 0);

    return {
      aylikGelir: topla((t) => t >= monthStart),
      gecenAyGelir: topla((t) => t >= oncekiAy && t < monthStart),
      hafta: Array.from({ length: 7 }, (_, i) => {
        const tarih = gunEkleISO(i - 6);
        return { tarih, tutar: topla((t) => t === tarih) };
      }),
    };
  }, [tahsilatlar]);

  /** Geçen ayın aynı gününe kadarki gelire göre değişim yüzdesi. */
  const aylikDegisim = useMemo(() => {
    if (gecenAyGelir <= 0) return null;
    return Math.round(((aylikGelir - gecenAyGelir) / gecenAyGelir) * 100);
  }, [aylikGelir, gecenAyGelir]);

  const bitenBugun = todayJobs.filter((j) => j.durum === "tamamlandi").length;
  const ilerleme = todayJobs.length > 0 ? Math.round((bitenBugun / todayJobs.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {error && <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-xl">{error}</div>}

      {/* Günün özeti */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-5 shadow-lg shadow-blue-600/20">
        <p className="text-blue-100 text-sm">{selam()}</p>
        <p className="text-xs text-blue-200 mb-4">
          {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
        </p>

        {todayJobs.length === 0 ? (
          <>
            <p className="text-xl font-bold">Bugün planlı iş yok</p>
            <p className="text-sm text-blue-100 mt-1">
              {haftaSayisi > 0 ? `Önümüzdeki 7 günde ${haftaSayisi} iş var.` : "Takvim boş görünüyor."}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">
                {bitenBugun}<span className="text-blue-200 text-xl">/{todayJobs.length}</span>
              </p>
              <p className="text-sm text-blue-100">bugün tamamlandı</p>
            </div>
            <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${ilerleme}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 gap-3">
        <OzetKart
          etiket="Bu Ay Tahsilat"
          deger={para(aylikGelir)}
          renk="text-green-600"
          href="/admin/finans"
          ikon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          }
          alt={
            aylikDegisim !== null ? (
              <p className={`text-[11px] font-medium ${aylikDegisim >= 0 ? "text-green-600" : "text-red-500"}`}>
                {aylikDegisim >= 0 ? "▲" : "▼"} geçen aya göre %{Math.abs(aylikDegisim)}
              </p>
            ) : (
              <p className="text-[11px] text-gray-400">geçen ay kaydı yok</p>
            )
          }
        />
        <OzetKart
          etiket="Tahsil Edilecek"
          deger={para(stats.alacak)}
          renk="text-red-600"
          href="/admin/alacaklar"
          ikon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          }
          alt={<p className="text-[11px] text-gray-400">açık bakiye</p>}
        />
        <OzetKart
          etiket="Bu Ay İş"
          deger={String(stats.aylikIs)}
          renk="text-blue-600"
          href="/admin/isler"
          ikon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg>
          }
          alt={<p className="text-[11px] text-gray-400">{haftaSayisi} iş planlı</p>}
        />
        <OzetKart
          etiket="Müşteri"
          deger={String(stats.toplamMusteri)}
          renk="text-gray-900"
          href="/admin/musteriler"
          ikon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          }
          alt={<p className="text-[11px] text-gray-400">kayıtlı</p>}
        />
      </div>

      <HaftaGrafigi gunler={hafta} />

      {/* Bugün */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-lg font-bold text-gray-900">Bugün</h2>
          <Link href="/admin/isler/yeni" className="text-blue-600 text-sm font-medium">+ Yeni İş</Link>
        </div>

        {todayJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <span className="text-4xl block mb-2">📋</span>
            <p className="text-gray-400 mb-4 text-sm">Bugün için kayıtlı iş yok</p>
            <Link href="/admin/hizli" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium py-2.5 px-5 rounded-xl text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
              Hızlı Kayıt
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayJobs.map((job) => <IsSatiri key={job.id} job={job} />)}
          </div>
        )}
      </div>

      {/* Yarın */}
      {yarinJobs.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2.5">
            Yarın <span className="text-sm font-normal text-gray-400">{tarihKisa(gunEkleISO(1))}</span>
          </h2>
          <div className="space-y-2.5">
            {yarinJobs.map((job) => <IsSatiri key={job.id} job={job} />)}
          </div>
        </div>
      )}

      {/* Hızlı işlemler */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2.5">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/admin/isler/yeni" className="bg-blue-600 text-white rounded-2xl p-4 text-center font-medium active:bg-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11v6" /><path d="M9 14h6" /></svg>
            Yeni İş
          </Link>
          <Link href="/admin/musteriler/yeni" className="bg-green-600 text-white rounded-2xl p-4 text-center font-medium active:bg-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
            Yeni Müşteri
          </Link>
          <Link href="/admin/galeri" className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-4 text-center font-medium active:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
            Galeri
          </Link>
          <Link href="/admin/alacaklar" className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-4 text-center font-medium active:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            Alacaklar
          </Link>
          <Link href="/admin/geri-kazanim" className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-4 text-center font-medium active:bg-gray-50 col-span-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>
            Geri Kazanım
          </Link>
          <Link href="/admin/talepler" className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-4 text-center font-medium active:bg-gray-50 col-span-2 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
            Site Talepleri
            {yeniTalep > 0 && (
              <span className="absolute top-2 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {yeniTalep}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

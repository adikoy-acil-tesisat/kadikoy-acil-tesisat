"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { fotografYukle } from "@/lib/foto";
import { todayISO, toIntlPhone } from "@/lib/date";
import { para, ayAdi, tarihKisa } from "@/lib/format";
import {
  HIZMET_TURLERI,
  GIDER_KATEGORILERI,
  ODEME_YONTEMLERI,
  type Is,
  type Gider,
  type Odeme,
  type Tahsilat,
  type TahsilatOzet,
} from "@/lib/types";
import { odemeToplamlari, kalanBakiye } from "@/lib/tahsilat";

type Tab = "ozet" | "gelirler" | "giderler" | "odenmemis" | "istatistik";

/** "2026-09" biçiminde ay anahtarı üretir. */
function ayAnahtari(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Ay anahtarını n ay kaydırır. */
function ayKaydir(ay: string, n: number): string {
  const [y, m] = ay.split("-").map(Number);
  return ayAnahtari(new Date(y, m - 1 + n, 1));
}

/** Ayın ilk ve son günü (dahil). */
function ayAraligi(ay: string): { bas: string; son: string } {
  const [y, m] = ay.split("-").map(Number);
  const sonGun = new Date(y, m, 0).getDate();
  return { bas: `${ay}-01`, son: `${ay}-${String(sonGun).padStart(2, "0")}` };
}

export default function FinansPage() {
  const [tab, setTab] = useState<Tab>("ozet");
  const [loading, setLoading] = useState(true);

  const buAy = useMemo(() => ayAnahtari(new Date()), []);
  const [ay, setAy] = useState(buAy);

  const [tahsilatlar, setTahsilatlar] = useState<Tahsilat[]>([]);
  const [unpaidJobs, setUnpaidJobs] = useState<Is[]>([]);
  /** Ödenmemiş işlerde o ana kadar tahsil edilen tutarlar (is_id -> toplam). */
  const [kismiOdenen, setKismiOdenen] = useState<Map<string, number>>(new Map());
  const [expenses, setExpenses] = useState<Gider[]>([]);
  /** İstatistik için son 6 ayın tüm tahsilatları */
  const [trendTahsilat, setTrendTahsilat] = useState<TahsilatOzet[]>([]);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [giderKat, setGiderKat] = useState("malzeme");
  const [giderAcik, setGiderAcik] = useState("");
  const [giderTutar, setGiderTutar] = useState("");
  const [giderSaving, setGiderSaving] = useState(false);
  const [fisDosya, setFisDosya] = useState<File | null>(null);

  const yukle = useCallback(async () => {
    const supabase = createClient();
    const { bas, son } = ayAraligi(ay);
    const trendBas = `${ayKaydir(buAy, -5)}-01`;

    // Gelir, paranın eline geçtiği tarihe göre sayılır — işin tarihine göre
    // değil. Bu yüzden hesaplar isler değil odemeler tablosundan çıkar.
    const [tahsilatRes, unpaidRes, expRes, trendRes] = await Promise.all([
      supabase.from("odemeler").select("*, is:isler(hizmet_turu, ilce, musteri:musteriler(ad))").gte("tarih", bas).lte("tarih", son).order("tarih", { ascending: false }),
      supabase.from("isler").select("*, musteri:musteriler(ad, telefon)").in("odeme_durumu", ["odenmedi", "kismi"]).eq("durum", "tamamlandi").order("tarih", { ascending: false }),
      supabase.from("giderler").select("*").gte("tarih", bas).lte("tarih", son).order("tarih", { ascending: false }),
      supabase.from("odemeler").select("tarih, tutar, is:isler(hizmet_turu, ilce, musteri:musteriler(ad))").gte("tarih", trendBas),
    ]);

    const acik = (unpaidRes.data as Is[]) || [];
    const kismiRes = acik.length
      ? await supabase.from("odemeler").select("is_id, tutar").in("is_id", acik.map((i) => i.id))
      : { data: [] };

    setTahsilatlar((tahsilatRes.data as Tahsilat[]) || []);
    setUnpaidJobs(acik);
    setKismiOdenen(odemeToplamlari((kismiRes.data as Odeme[]) || []));
    setExpenses((expRes.data as Gider[]) || []);
    setTrendTahsilat((trendRes.data as unknown as TahsilatOzet[]) || []);
  }, [ay, buAy]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        await yukle();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [yukle]);

  async function addExpense() {
    const tutarSayi = parseFloat(giderTutar);
    if (!giderAcik.trim() || !Number.isFinite(tutarSayi)) {
      alert("Açıklama ve geçerli bir tutar girin.");
      return;
    }
    setGiderSaving(true);

    try {
      // Fiş seçildiyse önce yükle; yüklenemezse gider yine de kaydedilsin
      let fisUrl: string | null = null;
      if (fisDosya) {
        try {
          fisUrl = await fotografYukle(fisDosya);
        } catch (e) {
          alert("Fiş yüklenemedi, gider fişsiz kaydedilecek. " + dbHataMesaji(e));
        }
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("giderler")
        .insert({
          kategori: giderKat,
          aciklama: giderAcik.trim(),
          tutar: tutarSayi,
          tarih: todayISO(),
          fis_url: fisUrl,
        })
        .select()
        .single();

      if (error || !data) {
        alert("Gider kaydedilemedi. " + dbHataMesaji(error));
        return;
      }

      setExpenses((prev) => [data as Gider, ...prev]);
      setGiderAcik("");
      setGiderTutar("");
      setFisDosya(null);
      setShowExpenseForm(false);
    } finally {
      setGiderSaving(false);
    }
  }

  async function giderSil(g: Gider) {
    if (!confirm(`"${g.aciklama}" gideri silinsin mi?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("giderler").delete().eq("id", g.id);
    if (error) {
      alert("Silinemedi. " + dbHataMesaji(error));
      return;
    }
    setExpenses((prev) => prev.filter((x) => x.id !== g.id));
  }

  const totalIncome = tahsilatlar.reduce((s, o) => s + (Number(o.tutar) || 0), 0);
  const totalExpense = expenses.reduce((s, e) => s + (Number(e.tutar) || 0), 0);
  const profit = totalIncome - totalExpense;
  // Kısmi ödenen işlerde tamamı değil, kalan bakiye borçtur.
  const totalUnpaid = unpaidJobs.reduce(
    (s, j) => s + kalanBakiye(j.tutar, kismiOdenen.get(j.id) ?? 0),
    0
  );

  // Son 6 ayın gelir trendi
  const trend = useMemo(() => {
    const aylar = Array.from({ length: 6 }, (_, i) => ayKaydir(buAy, i - 5));
    return aylar.map((a) => ({
      ay: a,
      tutar: trendTahsilat
        .filter((o) => o.tarih?.startsWith(a))
        .reduce((s, o) => s + (Number(o.tutar) || 0), 0),
    }));
  }, [trendTahsilat, buAy]);
  const trendMax = Math.max(...trend.map((t) => t.tutar), 1);

  // Mahalle dağılımı (son 6 ay)
  const mahalleDagilim = useMemo(() => {
    const m = new Map<string, { adet: number; tutar: number }>();
    for (const o of trendTahsilat) {
      const k = o.is?.ilce || "Belirtilmemiş";
      const v = m.get(k) ?? { adet: 0, tutar: 0 };
      m.set(k, { adet: v.adet + 1, tutar: v.tutar + (Number(o.tutar) || 0) });
    }
    return [...m.entries()].sort((a, b) => b[1].tutar - a[1].tutar).slice(0, 6);
  }, [trendTahsilat]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "ozet", label: "Özet" },
    { key: "gelirler", label: "Gelirler" },
    { key: "giderler", label: "Giderler" },
    { key: "odenmemis", label: `Alacak (${unpaidJobs.length})` },
    { key: "istatistik", label: "İstatistik" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-gray-900">Finans</h1><Link href="/admin/alacaklar" className="text-blue-600 text-sm font-medium">Alacaklar &rarr;</Link></div>

      {/* Ay seçici */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-2">
        <button onClick={() => setAy(ayKaydir(ay, -1))} className="p-2 text-gray-600 hover:text-blue-600" aria-label="Önceki ay">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <p className="font-semibold text-gray-900 capitalize">{ayAdi(ay)}</p>
          {ay !== buAy && (
            <button onClick={() => setAy(buAy)} className="text-xs text-blue-600">Bu aya dön</button>
          )}
        </div>
        <button
          onClick={() => setAy(ayKaydir(ay, 1))}
          disabled={ay >= buAy}
          className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-25"
          aria-label="Sonraki ay"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              tab === t.key ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          {tab === "ozet" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-sm text-green-600 font-medium">Gelir</p>
                  <p className="text-2xl font-bold text-green-700">{para(totalIncome)}</p>
                  <p className="text-xs text-green-500">{tahsilatlar.length} tahsilat</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-sm text-red-600 font-medium">Gider</p>
                  <p className="text-2xl font-bold text-red-700">{para(totalExpense)}</p>
                  <p className="text-xs text-red-500">{expenses.length} kalem</p>
                </div>
              </div>

              <div className={`rounded-xl p-5 border ${profit >= 0 ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"}`}>
                <p className={`text-sm font-medium ${profit >= 0 ? "text-blue-600" : "text-orange-600"}`}>Net Kar/Zarar</p>
                <p className={`text-3xl font-bold ${profit >= 0 ? "text-blue-700" : "text-orange-700"}`}>{para(profit)}</p>
              </div>

              {unpaidJobs.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600 font-medium">Tahsil Edilecek</p>
                      <p className="text-2xl font-bold text-amber-700">{para(totalUnpaid)}</p>
                      <p className="text-xs text-amber-500">{unpaidJobs.length} iş bekliyor</p>
                    </div>
                    <button onClick={() => setTab("odenmemis")} className="bg-amber-200 text-amber-800 text-sm font-medium px-3 py-1.5 rounded-lg">
                      Görüntüle
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Hizmete Göre Gelir</h3>
                {totalIncome === 0 ? (
                  <p className="text-sm text-gray-400">Bu ay gelir kaydı yok.</p>
                ) : (
                  <div className="space-y-2.5">
                    {Object.entries(HIZMET_TURLERI).map(([key, label]) => {
                      const amount = tahsilatlar.filter((o) => o.is?.hizmet_turu === key).reduce((s, o) => s + (Number(o.tutar) || 0), 0);
                      if (amount === 0) return null;
                      const oran = Math.round((amount / totalIncome) * 100);
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">{label}</span>
                            <span className="font-semibold text-gray-900">{para(amount)} <span className="text-gray-400 text-xs">%{oran}</span></span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${oran}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "gelirler" && (
            <div className="space-y-2">
              {tahsilatlar.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Bu ay tahsilat yok</p>
              ) : tahsilatlar.map((o) => (
                <Link key={o.id} href={`/admin/isler/${o.is_id}`} className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{o.is?.musteri?.ad || "—"}</p>
                    <p className="text-xs text-gray-500">
                      {tarihKisa(o.tarih)}
                      {o.is?.hizmet_turu ? ` • ${HIZMET_TURLERI[o.is.hizmet_turu] || o.is.hizmet_turu}` : ""}
                      {o.yontem ? ` • ${ODEME_YONTEMLERI[o.yontem] || o.yontem}` : ""}
                    </p>
                  </div>
                  <span className="font-bold text-green-600 shrink-0 ml-2">+{para(o.tutar)}</span>
                </Link>
              ))}
            </div>
          )}

          {tab === "giderler" && (
            <div className="space-y-3">
              <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600">
                {showExpenseForm ? "Vazgeç" : "+ Gider Ekle"}
              </button>

              {showExpenseForm && (
                <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                  <select value={giderKat} onChange={(e) => setGiderKat(e.target.value)} className="w-full px-3 py-2.5 border rounded-xl text-sm bg-white">
                    {Object.entries(GIDER_KATEGORILERI).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <input type="text" value={giderAcik} onChange={(e) => setGiderAcik(e.target.value)} placeholder="Açıklama *" className="w-full px-3 py-2.5 border rounded-xl text-sm" />
                  <input type="number" inputMode="numeric" value={giderTutar} onChange={(e) => setGiderTutar(e.target.value)} placeholder="Tutar (₺) *" className="w-full px-3 py-2.5 border rounded-xl text-sm" />

                  {/* Fiş fotoğrafı — muhasebe ve gider ispatı için */}
                  <label className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 cursor-pointer">
                    <span className="text-sm text-gray-600 truncate">
                      {fisDosya ? `🧾 ${fisDosya.name}` : "🧾 Fiş fotoğrafı ekle (isteğe bağlı)"}
                    </span>
                    {fisDosya ? (
                      <span
                        onClick={(e) => { e.preventDefault(); setFisDosya(null); }}
                        className="text-red-500 text-xs font-medium shrink-0"
                      >
                        Kaldır
                      </span>
                    ) : (
                      <span className="text-blue-600 text-xs font-medium shrink-0">Seç</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFisDosya(e.target.files?.[0] ?? null)}
                    />
                  </label>

                  <button onClick={addExpense} disabled={giderSaving} className="w-full bg-red-600 disabled:bg-red-400 text-white py-2.5 rounded-xl font-medium text-sm">
                    {giderSaving ? "Kaydediliyor..." : "Gideri Kaydet"}
                  </button>
                </div>
              )}

              {expenses.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Bu ay gider yok</p>
              ) : expenses.map((e) => (
                <div key={e.id} className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{e.aciklama}</p>
                    <p className="text-xs text-gray-500">
                      {tarihKisa(e.tarih)} • {GIDER_KATEGORILERI[e.kategori] || e.kategori}
                      {e.fis_url && (
                        <>
                          {" • "}
                          <a
                            href={e.fis_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-medium"
                          >
                            🧾 Fiş
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="font-bold text-red-600">-{para(e.tutar)}</span>
                    <button onClick={() => giderSil(e)} className="text-red-400 text-xs px-1">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "odenmemis" && (
            <div className="space-y-2">
              {unpaidJobs.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Tüm işler tahsil edildi 🎉</p>
              ) : unpaidJobs.map((j) => {
                const musteri = j.musteri as { ad: string; telefon: string } | null;
                return (
                  <div key={j.id} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{musteri?.ad || "—"}</p>
                        <p className="text-xs text-gray-500">
                          {tarihKisa(j.tarih)} • {HIZMET_TURLERI[j.hizmet_turu] || j.hizmet_turu}
                          {j.odeme_durumu === "kismi" && <span className="ml-1 text-orange-600 font-medium">• Kısmi</span>}
                        </p>
                      </div>
                      <span className="font-bold text-red-600">{para(kalanBakiye(j.tutar, kismiOdenen.get(j.id) ?? 0))}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/isler/${j.id}`} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-center text-sm font-medium">Detay</Link>
                      {musteri?.telefon && (
                        <a
                          href={`https://wa.me/${toIntlPhone(musteri.telefon)}?text=${encodeURIComponent(
                            `Merhaba ${musteri.ad}, ${tarihKisa(j.tarih)} tarihli tesisat işimiz için ödeme hatırlatması yapmak istiyorum.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-50 text-green-600 py-2 rounded-lg text-center text-sm font-medium"
                        >
                          Hatırlat
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "istatistik" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1">Son 6 Ay Gelir</h3>
                <p className="text-xs text-gray-400 mb-4">Tahsil edilmiş işler</p>
                <div className="flex items-end justify-between gap-2 h-40">
                  {trend.map((t) => (
                    <div key={t.ay} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="text-[10px] text-gray-500 mb-1 whitespace-nowrap">
                        {t.tutar > 0 ? `${Math.round(t.tutar / 1000)}b` : ""}
                      </span>
                      <div
                        className={`w-full rounded-t ${t.ay === buAy ? "bg-blue-600" : "bg-blue-300"}`}
                        style={{ height: `${Math.max((t.tutar / trendMax) * 100, 2)}%` }}
                        title={para(t.tutar)}
                      />
                      <span className="text-[10px] text-gray-500 mt-1.5 capitalize">
                        {ayAdi(t.ay).split(" ")[0].slice(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1">En Çok İş Gelen Mahalleler</h3>
                <p className="text-xs text-gray-400 mb-3">Son 6 ay</p>
                {mahalleDagilim.length === 0 ? (
                  <p className="text-sm text-gray-400">Henüz yeterli veri yok.</p>
                ) : (
                  <div className="space-y-2">
                    {mahalleDagilim.map(([ad, v]) => (
                      <div key={ad} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">📍 {ad}</span>
                        <span className="text-gray-500">
                          <span className="font-semibold text-gray-900">{v.adet}</span> iş • {para(v.tutar)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { monthStartISO, todayISO, toIntlPhone } from "@/lib/date";
import { HIZMET_TURLERI, GIDER_KATEGORILERI, type Is, type Gider } from "@/lib/types";

type Tab = "ozet" | "gelirler" | "giderler" | "odenmemis";

export default function FinansPage() {
  const [tab, setTab] = useState<Tab>("ozet");
  const [loading, setLoading] = useState(true);

  // Data
  const [paidJobs, setPaidJobs] = useState<Is[]>([]);
  const [unpaidJobs, setUnpaidJobs] = useState<Is[]>([]);
  const [expenses, setExpenses] = useState<Gider[]>([]);

  // Expense form
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [giderKat, setGiderKat] = useState("malzeme");
  const [giderAcik, setGiderAcik] = useState("");
  const [giderTutar, setGiderTutar] = useState("");
  const [giderSaving, setGiderSaving] = useState(false);

  const monthStart = monthStartISO();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const [paidRes, unpaidRes, expRes] = await Promise.all([
          supabase.from("isler").select("*, musteri:musteriler(ad)").eq("odeme_durumu", "odendi").gte("tarih", monthStart).order("tarih", { ascending: false }),
          supabase.from("isler").select("*, musteri:musteriler(ad, telefon)").eq("odeme_durumu", "odenmedi").eq("durum", "tamamlandi").order("tarih", { ascending: false }),
          supabase.from("giderler").select("*").gte("tarih", monthStart).order("tarih", { ascending: false }),
        ]);
        if (cancelled) return;
        setPaidJobs((paidRes.data as Is[]) || []);
        setUnpaidJobs((unpaidRes.data as Is[]) || []);
        setExpenses((expRes.data as Gider[]) || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [monthStart]);

  async function addExpense() {
    const tutarSayi = parseFloat(giderTutar);
    if (!giderAcik.trim() || !Number.isFinite(tutarSayi)) {
      alert("Açıklama ve geçerli bir tutar girin.");
      return;
    }
    setGiderSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("giderler").insert({
      kategori: giderKat,
      aciklama: giderAcik.trim(),
      tutar: tutarSayi,
      tarih: todayISO(),
    }).select().single();
    if (error || !data) {
      alert("Gider kaydedilemedi. " + dbHataMesaji(error));
    } else {
      setExpenses((prev) => [data as Gider, ...prev]);
      setGiderAcik("");
      setGiderTutar("");
      setShowExpenseForm(false);
    }
    setGiderSaving(false);
  }

  const totalIncome = paidJobs.reduce((sum, j) => sum + (Number(j.tutar) || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (Number(e.tutar) || 0), 0);
  const profit = totalIncome - totalExpense;
  const totalUnpaid = unpaidJobs.reduce((sum, j) => sum + (Number(j.tutar) || 0), 0);

  const tabs: { key: Tab; label: string }[] = [
    { key: "ozet", label: "Özet" },
    { key: "gelirler", label: "Gelirler" },
    { key: "giderler", label: "Giderler" },
    { key: "odenmemis", label: `Ödenmemiş (${unpaidJobs.length})` },
  ];

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Finans</h1>
      <p className="text-sm text-gray-500">
        {new Date().toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
      </p>

      {/* Tabs */}
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

      {/* Summary tab */}
      {tab === "ozet" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <p className="text-sm text-green-600 font-medium">Toplam Gelir</p>
              <p className="text-2xl font-bold text-green-700">{totalIncome.toLocaleString("tr-TR")} ₺</p>
              <p className="text-xs text-green-500">{paidJobs.length} iş</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-sm text-red-600 font-medium">Toplam Gider</p>
              <p className="text-2xl font-bold text-red-700">{totalExpense.toLocaleString("tr-TR")} ₺</p>
              <p className="text-xs text-red-500">{expenses.length} kalem</p>
            </div>
          </div>

          <div className={`rounded-xl p-5 border ${profit >= 0 ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"}`}>
            <p className={`text-sm font-medium ${profit >= 0 ? "text-blue-600" : "text-orange-600"}`}>Net Kar/Zarar</p>
            <p className={`text-3xl font-bold ${profit >= 0 ? "text-blue-700" : "text-orange-700"}`}>{profit.toLocaleString("tr-TR")} ₺</p>
          </div>

          {unpaidJobs.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Ödenmemiş İşler</p>
                  <p className="text-2xl font-bold text-amber-700">{totalUnpaid.toLocaleString("tr-TR")} ₺</p>
                  <p className="text-xs text-amber-500">{unpaidJobs.length} iş tahsil bekliyor</p>
                </div>
                <button onClick={() => setTab("odenmemis")} className="bg-amber-200 text-amber-800 text-sm font-medium px-3 py-1.5 rounded-lg">
                  Görüntüle
                </button>
              </div>
            </div>
          )}

          {/* Income by service type */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">Hizmete Göre Gelir</h3>
            <div className="space-y-2">
              {Object.entries(HIZMET_TURLERI).map(([key, label]) => {
                const amount = paidJobs.filter((j) => j.hizmet_turu === key).reduce((sum, j) => sum + (Number(j.tutar) || 0), 0);
                if (amount === 0) return null;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">{amount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Income tab */}
      {tab === "gelirler" && (
        <div className="space-y-2">
          {paidJobs.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Bu ay henüz ödenen iş yok</p>
          ) : paidJobs.map((j) => (
            <Link key={j.id} href={`/admin/isler/${j.id}`} className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100">
              <div>
                <p className="font-medium text-sm text-gray-900">{(j.musteri as { ad: string } | null)?.ad || "—"}</p>
                <p className="text-xs text-gray-500">
                  {new Date(j.tarih).toLocaleDateString("tr-TR")} • {HIZMET_TURLERI[j.hizmet_turu]}
                </p>
              </div>
              <span className="font-bold text-green-600">+{Number(j.tutar).toLocaleString("tr-TR")} ₺</span>
            </Link>
          ))}
        </div>
      )}

      {/* Expenses tab */}
      {tab === "giderler" && (
        <div className="space-y-3">
          <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600">
            + Gider Ekle
          </button>

          {showExpenseForm && (
            <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
              <select value={giderKat} onChange={(e) => setGiderKat(e.target.value)} className="w-full px-3 py-2.5 border rounded-xl text-sm bg-white">
                {Object.entries(GIDER_KATEGORILERI).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input type="text" value={giderAcik} onChange={(e) => setGiderAcik(e.target.value)} placeholder="Açıklama *" className="w-full px-3 py-2.5 border rounded-xl text-sm" />
              <input type="number" value={giderTutar} onChange={(e) => setGiderTutar(e.target.value)} placeholder="Tutar (₺) *" inputMode="numeric" className="w-full px-3 py-2.5 border rounded-xl text-sm" />
              <button onClick={addExpense} disabled={giderSaving} className="w-full bg-red-600 text-white py-2.5 rounded-xl font-medium text-sm">
                {giderSaving ? "Kaydediliyor..." : "Gideri Kaydet"}
              </button>
            </div>
          )}

          {expenses.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Bu ay henüz gider yok</p>
          ) : expenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100">
              <div>
                <p className="font-medium text-sm text-gray-900">{e.aciklama}</p>
                <p className="text-xs text-gray-500">
                  {new Date(e.tarih).toLocaleDateString("tr-TR")} • {GIDER_KATEGORILERI[e.kategori] || e.kategori}
                </p>
              </div>
              <span className="font-bold text-red-600">-{Number(e.tutar).toLocaleString("tr-TR")} ₺</span>
            </div>
          ))}
        </div>
      )}

      {/* Unpaid tab */}
      {tab === "odenmemis" && (
        <div className="space-y-2">
          {unpaidJobs.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Tüm işler ödendi!</p>
          ) : unpaidJobs.map((j) => {
            const musteri = j.musteri as { ad: string; telefon: string } | null;
            return (
              <div key={j.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{musteri?.ad || "—"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(j.tarih).toLocaleDateString("tr-TR")} • {HIZMET_TURLERI[j.hizmet_turu]}
                    </p>
                  </div>
                  <span className="font-bold text-red-600">{Number(j.tutar).toLocaleString("tr-TR")} ₺</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/isler/${j.id}`} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-center text-sm font-medium">Detay</Link>
                  {musteri?.telefon && (
                    <a
                      href={`https://wa.me/${toIntlPhone(musteri.telefon)}?text=${encodeURIComponent(`Merhaba ${musteri.ad}, ${new Date(j.tarih).toLocaleDateString("tr-TR")} tarihli tesisat işimiz için ödeme hatırlatması yapmak istiyorum.`)}`}
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
    </div>
  );
}

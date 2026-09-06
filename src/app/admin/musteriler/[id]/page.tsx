"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { toIntlPhone } from "@/lib/date";
import { HIZMET_TURLERI, DURUM_MAP, ODEME_DURUM_MAP, type Musteri, type Is } from "@/lib/types";

export default function MusteriDetayPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Musteri | null>(null);
  const [jobs, setJobs] = useState<Is[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ad: "", telefon: "", ilce: "", adres: "", notlar: "" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const [custRes, jobsRes] = await Promise.all([
          supabase.from("musteriler").select("*").eq("id", params.id).single(),
          supabase.from("isler").select("*").eq("musteri_id", params.id).order("tarih", { ascending: false }),
        ]);
        if (cancelled) return;
        const c = (custRes.data as Musteri) ?? null;
        setCustomer(c);
        if (c) setEditData({ ad: c.ad, telefon: c.telefon, ilce: c.ilce || "", adres: c.adres || "", notlar: c.notlar || "" });
        setJobs((jobsRes.data as Is[]) || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function handleSave() {
    const guncel = {
      ad: editData.ad,
      telefon: editData.telefon,
      ilce: editData.ilce || null,
      adres: editData.adres || null,
      notlar: editData.notlar || null,
    };
    const supabase = createClient();
    const { error } = await supabase.from("musteriler").update(guncel).eq("id", params.id);
    if (error) {
      alert("Kaydedilemedi. " + dbHataMesaji(error));
      return;
    }
    setCustomer((prev) => prev ? { ...prev, ...guncel } : prev);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Bu müşteriyi silmek istediğinize emin misiniz? İlişkili işler silinmez.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("musteriler").delete().eq("id", params.id);
    if (error) {
      alert("Silinemedi. " + dbHataMesaji(error));
      return;
    }
    router.push("/admin/musteriler");
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (!customer) return <div className="p-4 text-center text-gray-500">Müşteri bulunamadı</div>;

  const totalIncome = jobs.filter((j) => j.odeme_durumu === "odendi").reduce((sum, j) => sum + (Number(j.tutar) || 0), 0);
  const unpaidCount = jobs.filter((j) => j.odeme_durumu === "odenmedi" && j.durum === "tamamlandi").length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="text-blue-600 font-medium text-sm flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Geri
        </button>
        <div className="flex gap-2">
          <button onClick={() => setEditing(!editing)} className="text-blue-600 text-sm font-medium">{editing ? "İptal" : "Düzenle"}</button>
          <button onClick={handleDelete} className="text-red-500 text-sm font-medium">Sil</button>
        </div>
      </div>

      {/* Customer info */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        {editing ? (
          <div className="space-y-3">
            <input type="text" value={editData.ad} onChange={(e) => setEditData({ ...editData, ad: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ad Soyad" />
            <input type="tel" value={editData.telefon} onChange={(e) => setEditData({ ...editData, telefon: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Telefon" />
            <input type="text" value={editData.ilce} onChange={(e) => setEditData({ ...editData, ilce: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="İlçe" />
            <input type="text" value={editData.adres} onChange={(e) => setEditData({ ...editData, adres: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Adres" />
            <textarea value={editData.notlar} onChange={(e) => setEditData({ ...editData, notlar: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" placeholder="Notlar" />
            <button onClick={handleSave} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm">Kaydet</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600 text-xl">{customer.ad.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{customer.ad}</h2>
                <p className="text-gray-500">{customer.ilce && `📍 ${customer.ilce}`}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 w-20">Telefon:</span>
                <a href={`tel:+${toIntlPhone(customer.telefon)}`} className="text-blue-600 font-medium">{customer.telefon}</a>
              </div>
              {customer.adres && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 w-20">Adres:</span>
                  <span className="text-gray-700">{customer.adres}</span>
                </div>
              )}
              {customer.notlar && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 w-20">Not:</span>
                  <span className="text-gray-700">{customer.notlar}</span>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 mt-4">
              <a href={`tel:+${toIntlPhone(customer.telefon)}`} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-center font-medium text-sm">Ara</a>
              <a href={`https://wa.me/${toIntlPhone(customer.telefon)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25d366] text-white py-2.5 rounded-xl text-center font-medium text-sm">WhatsApp</a>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-xl font-bold text-gray-900">{jobs.length}</p>
          <p className="text-xs text-gray-500">Toplam İş</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-xl font-bold text-green-600">{totalIncome.toLocaleString("tr-TR")} ₺</p>
          <p className="text-xs text-gray-500">Toplam Gelir</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-xl font-bold text-red-600">{unpaidCount}</p>
          <p className="text-xs text-gray-500">Ödenmemiş</p>
        </div>
      </div>

      {/* Job history */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">İş Geçmişi</h3>
          <Link href={`/admin/isler/yeni`} className="text-blue-600 text-sm font-medium">+ Yeni İş</Link>
        </div>
        {jobs.length === 0 ? (
          <p className="text-gray-400 text-center py-6">Henüz iş kaydı yok</p>
        ) : (
          <div className="space-y-2">
            {jobs.map((j) => {
              const durum = DURUM_MAP[j.durum] || DURUM_MAP.beklemede;
              const odeme = ODEME_DURUM_MAP[j.odeme_durumu] || ODEME_DURUM_MAP.odenmedi;
              return (
                <Link key={j.id} href={`/admin/isler/${j.id}`} className="block bg-white rounded-xl p-3 border border-gray-100 active:bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm text-gray-500">{new Date(j.tarih).toLocaleDateString("tr-TR")}</span>
                    {j.tutar && <span className="font-bold text-sm">{Number(j.tutar).toLocaleString("tr-TR")} ₺</span>}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{HIZMET_TURLERI[j.hizmet_turu] || j.hizmet_turu}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${durum.bg} ${durum.color}`}>{durum.label}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${odeme.bg} ${odeme.color}`}>{odeme.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

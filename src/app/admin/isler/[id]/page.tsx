"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { dbHataMesaji } from "@/lib/db-error";
import { toIntlPhone, todayISO } from "@/lib/date";
import { para, tarihUzun, tarihKisa, saatKisa } from "@/lib/format";
import { yolTarifiLinki } from "@/lib/harita";
import {
  HIZMET_TURLERI,
  DURUM_MAP,
  ODEME_DURUM_MAP,
  ODEME_YONTEMLERI,
  ILCELER,
  type Is,
  type Musteri,
  type Odeme,
} from "@/lib/types";

/** Tahsil edilen tutara göre ödeme durumunu belirler. */
function odemeDurumuHesapla(tutar: number | null, odenen: number): string {
  if (odenen <= 0) return "odenmedi";
  if (tutar != null && odenen >= tutar) return "odendi";
  return "kismi";
}

export default function IsDetayPage() {
  const params = useParams();
  const router = useRouter();
  const isId = String(params.id);

  const [job, setJob] = useState<Is | null>(null);
  const [odemeler, setOdemeler] = useState<Odeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    hizmet_turu: "",
    tarih: "",
    saat: "",
    tutar: "",
    aciklama: "",
    ilce: "",
    adres: "",
    notlar: "",
  });

  const [odemeFormAcik, setOdemeFormAcik] = useState(false);
  const [odemeTutar, setOdemeTutar] = useState("");
  const [odemeYontem, setOdemeYontem] = useState("nakit");

  const yukle = useCallback(async () => {
    const supabase = createClient();
    const [isRes, odemeRes] = await Promise.all([
      supabase.from("isler").select("*, musteri:musteriler(*)").eq("id", isId).single(),
      supabase.from("odemeler").select("*").eq("is_id", isId).order("tarih", { ascending: false }),
    ]);
    const veri = (isRes.data as Is) ?? null;
    setJob(veri);
    setOdemeler((odemeRes.data as Odeme[]) || []);
    if (veri) {
      setForm({
        hizmet_turu: veri.hizmet_turu,
        tarih: veri.tarih,
        saat: saatKisa(veri.saat),
        tutar: veri.tutar != null ? String(veri.tutar) : "",
        aciklama: veri.aciklama ?? "",
        ilce: veri.ilce ?? "",
        adres: veri.adres ?? "",
        notlar: veri.notlar ?? "",
      });
    }
  }, [isId]);

  useEffect(() => {
    let cancelled = false;
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

  async function updateJob(updates: Partial<Is>) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("isler").update(updates).eq("id", isId);
    if (error) alert("Güncellenemedi. " + dbHataMesaji(error));
    else setJob((prev) => (prev ? { ...prev, ...updates } : prev));
    setSaving(false);
  }

  async function formKaydet() {
    const tutarSayi = form.tutar.trim() === "" ? null : parseFloat(form.tutar);
    if (tutarSayi != null && !Number.isFinite(tutarSayi)) {
      alert("Geçerli bir tutar girin.");
      return;
    }
    if (!form.tarih) {
      alert("Tarih boş olamaz.");
      return;
    }

    const guncel = {
      hizmet_turu: form.hizmet_turu,
      tarih: form.tarih,
      saat: form.saat || null,
      tutar: tutarSayi,
      aciklama: form.aciklama.trim() || null,
      ilce: form.ilce || null,
      adres: form.adres.trim() || null,
      notlar: form.notlar.trim() || null,
    };

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("isler").update(guncel).eq("id", isId);
    setSaving(false);
    if (error) {
      alert("Kaydedilemedi. " + dbHataMesaji(error));
      return;
    }
    setJob((prev) => (prev ? { ...prev, ...guncel } : prev));
    setEditing(false);
  }

  async function odemeEkle() {
    const t = parseFloat(odemeTutar);
    if (!Number.isFinite(t) || t <= 0) {
      alert("Geçerli bir tahsilat tutarı girin.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("odemeler")
      .insert({ is_id: isId, tutar: t, yontem: odemeYontem, tarih: todayISO() })
      .select()
      .single();

    if (error || !data) {
      setSaving(false);
      alert("Tahsilat kaydedilemedi. " + dbHataMesaji(error));
      return;
    }

    const yeniListe = [data as Odeme, ...odemeler];
    setOdemeler(yeniListe);
    setOdemeTutar("");
    setOdemeFormAcik(false);

    // Ödeme durumunu tahsilata göre otomatik güncelle
    const toplam = yeniListe.reduce((s, o) => s + Number(o.tutar), 0);
    const yeniDurum = odemeDurumuHesapla(job?.tutar ?? null, toplam);
    await supabase
      .from("isler")
      .update({ odeme_durumu: yeniDurum, odeme_yontemi: odemeYontem })
      .eq("id", isId);
    setJob((prev) => (prev ? { ...prev, odeme_durumu: yeniDurum, odeme_yontemi: odemeYontem } : prev));
    setSaving(false);
  }

  async function odemeSil(odeme: Odeme) {
    if (!confirm(`${para(odeme.tutar)} tutarındaki tahsilat kaydı silinsin mi?`)) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("odemeler").delete().eq("id", odeme.id);
    if (error) {
      setSaving(false);
      alert("Silinemedi. " + dbHataMesaji(error));
      return;
    }
    const yeniListe = odemeler.filter((o) => o.id !== odeme.id);
    setOdemeler(yeniListe);
    const toplam = yeniListe.reduce((s, o) => s + Number(o.tutar), 0);
    const yeniDurum = odemeDurumuHesapla(job?.tutar ?? null, toplam);
    await supabase.from("isler").update({ odeme_durumu: yeniDurum }).eq("id", isId);
    setJob((prev) => (prev ? { ...prev, odeme_durumu: yeniDurum } : prev));
    setSaving(false);
  }

  async function deleteJob() {
    if (!confirm("Bu işi silmek istediğinize emin misiniz? Tahsilat kayıtları da silinir.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("isler").delete().eq("id", isId);
    if (error) {
      alert("Silinemedi. " + dbHataMesaji(error));
      return;
    }
    router.push("/admin/isler");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }
  if (!job) return <div className="p-4 text-center text-gray-500">İş bulunamadı</div>;

  const musteri = job.musteri as Musteri | null;
  const toplamOdenen = odemeler.reduce((s, o) => s + Number(o.tutar), 0);
  const kalan = job.tutar != null ? Number(job.tutar) - toplamOdenen : null;

  // İşin kendi adresi yoksa müşterinin kayıtlı adresine düşüyoruz
  const yolTarifi =
    yolTarifiLinki([job.adres, job.ilce]) ??
    yolTarifiLinki([musteri?.adres, musteri?.mahalle, musteri?.ilce]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="text-blue-600 font-medium text-sm flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Geri
        </button>
        <div className="flex gap-3">
          <button onClick={() => setEditing((v) => !v)} className="text-blue-600 text-sm font-medium">
            {editing ? "Vazgeç" : "Düzenle"}
          </button>
          <button onClick={deleteJob} className="text-red-500 text-sm font-medium">Sil</button>
        </div>
      </div>

      {musteri && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-lg">{musteri.ad}</p>
              <p className="text-gray-500 text-sm">{musteri.ilce && `📍 ${musteri.ilce}`}</p>
            </div>
            <div className="flex gap-2">
              <a href={`tel:+${toIntlPhone(musteri.telefon)}`} className="bg-blue-600 text-white p-2.5 rounded-xl" aria-label="Ara">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              </a>
              <a href={`https://wa.me/${toIntlPhone(musteri.telefon)}`} target="_blank" rel="noopener noreferrer" className="bg-[#25d366] text-white p-2.5 rounded-xl" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L.05 23.5l5.793-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              </a>
            </div>
          </div>
          {musteri.adres && <p className="text-sm text-gray-500 mt-2">📍 {musteri.adres}</p>}
          <Link href={`/admin/musteriler/${musteri.id}`} className="text-blue-600 text-sm font-medium mt-2 inline-block">
            Müşteri Detayı &rarr;
          </Link>
        </div>
      )}

      {editing ? (
        <div className="bg-white rounded-xl p-4 border-2 border-blue-200 space-y-4">
          <h2 className="font-bold text-gray-900">İşi Düzenle</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hizmet Türü</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(HIZMET_TURLERI).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm({ ...form, hizmet_turu: key })}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                    form.hizmet_turu === key ? "bg-blue-600 text-white" : "bg-gray-50 border border-gray-200 text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tarih</label>
              <input type="date" value={form.tarih} onChange={(e) => setForm({ ...form, tarih: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Saat</label>
              <input type="time" value={form.saat} onChange={(e) => setForm({ ...form, saat: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tutar (₺)</label>
            <input type="number" inputMode="numeric" value={form.tutar} onChange={(e) => setForm({ ...form, tutar: e.target.value })} placeholder="Örn: 1500" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mahalle</label>
              <select value={form.ilce} onChange={(e) => setForm({ ...form, ilce: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                <option value="">Seçin</option>
                {ILCELER.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Adres</label>
              <input type="text" value={form.adres} onChange={(e) => setForm({ ...form, adres: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
            <textarea value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Özel Not</label>
            <textarea value={form.notlar} onChange={(e) => setForm({ ...form, notlar: e.target.value })} rows={2} placeholder="Sadece sen görürsün" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
          </div>

          <button onClick={formKaydet} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl">
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              {HIZMET_TURLERI[job.hizmet_turu] || job.hizmet_turu}
            </span>
            <span className="text-gray-500 text-sm">
              {tarihUzun(job.tarih)}
              {job.saat && ` • ${saatKisa(job.saat)}`}
            </span>
          </div>
          {job.tutar != null && <div className="text-3xl font-bold text-gray-900">{para(job.tutar)}</div>}
          {job.aciklama && <p className="text-gray-600">{job.aciklama}</p>}
          {job.adres && <p className="text-gray-500 text-sm">📍 {job.ilce && `${job.ilce} - `}{job.adres}</p>}
          {job.notlar && <p className="text-sm bg-amber-50 text-amber-900 rounded-lg p-3">📝 {job.notlar}</p>}

          {/* Adres iş kaydında yoksa müşterininkine düş */}
          {yolTarifi && (
            <a
              href={yolTarifi}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white font-semibold py-3 rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Yol Tarifi Al
            </a>
          )}
        </div>
      )}

      {/* Tahsilat */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Tahsilat</h2>
          <button onClick={() => setOdemeFormAcik((v) => !v)} className="text-blue-600 text-sm font-medium">
            {odemeFormAcik ? "Vazgeç" : "+ Tahsilat Ekle"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded-lg py-2">
            <p className="text-xs text-gray-500">Tutar</p>
            <p className="font-bold text-gray-900 text-sm">{job.tutar != null ? para(job.tutar) : "—"}</p>
          </div>
          <div className="bg-green-50 rounded-lg py-2">
            <p className="text-xs text-green-600">Tahsil edilen</p>
            <p className="font-bold text-green-700 text-sm">{para(toplamOdenen)}</p>
          </div>
          <div className={`rounded-lg py-2 ${kalan != null && kalan > 0 ? "bg-red-50" : "bg-gray-50"}`}>
            <p className={`text-xs ${kalan != null && kalan > 0 ? "text-red-600" : "text-gray-500"}`}>Kalan</p>
            <p className={`font-bold text-sm ${kalan != null && kalan > 0 ? "text-red-700" : "text-gray-900"}`}>
              {kalan != null ? para(Math.max(kalan, 0)) : "—"}
            </p>
          </div>
        </div>

        {odemeFormAcik && (
          <div className="bg-gray-50 rounded-xl p-3 space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={odemeTutar}
                onChange={(e) => setOdemeTutar(e.target.value)}
                placeholder={kalan != null && kalan > 0 ? `Kalan: ${kalan}` : "Tutar"}
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
              {kalan != null && kalan > 0 && (
                <button type="button" onClick={() => setOdemeTutar(String(kalan))} className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 whitespace-nowrap">
                  Tamamı
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ODEME_YONTEMLERI).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setOdemeYontem(k)}
                  className={`py-2 rounded-lg text-xs font-medium ${odemeYontem === k ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button onClick={odemeEkle} disabled={saving} className="w-full bg-green-600 disabled:bg-green-400 text-white font-medium py-2.5 rounded-xl text-sm">
              {saving ? "Kaydediliyor..." : "Tahsilatı Kaydet"}
            </button>
          </div>
        )}

        {odemeler.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {odemeler.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-1.5 last:border-0">
                <div>
                  <span className="font-semibold text-green-700">{para(o.tutar)}</span>
                  <span className="text-gray-400 text-xs ml-2">
                    {tarihKisa(o.tarih)} • {ODEME_YONTEMLERI[o.yontem] || o.yontem}
                  </span>
                </div>
                <button onClick={() => odemeSil(o)} className="text-red-400 text-xs px-2 py-1">Sil</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Durum */}
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

        <label className="block text-sm font-semibold text-gray-700 mt-3">Ödeme Durumu</label>
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
        {odemeler.length > 0 && (
          <p className="text-xs text-gray-400">Tahsilat ekledikçe bu durum otomatik güncellenir.</p>
        )}
      </div>

      {job.durum !== "tamamlandi" && (
        <button
          onClick={() => updateJob({ durum: "tamamlandi" })}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-xl text-lg transition-colors"
        >
          ✓ İşi Tamamla
        </button>
      )}
    </div>
  );
}

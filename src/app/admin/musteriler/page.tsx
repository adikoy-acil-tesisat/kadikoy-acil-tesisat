"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toIntlPhone } from "@/lib/date";
import { ILCELER, type Musteri } from "@/lib/types";

export default function MusterilerPage() {
  const [customers, setCustomers] = useState<Musteri[]>([]);
  const [search, setSearch] = useState("");
  const [ilceFilter, setIlceFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        let query = supabase.from("musteriler").select("*").order("olusturma_tarihi", { ascending: false }).limit(200);
        if (ilceFilter) query = query.eq("ilce", ilceFilter);
        const { data } = await query;
        if (!cancelled) setCustomers((data as Musteri[]) || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ilceFilter]);

  // Numara aramasında biçim farkı sorun çıkarmasın: "0531 865 38 02",
  // "+90 531 865 38 02" ve "5318653802" aynı müşteriyi bulmalı.
  const filtered = (() => {
    const q = search.trim();
    if (!q) return customers;

    const qRakam = q.replace(/\D/g, "");
    const qMetin = q.toLowerCase();

    return customers.filter((c) => {
      if (c.ad.toLowerCase().includes(qMetin)) return true;
      if (!qRakam) return false;
      const numaralar = [c.telefon, c.telefon2]
        .filter(Boolean)
        .map((t) => String(t).replace(/\D/g, "").replace(/^(90|0)/, ""));
      const hedef = qRakam.replace(/^(90|0)/, "");
      return numaralar.some((n) => n.includes(hedef));
    });
  })();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Müşteriler ({filtered.length})</h1>
        <Link href="/admin/musteriler/yeni" className="bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-xl">
          + Yeni
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="İsim veya telefon ara (0531... / 531... fark etmez)"
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* District filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => { setIlceFilter(""); setLoading(true); }}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${!ilceFilter ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
        >
          Tümü
        </button>
        {ILCELER.map((i) => (
          <button
            key={i}
            onClick={() => { setIlceFilter(i); setLoading(true); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${ilceFilter === i ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
          >
            {i}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {search ? "Sonuç bulunamadı" : "Henüz müşteri yok"}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100">
              <Link href={`/admin/musteriler/${c.id}`} className="flex items-center gap-3 flex-1 min-w-0 active:opacity-60">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="font-bold text-blue-600 text-sm">{c.ad.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{c.ad}</p>
                  <p className="text-xs text-gray-500 truncate">{c.telefon} {c.ilce && `• ${c.ilce}`}</p>
                </div>
              </Link>
              <div className="flex gap-2 shrink-0 ml-2">
                <a href={`tel:+${toIntlPhone(c.telefon)}`} className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </a>
                <a href={`https://wa.me/${toIntlPhone(c.telefon)}`} target="_blank" rel="noopener noreferrer" className="bg-green-50 text-green-600 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L.05 23.5l5.793-1.448A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

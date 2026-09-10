"use client";

import { useMemo } from "react";
import { todayISO } from "@/lib/date";
import { para } from "@/lib/format";
import type { Is } from "@/lib/types";

const GUN_BASLIKLARI = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

/** "2026-09" -> o ayın gün sayısı. */
function ayGunSayisi(ay: string): number {
  const [y, a] = ay.split("-").map(Number);
  return new Date(y, a, 0).getDate();
}

/** Ayın 1'i haftanın kaçıncı günü (0 = Pazartesi). */
function ilkGunKaydirma(ay: string): number {
  const [y, a] = ay.split("-").map(Number);
  return (new Date(y, a - 1, 1).getDay() + 6) % 7;
}

/** "2026-09" ay anahtarını n ay kaydırır. */
export function ayKaydir(ay: string, n: number): string {
  const [y, a] = ay.split("-").map(Number);
  const d = new Date(y, a - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

interface Props {
  /** Gösterilecek ay: "YYYY-MM" */
  ay: string;
  isler: Is[];
  seciliGun: string | null;
  onAyDegisti: (ay: string) => void;
  onGunSecildi: (tarih: string) => void;
}

/**
 * Aylık takvim ızgarası.
 *
 * Ajanda listesi "sırada ne var" sorusuna cevap veriyor ama "hangi günler
 * boş, hangi günler dolu" sorusuna vermiyordu. Izgarada her günün altında iş
 * sayısı kadar nokta var; yoğunluk bir bakışta görünüyor.
 */
export default function AyTakvimi({ ay, isler, seciliGun, onAyDegisti, onGunSecildi }: Props) {
  const bugun = todayISO();

  const gunler = useMemo(() => {
    const harita = new Map<string, { adet: number; tutar: number; bekleyen: boolean }>();
    for (const j of isler) {
      if (j.durum === "iptal") continue;
      const v = harita.get(j.tarih) ?? { adet: 0, tutar: 0, bekleyen: false };
      harita.set(j.tarih, {
        adet: v.adet + 1,
        tutar: v.tutar + (Number(j.tutar) || 0),
        bekleyen: v.bekleyen || j.durum !== "tamamlandi",
      });
    }
    return harita;
  }, [isler]);

  const gunSayisi = ayGunSayisi(ay);
  const kaydirma = ilkGunKaydirma(ay);
  const ayToplam = useMemo(
    () =>
      isler
        .filter((j) => j.tarih.startsWith(ay) && j.durum !== "iptal")
        .reduce((s, j) => s + (Number(j.tutar) || 0), 0),
    [isler, ay]
  );

  const ayAdiUzun = new Date(Number(ay.slice(0, 4)), Number(ay.slice(5, 7)) - 1, 1)
    .toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
      {/* Ay gezinme */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => onAyDegisti(ayKaydir(ay, -1))}
          className="p-2 text-gray-500 active:bg-gray-100 rounded-lg"
          aria-label="Önceki ay"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <div className="text-center">
          <p className="font-bold text-gray-900 capitalize">{ayAdiUzun}</p>
          {ayToplam > 0 && <p className="text-xs text-gray-400 tabular-nums">{para(ayToplam)}</p>}
        </div>
        <button
          onClick={() => onAyDegisti(ayKaydir(ay, 1))}
          className="p-2 text-gray-500 active:bg-gray-100 rounded-lg"
          aria-label="Sonraki ay"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {GUN_BASLIKLARI.map((g) => (
          <div key={g} className="text-center text-[11px] font-medium text-gray-400 py-1">{g}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: kaydirma }, (_, i) => <div key={`bos-${i}`} />)}

        {Array.from({ length: gunSayisi }, (_, i) => {
          const gun = i + 1;
          const tarih = `${ay}-${String(gun).padStart(2, "0")}`;
          const veri = gunler.get(tarih);
          const secili = seciliGun === tarih;
          const buGun = tarih === bugun;

          return (
            <button
              key={tarih}
              onClick={() => onGunSecildi(tarih)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-colors ${
                secili
                  ? "bg-blue-600 text-white font-bold"
                  : buGun
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : veri
                  ? "bg-gray-50 text-gray-900 font-medium"
                  : "text-gray-400"
              }`}
            >
              <span className="tabular-nums leading-none">{gun}</span>
              {/* En fazla üç nokta; daha fazlası için "+" */}
              <span className="flex items-center gap-0.5 h-1.5">
                {veri
                  ? Array.from({ length: Math.min(veri.adet, 3) }, (_, k) => (
                      <span
                        key={k}
                        className={`w-1 h-1 rounded-full ${
                          secili ? "bg-white" : veri.bekleyen ? "bg-amber-500" : "bg-green-500"
                        }`}
                      />
                    ))
                  : null}
                {veri && veri.adet > 3 && (
                  <span className={`text-[8px] leading-none ${secili ? "text-white" : "text-gray-400"}`}>+</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> bekleyen</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> tamamlanan</span>
      </div>
    </div>
  );
}

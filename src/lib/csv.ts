/**
 * CSV dışa aktarma — muhasebe için ve yedek olarak.
 *
 * Excel Türkçe Windows'ta virgülü ondalık ayırıcı saydığı için alan ayırıcı
 * olarak noktalı virgül kullanıyoruz; ayrıca UTF-8 BOM ekliyoruz, yoksa Excel
 * Türkçe karakterleri bozuk gösteriyor.
 */

const AYIRICI = ";";

function hucre(deger: unknown): string {
  if (deger == null) return "";
  const s = String(deger);
  // Ayırıcı, tırnak veya satır sonu içeren değerler tırnaklanmalı
  if (s.includes(AYIRICI) || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function csvOlustur(basliklar: string[], satirlar: unknown[][]): string {
  const hepsi = [basliklar, ...satirlar];
  return hepsi.map((satir) => satir.map(hucre).join(AYIRICI)).join("\r\n");
}

export function csvIndir(icerik: string, dosyaAdi: string): void {
  // BOM: Excel'in UTF-8 olduğunu anlaması için
  const blob = new Blob(["﻿", icerik], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = dosyaAdi;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

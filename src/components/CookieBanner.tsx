"use client";

import { useCallback, useSyncExternalStore } from "react";
import { CEREZ_ANAHTARI, analitikOnayiBildir } from "@/lib/cerez";

const STORAGE_KEY = CEREZ_ANAHTARI;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // Gizli sekme / çerez engelli tarayıcı: banner'ı gösterme
    return "accepted";
  }
}

// Sunucuda localStorage yok; banner'ı render etmiyoruz.
// React hydration'da önce bu değeri, sonra istemci değerini kullanır.
function getServerSnapshot(): string | null {
  return "accepted";
}

export default function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // yazılamıyorsa da banner'ı kapat
    }
    // Analytics izin bekliyordu; onayı buradan yükseltiyoruz.
    analitikOnayiBildir();
    listeners.forEach((listener) => listener());
  }, []);

  if (consent) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          Bu web sitesi deneyiminizi iyileştirmek için çerezler kullanmaktadır.
          Siteyi kullanmaya devam ederek{" "}
          <span className="text-white font-medium">KVKK ve çerez politikamızı</span> kabul etmiş olursunuz.
        </p>
        <button
          onClick={accept}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-full text-sm whitespace-nowrap transition-colors"
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
}

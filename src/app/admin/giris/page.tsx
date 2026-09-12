"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { dbHataMesaji } from "@/lib/db-error";

/**
 * Giriş hatalarını ayırt eder.
 *
 * Önce hepsi "Email veya şifre hatalı" diye gösteriliyordu. Doğrulanmamış
 * e-posta da bu mesajı alıyordu; o durumda şifre doğru olduğu hâlde insan
 * şifresini yanlış sanıp boşuna deniyor.
 */
function girisHatasi(mesaj: string): string {
  const m = mesaj.toLowerCase();
  if (m.includes("email not confirmed") || m.includes("not_confirmed")) {
    return (
      "E-posta adresiniz doğrulanmamış. Supabase panelinde " +
      "Authentication > Users bölümünden hesabı onaylayın."
    );
  }
  if (m.includes("invalid login") || m.includes("invalid credentials")) {
    return "Email veya şifre hatalı.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Çok fazla deneme yapıldı. Birkaç dakika bekleyip tekrar deneyin.";
  }
  if (m.includes("user not found")) {
    return "Bu e-posta ile kayıtlı kullanıcı yok.";
  }
  return dbHataMesaji(new Error(mesaj));
}

export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  /** Supabase'in ham mesajı — teşhis için küçük puntoyla gösterilir. */
  const [hamHata, setHamHata] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(girisHatasi(error.message));
      setHamHata(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <LogoMark size={64} idPrefix="giris" className="inline-block mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Kadıköy Acil Tesisat</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Paneli</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-lg"
              placeholder="admin@kadikoyaciltesisat.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-lg"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
              {hamHata && (
                <p className="mt-1.5 text-[11px] font-mono text-red-400 break-all select-all">
                  {hamHata}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition-colors text-lg"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}

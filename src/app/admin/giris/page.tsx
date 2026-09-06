"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { dbHataMesaji } from "@/lib/db-error";

export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Bağlantı/yapılandırma sorunlarını "şifre hatalı" diye göstermeyelim;
      // yalnızca sunucu gerçekten kimlik bilgilerini reddettiyse öyle diyoruz.
      const kimlikHatasi = /invalid login|invalid credentials|email not confirmed/i.test(error.message);
      setError(kimlikHatasi ? "Email veya şifre hatalı." : dbHataMesaji(error));
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
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">{error}</div>
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

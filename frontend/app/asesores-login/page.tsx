"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../services/supabaseClient";

export default function AsesoresLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: username.trim(),
        password: password
      });

      if (signInError || !data.user) {
        setError("Usuario o contraseña incorrectos.");
      } else {
        // Authentication success
        localStorage.setItem("asesores_session", "true");
        router.push("/portal-asesores");
      }
    } catch (err) {
      console.error("Login verification failed:", err);
      setError("Ocurrió un error inesperado. Inténtelo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002868] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-95 transition-all">
            <img
              src="/VisaScore Transparente.png"
              alt="VisaScore Logo"
              className="h-10 md:h-12 w-auto mx-auto brightness-0 invert"
            />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-4 text-[10px] font-extrabold uppercase tracking-widest text-[#FF9900] bg-white/10 rounded-full border border-white/20">
            <Lock className="w-3 h-3" /> Área Administrativa
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Ingreso de Asesores</h2>
          <p className="text-xs text-slate-500 mb-6">
            Inicie sesión con sus credenciales autorizadas para acceder a la gestión de expedientes.
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-6 text-sm font-bold flex items-start gap-2.5 animate-fadeIn">
              <ShieldAlert className="w-5 h-5 text-[#CC0000] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@visascore.info"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition text-sm font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition text-sm font-medium text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#CC0000] hover:bg-red-800 text-white font-extrabold tracking-wide uppercase py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verificando..." : "Ingresar Seguro"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-xs font-bold text-blue-200 hover:text-white transition-colors underline">
            ← Volver a la Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}

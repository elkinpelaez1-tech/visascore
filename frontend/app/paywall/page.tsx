"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import ProfessionalAdvisory from "../components/ProfessionalAdvisory";
import LegalNotice from "../components/LegalNotice";

export default function PaywallPage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('[Analytics] paywall_viewed', { testId });
  }, [testId]);

  const handlePayment = () => {
    setIsLoading(true);
    console.log('[Analytics] payment_initiated', { testId });
    setTimeout(() => {
      window.alert("Redirigiendo a pasarela segura de Wompi...");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4">
      {/* Header Logotipo */}
      <div className="mb-12">
        <Link href="/">
          <img 
            src="/VisaScore Transparente.png" 
            alt="VisaScore Logo" 
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Columna Izquierda: El Gancho Visual */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-10 -mt-10" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                <CheckCircle2 size={14} strokeWidth={4} /> Perfil Analizado con éxito
              </div>

              <h1 className="text-4xl md:text-5xl font-black font-heading text-slate-900 leading-[1.1] mb-6">
                Tu VisaScore<br/>está listo
              </h1>

              <p className="text-slate-500 text-lg font-medium mb-10 leading-relaxed">
                Desbloquea tu resultado completo para conocer tu probabilidad real de aprobación de visa americana.
              </p>

              {/* Score Oculto - El Imán de Curiosidad */}
              <div className="bg-slate-900 rounded-[32px] p-10 text-white flex items-center justify-between overflow-hidden relative group">
                <div className="absolute inset-0 bg-usa-blue/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                   <div className="text-blue-400 font-black text-xs uppercase tracking-widest mb-1">Tu Resultado</div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black blur-md select-none">742</span>
                      <span className="text-2xl font-bold text-slate-500">/ 1000</span>
                   </div>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 mb-2">
                      <Lock className="text-white w-8 h-8" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bloqueado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-white">
            <h3 className="text-slate-900 font-black text-lg mb-8 flex items-center gap-3 font-heading">
               ¿Qué incluye tu reporte?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { t: "Tu VisaScore (0 – 1000)", d: "Puntaje de viabilidad exacto" },
                 { t: "Probabilidad Estimada", d: "Porcentaje real de éxito" },
                 { t: "Fortalezas de Perfil", d: "Tus puntos más fuertes" },
                 { t: "Factores de Riesgo", d: "Lo que el cónsul cuestionará" },
                 { t: "Recomendaciones", d: "Guía para mejorar tu perfil" },
                 { t: "Simulador de Score", d: "Visualiza cambios a futuro" },
                 { t: "Reporte PDF", d: "Descargable profesional" }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                       <CheckCircle2 size={16} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    <div>
                       <div className="font-black text-sm text-slate-900 mb-0.5">{item.t}</div>
                       <div className="text-xs text-slate-400 font-medium">{item.d}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: El Checkout */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-2xl shadow-blue-900/10 border-2 border-usa-blue relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-usa-blue text-white px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest">
              Acceso Único
            </div>

            <div className="mb-10 pt-4">
              <div className="flex items-center gap-1 mb-2">
                 {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />)}
                 <span className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Miles de perfiles analizados</span>
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Inversión para tu visa</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-6xl font-black font-heading text-slate-900">$50.000</span>
                <span className="text-xl font-bold text-slate-400 uppercase">COP</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-usa-blue text-white py-8 rounded-[32px] font-black text-xl shadow-2xl shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 relative overflow-hidden group mb-8"
            >
              <span className="flex items-center gap-2">Desbloquear mi VisaScore <ArrowRight size={20} /></span>
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Pago 100% Seguro</span>
            </button>

            <div className="space-y-4 mb-4">
               <div className="flex items-center justify-center gap-4 py-4 border-y border-slate-50 italic text-slate-500 text-sm text-center px-4">
                  "Tu análisis ya fue generado. Desbloquéalo ahora para ver tu resultado completo."
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                     <ShieldCheck size={14} className="text-emerald-500" /> 2 Minutos
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                     <ShieldCheck size={14} className="text-emerald-500" /> Reporte Pro
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                     <ShieldCheck size={14} className="text-emerald-500" /> DS-160 Ready
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                     <ShieldCheck size={14} className="text-emerald-500" /> Wompi Safe
                  </div>
               </div>
            </div>

            <div className="flex flex-col items-center gap-3 mt-8">
               <img src="https://checkout.wompi.co/img/logos-pago.png" alt="Metodos de pago" className="h-6 grayscale opacity-50" />
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                 Transacción protegida por Wompi
               </p>
            </div>
          </div>

          <ProfessionalAdvisory />
          <LegalNotice />
        </div>
      </motion.div>

      <Link href="/" className="mt-12 text-slate-400 hover:text-usa-blue transition-colors text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
        ← Volver al inicio
      </Link>
    </div>
  );
}

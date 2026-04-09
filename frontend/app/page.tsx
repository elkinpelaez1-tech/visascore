"use client";

import Link from "next/link";
import { ShieldCheck, BarChart3, Zap, ArrowRight, CheckCircle2, Users, FileText } from "lucide-react";
import LegalNotice from "./components/LegalNotice";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* HEADER */}
      <header className="px-4 lg:px-8 h-20 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
            <img
              src="/VisaScore Transparente.png"
              alt="VisaScore Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>
        </div>
        <nav className="flex items-center gap-4 md:gap-8">
          <Link className="text-sm font-bold text-gray-600 hover:text-[#002868] transition-colors hidden sm:block" href="/quienes-somos">
            Quiénes Somos
          </Link>
          <Link
            className="text-sm font-bold bg-[#FF9900] text-white px-6 py-3 rounded-full hover:bg-[#E68A00] hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
            href="/test"
            onClick={() => { if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') (window as any).gtag('event', 'begin_test'); }}
          >
            Calcular mi Score <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* BLOQUE 1 — HERO */}
        <section className="w-full py-16 md:py-28 relative overflow-hidden bg-white">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#002868] text-xs md:text-sm font-bold mb-8">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                ANÁLISIS DE PERFIL BASADO EN CRITERIOS CONSULARES
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
                ¿Vas a arriesgar más de <span className="text-[#CC0000]">$800.000 COP</span> sin saber si te aprobarán la visa?
              </h1>
              <div className="text-lg md:text-2xl text-gray-600 mb-12 max-w-2xl font-medium leading-relaxed">
                <p className="mb-4 text-gray-500 text-base md:text-lg">Antes de pagar:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left md:text-center text-gray-700 font-bold mb-8">
                  <div className="flex items-center md:justify-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-red-500">•</span> $185 USD derechos
                  </div>
                  <div className="flex items-center md:justify-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-red-500">•</span> $300.000 trámite
                  </div>
                  <div className="flex items-center md:justify-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-red-500">•</span> Tiempo y tiquetes
                  </div>
                </div>
                <p className="text-gray-900 font-bold bg-yellow-100 px-4 py-2 inline-block rounded-lg mt-4">
                  Descubre tu probabilidad real por solo $50.000 COP
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/test"
                  className="inline-flex w-full sm:w-auto h-16 items-center justify-center rounded-2xl bg-[#FF9900] px-12 text-xl font-black text-white shadow-[0_10px_30px_-10px_rgba(255,153,0,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(255,153,0,0.6)] hover:-translate-y-1 hover:bg-[#E68A00] transition-all active:scale-95"
                  onClick={() => { if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') (window as any).gtag('event', 'begin_test'); }}
                >
                  Calcular mi VisaScore ahora →
                </Link>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center text-sm font-bold text-gray-500 mt-2">
                  <span className="text-green-600">✔ Resultado inmediato</span>
                  <span className="text-blue-600">✔ Criterios reales del cónsul</span>
                  <span className="text-purple-600">✔ +500 perfiles evaluados</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 right-0 -mr-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-1/4 left-0 -ml-40 w-96 h-96 bg-red-100/50 rounded-full blur-3xl -z-10" />
        </section>

        {/* 🟠 BLOQUE 2 — PROBLEMA (DOLOR) */}
        <section className="w-full py-24 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-12 text-center leading-tight">
                Cada año miles de colombianos pierden su visa…<br />
                <span className="text-[#CC0000]">y con ella, más de $800.000 COP por intento.</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold italic">?</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Sin explicación.</h3>
                      <p className="text-gray-600 font-medium leading-relaxed">Sales de la embajada sin saber qué salió mal en tu perfil.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold italic">!</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Sin saber qué ajustar.</h3>
                      <p className="text-gray-600 font-medium leading-relaxed">Vuelves a aplicar y te vuelven a negar por el mismo motivo.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-[#CC0000]">
                  <p className="text-lg md:text-xl text-gray-800 font-bold mb-4 italic leading-relaxed">
                    "El cónsul evalúa factores que tú no ves… pero que ya están afectando tu resultado."
                  </p>
                  <p className="text-gray-600 font-bold text-base">
                    ¿Y si estás aplicando con errores sin saberlo?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#002868 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </section>

        {/* 🟡 BLOQUE 3 — VALOR (QUÉ OBTIENE) */}
        <section id="benefits" className="w-full py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Por solo <span className="text-[#002868]">$50.000 COP</span> obtienes:
              </h2>
              <p className="text-gray-600 text-lg font-medium tracking-wide">Todo en minutos. Sin adivinar. Sin riesgos.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { title: 'Tu VisaScore de 0 a 1000', desc: 'Una métrica precisa basada en algoritmos de riesgo migratorio.', icon: BarChart3, color: 'text-blue-600' },
                { title: 'Probabilidad real', desc: 'Clasificación clara: Baja, Media o Alta según tus respuestas.', icon: Zap, color: 'text-yellow-600' },
                { title: 'Razones de posible rechazo', desc: 'Identificamos los 3 factores que más ponen en riesgo tu visa.', icon: ShieldCheck, color: 'text-red-600' },
                { title: 'Recomendaciones claras', desc: 'Pasos accionables para fortalecer tu perfil antes de la cita.', icon: CheckCircle2, color: 'text-green-600' },
                { title: 'Consejos para DS-160', desc: 'Técnicas actuales para completar el formulario y la entrevista.', icon: FileText, color: 'text-blue-600' },
                { title: 'Informe PDF descargable', desc: 'Tu análisis completo listo para revisar en cualquier momento.', icon: Users, color: 'text-purple-600' }
              ].map((item, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`p-4 rounded-2xl bg-gray-50 mb-6 inline-block ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-4 leading-tight">{item.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/test"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#FF9900] px-10 text-lg font-bold text-white shadow-lg hover:bg-[#E68A00] transition-all"
                onClick={() => { if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') (window as any).gtag('event', 'begin_test'); }}
              >
                Empezar mi evaluación ahora
              </Link>
            </div>
          </div>
        </section>

        {/* 🟢 BLOQUE 4 — TESTIMONIO */}
        <section className="w-full py-24 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-blue-50 opacity-10">
                <Users size={200} />
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-lg relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop"
                  alt="Carlos M."
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-bold text-gray-800 mb-6 italic leading-relaxed text-center md:text-left">
                  “Pensé que estaba listo… pero mi score fue 54. Corregí lo que me indicó el sistema y en la entrevista me aprobaron.”
                </p>
                <div className="text-center md:text-left">
                  <h4 className="font-extrabold text-gray-900 uppercase tracking-wide">Carlos M., Medellín</h4>
                  <p className="text-green-600 font-bold flex items-center justify-center md:justify-start gap-2 mt-2">
                    <CheckCircle2 size={18} /> Visa aprobada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔵 BLOQUE 5 — CTA FINAL */}
        <section className="w-full py-24 md:py-32 bg-[#002868] relative overflow-hidden text-white">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
                No pierdas más de <span className="text-[#CC0000]">$800.000 COP</span> por aplicar a ciegas.
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 font-medium">
                Evalúa tu perfil hoy por solo <span className="text-white font-black">$50.000</span> y aumenta tus probabilidades reales.
              </p>

              <Link
                href="/test"
                className="inline-flex h-20 items-center justify-center rounded-2xl bg-[#FF9900] px-16 text-2xl font-black text-white shadow-[0_20px_40px_-10px_rgba(255,153,0,0.5)] hover:bg-[#E68A00] hover:scale-105 transition-all w-full sm:w-auto"
                onClick={() => { if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') (window as any).gtag('event', 'begin_test'); }}
              >
                Empezar mi evaluación ahora →
              </Link>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FF9900 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-20 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-4">
              <img
                src="/VisaScore Transparente.png"
                alt="VisaScore Logo"
                className="h-10 w-auto opacity-90"
              />
              <p className="text-sm text-gray-500 font-medium max-w-xs leading-relaxed">
                Inteligencia de datos para aplicaciones consulares. © {new Date().getFullYear()} VisaScore.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-gray-500">
              <Link className="hover:text-[#002868] transition-colors" href="/quienes-somos">Qué obtienes</Link>
              <Link className="hover:text-[#002868] transition-colors" href="/faq">Preguntas</Link>
              <Link className="hover:text-[#002868] transition-colors" href="/terminos">Términos</Link>
              <Link className="hover:text-[#002868] transition-colors" href="/privacidad">Privacidad</Link>
            </div>
          </div>

          <div className="w-full max-w-4xl mx-auto pt-12 border-t border-gray-100">
            <LegalNotice />
          </div>
        </div>
      </footer>
    </div>
  );
}

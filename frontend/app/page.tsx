"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, BarChart3, Zap, ArrowRight, CheckCircle2, Users, FileText,
  User, Clock, Award
} from "lucide-react";
import LegalNotice from "./components/LegalNotice";
import LegalModal from "../components/ui/LegalModal";

type LegalDocType = 'terms' | 'habeas' | 'cookies' | null;

export default function LandingPage() {
  // ─── Calculator State (client-side only, never touches backend or Supabase) ───
  const [calculatorStep, setCalculatorStep] = useState(1);
  const [calcAnswers, setCalcAnswers] = useState({
    income: '',
    travels: '',
    ties: '',
    warnings: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [estimatedScore, setEstimatedScore] = useState(0);

  // ─── Legal Modal State ───
  const [legalDoc, setLegalDoc] = useState<LegalDocType>(null);

  const resetCalculator = () => {
    setCalculatorStep(1);
    setCalcAnswers({ income: '', travels: '', ties: '', warnings: '' });
    setShowResult(false);
    setEstimatedScore(0);
  };

  const handleCalcAnswer = (field: keyof typeof calcAnswers, value: string, nextStep: number) => {
    const updated = { ...calcAnswers, [field]: value };
    setCalcAnswers(updated);
    if (nextStep > 4) {
      let base = 600;
      if (updated.income === 'Si') base += 150;
      if (updated.travels === 'Si') base += 150;
      if (updated.ties === 'Si') base += 100;
      if (updated.warnings === 'No') base += 50;
      setEstimatedScore(Math.min(990, Math.max(350, base)));
      setShowResult(true);
    } else {
      setCalculatorStep(nextStep);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          HEADER — sin cambios respecto al original
      ═══════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════
            BLOQUE 1 — HERO — sin cambios respecto al original
        ═══════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════
            NUEVO — SECCIÓN RIESGOS: ¿Por qué prepararse?
        ═══════════════════════════════════════════════════════ */}
        <section className="w-full py-20 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-sm font-extrabold text-[#CC0000] uppercase tracking-wider">
                ¿Por qué iniciar correctamente tu proceso?
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 leading-tight">
                Una solicitud mal preparada puede generar consecuencias costosas
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
              {[
                {
                  title: "Pérdida de Derechos Consulares",
                  value: "USD 185",
                  desc: "La tasa consular NO es reembolsable. Si tu visa es rechazada, pierdes este dinero inmediatamente.",
                  icon: "❌"
                },
                {
                  title: "Gastos de Desplazamiento",
                  value: "Billetes y Viáticos",
                  desc: "Desplazamientos a Bogotá para toma de datos biométricos y cita consular sin preparación.",
                  icon: "❌"
                },
                {
                  title: "Tiempo Perdido",
                  value: "Meses de Espera",
                  desc: "Las citas tienen meses de retraso. Una solicitud rechazada te obliga a iniciar la fila desde cero.",
                  icon: "❌"
                },
                {
                  title: "Negación Permanente",
                  value: "Historial Negativo",
                  desc: "Un historial negativo disminuye de forma drástica tus probabilidades de aprobación futura.",
                  icon: "❌"
                },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-base font-extrabold text-gray-900 mb-1">{item.title}</h3>
                  <span className="block text-sm font-extrabold text-[#CC0000] mb-3 uppercase tracking-wider">{item.value}</span>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl text-center max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-[#002868] font-bold mb-5">
                Conoce tu probabilidad real antes de invertir. Evalúa tu perfil con VisaScore.
              </p>
              <Link
                href="/test"
                className="inline-flex items-center gap-2 bg-[#002868] hover:bg-blue-900 text-white font-extrabold uppercase px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all text-sm"
                onClick={() => { if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') (window as any).gtag('event', 'begin_test'); }}
              >
                Calcular mi VisaScore <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            BLOQUE 2 — PROBLEMA (DOLOR) — sin cambios
        ═══════════════════════════════════════════════════════ */}
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
                    &ldquo;El cónsul evalúa factores que tú no ves… pero que ya están afectando tu resultado.&rdquo;
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

        {/* ═══════════════════════════════════════════════════════
            NUEVO — SECCIÓN ACOMPAÑAMIENTO: ¿Qué incluye?
        ═══════════════════════════════════════════════════════ */}
        <section className="w-full py-24 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-extrabold text-[#002868] uppercase tracking-wider">Acompañamiento de Extremo a Extremo</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-3 leading-tight">
                ¿Qué incluye nuestro acompañamiento?
              </h2>
              <p className="text-gray-600 mt-4 font-medium">
                Diseñamos una experiencia profesional para guiar cada detalle de tu solicitud de visa americana.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Revisión de documentación",
                  desc: "Validamos que cumplas con los documentos e ingresos necesarios para soportar tu arraigo.",
                  icon: <FileText className="w-6 h-6 text-[#002868]" />
                },
                {
                  title: "Captura profesional DS-160",
                  desc: "Asistencia experta para el desglose y orden cronológico de toda tu información personal.",
                  icon: <User className="w-6 h-6 text-[#002868]" />
                },
                {
                  title: "Diligenciamiento del formulario",
                  desc: "Ingreso sin errores técnicos ni omisiones en la plataforma consular oficial en inglés.",
                  icon: <CheckCircle2 className="w-6 h-6 text-[#002868]" />
                },
                {
                  title: "Revisión de inconsistencias",
                  desc: "Corregimos redacciones ambiguas antes del cargue que puedan alarmar al oficial consular.",
                  icon: <ShieldCheck className="w-6 h-6 text-[#002868]" />
                },
                {
                  title: "Preparación para entrevista",
                  desc: "Simulacro y asesoramiento sobre respuestas estratégicas basadas en tus condiciones particulares.",
                  icon: <Award className="w-6 h-6 text-[#002868]" />
                },
                {
                  title: "Asignación de cita AIS",
                  desc: "Separamos la cita para tu entrevista con seguimiento del proceso en tiempo real.",
                  icon: <Clock className="w-6 h-6 text-[#002868]" />
                },
              ].map((service, i) => (
                <div key={i} className="group bg-white border border-gray-100 p-7 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 flex gap-4">
                  <div className="bg-blue-50 p-3 h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            BLOQUE 3 — VALOR (QUÉ OBTIENE) — sin cambios
        ═══════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════
            NUEVO — CALCULADORA INTERACTIVA (solo client-side)
            NOTA: NO reemplaza el flujo VisaScore en /test
        ═══════════════════════════════════════════════════════ */}
        <section id="visascore-tools" className="w-full py-24 bg-[#002868] text-white relative overflow-hidden scroll-mt-20">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

              {/* Descripción */}
              <div>
                <span className="text-sm font-extrabold text-white uppercase tracking-wider bg-[#CC0000] px-4 py-1.5 rounded-full inline-block mb-5 shadow-sm">
                  Herramienta Gratuita Complementaria
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight">
                  Antes de iniciar tu trámite, conoce tu perfil migratorio.
                </h2>
                <p className="text-base text-blue-100 leading-relaxed mb-6 font-light">
                  Este simulador analiza 4 variables clave para mostrarte posibles alertas de riesgo antes de que presentes tu postulación consular.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "Algoritmo entrenado con miles de casos consulares colombianos.",
                    "Evaluación instantánea y privada sin recopilar datos bancarios.",
                    "Este simulador complementa — NO reemplaza — la evaluación completa de VisaScore.",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-blue-100">
                      <CheckCircle2 className="w-5 h-5 text-[#FF9900] flex-shrink-0 mt-0.5" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculadora */}
              <div className="bg-white text-gray-900 rounded-3xl p-6 md:p-8 shadow-2xl relative">
                <span className="absolute top-4 right-4 text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Micro-Simulador
                </span>

                {!showResult ? (
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">Simulador VisaScore</h3>
                    <p className="text-xs text-gray-500 mb-5">Completa estas 4 preguntas para estimar tu perfil:</p>

                    {/* Barra de progreso */}
                    <div className="flex gap-1.5 mb-6">
                      {[1, 2, 3, 4].map((s) => (
                        <div
                          key={s}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= calculatorStep ? 'bg-[#002868]' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>

                    <div className="space-y-4">
                      {calculatorStep === 1 && (
                        <div>
                          <label className="block text-sm font-extrabold text-gray-700 mb-4">
                            1. ¿Posees estabilidad laboral formal, pensión o negocio registrado?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => handleCalcAnswer('income', 'Si', 2)}
                              className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#002868] hover:bg-blue-50 font-bold transition-all text-sm text-gray-700 active:scale-95"
                            >Sí</button>
                            <button
                              onClick={() => handleCalcAnswer('income', 'No', 2)}
                              className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#002868] hover:bg-blue-50 font-bold transition-all text-sm text-gray-700 active:scale-95"
                            >No / Informal</button>
                          </div>
                        </div>
                      )}

                      {calculatorStep === 2 && (
                        <div>
                          <label className="block text-sm font-extrabold text-gray-700 mb-4">
                            2. ¿Has viajado fuera de tu país en los últimos años? (Europa, Caribe, Suramérica)
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => handleCalcAnswer('travels', 'Si', 3)}
                              className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#002868] hover:bg-blue-50 font-bold transition-all text-sm text-gray-700 active:scale-95"
                            >Sí, tengo historial</button>
                            <button
                              onClick={() => handleCalcAnswer('travels', 'No', 3)}
                              className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#002868] hover:bg-blue-50 font-bold transition-all text-sm text-gray-700 active:scale-95"
                            >No / Pocos viajes</button>
                          </div>
                        </div>
                      )}

                      {calculatorStep === 3 && (
                        <div>
                          <label className="block text-sm font-extrabold text-gray-700 mb-4">
                            3. ¿Tienes lazos fuertes en Colombia? (propiedad, vehículo, estudios, hijos)
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => handleCalcAnswer('ties', 'Si', 4)}
                              className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#002868] hover:bg-blue-50 font-bold transition-all text-sm text-gray-700 active:scale-95"
                            >Sí, varios lazos</button>
                            <button
                              onClick={() => handleCalcAnswer('ties', 'No', 4)}
                              className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#002868] hover:bg-blue-50 font-bold transition-all text-sm text-gray-700 active:scale-95"
                            >Pocos o ninguno</button>
                          </div>
                        </div>
                      )}

                      {calculatorStep === 4 && (
                        <div>
                          <label className="block text-sm font-extrabold text-gray-700 mb-4">
                            4. ¿Tienes familiares directos irregulares o con asilo en EE.UU.?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => handleCalcAnswer('warnings', 'Si', 5)}
                              className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#002868] hover:bg-blue-50 font-bold transition-all text-sm text-gray-700 active:scale-95"
                            >Sí</button>
                            <button
                              onClick={() => handleCalcAnswer('warnings', 'No', 5)}
                              className="py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#002868] hover:bg-blue-50 font-bold transition-all text-sm text-gray-700 active:scale-95"
                            >No</button>
                          </div>
                        </div>
                      )}

                      {calculatorStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setCalculatorStep(calculatorStep - 1)}
                          className="text-xs text-gray-500 font-bold hover:underline mt-2"
                        >
                          ← Volver a pregunta anterior
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Resultado */
                  <div className="text-center py-4">
                    <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-10 h-10 text-[#002868]" />
                    </div>

                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Resultado Estimado</p>
                    <span className="block text-5xl font-black text-[#002868] mb-1">
                      {estimatedScore} <span className="text-lg font-bold text-gray-400">/ 1000</span>
                    </span>

                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold mb-4 ${
                      estimatedScore >= 750
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : estimatedScore >= 600
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {estimatedScore >= 750
                        ? '🟢 Aprobación Altamente Probable'
                        : estimatedScore >= 600
                        ? '🟡 Probabilidad Moderada'
                        : '🔴 Alertas Críticas Encontradas'}
                    </span>

                    <p className="text-xs text-gray-500 leading-relaxed mb-6 max-w-xs mx-auto">
                      Este es un estimado preliminar. Para obtener tu VisaScore completo con análisis detallado, recomendaciones personalizadas e informe PDF descargable, realiza la evaluación completa.
                    </p>

                    <div className="space-y-3">
                      <Link
                        href="/test"
                        className="w-full bg-[#FF9900] hover:bg-[#E68A00] text-white font-black py-3.5 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 uppercase text-sm flex items-center justify-center gap-2"
                        onClick={() => { if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') (window as any).gtag('event', 'begin_test'); }}
                      >
                        Calcular mi VisaScore completo <ArrowRight size={16} />
                      </Link>
                      <button
                        onClick={resetCalculator}
                        className="w-full text-gray-500 hover:text-gray-700 text-xs font-bold transition-all py-2"
                      >
                        Reiniciar simulador
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-[#CC0000] opacity-50" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#CC0000] opacity-50" />
        </section>

        {/* ═══════════════════════════════════════════════════════
            BLOQUE 4 — TESTIMONIO — sin cambios
        ═══════════════════════════════════════════════════════ */}
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
                  &ldquo;Pensé que estaba listo… pero mi score fue 54. Corregí lo que me indicó el sistema y en la entrevista me aprobaron.&rdquo;
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

        {/* ═══════════════════════════════════════════════════════
            NUEVO — PARA ASESORES (solo informativo, sin link al dashboard)
        ═══════════════════════════════════════════════════════ */}
        <section className="w-full py-24 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block bg-blue-50 text-[#002868] text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full border border-blue-100 mb-4">
                  Para Profesionales
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                  Portal de Asesores Migratorios
                </h2>
                <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto">
                  VisaScore cuenta con un portal exclusivo para profesionales de la asesoría migratoria, diseñado para gestionar expedientes, hacer seguimiento de casos y optimizar cada proceso.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {[
                  { icon: <FileText className="w-5 h-5 text-[#002868]" />, title: "Gestión de Expedientes", desc: "Control centralizado de todos los casos con seguimiento en tiempo real." },
                  { icon: <CheckCircle2 className="w-5 h-5 text-[#002868]" />, title: "Checklist de Proceso", desc: "Lista de verificación paso a paso para cada etapa del trámite consular." },
                  { icon: <Users className="w-5 h-5 text-[#002868]" />, title: "Panel Multicliente", desc: "Acceso rápido a los perfiles y documentos de todos tus clientes activos." },
                  { icon: <ShieldCheck className="w-5 h-5 text-[#002868]" />, title: "Revisión de DS-160", desc: "Herramientas de revisión de formularios antes del envío oficial." },
                  { icon: <BarChart3 className="w-5 h-5 text-[#002868]" />, title: "Reportes y Analytics", desc: "Estadísticas de casos exitosos y métricas de tu operación." },
                  { icon: <Award className="w-5 h-5 text-[#002868]" />, title: "Certificación VisaScore", desc: "Respaldo profesional del proceso de asesoría para tus clientes." },
                ].map((feat, i) => (
                  <div key={i} className="flex gap-3 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-all">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm flex-shrink-0 h-10 w-10 flex items-center justify-center">
                      {feat.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm mb-1">{feat.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Banner Próximamente — sin link al dashboard */}
              <div className="bg-gradient-to-r from-[#002868] to-blue-800 rounded-3xl p-8 text-center text-white">
                <span className="inline-block bg-white/20 text-white text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/30 mb-4">
                  🔒 Próximamente Disponible
                </span>
                <h3 className="text-2xl font-extrabold mb-3">Acceso al Portal de Asesores</h3>
                <p className="text-blue-100 font-medium text-sm max-w-xl mx-auto">
                  Estamos finalizando el portal de gestión para profesionales de la asesoría migratoria. Pronto podrás solicitar tu acceso y gestionar todos tus casos desde un solo lugar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            BLOQUE 5 — CTA FINAL — sin cambios
        ═══════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════
          FOOTER — mejorado con agencia, RNT y LegalModal
          Las páginas /terminos y /privacidad se mantienen intactas
      ═══════════════════════════════════════════════════════ */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/VisaScore Transparente.png"
              alt="VisaScore Logo"
              className="h-10 w-auto brightness-0 invert opacity-80"
            />
          </div>

          {/* Datos de agencia */}
          <div className="mb-8 max-w-2xl mx-auto text-center border-b border-slate-800 pb-8">
            <p className="text-sm font-bold text-slate-300 mb-1">Agencia: Central de Reservas y Turismo</p>
            <p className="text-xs text-slate-500 mb-3">RNT 31276 Mde. Col.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs">
              <a
                href="mailto:comercial@centraldereservasyturismo.com"
                className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-slate-700"
              >
                comercial@centraldereservasyturismo.com
              </a>
              <span className="hidden sm:inline text-slate-700">•</span>
              <a
                href="https://www.centraldereservasyturismo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-slate-700"
              >
                www.centraldereservasyturismo.com
              </a>
            </div>
          </div>

          {/* Links de navegación originales — se mantienen */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-500 mb-8">
            <Link className="hover:text-white transition-colors" href="/quienes-somos">Quiénes Somos</Link>
            <Link className="hover:text-white transition-colors" href="/faq">Preguntas</Link>
            <Link className="hover:text-white transition-colors" href="/terminos">Términos</Link>
            <Link className="hover:text-white transition-colors" href="/privacidad">Privacidad</Link>
          </div>

          {/* Links legales que abren el LegalModal */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 mb-6 border-t border-slate-800/50 pt-6">
            <button
              onClick={() => setLegalDoc('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Términos y Condiciones
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setLegalDoc('habeas')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Tratamiento de Datos (Habeas Data)
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setLegalDoc('cookies')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Política de Cookies
            </button>
          </div>

          <p className="text-center text-[11px] mb-4 text-slate-500">
            © {new Date().getFullYear()} VisaScore. Todos los derechos reservados.
          </p>

          <p className="max-w-3xl mx-auto text-center text-slate-500 leading-relaxed text-[10px] opacity-60">
            Aviso Legal: VisaScore es una plataforma privada y profesional de acompañamiento y facilitación de trámites para solicitudes de visado estadounidense. No tenemos filiación directa con la Embajada de los Estados Unidos o el Departamento de Estado. La decisión final recae de forma exclusiva en los dictámenes de las autoridades consulares de los EE.UU.
          </p>

          {/* LegalNotice original — se conserva para compatibilidad */}
          <div className="w-full max-w-4xl mx-auto pt-8 border-t border-slate-800 mt-8">
            <LegalNotice />
          </div>
        </div>
      </footer>

      {/* ─── Legal Modal ─── */}
      <LegalModal
        isOpen={legalDoc !== null}
        onClose={() => setLegalDoc(null)}
        documentType={legalDoc}
      />

    </div>
  );
}

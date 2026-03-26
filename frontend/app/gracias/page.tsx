"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Mail, 
  RefreshCw, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Info 
} from "lucide-react";
import Link from "next/link";

interface ScoreResult {
  overall_score: number;
  approval_probability: number;
  category: "HIGH" | "MEDIUM" | "LOW";
  breakdown: {
    economic: number;
    ties: number;
    travel: number;
    migration: number;
    personal: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const CircularGauge = ({ score, color }: { score: number, color: string }) => {
  const radius = 100;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const scoreNum = Number(score) || 0;
  // Calculate percentage relative to max possible score (assumed 1000 Based on context)
  const percentage = Math.min(Math.max(scoreNum / 1000, 0), 1);
  const strokeDashoffset = circumference - percentage * circumference;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative flex items-center justify-center transition-transform hover:scale-105 duration-500">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 filter drop-shadow-sm">
        <circle
          stroke="#E2E8F0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset: mounted ? strokeDashoffset : circumference, 
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" 
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center mt-1">
        <span className="text-5xl font-black tracking-tight" style={{ color }}>{score}</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">VisaScore</span>
      </div>
    </div>
  );
};

const getCategoryDetails = (category: string) => {
  switch (category) {
    case 'HIGH':
      return { 
        color: '#0A3161', 
        label: 'Perfil sólido', 
        bg: 'bg-[#0A3161]/10', 
        text: 'text-[#0A3161]',
        icon: <ShieldCheck className="h-6 w-6 text-[#0A3161]" />
      };
    case 'MEDIUM':
      return { 
        color: '#F59E0B', 
        label: 'Riesgo moderado', 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-700',
        icon: <Info className="h-6 w-6 text-yellow-600" />
      };
    case 'LOW':
    default:
      return { 
        color: '#B31942', 
        label: 'Alto riesgo / baja probabilidad', 
        bg: 'bg-[#B31942]/10', 
        text: 'text-[#B31942]',
        icon: <AlertTriangle className="h-6 w-6 text-[#B31942]" />
      };
  }
};

function GraciasContent() {
  const searchParams = useSearchParams();
  const wompiId = searchParams.get("id");
  const urlTestId = searchParams.get("testId");

  // Lazy initializer: se ejecuta UNA sola vez en el mount.
  // Prioridad: ?testId= en URL → sessionStorage → null
  const [testId, setTestId] = useState<string | null>(() => {
    if (urlTestId && urlTestId !== "undefined" && urlTestId !== "null") return urlTestId;
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("pendingTestId");
      if (stored && stored !== "undefined" && stored !== "null") return stored;
    }
    return null;
  });

  // Limpiar sessionStorage después del mount, una sola vez
  useEffect(() => {
    sessionStorage.removeItem("pendingTestId");
  }, []);

  const isTestIdValid = !!testId && testId !== "undefined" && testId !== "null";

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloading, setDownloading] = useState(false);

  // FASE 1: RESOLVE (obtener testId)
  useEffect(() => {
    // Si ya tenemos testId (por URL o sessionStorage), pasamos a Fase 2
    if (testId) {
      return;
    }
    
    // Si no tenemos nada de Wompi, no hay que hacer nada acá
    if (!wompiId || wompiId === "undefined" || wompiId === "null") {
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 60; // Hasta 2 minutos esperando al banco/webhook

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/resolve/${wompiId}`);
        const data = await res.json();

        if (data && data.testId) {
          // Detener polling de fase 1
          clearInterval(interval);
          // Guardar testId (activa automáticamente Fase 2)
          setTestId(data.testId);
          return;
        }

        // Si sobrepasa los intentos máximos sin respuesta del webhook
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setLoading(false);
          setError("El pago está tomando más tiempo en procesarse por parte de su banco. Por favor verifique su correo en unos minutos o recargue esta página.");
        }
      } catch (err) {
        console.error("Error resolving transaction:", err);
      }
    }, 2500); // Polling de resolve cada 2.5 seg

    return () => clearInterval(interval);
  }, [wompiId, urlTestId]);

  // VERIFICACIÓN DE PAGO: llamar al backend UNA vez para asegurar status='paid'
  // Esto es el fallback si el webhook de Wompi no actualizó el status correctamente
  useEffect(() => {
    if (!testId || testId === "undefined" || testId === "null") return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testId }),
    })
      .then(r => r.json())
      .then(d => console.log("🔐 verify result:", d))
      .catch(err => console.error("verify error:", err));
  }, [testId]);

  // FASE 2: RESULT (obtener datos del reporte)
  useEffect(() => {
    if (!testId || testId === "undefined" || testId === "null") return;

    // GUARD: Evitar que transactionIds rebotados generen polling basura
    // Los IDs de checkout UI (o de la tabla de tests) son UUID o Hashes. 
    // Los de transaccion puros de Wompi suelen iniciar con números tipo "1314-"
    if (!testId || testId.startsWith('1314')) {
      console.error('❌ testId inválido:', testId);
      setError('No se pudo recuperar tu análisis. Contacta soporte.');
      setLoading(false);
      return;
    }

    let resultAttempts = 0;
    const maxResultAttempts = 40; // ~2 minutos esperando que el webhook confirme el pago

    const intervalId = setInterval(async () => {
      resultAttempts++;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visa-test/result/${testId}`);

        // 403 = pago aún no confirmado en BD (webhook pendiente). Seguir esperando.
        if (res.status === 403) {
          if (resultAttempts >= maxResultAttempts) {
            clearInterval(intervalId);
            setError("El pago está tomando más tiempo en procesarse. Por favor recarga la página en unos minutos o contacta soporte.");
            setLoading(false);
          }
          return;
        }

        if (!res.ok) {
          clearInterval(intervalId);
          setError("No se pudo encontrar tu análisis. Contacta soporte.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data && data.overall_score !== undefined && data.overall_score !== null) {
          setResult(data);
          setLoading(false);
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error("Error al obtener resultado:", err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [testId]);

  const handleDownloadReport = async () => {
    if (!testId) return;

    setDownloading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visa-test/report/${testId}`);
      if (!res.ok) throw new Error("No se pudo descargar el reporte");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte-visascore.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al descargar tu PDF. Inténtalo de nuevo.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId || !email) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus("error");
      return;
    }

    setEmailStatus("loading");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visa-test/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ testId, email })
      });

      if (!res.ok) throw new Error("Error al enviar el correo");
      setEmailStatus("success");
    } catch (err) {
      console.error(err);
      setEmailStatus("error");
    }
  };

  // ---------------------------------------------------------------------------
  // UI RENDERING
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0A3161] mb-6 shadow-sm"></div>
        <h2 className="text-2xl font-bold text-[#0A3161] mb-2 tracking-tight">Procesando tu análisis</h2>
        <p className="text-slate-600 font-medium text-center">Estamos verificando tu transacción y calculando tu VisaScore...</p>
      </div>
    );
  }

  if (!isTestIdValid) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-center max-w-md w-full border border-slate-100">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#0A3161] mb-2 tracking-tight">Pago Recibido</h2>
          <p className="text-slate-600 mb-8 font-medium">Estamos procesando tu resultado. Esto tomará sólo un momento.</p>
          <Link href="/" className="inline-flex w-full items-center justify-center bg-[#0A3161] hover:bg-[#08264A] text-white px-6 py-4 rounded-[14px] font-bold transition-all shadow-[0_4px_14px_rgba(10,49,97,0.15)] hover:shadow-[0_6px_20px_rgba(10,49,97,0.2)]">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex flex-col items-center justify-center p-4">
         <div className="bg-white p-10 rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-center max-w-md w-full border border-slate-100">
          <XCircle className="h-16 w-16 text-[#B31942] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#0A3161] mb-2 tracking-tight">Algo salió mal</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto font-medium">{error}</p>
          <Link href="/" className="inline-flex w-full items-center justify-center bg-[#0A3161] hover:bg-[#08264A] text-white px-6 py-4 rounded-[14px] font-bold transition-all shadow-[0_4px_14px_rgba(10,49,97,0.15)] hover:shadow-[0_6px_20px_rgba(10,49,97,0.2)]">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const catDetails = getCategoryDetails(result.category);

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#0A3161] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8 tracking-tight">
        
        {/* Header Section */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-2 shadow-sm">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0A3161] tracking-tight">
            Análisis Consular Completado
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mt-4 px-4">
            Hemos evaluado tu perfil con criterios utilizados en procesos consulares reales e inteligencia algorítmica. Tus resultados han sido generados.
          </p>
        </div>

        {/* 1. Main Score & Risk Grid (SCORE AS HERO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card: Hero Score */}
          <div className="bg-white rounded-[24px] p-10 border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center group transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] relative overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 z-10">
              Puntaje estimado VisaScore
            </h3>
            <div className="z-10">
              <CircularGauge score={result.overall_score} color={catDetails.color} />
            </div>
            <p className="mt-8 text-sm font-medium text-slate-500 max-w-[250px] z-10">
              Evaluación basada en múltiples estándares utilizados en procesos consulares.
            </p>
          </div>

          {/* Card: Risk Assessment (FIX SCORE VS PROBABILITY PERCEPTION) */}
          <div className="bg-white rounded-[24px] p-10 border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center group transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
              Riesgo y probabilidad
            </h3>
            
            <div className={`flex items-center justify-center w-24 h-24 rounded-full mb-6 transition-transform group-hover:scale-105 duration-300 ${catDetails.bg}`}>
              {catDetails.icon}
            </div>

            <h2 className={`text-2xl md:text-3xl font-black mb-3 leading-tight ${catDetails.text}`}>
              {catDetails.label}
            </h2>
            
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 mb-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${result.approval_probability}%`, backgroundColor: catDetails.color }}
              ></div>
            </div>

            <p className="text-slate-500 font-medium leading-relaxed mt-2 text-sm max-w-[280px]">
              Según este análisis, tu perfil presenta indicadores evaluados bajo criterios consulares.
            </p>
          </div>
        </div>

        {/* 2. Core Analysis Summary (REWRITE “FORTALEZAS / ANALYSIS” BLOCK) */}
        <div className="bg-white rounded-[24px] p-8 md:p-12 border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.05)] my-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <ShieldCheck className="w-7 h-7 text-[#0A3161]" />
            <h2 className="text-2xl font-extrabold text-[#0A3161] tracking-tight">Reporte de Inteligencia Consular</h2>
          </div>
          
          <div className="bg-[#F4F6F8] rounded-[16px] p-8 border border-slate-200/60 mb-10 text-center md:text-left">
            <p className="text-[#050B14] leading-relaxed font-semibold text-[1.05rem]">
              Tu perfil presenta factores que pueden afectar la aprobación. Hemos identificado áreas clave de mejora dentro de un análisis detallado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-green-50/50 rounded-[16px] p-6 border border-green-100/50">
              <h3 className="text-base font-bold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Fortalezas actuales
              </h3>
              {result.strengths && result.strengths.length > 0 ? (
                <ul className="space-y-3">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0" />
                      <span className="text-green-900/80 font-medium text-sm leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-900/50 italic text-sm font-medium">No se identificaron fortalezas significativas.</p>
              )}
            </div>

            <div className="bg-red-50/50 rounded-[16px] p-6 border border-red-100/50">
              <h3 className="text-base font-bold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Áreas de riesgo
              </h3>
              {result.weaknesses && result.weaknesses.length > 0 ? (
                <ul className="space-y-3">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B31942] mt-2 mr-3 flex-shrink-0" />
                      <span className="text-red-900/80 font-medium text-sm leading-relaxed">{w}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-900/50 italic text-sm font-medium">No se identificaron riesgos significativos.</p>
              )}
            </div>
          </div>

          {/* 3. CTA Anchor (ENHANCE CTA) */}
          <div className="text-center mt-12 mb-4">
            <Link 
               href={`/improve/${testId}`} 
               className="group inline-flex items-center justify-center bg-[#0A3161] hover:bg-[#08264A] text-white px-10 py-5 rounded-[16px] text-lg font-bold transition-all duration-300 shadow-[0_8px_20px_rgba(10,49,97,0.2)] hover:shadow-[0_12px_25px_rgba(10,49,97,0.3)] hover:-translate-y-1"
            >
              Ver cómo mejorar mi aprobación
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4. Actionable Recommendations (Plan de mejora) */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div id="improvement-plan" className="bg-[#0A3161] rounded-[24px] p-10 md:p-14 shadow-[0_20px_40px_rgba(10,49,97,0.2)] mt-8 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B31942]/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
            
            <h3 className="text-2xl md:text-3xl font-extrabold mb-8 flex items-center tracking-tight">
              <span className="bg-white/10 p-3 rounded-2xl mr-5 border border-white/10 shadow-inner">
                <ShieldCheck className="w-7 h-7 text-blue-100" />
              </span>
              Strategic Improvement Plan
            </h3>
            
            <ul className="space-y-4 relative z-10 max-w-3xl">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start bg-white/5 p-5 md:p-6 rounded-[16px] border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-white font-black text-sm mr-5 flex-shrink-0 shadow-inner border border-blue-400/20">
                    {i + 1}
                  </div>
                  <span className="text-blue-50/90 font-medium leading-relaxed pt-1 text-base md:text-lg">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. PDF Download Section (UPGRADE PDF DOWNLOAD SECTION) */}
        <div className="bg-gradient-to-br from-white to-[#F8FAFC] border-2 border-[#0A3161]/5 rounded-[24px] p-8 md:p-12 shadow-[0_15px_30px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row items-center justify-between gap-10 group mt-8">
          <div className="flex-1 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
            <div className="flex items-center justify-center w-20 h-20 rounded-[20px] bg-[#0A3161]/5 border border-[#0A3161]/10 text-[#0A3161] group-hover:scale-105 group-hover:bg-[#0A3161]/10 transition-all duration-300 flex-shrink-0">
              <FileText className="w-10 h-10" />
            </div>
            <div>
              <div className="inline-flex items-center px-3 py-1.5 mb-4 bg-[#B31942]/10 text-[#B31942] text-xs font-bold uppercase tracking-widest rounded-lg">
                Documento oficial
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#0A3161] mb-3 tracking-tight">Descargar reporte completo</h3>
              <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed max-w-xl">
                Informe consular basado en criterios reales de evaluación. Incluye análisis completo, métricas y recomendaciones.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="w-full lg:w-auto relative overflow-hidden flex items-center justify-center bg-white border-[3px] border-[#0A3161] text-[#0A3161] hover:bg-[#0A3161] hover:text-white rounded-[16px] px-10 py-5 text-lg font-bold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group/btn shadow-sm hover:shadow-[0_10px_20px_rgba(10,49,97,0.15)] flex-shrink-0"
          >
            {downloading ? (
              <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
            ) : (
              <Download className="mr-3 h-6 w-6 group-hover/btn:-translate-y-1 transition-transform" />
            )}
            {downloading ? "Generando PDF..." : "Descargar reporte"}
          </button>
        </div>

        {/* 6. Email Form Section (Visual Upgrade) */}
        {false && (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.03)] p-10 max-w-2xl mx-auto text-center hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] transition-all duration-300 mt-8 mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-slate-50 mb-6 border border-slate-100">
            <Mail className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-[#0A3161] mb-3 tracking-tight">Recibe una copia en tu correo</h3>
          <p className="text-slate-500 text-base mb-8 font-medium">
            Te enviaremos el reporte detallado directamente a tu bandeja de entrada.
          </p>
          <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="tu@correo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[16px] border-2 border-slate-200 px-6 py-4 focus:outline-none focus:border-[#0A3161] focus:ring-4 focus:ring-[#0A3161]/10 transition-all font-semibold placeholder:text-slate-400 bg-slate-50 focus:bg-white text-[#050B14]"
              />
            </div>
            <button
              type="submit"
              disabled={emailStatus === "loading" || emailStatus === "success"}
              className="rounded-[16px] px-8 py-4 whitespace-nowrap bg-[#0A3161] hover:bg-[#08264A] text-white font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(10,49,97,0.15)] hover:shadow-[0_8px_25px_rgba(10,49,97,0.2)] hover:-translate-y-0.5"
            >
              {emailStatus === "loading" ? "Enviando..." : emailStatus === "success" ? "¡Enviado!" : "Enviar"}
            </button>
          </form>
          {emailStatus === "success" && (
            <p className="text-green-600 font-semibold text-sm mt-5 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Reporte enviado correctamente
            </p>
          )}
          {emailStatus === "error" && (
            <p className="text-[#B31942] font-semibold text-sm mt-5 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Error al enviar. Por favor intenta de nuevo.
            </p>
          )}
        </div>
        )}

      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F6F8] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0A3161] mb-6 shadow-sm"></div>
        <h2 className="text-2xl font-bold text-[#0A3161] tracking-tight">Cargando interfaz...</h2>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}

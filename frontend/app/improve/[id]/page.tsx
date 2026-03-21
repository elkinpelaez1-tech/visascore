"use client";

import { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  MessageCircle,
  TrendingUp,
  MapPin,
  Wallet,
  Landmark,
  Plane
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

export default function ImprovePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID no proporcionado");
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visa-test/result/${id}`);
        if (!res.ok) {
          throw new Error("No se pudo cargar el análisis");
        }
        const data = await res.json();
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar la ruta de mejora");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3161]"></div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse text-center">Analizando perfil detallado...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl max-w-md w-full text-center border border-red-100 flex flex-col items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="font-semibold">{error || "Perfil no encontrado"}</p>
          <button 
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const score = result.overall_score || 0;
  
  // Mapping logic for dynamic recommendations
  interface DynamicRecommendation {
    title: string;
    explanation?: string;
    recommendation: string;
    icon: React.ReactNode;
  }

  const generatedRecommendations: DynamicRecommendation[] = [];

  result.weaknesses.forEach((w) => {
    const wLower = w.toLowerCase();
    
    if (wLower.includes("arraigo") || wLower.includes("vínculos")) {
      generatedRecommendations.push({
        title: "Falta de arraigo",
        explanation: "Tu perfil no evidencia suficientes vínculos fuertes con tu país de origen.",
        recommendation: "Asegura demostrar estabilidad laboral, propiedad, estudios o vínculos familiares antes de aplicar.",
        icon: <MapPin className="h-6 w-6 text-indigo-500" />
      });
    } else if (wLower.includes("ingresos bajos") || wLower.includes("salarial")) {
      generatedRecommendations.push({
        title: "Ingresos bajos",
        explanation: "Tu capacidad económica puede generar dudas sobre tu solvencia durante el viaje.",
        recommendation: "Presenta extractos bancarios sólidos y evidencia de ingresos estables en los últimos 6 meses.",
        icon: <Wallet className="h-6 w-6 text-amber-500" />
      });
    } else if (wLower.includes("evidencia financiera") || wLower.includes("soportes") || wLower.includes("capacidad") || wLower.includes("económ")) {
      generatedRecommendations.push({
        title: "Poca evidencia financiera",
        recommendation: "Refuerza tu perfil con soportes financieros claros como cuentas bancarias, certificados laborales o ingresos adicionales.",
        icon: <Landmark className="h-6 w-6 text-emerald-500" />
      });
    } else if (wLower.includes("historial de viajes") || wLower.includes("sin historial")) {
      generatedRecommendations.push({
        title: "Sin historial de viajes",
        recommendation: "Considera realizar viajes internacionales previos para fortalecer tu perfil migratorio.",
        icon: <Plane className="h-6 w-6 text-blue-500" />
      });
    } else {
      // Generic fallback for unmapped weaknesses
      generatedRecommendations.push({
        title: "Área de oportunidad",
        explanation: "Este aspecto de tu perfil fue identificado como un factor de riesgo.",
        recommendation: w,
        icon: <Info className="h-6 w-6 text-slate-400" />
      });
    }
  });

  // Remove duplicates based on title
  const uniqueRecommendations = Array.from(new Map(generatedRecommendations.map(item => [item.title, item])).values());

  const whatsappMessage = "Hola,%20quiero%20asesoría%20para%20mejorar%20mi%20probabilidad%20de%20visa";
  const whatsappUrl = `https://wa.me/573117287366?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200 py-6 px-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/gracias?testId=${id}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition">
            <ArrowRight className="h-5 w-5 rotate-180" />
            <span className="font-medium text-sm hidden sm:inline">Volver al análisis</span>
          </Link>
          <div className="text-xl font-black text-[#0A3161] tracking-tight flex items-center gap-2">
            VisaScore <span className="text-[#B31942] text-2xl leading-none">.</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-12">
        {/* HERO */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-2">
            <TrendingUp className="h-4 w-4" />
            Plan Estratégico
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A3161] leading-tight">
            Plan personalizado para mejorar tu aprobación
          </h1>
          <p className="text-lg text-slate-600">
            Basado en tu análisis consular, estas acciones pueden aumentar tus probabilidades de obtener la visa.
          </p>
        </div>

        {/* SCORE HIGHLIGHT BLOCK */}
        {score < 60 && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5 shadow-sm">
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-red-800 font-bold mb-1">Evita un rechazo</h3>
                <p className="text-red-700 text-sm">
                  Se recomienda <strong>NO aplicar inmediatamente</strong>. Primero fortalece tu perfil para reducir significativamente el riesgo de rechazo consular.
                </p>
              </div>
            </div>
          </div>
        )}

        {score >= 80 && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-5 shadow-sm">
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-emerald-800 font-bold mb-1">Ruta Óptima</h3>
                <p className="text-emerald-700 text-sm">
                  Tu perfil es sólido, pero puedes optimizar detalles menores para maximizar tus probabilidades y asegurar una entrevista exitosa.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC AREAS TO IMPROVE */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Áreas a mejorar
            </h2>
          </div>
          
          {uniqueRecommendations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {uniqueRecommendations.map((rec, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    {rec.icon}
                  </div>
                  <div className="flex gap-3 mb-3">
                    <div className="p-2 bg-slate-50 rounded-xl shrink-0">
                      {rec.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight mt-1">{rec.title}</h3>
                    </div>
                  </div>
                  
                  {rec.explanation && (
                    <p className="text-sm text-slate-500 mb-3 ml-12">
                      {rec.explanation}
                    </p>
                  )}
                  
                  <div className="ml-12 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <p className="text-sm font-medium text-[#0A3161]">
                      {rec.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No detectamos debilidades críticas</h3>
              <p className="text-slate-500 mt-1">Tu perfil cumple con la mayoría de los requerimientos consulares.</p>
            </div>
          )}
        </section>

        {/* STATIC CHECKLIST */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Checklist Esencial</h2>
            <p className="text-sm text-slate-500">Asegúrate de cumplir esto antes de la entrevista</p>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="mt-0.5"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                <div>
                  <h4 className="font-semibold text-slate-800">Tener empleo estable</h4>
                  <p className="text-sm text-slate-500">Antigüedad demostrable de al menos un año en tu actividad.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="mt-0.5"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                <div>
                  <h4 className="font-semibold text-slate-800">Extractos bancarios recientes</h4>
                  <p className="text-sm text-slate-500">Fondos suficientes y movimientos coherentes con tus ingresos.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="mt-0.5"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                <div>
                  <h4 className="font-semibold text-slate-800">Motivo claro de viaje</h4>
                  <p className="text-sm text-slate-500">Itinerario y plan lógico, respaldado por tu nivel económico.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="mt-0.5"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                <div>
                  <h4 className="font-semibold text-slate-800">DS-160 sin errores</h4>
                  <p className="text-sm text-slate-500">Toda la información debe coincidir exactamente con tus respuestas.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="p-8 rounded-3xl bg-gradient-to-br from-[#0A3161] to-[#051c3a] text-white text-center shadow-lg relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-lg mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              ¿Quieres maximizar tus probabilidades de aprobación?
            </h2>
            <p className="text-blue-100 text-lg">
              Nuestro equipo puede ayudarte a preparar tu proceso paso a paso y evitar errores comunes en la entrevista consular.
            </p>
            
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-lg transition-colors shadow-emerald-500/20 shadow-xl"
            >
              <MessageCircle className="h-6 w-6" />
              Hablar con un asesor
            </a>
            
            <p className="text-sm text-blue-200/60 mt-4">
              Atención inmediata vía WhatsApp.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Download, Mail, RefreshCw, XCircle } from "lucide-react";
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

function GraciasContent() {
  const searchParams = useSearchParams();
  // Wompi appends its transaction as ?id=... so we use ?testId=... to avoid collisions, but fallback to id just in case.
  const testId = searchParams.get("id");
  const isTestIdValid = testId && testId !== "undefined" && testId !== "null";

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isTestIdValid) {
      setLoading(false);
      return;
    }

    let intervalId: NodeJS.Timeout;

    const fetchResult = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visa-test/result/${testId}`);

        if (res.ok) {
          const data = await res.json();
          setResult(data);
          setLoading(false);
          clearInterval(intervalId);
        } else if (res.status === 403 || res.status === 404) {
          // Si es 403 significa "Resultado bloqueado. Pago requerido."
          // Seguimos intentando hasta que el webhook lo desbloquee.
          console.log("Aún bloqueado. Reintentando...");
        } else {
          setError("Ocurrió un error al obtener tu resultado.");
          setLoading(false);
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error("Error fetching result:", err);
      }
    };

    // Hacer la primera consulta y luego iniciar el polling
    fetchResult();
    intervalId = setInterval(fetchResult, 3000); // polling cada 3 segundos

    // Timeout de 1 minuto maximo de polling
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (loading && !result) {
        setError("El tiempo de espera se agotó. Por favor, refresca la página si ya realizaste el pago.");
        setLoading(false);
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [testId]);

  const handleDownloadReport = async () => {
    if (!testId) return;
    setDownloading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/generate/${testId}`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("No se pudo descargar el reporte");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VisaScore_Report_${testId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al generar tu PDF. Inténtalo de nuevo.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId || !email) return;
    setEmailStatus("loading");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mail/send/${testId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error("Error al enviar el correo");
      setEmailStatus("success");
    } catch (err) {
      console.error(err);
      setEmailStatus("error");
    }
  };

  if (!isTestIdValid) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-[#050B14] mb-2 text-center">Pago recibido correctamente.</h2>
        <p className="text-slate-600 text-center">Estamos procesando tu resultado.</p>
        <Link href="/" className="mt-8 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pago en confirmación</h2>
        <p className="text-slate-600">Estamos verificando tu transacción y calculando tu VisaScore...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4">
        <XCircle className="h-16 w-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Algo salió mal</h2>
        <p className="text-slate-600 mb-6 text-center max-w-md">{error}</p>
        <Link href="/" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#050B14] tracking-tight">
            ¡Pago confirmado! Aquí tienes tu VisaScore
          </h1>
          <p className="text-lg text-slate-600 mt-4">
            Hemos analizado tu perfil con la metodología Consular actual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card del Score */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Tu VisaScore
            </h3>
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
              {result.overall_score}
            </div>
            <p className="text-sm font-medium text-slate-500">sobre 1000 posibles</p>
          </div>

          {/* Probabilidad */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Probabilidad de Aprobación
            </h3>
            <div className="text-5xl font-black text-[#050B14]">
              {result.approval_probability}%
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${result.category === 'HIGH' ? 'bg-green-500' :
                    result.category === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                style={{ width: `${result.approval_probability}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Tus Fortalezas
            </h3>
            <ul className="space-y-3">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-slate-600 text-sm">{s}</span>
                </li>
              ))}
              {result.strengths.length === 0 && (
                <li className="text-slate-500 text-sm italic">No se identificaron fortalezas significativas.</li>
              )}
            </ul>
          </div>

          <div className="bg-[#050B14] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-600/20 blur-2xl"></div>
            <h3 className="text-lg font-bold mb-4 relative z-10">Acciones Recomendadas</h3>
            <ul className="space-y-4 relative z-10">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex items-start">
                  <ArrowRight className="h-5 w-5 mr-3 text-blue-400 shrink-0" />
                  <span className="text-sm text-slate-300">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-[#050B14] mb-2">Descarga tu PDF Oficial</h3>
            <p className="text-slate-600 text-sm">
              Obtén un informe detallado con todo tu análisis, simulación de mejoras y consejos para la entrevista.
            </p>
          </div>
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 h-auto text-base font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {downloading ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
            {downloading ? "Generando..." : "Descargar Reporte Completo"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-2xl mx-auto">
          <Mail className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#050B14] mb-2">¿Quieres una copia en tu correo?</h3>
          <p className="text-slate-600 text-sm mb-6">
            Te enviaremos el reporte completo en formato PDF para que lo guardes.
          </p>
          <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="tu@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              type="submit"
              disabled={emailStatus === "loading" || emailStatus === "success"}
              className="rounded-xl px-6 py-3 whitespace-nowrap bg-[#050B14] hover:bg-slate-800 text-white font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {emailStatus === "loading" ? "Enviando..." : emailStatus === "success" ? "¡Enviado!" : "Enviar a mi correo"}
            </button>
          </form>
          {emailStatus === "error" && (
            <p className="text-red-500 text-sm mt-3">Hubo un error al enviar. Intenta de nuevo.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Cargando datos...</h2>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}

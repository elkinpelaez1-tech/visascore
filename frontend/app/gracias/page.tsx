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
const testId = searchParams.get("testId") || searchParams.get("id");

const [loading, setLoading] = useState(true);
const [result, setResult] = useState<ScoreResult | null>(null);
const [error, setError] = useState<string | null>(null);

const [email, setEmail] = useState("");
const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
const [downloading, setDownloading] = useState(false);

useEffect(() => {
if (!testId) {
setError("No se ha proporcionado un ID de prueba válido.");
setLoading(false);
return;
}

```
let intervalId: NodeJS.Timeout;

const fetchResult = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visa-test/result/${testId}`);

    if (res.ok) {
      const data = await res.json();

      // 🔥 FIX CLAVE: solo avanzar cuando el score realmente exista
      if (data?.overall_score && data.overall_score > 0) {
        setResult(data);
        setLoading(false);
        clearInterval(intervalId);
      } else {
        console.log("Resultado aún no listo...");
      }

    } else if (res.status === 403 || res.status === 404) {
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

fetchResult();
intervalId = setInterval(fetchResult, 3000);

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
```

}, [testId]);

const handleDownloadReport = async () => {
if (!testId) return;
setDownloading(true);
try {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/generate/${testId}`, {
method: "POST"
});
if (!res.ok) throw new Error("No se pudo descargar el reporte");

```
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
```

};

const handleSendEmail = async (e: React.FormEvent) => {
e.preventDefault();
if (!testId || !email) return;
setEmailStatus("loading");

```
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
```

};

if (loading) {
return ( <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4"> <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-6"></div> <h2 className="text-2xl font-bold text-slate-800 mb-2">Pago en confirmación</h2> <p className="text-slate-600">Estamos verificando tu transacción y calculando tu VisaScore...</p> </div>
);
}

if (error) {
return ( <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4"> <XCircle className="h-16 w-16 text-red-500 mb-6" /> <h2 className="text-2xl font-bold text-slate-800 mb-2">Algo salió mal</h2> <p className="text-slate-600 mb-6 text-center max-w-md">{error}</p> <Link href="/" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
Volver al inicio </Link> </div>
);
}

if (!result) return null;

return ( <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6 lg:px-8">
{/* ... TODO el resto queda EXACTAMENTE igual (no se toca nada más) */}
{/* No lo repito para no hacer ruido, pero no cambies nada más */} </div>
);
}

export default function GraciasPage() {
return (
<Suspense fallback={ <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4"> <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-6"></div> <h2 className="text-2xl font-bold text-slate-800 mb-2">Cargando datos...</h2> </div>
}> <GraciasContent /> </Suspense>
);
}

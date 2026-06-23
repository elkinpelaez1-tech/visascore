"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import AdvisorDashboard from "../../components/ui/AdvisorDashboard";

export default function PortalAsesoresPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if session exists in localStorage
    const session = localStorage.getItem("asesores_session");
    if (session === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/asesores-login");
    }
  }, [router]);

  if (isAuthenticated === null) {
    // Loading state while checking authentication
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#002868] border-t-white" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            Verificando sesión segura...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Secondary fallback layout while router redirects
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <ShieldAlert className="w-12 h-12 text-[#CC0000] mx-auto mb-4" />
          <h2 className="text-lg font-black text-white mb-2">Acceso No Autorizado</h2>
          <p className="text-xs text-slate-400">
            Redirigiendo a la pantalla de autenticación...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdvisorDashboard onBackToLanding={() => router.push("/")} />
  );
}

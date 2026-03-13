"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  BarChart3, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  Briefcase, 
  Home, 
  Plane, 
  History, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Download
} from "lucide-react";
import ProfessionalAdvisory from "../components/ProfessionalAdvisory";
import LegalNotice from "../components/LegalNotice";
import { motion, useSpring, useTransform, animate } from "framer-motion";

function Counter({ value }: { value: number }) {
  const count = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return <motion.span>{display}</motion.span>;
}

function DashboardContent() {
  const [data, setData] = useState<any>(null);
  const searchParams = useSearchParams();
  const testId = searchParams.get("id");

  useEffect(() => {
    // Mock fetch for demonstration
    setData({
      overall_score: 742,
      category: 'HIGH',
      userName: 'Carlos Arturo',
      percentile: 64,
      breakdown: {
        economic: 215,
        ties: 140,
        travel: 185,
        migration: 120,
        personal: 82
      },
      strengths: ['Estabilidad económica superior', 'Historial de viajes Tier 1', 'Arraigo familiar demostrado'],
      weaknesses: ['Sin propiedades inmobiliarias', 'Vínculos en EE.UU.'],
      recommendations: [
        'Adquiere un activo inmobiliario para subir +80 puntos.',
        'Evita solicitar visas de corta duración por ahora.'
      ],
      simulations: [
        { label: 'Si compras propiedad', points: '+80', result: 822 },
        { label: 'Si viajas a Europa', points: '+60', result: 802 }
      ]
    });
    
    console.log('[Analytics] dashboard_viewed', { testId });
  }, [testId]);

  if (!data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
            <ShieldCheck className="text-usa-blue w-12 h-12" />
        </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      {/* Top Navbar */}
      <nav className="h-20 bg-white/80 backdrop-blur-md flex items-center px-8 text-slate-900 justify-between sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <img 
            src="/VisaScore Transparente.png" 
            alt="VisaScore Logo" 
            className="h-10 w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-usa-blue text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all">
            <Download size={18} />
            <span>Descargar Reporte</span>
          </button>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border border-slate-200">
            {data.userName[0]}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 mt-10 max-w-7xl">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center md:text-left"
        >
            <h1 className="text-3xl font-black font-heading text-slate-900">Hola, {data.userName} 👋</h1>
            <p className="text-slate-500 font-medium">Este es tu análisis de inteligencia migratoria basado en el perfil DS-160.</p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Main Score & Vital Stats (4 columns) */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/60 border border-white flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-usa-blue to-usa-red" />
              
              <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-8">VisaScore Actual</span>
              
              <div className="relative w-56 h-56 flex items-center justify-center mb-6">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="112" cy="112" r="100" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                  <motion.circle 
                    cx="112" cy="112" r="100" fill="none" stroke="#003366" strokeWidth="16" 
                    strokeDasharray="628" 
                    initial={{ strokeDashoffset: 628 }}
                    animate={{ strokeDashoffset: 628 - (628 * data.overall_score) / 1000 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-black font-heading tracking-tighter text-usa-blue">
                      <Counter value={data.overall_score} />
                    </span>
                    <span className="text-slate-400 font-bold tracking-widest text-sm">/ 1000</span>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-4 opacity-50">
                    Resultado estimado basado en variables del DS-160
                  </p>
                </div>
              </div>
              
              <div className="mb-8 w-full">
                <div className="px-6 py-2 rounded-2xl inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Zap size={14} fill="currentColor" /> ALTA PROBABILIDAD
                </div>
              </div>

              <div className="w-full pt-8 border-t border-slate-50">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-500 text-left">Fuerza del perfil</span>
                    <span className="text-sm font-black text-usa-blue">{data.percentile}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${data.percentile}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-usa-blue rounded-full shadow-[0_0_12px_rgba(0,51,102,0.3)]"
                    />
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-tight text-center italic">
                    Tu perfil es más fuerte que el {data.percentile}% de los solicitantes recientes
                </p>
              </div>
            </motion.div>

            {/* Visual Simulator */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-usa-blue rounded-[40px] p-8 shadow-2xl shadow-blue-900/20 text-white"
            >
              <h3 className="font-bold flex items-center gap-2 mb-6 text-blue-100 text-lg">
                <TrendingUp size={20} /> Simulador de Mejora
              </h3>
              <div className="space-y-4">
                {data.simulations.map((sim: any, i: number) => (
                  <div key={sim.label} className="p-5 rounded-3xl bg-white/10 flex justify-between items-center hover:bg-white/15 transition-all group cursor-default">
                    <div>
                      <div className="text-[10px] text-blue-300 font-black uppercase tracking-widest mb-1">{sim.label}</div>
                      <div className="text-xl font-black font-heading flex items-center gap-2">
                         <span>{data.overall_score}</span>
                         <ArrowRight size={16} className="text-blue-400" />
                         <span className="text-blue-300">{sim.result}</span>
                      </div>
                    </div>
                    <span className="text-white font-black text-sm bg-emerald-500/30 border border-emerald-500/50 px-3 py-1.5 rounded-xl">
                      {sim.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Technical Breakdown (8 columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Breakdown Cards */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/60 border border-white"
            >
              <h3 className="font-black text-slate-400 mb-10 text-sm tracking-widest uppercase">Desglose Técnico DS-160</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {[
                  { icon: Briefcase, label: 'Económico', val: data.breakdown.economic, max: 250, color: '#003366' },
                  { icon: Home, label: 'Arraigo', val: data.breakdown.ties, max: 230, color: '#cc0000' },
                  { icon: Plane, label: 'Viajes', val: data.breakdown.travel, max: 200, color: '#003366' },
                  { icon: History, label: 'Migratorio', val: data.breakdown.migration, max: 200, color: '#64748b' },
                  { icon: User, label: 'Personal', val: data.breakdown.personal, max: 120, color: '#003366' },
                ].map((item, i) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm"
                    >
                       <item.icon size={28} className="text-slate-700" />
                    </motion.div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                    <span className="font-black text-lg text-slate-800 tracking-tight">{item.val}<span className="text-slate-300 text-xs ml-0.5">/{item.max}</span></span>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.val/item.max)*100}%` }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                        className="h-full rounded-full shadow-sm" 
                        style={{ backgroundColor: item.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-[40px] p-8 shadow-xl shadow-emerald-900/5 border border-emerald-50 border-t-4 border-t-emerald-500"
              >
                <h3 className="font-black text-emerald-800 flex items-center gap-2 mb-6 uppercase tracking-wider text-sm">
                  <CheckCircle2 size={20} /> Fortalezas Detectadas
                </h3>
                <ul className="space-y-4">
                  {data.strengths.map((str: string, i: number) => (
                    <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        key={str} 
                        className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl text-sm font-bold flex items-center gap-3"
                    >
                       <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <BarChart3 size={12} fill="white" />
                       </div>
                       {str}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-[40px] p-8 shadow-xl shadow-amber-900/5 border border-amber-50 border-t-4 border-t-amber-400"
              >
                <h3 className="font-black text-amber-700 flex items-center gap-2 mb-6 uppercase tracking-wider text-sm">
                  <AlertTriangle size={20} /> Puntos de Riesgo
                </h3>
                <ul className="space-y-4">
                  {data.weaknesses.map((wk: string, i: number) => (
                    <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        key={wk} 
                        className="p-4 bg-amber-50 text-amber-800 rounded-2xl text-sm font-bold flex items-center gap-3"
                    >
                       <div className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center shrink-0 text-[10px]">!</div>
                       {wk}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Recommendations */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40"
            >
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                <ShieldCheck size={300} />
              </div>
              <h3 className="text-2xl font-black font-heading mb-8 relative z-10">Recomendaciones del Experto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {data.recommendations.map((rec: string, i: number) => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    key={i} 
                    className="flex flex-col gap-4 items-start bg-white/5 p-6 rounded-[32px] border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white text-slate-900 shrink-0 flex items-center justify-center font-black text-lg shadow-xl shadow-white/10">{i+1}</div>
                    <p className="text-base text-slate-200 font-medium leading-relaxed">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="pt-12 space-y-8">
               <ProfessionalAdvisory />
               <LegalNotice />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-usa-blue"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}

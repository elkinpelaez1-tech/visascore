"use client";

import Link from "next/link";
import { ShieldCheck, BarChart3, Lock, Zap, ArrowRight, CheckCircle2, TrendingUp, Users, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import LegalNotice from "./components/LegalNotice";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-8 h-20 flex items-center relative glass sticky top-0 z-50">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <img 
              src="/VisaScore Transparente.png" 
              alt="VisaScore Logo" 
              className="h-10 md:h-12 w-auto"
            />
          </Link>
        </div>

        <nav className="ml-auto items-center hidden sm:flex gap-4 lg:gap-8">
          <Link className="text-sm font-bold text-slate-500 hover:text-usa-blue transition-colors uppercase tracking-widest hidden lg:block" href="#how-it-works">
            Cómo funciona
          </Link>
          <Link className="text-sm font-black bg-usa-blue text-white px-6 py-2.5 rounded-full hover:bg-blue-900 hover:shadow-xl hover:shadow-blue-950/20 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/10" href="/test">
            Calcular mi Score <ArrowRight size={14} />
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-white overflow-hidden relative">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-usa-blue mb-4 border border-blue-100"
              >
                Nueva plataforma de Inteligencia Migratoria ⚡
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-heading max-w-4xl"
              >
                Descubre si te aprobarían la <span className="text-usa-blue relative">visa americana<span className="absolute bottom-1 left-0 w-full h-3 bg-usa-red/10 -z-10"></span></span> antes de aplicar
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mx-auto max-w-[800px] text-slate-500 md:text-xl/relaxed lg:text-2xl/relaxed mt-6 font-medium"
              >
                Analizamos tu perfil migratorio basado en el formulario DS-160 y calculamos tu probabilidad real de aprobación con algoritmos avanzados.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-6 mt-8"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/test" className="inline-flex h-14 items-center justify-center rounded-2xl bg-usa-blue px-10 py-4 text-xl font-bold text-white shadow-2xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all">
                    Calcular mi VisaScore
                  </Link>
                  <Link href="#how-it-works" className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-10 py-4 text-xl font-bold shadow-sm hover:bg-slate-50 transition-all text-slate-700">
                    Ver cómo funciona
                  </Link>
                </div>

                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
                  Este análisis es orientativo y no garantiza la aprobación de la visa.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={18} className="text-usa-blue" />
                    <span className="text-sm font-bold">Evaluación en 2 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users size={18} className="text-usa-blue" />
                    <span className="text-sm font-bold">+1000 perfiles analizados</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText size={18} className="text-usa-blue" />
                    <span className="text-sm font-bold">Reporte PDF Pro</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="w-full py-20 md:py-32 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-heading md:text-4xl mb-4">¿Por qué usar VisaScore?</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">La mayoría de las negaciones de visa ocurren por errores que podrían haberse identificado antes de la entrevista.</p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                { icon: TrendingUp, color: 'blue', title: 'Scoring Algorítmico', desc: 'Damos un puntaje de 0 a 1000 basado en los criterios de evaluación de los oficiales consulares.' },
                { icon: ShieldCheck, color: 'red', title: 'Detección de Riesgos', desc: 'Identificamos señales de alerta en tu perfil DS-160 que podrían causar una negación inmediata.' },
                { icon: BarChart3, color: 'slate', title: 'Simulador Pro', desc: 'Descubre exactamente cuánto subiría tu score si viajas a Europa o adquieres una propiedad.' }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center space-y-4 text-center p-8 rounded-[32px] bg-white shadow-xl shadow-slate-200/50 border border-slate-100 transition-all"
                >
                  <div className={`p-4 bg-${feature.color}-50 rounded-2xl`}>
                    <feature.icon className={`w-8 h-8 text-${feature.color === 'blue' ? 'usa-blue' : feature.color === 'red' ? 'usa-red' : 'slate-700'}`} />
                  </div>
                  <h3 className="text-xl font-bold font-heading">{feature.title}</h3>
                  <p className="text-slate-500 font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-white">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img 
              src="/VisaScore Transparente.png" 
              alt="VisaScore Logo" 
              className="h-8 w-auto mb-2"
            />
            <p className="text-sm text-slate-400 max-w-xs text-center md:text-left">
              Potenciando perfiles migratorio con inteligencia de datos.
            </p>
          </div>
          
          <div className="w-full max-w-4xl mx-auto my-12">
            <LegalNotice />
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-slate-600">
            <Link className="hover:text-usa-blue transition-colors" href="#">Términos</Link>
            <Link className="hover:text-usa-blue transition-colors" href="#">Privacidad</Link>
            <Link className="hover:text-usa-blue transition-colors" href="#">Contacto</Link>
          </div>
          
          <p className="text-[10px] text-slate-400 text-center md:text-right max-w-[200px]">
            © 2026 VisaScore. No afiliado al gobierno de los EE.UU.
          </p>
        </div>
      </footer>
    </div>
  );
}

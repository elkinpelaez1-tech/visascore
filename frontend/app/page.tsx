"use client";

import Link from "next/link";
import { ShieldCheck, BarChart3, Lock, Zap, ArrowRight, CheckCircle2, TrendingUp, Users, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import LegalNotice from "./components/LegalNotice";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-8 h-20 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
            <img 
              src="/VisaScore Transparente.png" 
              alt="VisaScore Logo" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link className="text-sm font-semibold text-gray-600 hover:text-[#002868] transition-colors hidden md:block" href="#how-it-works">
            Cómo funciona
          </Link>
          <Link className="text-sm font-semibold bg-[#002868] text-white px-6 py-2.5 rounded-xl hover:bg-[#001f4d] hover:shadow-lg transition-all flex items-center gap-2" href="/test">
            Calcular mi Score <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 relative overflow-hidden bg-white">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#002868] text-sm font-semibold mb-6">
                <span>🇺🇸</span> VisaScore Análisis Inteligente
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Descubre si te aprobarían la visa americana <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002868] to-blue-500">antes de aplicar</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl font-medium">
                Analizamos tu perfil migratorio y te mostramos tu probabilidad real de aprobación basándonos en los criterios consulares actuales.
              </p>
              
              <Link href="/test" className="inline-flex h-14 items-center justify-center rounded-xl bg-[#002868] px-10 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-[#001f4d] transition-all mb-8">
                Calcular mi VisaScore
              </Link>
              
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> <span>Basado en DS160</span></div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#002868]" /> <span>Análisis migratorio</span></div>
                <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-red-500" /> <span>Recomendaciones reales</span></div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-gradient-to-bl from-[#002868] to-blue-500 opacity-20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl -z-10" />
        </section>

        {/* Sección de Confianza */}
        <section className="w-full py-20 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { title: 'Análisis DS160', desc: 'Evaluamos los factores migratorios clave que los cónsules revisan.', icon: FileText },
                { title: 'Riesgo migratorio', desc: 'Detectamos debilidades en tu perfil que podrían causar una negación.', icon: ShieldCheck },
                { title: 'Reporte personalizado', desc: 'Recibe recomendaciones claras para mejorar tu entrevista.', icon: BarChart3 }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-8 border border-gray-100 border-t-4 border-t-[#002868] flex flex-col items-center text-center">
                  <div className="p-4 rounded-full bg-blue-50 text-[#002868] mb-4">
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo Funciona */}
        <section id="how-it-works" className="w-full py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
              <p className="text-gray-600 text-lg">Un proceso simple y rápido para salir de dudas.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { step: '1', title: 'Responde el test', desc: 'Comienza nuestro formulario inteligente de toma menos de 3 minutos.', icon: Clock },
                { step: '2', title: 'Analizamos tu perfil', desc: 'Nuestro algoritmo evalúa riesgos y cruza datos con las políticas consulares.', icon: Zap },
                { step: '3', title: 'Obtén tu VisaScore', desc: 'Descubre tu probabilidad real de aprobación y qué debes mejorar.', icon: TrendingUp }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center relative">
                  {i !== 2 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gray-100 z-0"></div>}
                  <div className="w-16 h-16 bg-white border-2 border-[#002868] rounded-full flex items-center justify-center text-2xl font-bold text-[#002868] mb-6 relative z-10 shadow-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RESULTADO (MOCKUP) - High Conversion Section */}
        <section className="w-full py-24 bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Lo que obtienes al instante</h2>
              <p className="text-gray-600">Un diagnóstico exacto de tu perfil migratorio, justo como lo vería un agente.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-[#050B14] p-6 text-white flex justify-between items-center border-b-[6px] border-[#002868]">
                <span className="font-bold text-lg tracking-wide">VisaScore</span>
                <span className="text-sm bg-[#002868]/30 text-blue-200 px-3 py-1 rounded-full border border-blue-400/30">Ejemplo de Reporte</span>
              </div>
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 pb-8 mb-8 gap-8">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tu Score</p>
                    <div className="text-6xl font-black text-[#002868]">78<span className="text-2xl text-gray-400">/100</span></div>
                  </div>
                  <div className="flex-1 w-full flex flex-col items-center">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Probabilidad</p>
                    <div className="w-full bg-gray-100 rounded-full h-4 mb-2 overflow-hidden">
                      <div className="bg-green-500 h-4 rounded-full w-[78%]"></div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Alta</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Fortalezas principales</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start text-sm text-gray-600"><CheckCircle2 className="w-5 h-5 text-green-500 mr-2 shrink-0" /> Viajes previos registrados</li>
                      <li className="flex items-start text-sm text-gray-600"><CheckCircle2 className="w-5 h-5 text-green-500 mr-2 shrink-0" /> Estabilidad laboral prolongada</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span> Áreas de Riesgo</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start text-sm text-gray-600"><ShieldCheck className="w-5 h-5 text-yellow-500 mr-2 shrink-0" /> Duración de viaje planificada elevada</li>
                      <li className="flex items-start text-sm text-gray-600"><ShieldCheck className="w-5 h-5 text-yellow-500 mr-2 shrink-0" /> Contactos en EE.UU sin especificar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Should Use It */}
        <section className="w-full py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">¿Para quién es VisaScore?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center hover:-translate-y-1 transition-transform">
                <span className="text-4xl mb-4 block">✈️</span>
                <h3 className="font-bold text-gray-900 mb-2">Turismo y Compras</h3>
                <p className="text-sm text-gray-600">Asegura que tu perfil de turista sea creíble y sin banderas rojas.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center hover:-translate-y-1 transition-transform">
                <span className="text-4xl mb-4 block">🎓</span>
                <h3 className="font-bold text-gray-900 mb-2">Estudiantes</h3>
                <p className="text-sm text-gray-600">Demuestra lazos fuertes y minimiza la sospecha de inmigración.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center hover:-translate-y-1 transition-transform">
                <span className="text-4xl mb-4 block">👨‍👩‍👧‍👦</span>
                <h3 className="font-bold text-gray-900 mb-2">Visitas Familiares</h3>
                <p className="text-sm text-gray-600">Evita negaciones por exceso de familiares residentes en EE.UU.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-24 bg-[#002868] text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Descubre tu VisaScore en menos de 3 minutos</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              No dejes tu aplicación al azar. Conoce exactamente cómo te ve el cónsul y aplica con seguridad.
            </p>
            <Link href="/test" className="inline-flex h-14 items-center justify-center rounded-xl bg-white px-10 text-lg font-bold text-[#002868] shadow-xl hover:bg-gray-50 hover:scale-105 transition-all">
              Comenzar evaluación gratuita
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img 
              src="/VisaScore Transparente.png" 
              alt="VisaScore Logo" 
              className="h-8 w-auto mb-2 opacity-80"
            />
            <p className="text-sm text-gray-400 max-w-xs text-center md:text-left">
              Inteligencia de datos para aplicaciones consulares.
            </p>
          </div>
          
          <div className="w-full max-w-4xl mx-auto my-8">
            <LegalNotice />
          </div>
          
          <div className="flex justify-center gap-6 text-sm font-semibold text-gray-500">
            <Link className="hover:text-[#002868] transition-colors" href="#">Términos</Link>
            <Link className="hover:text-[#002868] transition-colors" href="#">Privacidad</Link>
            <Link className="hover:text-[#002868] transition-colors" href="#">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

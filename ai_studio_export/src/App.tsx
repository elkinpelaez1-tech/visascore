import { useState, useEffect } from "react";
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, BarChart3, ArrowRight, Star, 
  Sparkles, DollarSign, MapPin, Search, GraduationCap, Phone, Check, Clock, ShieldAlert, Award,
  FileText, User, Shield, Zap, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import VisaWizard from "./components/VisaWizard";
import AdvisorDashboard from "./components/AdvisorDashboard";
import LegalModal from "./components/LegalModal";

const LOGO_URL = "https://lh3.googleusercontent.com/d/1_wVC8X9_sDkaOdovq-z78qZYFswZX2He";
const DESTINATION_URL = "https://www.visascore.info";

export default function App() {
  const [view, setView] = useState<'landing' | 'wizard' | 'advisor'>('landing');
  const [legalDoc, setLegalDoc] = useState<'terms' | 'habeas' | 'cookies' | null>(null);
  
  // VisaScore dynamic calculator state
  const [calculatorStep, setCalculatorStep] = useState(1);
  const [calcAnswers, setCalcAnswers] = useState({
    income: '',
    travels: '',
    ties: '',
    warnings: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [estimatedScore, setEstimatedScore] = useState(0);

  // Simple client-side hash router
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/tramite-visa') {
        setView('wizard');
      } else if (window.location.hash === '#/portal-asesores') {
        setView('advisor');
      } else {
        setView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // check on mount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToWizard = () => {
    window.location.hash = '#/tramite-visa';
    setView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdvisor = () => {
    window.location.hash = '#/portal-asesores';
    setView('advisor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    window.location.hash = '#/';
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // VisaScore Calculation algorithm
  const calculateScore = () => {
    let base = 600;
    if (calcAnswers.income === 'Si') base += 150;
    if (calcAnswers.travels === 'Si') base += 150;
    if (calcAnswers.ties === 'Si') base += 100;
    if (calcAnswers.warnings === 'No') base += 50;
    
    // safe boundaries
    setEstimatedScore(Math.min(990, Math.max(350, base)));
    setShowResult(true);
  };

  const resetCalculator = () => {
    setCalculatorStep(1);
    setCalcAnswers({ income: '', travels: '', ties: '', warnings: '' });
    setShowResult(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (view === 'wizard') {
    return <VisaWizard onBackToLanding={navigateToLanding} logoUrl={LOGO_URL} />;
  }

  if (view === 'advisor') {
    return <AdvisorDashboard onBackToLanding={navigateToLanding} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={navigateToLanding}
            className="focus:outline-none transition-transform hover:scale-102"
          >
            <img 
              src={LOGO_URL} 
              alt="VisaScore Logo" 
              className="h-8 md:h-10 cursor-pointer"
              referrerPolicy="no-referrer"
            />
          </button>
          
          <div className="flex items-center gap-4 md:gap-6 text-sm">
            <button 
              onClick={() => scrollToSection('visascore-tools')}
              className="hidden md:block font-bold text-slate-600 hover:text-us-blue transition-colors"
            >
              Calcular VisaScore
            </button>
            <button 
              onClick={navigateToAdvisor}
              className="hidden sm:inline-flex items-center gap-1.5 font-bold text-us-red bg-red-50 hover:bg-rose-100 border border-red-200 px-4 py-2 rounded-full transition-all text-xs"
            >
              <Shield className="w-3.5 h-3.5 text-us-red" /> Acceso Asesores
            </button>
            <button 
              onClick={navigateToWizard}
              className="text-xs md:text-sm font-bold bg-us-blue hover:bg-blue-900 text-white px-5 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Iniciar Trámite
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-us-blue uppercase bg-blue-50 rounded-full border border-blue-100 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-us-red" /> Acompañamiento Profesional Premium
                  </span>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] text-slate-900 tracking-tight">
                    Tramitamos tu Visa Americana de forma <span className="text-us-blue">profesional.</span>
                  </h1>
                  
                  <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed font-normal">
                    Evita errores que pueden costarte más de <span className="font-extrabold text-us-red">$800.000 COP</span> entre derechos consulares, formularios defectuosos, desplazamientos en vano y tiempo perdido. Te acompañamos desde el inicio hasta la entrevista.
                  </p>
                  
                  {/* Buttons group as requested */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button 
                      onClick={navigateToWizard}
                      className="cta-button cta-primary w-full sm:w-auto font-extrabold tracking-wide uppercase shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-0.5 active:scale-95"
                    >
                      INICIAR MI TRÁMITE DE VISA AHORA
                    </button>
                    
                    <button 
                      onClick={() => scrollToSection('visascore-tools')}
                      className="cta-button cta-secondary w-full sm:w-auto font-bold tracking-wide uppercase border-2 border-transparent hover:border-slate-300 transition duration-300 active:scale-95"
                    >
                      CALCULAR MI VISASCORE
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-5 h-5 text-green-500" /> Formulario Oficial DS-160
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Award className="w-5 h-5 text-us-red" /> 85% de efectividad
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* OPCIÓN 2 Premium Dashboard Card */}
              <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
                <div className="relative w-full max-w-xl bg-white border border-slate-200/80 shadow-2xl rounded-[2.25rem] p-6 md:p-7 overflow-hidden">
                  
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2.5 rounded-full text-us-blue flex items-center justify-center w-11 h-11 flex-shrink-0">
                        <Clock className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Estado del servicio</p>
                        <h4 className="text-[15px] font-black text-slate-900 mt-1">Asesoría Disponible Co/USA</h4>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-50 rounded-full border border-emerald-100/70 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Disponible
                    </span>
                  </div>

                  {/* Red & Light pricing split grid */}
                  <div className="grid grid-cols-12 rounded-2xl border border-slate-200 overflow-hidden mb-5">
                    <div className="col-span-6 bg-us-red p-4 flex flex-col justify-center text-white">
                      <span className="text-[10px] font-bold text-red-100 uppercase tracking-wide">Valor del trámite</span>
                      <span className="text-xl md:text-2xl font-black mt-1">$250.000 <span className="text-xs font-bold text-red-100">COP</span></span>
                    </div>
                    <div className="col-span-6 bg-slate-50 p-4 border-l border-slate-200 flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">+ Derechos consulares</span>
                      <span className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">USD 185</span>
                      <span className="text-[9px] font-bold text-slate-400">Pagados a la Embajada</span>
                    </div>
                  </div>

                  {/* Metrics 3-column Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {/* Item 1 */}
                    <div className="bg-white border border-slate-150 p-3 rounded-2xl flex flex-col items-center text-center justify-between min-h-[140px] shadow-sm">
                      <div className="w-9 h-9 bg-rose-50 text-us-red rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-950 mt-2.5 leading-snug">
                        Menos de 24 horas
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 leading-tight block mt-1">
                        Tiempo de diligenciamiento
                      </span>
                    </div>
                    
                    {/* Item 2 */}
                    <div className="bg-white border border-slate-150 p-3 rounded-2xl flex flex-col items-center text-center justify-between min-h-[140px] shadow-sm">
                      <div className="w-9 h-9 bg-blue-50 text-us-blue rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-xs font-extrabold text-emerald-600 mt-2.5 leading-snug">
                        DS-160 incluido
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 leading-tight block mt-1">
                        Simulación integrada al formulario
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="bg-white border border-slate-150 p-3 rounded-2xl flex flex-col items-center text-center justify-between min-h-[140px] shadow-sm">
                      <div className="w-9 h-9 bg-emerald-50 text-emerald-650 rounded-full flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5.5 h-5.5 text-emerald-600" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-950 mt-2.5 leading-snug">
                        Acompañamiento total
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 leading-tight block mt-1">
                        Desde el inicio hasta tu entrevista
                      </span>
                    </div>
                  </div>

                  {/* Trust indicator - Dotted container */}
                  <div className="border border-dashed border-blue-200 bg-blue-50/25 p-4 rounded-2xl mb-5 flex items-center gap-4">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-us-blue">
                        <TrendingUp className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <span className="text-2xl font-black text-us-blue block leading-none">85%</span>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mt-0.5">casos exitosos</span>
                      </div>
                    </div>
                    
                    <div className="w-px h-10 bg-slate-200" />
                    
                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-slate-500 leading-snug">
                        Basado en cientos de casos gestionados exitosamente.
                      </p>
                      
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          <img className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&fit=crop" alt="Persona 1" referrerPolicy="no-referrer" />
                          <img className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop" alt="Persona 2" referrerPolicy="no-referrer" />
                          <img className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop" alt="Persona 3" referrerPolicy="no-referrer" />
                          <div className="inline-flex items-center justify-center h-5.5 w-5.5 rounded-full ring-2 ring-white bg-us-blue text-[8px] font-black text-white">+126</div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-405">Personas ya confían en nosotros</span>
                      </div>
                    </div>
                  </div>

                  {/* Warning Note */}
                  <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                    <div className="bg-red-100 p-1 rounded-lg text-us-red flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal font-medium">
                      <strong className="text-us-red font-bold">Aviso importante:</strong> La tarifa oficial consular aumentó a USD 185. Prepararte correctamente es indispensable para no perder tu inversión.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-us-blue/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-us-red/5 rounded-full blur-3xl -z-10" />
        </section>


        {/* 2. SECCIÓN DE CONFIANZA */}
        <section className="py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-extrabold text-us-red uppercase tracking-wider">¿Por qué iniciar correctamente tu proceso?</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
                Una solicitud mal preparada puede generar consecuencias costosas
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
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
                }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden hover:scale-102 transition-transform">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-slate-950 mb-1">{item.title}</h3>
                  <span className="block text-sm font-extrabold text-us-red mb-3 uppercase tracking-wider">{item.value}</span>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-105 p-8 rounded-3xl text-center max-w-3xl mx-auto">
              <p className="text-lg text-us-blue font-bold mb-4">
                Nosotros te ayudamos a preparar correctamente tu caso para asegurar una postulación impecable.
              </p>
              <button 
                onClick={navigateToWizard}
                className="bg-us-blue hover:bg-blue-900 text-white font-extrabold uppercase px-8 py-3.5 rounded-full inline-flex items-center gap-2 shadow-lg hover:scale-103 transition-transform text-sm"
              >
                Comenzar con mi Asesor <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>


        {/* 3. SECCIÓN DE SERVICIO */}
        <section className="py-24 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-extrabold text-us-blue uppercase tracking-wider">Acompañamiento de Extremo a Extremo</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
                ¿Qué incluye nuestro acompañamiento?
              </h2>
              <p className="text-slate-600 mt-4 font-normal">
                Diseñamos una experiencia profesional para guiar cada detalle de tu solicitud de visa americana.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Revisión de documentación",
                  desc: "Validamos que cumplas con los documentos e ingresos necesarios para soportar tu arraigo.",
                  icon: <FileText className="w-6 h-6 text-us-blue" />
                },
                {
                  title: "Captura profesional DS-160",
                  desc: "Asistencia experta para el desglose y orden cronológico de toda tu información personal.",
                  icon: <User className="w-6 h-6 text-us-blue" />
                },
                {
                  title: "Diligenciamiento del formulario",
                  desc: "Ingreso sin errores técnicos ni omisiones en la plataforma consular oficial en inglés.",
                  icon: <CheckCircle2 className="w-6 h-6 text-us-blue" />
                },
                {
                  title: "Revisión de inconsistencias",
                  desc: "Corregimos redacciones ambiguas antes del cargue que puedan alarmar al oficial consular.",
                  icon: <ShieldCheck className="w-6 h-6 text-us-blue" />
                },
                {
                  title: "Preparación para entrevista",
                  desc: "Simulacro y asesoramiento sobre respuestas estratégicas basadas en tus condiciones particulares.",
                  icon: <Award className="w-6 h-6 text-us-blue" />
                },
                {
                  title: "Asignación de cita AIS",
                  desc: "Separamos la cita para tu entrevista con seguimiento del proceso en tiempo real.",
                  icon: <Clock className="w-6 h-6 text-us-blue" />
                }
              ].map((service, i) => (
                <div key={i} className="bg-white p-8 rounded-4xl border border-slate-200 hover:shadow-xl transition-shadow flex gap-4">
                  <div className="bg-blue-50/80 p-3 h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 mb-2 flex items-center gap-2">
                       {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 4. SECCIÓN VISASCORE (INTEGRATED INTERACTIVE PRE-CHECKPOINT) */}
        <section id="visascore-tools" className="py-24 bg-us-blue text-white relative overflow-hidden scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6">
                <span className="text-sm font-extrabold text-white uppercase tracking-wider bg-us-red px-4 py-1.5 rounded-full inline-block mb-4 shadow-sm">
                  Herramienta Gratuita Complementaria
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                  Antes de iniciar tu trámite puedes conocer tu perfil migratorio.
                </h2>
                <p className="text-lg text-blue-100/95 leading-relaxed mb-6 font-light">
                  VisaScore analiza múltiples variables socioeconómicas y familiares para mostrarte posibles alarmas de riesgo antes de que presentes la postulación oficial consular.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 text-sm text-blue-100">
                    <Check className="w-5 h-5 text-us-red flex-shrink-0 mt-0.5" />
                    <span>Algoritmo entrenado con miles de casos consulares colombianos.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-blue-100">
                    <Check className="w-5 h-5 text-us-red flex-shrink-0 mt-0.5" />
                    <span>Evaluación instantánea y privada sin recopilar cuentas bancarias.</span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC VISASCORE MICRO CALCULATOR */}
              <div className="lg:col-span-6">
                <div className="bg-white text-slate-900 rounded-4xl p-6 md:p-8 shadow-2xl relative border border-white/15">
                  <span className="absolute top-4 right-4 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-205">
                    Micro-Simulador
                  </span>

                  {!showResult ? (
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Simulador VisaScore</h3>
                      <p className="text-xs text-slate-500 mb-6">Completa estas 4 preguntas rápidas para calcular tu probabilidad:</p>
                      
                      <div className="space-y-6">
                        {calculatorStep === 1 && (
                          <div className="animate-fadeIn">
                            <label className="block text-sm font-extrabold text-slate-700 mb-3">
                              1. ¿Posees estabilidad laboral formal, pensionados o negocio registrado?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button 
                                onClick={() => { setCalcAnswers({ ...calcAnswers, income: 'Si' }); setCalculatorStep(2); }}
                                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold transition-all text-sm text-slate-700 active:scale-97 text-center"
                              >
                                Sí
                              </button>
                              <button 
                                onClick={() => { setCalcAnswers({ ...calcAnswers, income: 'No' }); setCalculatorStep(2); }}
                                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold transition-all text-sm text-slate-700 active:scale-97 text-center"
                              >
                                No / Informal
                              </button>
                            </div>
                          </div>
                        )}

                        {calculatorStep === 2 && (
                          <div className="animate-fadeIn">
                            <label className="block text-sm font-extrabold text-slate-700 mb-3">
                              2. ¿Has viajado últimamente fuera de tu país natal? (ej. Europa, Caribe, Suramérica)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button 
                                onClick={() => { setCalcAnswers({ ...calcAnswers, travels: 'Si' }); setCalculatorStep(3); }}
                                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold transition-all text-sm text-slate-700 active:scale-97 text-center"
                              >
                                Sí, tengo historial
                              </button>
                              <button 
                                onClick={() => { setCalcAnswers({ ...calcAnswers, travels: 'No' }); setCalculatorStep(3); }}
                                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold transition-all text-sm text-slate-700 active:scale-97 text-center"
                              >
                                No / Pocos viajes
                              </button>
                            </div>
                          </div>
                        )}

                        {calculatorStep === 3 && (
                          <div className="animate-fadeIn">
                            <label className="block text-sm font-extrabold text-slate-700 mb-3">
                              3. ¿Tienes lazos fuertes (propiedad raíz, vehículo, estudios vigentes, hijos)?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button 
                                onClick={() => { setCalcAnswers({ ...calcAnswers, ties: 'Si' }); setCalculatorStep(4); }}
                                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold transition-all text-sm text-slate-700 active:scale-97 text-center"
                              >
                                Sí, tengo varios lazos
                              </button>
                              <button 
                                onClick={() => { setCalcAnswers({ ...calcAnswers, ties: 'No' }); setCalculatorStep(4); }}
                                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold transition-all text-sm text-slate-700 active:scale-97 text-center"
                              >
                                Pocos o ningún lazo
                              </button>
                            </div>
                          </div>
                        )}

                        {calculatorStep === 4 && (
                          <div className="animate-fadeIn">
                            <label className="block text-sm font-extrabold text-slate-700 mb-3">
                              4. ¿Tienes familiares directos irregulares o con asilo en USA?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button 
                                onClick={() => { 
                                  const updatedAnswers = { ...calcAnswers, warnings: 'Si' };
                                  setCalcAnswers(updatedAnswers);
                                  // Trigger immediate calculation with functional values
                                  let base = 600;
                                  if (updatedAnswers.income === 'Si') base += 150;
                                  if (updatedAnswers.travels === 'Si') base += 150;
                                  if (updatedAnswers.ties === 'Si') base += 100;
                                  if (updatedAnswers.warnings === 'No') base += 50;
                                  setEstimatedScore(Math.min(990, Math.max(350, base)));
                                  setShowResult(true);
                                }}
                                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold transition-all text-sm text-slate-700 active:scale-97 text-center"
                              >
                                Sí
                              </button>
                              <button 
                                onClick={() => { 
                                  const updatedAnswers = { ...calcAnswers, warnings: 'No' };
                                  setCalcAnswers(updatedAnswers);
                                  // Trigger immediate calculation with functional values
                                  let base = 600;
                                  if (updatedAnswers.income === 'Si') base += 150;
                                  if (updatedAnswers.travels === 'Si') base += 150;
                                  if (updatedAnswers.ties === 'Si') base += 100;
                                  if (updatedAnswers.warnings === 'No') base += 50;
                                  setEstimatedScore(Math.min(990, Math.max(350, base)));
                                  setShowResult(true);
                                }}
                                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold transition-all text-sm text-slate-700 active:scale-97 text-center"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {calculatorStep > 1 && (
                          <button 
                            type="button"
                            onClick={() => setCalculatorStep(calculatorStep - 1)}
                            className="text-xs text-slate-500 font-bold hover:underline"
                          >
                            Volver a pregunta anterior
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 animate-fadeIn">
                      <div className="w-24 h-24 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="w-12 h-12 text-us-blue animate-pulse" />
                      </div>
                      
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resultado Estimado</p>
                      
                      <div className="my-4">
                        <span className="block text-4xl md:text-5xl font-extrabold text-us-blue">
                          {estimatedScore} <span className="text-lg font-bold text-slate-400">/ 1000</span>
                        </span>
                        
                        <span className={`inline-block px-4 py-1 rounded-full text-xs font-extrabold mt-2 ${
                          estimatedScore >= 750 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : estimatedScore >= 600
                          ? 'bg-yellow-105 text-yellow-800 border border-yellow-250'
                          : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {estimatedScore >= 750 ? 'Aprobación Altamente Probable' : estimatedScore >= 600 ? 'Probabilidad Moderada' : 'Alertas Críticas Encontradas'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-8 max-w-sm mx-auto">
                        Este puntaje es un estimado preliminar. Para asegurar tu correcta radicación sin inconsistencias, es recomendado diligenciar el formulario formal con asesoramiento.
                      </p>

                      <div className="space-y-3">
                        <button
                          onClick={navigateToWizard}
                          className="w-full bg-us-blue hover:bg-blue-900 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-102 uppercase text-sm"
                        >
                          Iniciar Mi Trámite Formal con Asesor
                        </button>
                        
                        <button
                          onClick={resetCalculator}
                          className="w-full text-slate-500 hover:text-slate-850 text-xs font-bold transition-all"
                        >
                          Volver a Calculadora
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="absolute top-0 left-0 w-full h-1 bg-us-red opacity-50" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-us-red opacity-50" />
        </section>


        {/* 5. BENEFITS & PROOF */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
                  La tranquilidad de estar guiado por profesionales
                </h2>
                
                <div className="space-y-6">
                  {[
                    { title: "Garantía de Cero Errores", desc: "No te arriesgues a cometer inconsistencias ortográficas o vacíos en el DS-160 que lleven a un rechazo directo." },
                    { title: "Entrenamiento para Entrevistas", desc: "Te damos pautas sobre comportamiento, documentación qué llevar y cómo responder con honestidad y seguridad." },
                    { title: "Ahorro de Tiempo de Citas", desc: "Te asesoramos para optimizar las agendas posibles en el sistema oficial consular colombiano." },
                    { title: "Privacidad Encriptada", desc: "Nuestros sistemas protegen toda tu información confidencial mediante estándares globales de cifrado." }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{benefit.title}</h4>
                        <p className="text-slate-600 font-medium text-sm mt-1">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-lg italic text-slate-700 mb-6">
                    "Estaba muy nerviosa porque no entendía bien los términos en inglés del formulario. El equipo de acompañamiento de VisaScore tradujo y organizó mis respuestas. Mi visa de turismo fue aprobada la semana pasada."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                      <img src="https://picsum.photos/seed/user1/100/100" alt="User" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">María Fernanda R.</p>
                      <p className="text-sm text-slate-500">Aprobada en Bogotá, CO</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-lg italic text-slate-700 mb-6">
                    "El simulador me detectó alertas de inconsistencias laborales que corregimos en la radicación. El oficial ni dudó en aprobar. Excelente preparación para la cita."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                      <img src="https://picsum.photos/seed/user2/100/100" alt="User" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Carlos Eduardo T.</p>
                      <p className="text-sm text-slate-500">Aprobado en Bogotá, CO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* 6. FINAL CTA SECTION */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-slate-950">
              ¿Listo para iniciar tu proceso de visa correctamente?
            </h2>
            
            <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto font-normal">
              No esperes a cometer un error irreversible ante el oficial consular. Inicia tu proceso con acompañamiento experto hoy mismo.
            </p>
            
            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={navigateToWizard}
                className="cta-button cta-primary w-full sm:w-auto text-xl px-12 py-6 uppercase tracking-wider"
              >
                Iniciar Mi Trámite de Visa Ahora
              </button>
              
              <div className="flex items-center gap-8 opacity-50 grayscale">
                <img src={LOGO_URL} alt="VisaScore" className="h-6" referrerPolicy="no-referrer" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Secure Consultation</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <img 
            src={LOGO_URL} 
            alt="VisaScore Logo" 
            className="h-8 mx-auto mb-6 brightness-0 invert opacity-80"
            referrerPolicy="no-referrer"
          />
          
          {/* Agency Details */}
          <div className="mb-6 max-w-2xl mx-auto border-b border-slate-800/80 pb-6 text-slate-400 font-medium">
            <p className="text-sm font-bold text-slate-300 mb-2">
              Agencia: Central de Reservas y Turismo
            </p>
            <p className="text-xs text-slate-500 mb-2">
              RNT 31276 Mde. Col.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs mt-3">
              <a href="mailto:comercial@centraldereservasyturismo.com" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-slate-700">
                comercial@centraldereservasyturismo.com
              </a>
              <span className="hidden sm:inline text-slate-700">•</span>
              <a href="https://www.centraldereservasyturismo.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-slate-700">
                www.centraldereservasyturismo.com
              </a>
            </div>
          </div>

          {/* Legal Document Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400 mb-6">
            <button 
              onClick={() => setLegalDoc('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Términos y Condiciones
            </button>
            <span className="text-slate-800">|</span>
            <button 
              onClick={() => setLegalDoc('habeas')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Tratamiento de Datos (Habeas Data)
            </button>
            <span className="text-slate-800">|</span>
            <button 
              onClick={() => setLegalDoc('cookies')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Política de Cookies
            </button>
          </div>

          <p className="text-[11px] mb-4 text-slate-500">© 2026 VisaScore. Todos los derechos reservados.</p>
          
          <p className="max-w-3xl mx-auto text-slate-500 opacity-60 leading-relaxed font-light text-[10px]">
            Aviso Legal: VisaScore es una plataforma privada y profesional de acompañamiento y facilitación de trámites para solicitudes de visado estadounidense. No tenemos filiación directa con la Embajada de los Estados Unidos o el Departamento de Estado. La decisión final recae de forma exclusiva en los dictámenes de las autoridades consulares de los EE.UU.
          </p>
        </div>
      </footer>

      <LegalModal 
        isOpen={legalDoc !== null} 
        onClose={() => setLegalDoc(null)} 
        documentType={legalDoc} 
      />
    </div>
  );
}

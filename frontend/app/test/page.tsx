"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, ShieldCheck, Clock, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";

interface Question {
  id: string;
  label: string;
  type: "number" | "select" | "boolean" | "text";
  options?: string[];
  category: string;
}

const QUESTIONS: Question[] = [
  { id: "age", label: "¿Cuál es tu edad?", type: "number", category: "Personal" },
  { id: "maritalStatus", label: "¿Cuál es tu estado civil?", type: "select", options: ["Soltero/a", "Casado/a", "Unión Libre", "Divorciado/a", "Viudo/a"], category: "Personal" },
  { id: "hasChildren", label: "¿Tienes hijos?", type: "boolean", category: "Personal" },
  { id: "educationLevel", label: "Nivel educativo alcanzado", type: "select", options: ["Bachillerato", "Técnico/Tecnólogo", "Universitario", "Posgrado/Maestría"], category: "Personal" },
  { id: "occupation", label: "Ocupación actual", type: "text", category: "Económico" },
  { id: "employmentDurationMonths", label: "Antigüedad laboral (meses)", type: "number", category: "Económico" },
  { id: "monthlyIncomeCop", label: "Ingreso mensual aproximado (COP)", type: "number", category: "Económico" },
  { id: "isCompanyRegistered", label: "¿Tu empresa o negocio está legalmente registrado?", type: "boolean", category: "Económico" },
  { id: "hasProperties", label: "¿Tienes propiedades inmobiliarias a tu nombre?", type: "boolean", category: "Arraigo" },
  { id: "hasVehicle", label: "¿Tienes vehículo propio?", type: "boolean", category: "Arraigo" },
  { id: "bankAccountsCount", label: "¿Cuántas cuentas bancarias activas posees?", type: "number", category: "Arraigo" },
  { id: "familyInHomeCountry", label: "¿Tienes familiares directos en tu país de origen?", type: "boolean", category: "Arraigo" },
  { id: "travelHistoryInternational", label: "¿Has realizado viajes internacionales en los últimos 5 años?", type: "boolean", category: "Viajes" },
  { id: "travelHistoryTier1", label: "¿Has viajado a Europa, Canadá o Reino Unido anteriormente?", type: "boolean", category: "Viajes" },
  { id: "hasPreviousUsVisa", label: "¿Has tenido una visa americana anteriormente?", type: "boolean", category: "Migratorio" },
  { id: "previousVisaUsageCorrect", label: "Si tuviste visa, ¿la usaste correctamente?", type: "boolean", category: "Migratorio" },
  { id: "hasVisaDenial", label: "¿Te han negado una visa americana anteriormente?", type: "boolean", category: "Migratorio" },
  { id: "familyInUs", label: "¿Tienes familiares directos viviendo en Estados Unidos?", type: "boolean", category: "Migratorio" },
  { id: "hasOverstayHistory", label: "¿Te has quedado más tiempo del permitido en algún país?", type: "boolean", category: "Migratorio" },
  { id: "travelPurpose", label: "Motivo principal de tu viaje", type: "select", options: ["Turismo", "Negocios", "Tratamiento Médico", "Visita Familiar"], category: "Migratorio" },
];

function LoadingStep({ label, delay }: { label: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, type: "spring" }}
        className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
      >
        <CheckCircle2 size={12} className="text-white" strokeWidth={4} />
      </motion.div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </motion.div>
  );
}

export default function TestPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isCapping, setIsCapping] = useState(false);
  const router = useRouter();

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  useEffect(() => {
    if (step === 0) console.log('[Analytics] test_started');
  }, [step]);

  const handleNext = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      console.log('[Analytics] test_completed');
      try {
        const response = await axios.post("http://localhost:3000/visa-test/submit", formData);
        // Simulation of smart intelligence
        setIsCapping(true);
        setTimeout(() => {
           router.push(`/paywall?id=${response.data.testId}`);
        }, 4500);
      } catch (error) {
        console.error("Error submitting test", error);
        router.push(`/paywall?id=temp-${Date.now()}`);
      }
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateField = (val: any) => {
    setFormData({ ...formData, [currentQuestion.id]: val });
    // Auto-advance for simple choice questions after a small delay
    if (currentQuestion.type === "boolean" || currentQuestion.type === "select") {
       setTimeout(() => {
          if (step < QUESTIONS.length - 1) handleNext();
       }, 300);
    }
  };

  if (isCapping) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="max-w-md w-full">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-usa-blue rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-500/20 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-[32px] border-4 border-blue-100 border-t-white"
            />
            <ShieldCheck className="text-white w-10 h-10 relative z-10" />
          </motion.div>

          <h2 className="text-3xl font-black font-heading text-slate-900 mb-8 leading-tight">
            Analizando tu perfil<br/>migratorio...
          </h2>

          <div className="space-y-4 text-left bg-slate-50 p-8 rounded-[32px] border border-slate-100 mb-8">
            <LoadingStep label="Evaluación completada" delay={0.5} />
            <LoadingStep label="Perfil analizado" delay={1.5} />
            <LoadingStep label="VisaScore calculado" delay={2.5} />
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.5 }}
              className="h-full bg-usa-blue"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
            Procesando variables del DS-160
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 md:py-20">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/VisaScore Transparente.png" 
              alt="VisaScore Logo" 
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
             <Clock size={16} className="text-usa-blue" />
             <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Pregunta {step + 1}/{QUESTIONS.length}</span>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200 rounded-full mb-16 overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-usa-blue shadow-[0_0_12px_rgba(0,51,102,0.4)]" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[40px] p-8 md:p-14 shadow-2xl shadow-slate-200/60 border border-white mb-10 min-h-[500px] flex flex-col relative"
          >
            <div className="flex-1">
              <span className="text-usa-blue font-black text-[10px] uppercase tracking-[0.3em] mb-4 block opacity-60">
                Categoría: {currentQuestion.category}
              </span>
              <h2 className="text-3xl md:text-5xl font-black font-heading mb-12 text-slate-900 leading-[1.1]">
                {currentQuestion.label}
              </h2>

              <div className="space-y-4">
                {currentQuestion.type === "boolean" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => updateField(true)}
                      className={`p-8 rounded-[24px] border-2 font-black text-xl transition-all flex items-center justify-between px-10 ${formData[currentQuestion.id] === true ? 'border-usa-blue bg-blue-50 text-usa-blue shadow-lg shadow-blue-500/10' : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-md'}`}
                    >
                      SÍ <CheckCircle2 size={24} className={formData[currentQuestion.id] === true ? 'opacity-100' : 'opacity-0'} />
                    </button>
                    <button 
                      onClick={() => updateField(false)}
                      className={`p-8 rounded-[24px] border-2 font-black text-xl transition-all flex items-center justify-between px-10 ${formData[currentQuestion.id] === false ? 'border-usa-blue bg-blue-50 text-usa-blue shadow-lg shadow-blue-500/10' : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-md'}`}
                    >
                      NO <CheckCircle2 size={24} className={formData[currentQuestion.id] === false ? 'opacity-100' : 'opacity-0'} />
                    </button>
                  </div>
                )}

                {currentQuestion.type === "select" && (
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options?.map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => updateField(opt)}
                        className={`p-5 rounded-[20px] border-2 font-bold text-left transition-all flex items-center justify-between ${formData[currentQuestion.id] === opt ? 'border-usa-blue bg-blue-50 text-usa-blue shadow-lg shadow-blue-500/10' : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-md'}`}
                      >
                        {opt}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData[currentQuestion.id] === opt ? 'border-usa-blue bg-usa-blue' : 'border-slate-200'}`}>
                           {formData[currentQuestion.id] === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {(currentQuestion.type === "number" || currentQuestion.type === "text") && (
                  <input 
                    type={currentQuestion.type}
                    value={formData[currentQuestion.id] || ''}
                    onChange={(e) => updateField(currentQuestion.type === "number" ? Number(e.target.value) : e.target.value)}
                    className="w-full p-6 py-8 rounded-[24px] border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-usa-blue outline-none transition-all text-2xl font-black font-heading placeholder:text-slate-300 shadow-inner"
                    placeholder="Escribe tu respuesta..."
                    autoFocus
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-12 gap-10">
              <button 
                onClick={handlePrev}
                disabled={step === 0}
                className="flex items-center gap-3 text-slate-400 font-black text-base hover:text-usa-blue disabled:opacity-0 transition-colors uppercase tracking-widest"
              >
                <ChevronLeft size={24} strokeWidth={3} /> Atrás
              </button>
              <button 
                onClick={handleNext}
                disabled={formData[currentQuestion.id] === undefined || loading}
                className="flex items-center gap-3 bg-usa-blue text-white px-10 py-6 rounded-3xl font-black text-xl shadow-2xl shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all disabled:grayscale disabled:opacity-50"
              >
                {loading ? "Calculando..." : step === QUESTIONS.length - 1 ? "Analizar Perfil" : "Siguiente"}
                {!loading && <ChevronRight size={24} strokeWidth={3} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1 } }}
            className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"
        >
          <Lock size={12} className="text-usa-blue" />
          Toda tu información está protegida por encriptación avanzada de 256 bits.
        </motion.div>
      </div>
    </div>
  );
}
